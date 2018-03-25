---
id: 216
title: Testing code that uses Autofac + DependencyResolver in ASP.NET MVC
date: 2012-04-27T17:21:41+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=216
permalink: /blog/2012/04/27/testing-code-that-uses-autofac-dependencyresolver-in-asp-net-mvc/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - Autofac
  - 'C#'
  - filter provider
  - mocking
  - testing
---
Sometimes it&#8217;s necessary to use DependencyResolver.Current in your MVC code where there is code that can&#8217;t be simply injected using your dependency injection framework. MVC provides a lot of extensibility points for things like model binding, model validation, and action filter, controller and view instantiation that mean that 90% of the time you can simply use your DI framework. This is made especially easy by frameworks like Autofac that provide <a href="http://code.google.com/p/autofac/wiki/Mvc3Integration" target="_blank">easy MVC integration</a>.

## Use Case: Filter Provider

The main circumstance I&#8217;ve needed to use DependencyResolver.Current is in a filter provider (when trying to get precise control over globally applied filters and their execution order). I have tried passing through functors from Autofac that return the things I&#8217;m after, but you get Autofac resolution errors because it can&#8217;t tell what scope you are calling them from and if they are bound to, say, the HTTP lifetime then it can&#8217;t guarantee that the objects will be disposed correctly. There is possibly a way to inject something to correctly resolve the right Autofac lifetime scope, but I haven&#8217;t looked into it further.

An example such filter provider might be:

<pre class="brush: csharp; title: ; notranslate" title="">public class MyAppFilterProvider : IFilterProvider
    {
        private readonly Environment _currentEnvironment;

        public MyAppFilterProvider(Environment currentEnvironment)
        {
            // Injected from Autofac
            _currentEnvironment = currentEnvironment;
        }

        public IEnumerable GetFilters(ControllerContext controllerContext, ActionDescriptor actionDescriptor)
        {

            // Ensure all pages other than the homepage are HTTPS in production
            if (_currentEnvironment == Environment.Prod && !(actionDescriptor.ActionName == "Index" && controllerContext.Controller.GetType() == typeof(StaticPageController)))
            {
                yield return new Filter(new RequireHttpsAttribute(), FilterScope.First, -5);
            }

            // Resolve the "current user" filter including any dependencies it may have
            // This could do something like, say put a reference to the current user from the database into the ViewBag so it can be accessed by the controller and the view
            var currentUserFilter = DependencyResolver.Current.GetService();
            yield return new Filter(currentUserFilter, FilterScope.First, -1);
        }
    }
</pre>

## Testing when there are calls to Dependency Resolver

Because we make use of DependencyResolver we need to be able to test it. This is trickier than it seems when using Autofac since if you resolve a service from the dependency resolver when there is no HttpContext then it will fail with &#8220;System.InvalidOperationException : The request lifetime scope cannot be created because the HttpContext is not available&#8221;. This problem may well affect other DI frameworks as well.

There are two options to combat this:

  * Create a custom class to resolve dependencies for that/those specific test/s and set it using DependencyResolver.SetResolver(new MyTestDependencyResolver()), but this could become tedious to maintain and complicates your test
  * Simulate a HTTP context by using <a href="http://haacked.com/archive/2007/06/19/unit-tests-web-code-without-a-web-server-using-httpsimulator.aspx" target="_blank">HttpSimulator</a>, it&#8217;s easy to install via NuGet (thanks <a href="http://twitter.com/mdaviesnet" target="_blank">Matt</a>):Â `Install-Package HttpSimulator`

When testing I use an <a href="https://nuget.org/packages/AutofacContrib.NSubstitute" target="_blank">Autofac container</a> that automatically resolves interfaces as <a href="http://nsubstitute.github.com/" target="_blank">NSubstitute Substitutes</a> (there are similar packages for other mocking frameworks, check out <a href="http://code.google.com/p/autofac/wiki/Integration#Autofac_Contrib" target="_blank">Autofac.Contrib</a>). The following code is an example of how you can set up a test:

