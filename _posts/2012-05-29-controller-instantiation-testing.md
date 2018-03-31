---
layout: post
title: Controller instantiation testing
date: 2012-05-29 22:43:02.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- Autofac
- C#
- testing
- unobtrusive coding
author: rob
---


As I just mentioned in my post on [Robust testing](http://robdmoore.id.au/blog/2012/05/29/robust-testing/ "Robust testing") the best kind of test is one that automatically updates when you change your code. In particular when that test provides you a lot of value and checks something that would otherwise have a likelihood of going wrong when you deploy it (in particular production!). This post gives an example of this kind of test.


## The problem


One thing that I've come across a number of times is a situation where controllers aren't able to be instantiated because one of the constructor parameters isn't able to be resolved from the dependency injection container. This is a pain and causes an ugly yellow screen of death to show up for requests to the affected controller(s) (or a nice error page if the environment you deploy to has that set up).



Ideally you should check the pages that a controller serves up after adding new parameters to it's constructor before pushing your code changes, but sometimes you might forget and your development environment will break (I'm making a few assumptions here: continuous integration and continuous deployment to a dev environment after your tests pass). While it's both quick and easy to identify and resolve this problem it's annoying and can be disruptive to any testing on that environment. Ideally, the problem should be picked up much sooner than after the deployment.



Also, you may make some sort of changes that have unintended consequences like, say, changing the namespace of some classes that are registered by namespace to your dependency injection container.



In these situations, it's impossible to use the compiler to check that the dependency resolution will work because they are resolved at run time. However, we can do the next best thing and write a test that will break!


## An example solution for ASP.NET MVC


Consider the following code (this example in NUnit, but the same concept applies for other libraries):



```csharp
namespace MyApp.Tests.Controllers
{
    [TestFixture]
    class ControllersShould
    {
        private IContainer _container;
        [TestFixtureSetUp]
        public void FixtureSetup()
        {
            _container = MvcApplication.RegisterDependencies();
        }
        // ReSharper disable UnusedMember.Global
        public IEnumerable<Type> GetAllControllers()
        {
            return typeof(MvcApplication).Assembly.GetTypes().Where(t => t.IsAssignableTo<ControllerBase>() && !t.IsAbstract);
        }
        // ReSharper restore UnusedMember.Global
        [Test]
        [TestCaseSource("GetAllControllers")]
        public void Instantiate(Type controller)
        {
            _container.Resolve(controller);
        }
    }
}
```



This test uses the (really handy) [TestCaseSource] attribute so each controller that is instantiated is presented as a separate test. This makes sense semantically and allows you to see all of the controllers that can't be instantiated, rather than it short-circuiting at the first one that doesn't. In saying that, if your unit testing library doesn't support that kind of testing metadata then the same thing can be implemented as a loop inside the test.



The real magic here is in the GetAllControllers() method, which uses reflection to scan the assembly of the web application to find all classes that extend ControllerBase. You could use Controller too, but if for example you are using [ActionMailer.Net](https://bitbucket.org/swaj/actionmailer.net/wiki/Home) then your mail controller will inherit from MailerBase, which extends ControllerBase. It also ensures the classes returned aren't abstract.



Once you have this list of types, resolving each of them with the dependency injection container (in my case Autofac, but as with the unit testing library, this technique applies generically) you are using is easy. The only requirement is you make the method with all of your dependency registrations public and static so it's available to call within the test. I usually have a method called RegisterDependencies() on the application class (unless the dependencies are shared with non-web projects too).



The beautiful thing about this test is that as soon as you add new controllers it will automatically apply the test to that controller! So you can literally write the test once and then forget about it :).



Note: there are a few implications of this technique that you should consider before using it:


- This will call the constructor of all your controllers; if any of them are doing anything "funky" in their constructors then this might not be desirable. Personally, all my controller constructors ever have are storing the dependencies in the private instance scope.
- More importantly, all of the dependencies that the controllers have and indeed all the dependencies down the chain will have their constructors called as well. This might well be a problem for your application depending on what it does so **you should be very conscious of this**. This usually involves me needing to set certain connection strings in the App.config of the test to test datasources etc. so the constructors don't throw exceptions.
- All of the dependencies to the controllers need to be such that your dependency container, with all the registrations made in your RegisterDependencies() (or similar) method, can resolve them. If you have any custom controller registration code outside of what your dependency injection framework provides you might need to adjust the approach above accordingly.
- This is (at least in the way it's written above, it could be adjusted though) an all-or-nothing approach - it will resolve all of the controllers.
- If your controllers are in multiple assemblies then the GetAllControllers() method will need to be adjusted to scan the other assemblies.


## Other applications


There is another application of this particular style of test that I have used before and is worth mentioning. If you are in a situation where most (or all) of your controllers must inherit from a base controller that contains important/shared functionality for your website then there is no way for you to use the compiler to check that the classes inherit that base controller. You will only find out if a new controller has that inheritance missing when loading up the site and even then, depending on the nature of the functionality, maybe only in certain circumstances (so it mightn't be immediately obvious). As before, you can write a test that will automatically check this for you as soon as you add any new controllers.



Following is an example of such a test that I have used before:



```csharp
        // ReSharper disable UnusedMember.Global
        public IEnumerable<Type> GetAllHttpControllers()
        {
            return typeof(MvcApplication).Assembly.GetTypes().Where(t => t.IsAssignableTo<Controller>() && !t.IsAbstract && t != typeof(ErrorController));
        }
        // ReSharper restore UnusedMember.Global
        [Test]
        [TestCaseSource("GetAllHttpControllers")]
        public void Inherit_from_base_controller(Type controller)
        {
            Assert.That(controller.IsAssignableTo<BaseController>());
        }
```



In this case the base controller class is called BaseController. There are a couple of differences to note here: I am checking for controllers that inherit from Controller rather than ControllerBase because I only want the controllers that are serving HTTP requests and I actually have an exclusion here for one particular controller, the ErrorController, because I didn't want that particular one to extend BaseController.