<pre class="brush: csharp; title: ; notranslate" title="">public class ClassThatUsesDependencyResolver
    {
        public ClassThatUsesDependencyResolver()
        {
            var service = DependencyResolver.Current.GetService();
            service.Get(1);
        }
    }

    [TestFixture]
    class DependencyResolverTests
    {
        private AutoMock _autoMock;
        private HttpSimulator _httpSimulator;

        [SetUp]
        public void Setup()
        {
            _autoMock = new AutoMock();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(_autoMock.Container));
            _httpSimulator = new HttpSimulator().SimulateRequest();
        }

        [TearDown]
        public void Teardown()
        {
            _httpSimulator.Dispose();
        }

        [Test]
        public void Test()
        {
            new ClassThatUsesDependencyResolver();
            DependencyResolver.Current.GetService().Received().Get(1);
        }
    }
</pre>

One thing to note is that I used DependencyResolver.Current in the test rather than _autoMock.Resolve<&#8230;>() because the scoping that Autofac has is such that they resolve as different objects (which can be a bit confusing).

## Testing the filter provider

Given I&#8217;ve shown an example filter provider above I figure I should demonstrate some of the tests that I have done in the past. There are two main things to test as far as I see (which you test for or indeed if you test for both (or don&#8217;t test it at all) depends on your situation &#8211; be pragmatic):

  * Test the order that the filters get applied is as you expect (you don&#8217;t want database calls for the current user before passive (e.g. single-sign-on) authentication is processed for instance&#8230;
  * Test that in certain circumstances a filter is applied (or not!)

An example showing both for the above filter provider is given below:

<pre class="brush: csharp; title: ; notranslate" title="">[TestFixture]
    class MyAppFilterProviderShould
    {
        private AutoMock _autoMock;
        private HttpSimulator _httpSimulator;
        private ControllerContext _controllerContext;
        private ActionDescriptor _actionDescriptor;

        [SetUp]
        public void Setup()
        {
            _autoMock = new AutoMock();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(_autoMock.Container));
            _httpSimulator = new HttpSimulator().SimulateRequest();
            _controllerContext = Substitute.For&lt;ControllerContext&gt;();
            _actionDescriptor = Substitute.For&lt;ActionDescriptor&gt;();
        }

        [TearDown]
        public void Teardown()
        {
            _httpSimulator.Dispose();
        }

        private IEnumerable&lt;Filter&gt; GetFilters(Environment environment)
        {
            var filterProvider = new MyAppFilterProvider(environment);
            return filterProvider.GetFilters(_controllerContext, _actionDescriptor);
        }

        [Test]
        public void Resolve_filters_in_correct_order()
        {
            var filters = GetFilters(Environment.Prod).ToList().OrderBy(f =&gt; f.Scope).OrderBy(f =&gt; f.Order).ToList();
            var index = 0;
            Assert.That(filters[index++].Instance, Is.TypeOf&lt;RequireHttpsAttribute&gt;()); // Require Https should always be run first
            Assert.That(filters[index++].Instance, Is.TypeOf&lt;CurrentUserFilter&gt;());
            Assert.That(filters, Has.Count.EqualTo(index)); // This ensures we update the test when more filters are added
        }

        [Test]
        public void Not_require_https_when_not_in_production([Values(Environment.Dev, Environment.CI, Environment.Test)] Environment environment)
        {
            Assert.That(GetFilters(environment).Select(f =&gt; f.Instance), Has.None.TypeOf&lt;RequireHttpsAttribute&gt;());
        }

        [Test]
        public void Not_require_https_for_homepage_in_production()
        {
            _controllerContext.Controller = _autoMock.Resolve&lt;StaticPageController&gt;();
            _actionDescriptor.ActionName.Returns("Index");
            Assert.That(GetFilters(Environment.Prod).Select(f =&gt; f.Instance), Has.None.TypeOf&lt;RequireHttpsAttribute&gt;());
        }
    }
</pre>

## Update (23/03/2013)

It might not be necessary to ever use DependencyResolver.Current any more due to a [new technique I&#8217;ve found](http://robdmoore.id.au/blog/2013/03/23/resolving-request-scoped-objects-into-a-singleton-with-autofac/).