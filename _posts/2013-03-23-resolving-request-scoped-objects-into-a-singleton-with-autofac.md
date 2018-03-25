---
id: 751
title: Resolving request-scoped objects into a singleton with Autofac
date: 2013-03-23T13:21:57+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=751
permalink: /blog/2013/03/23/resolving-request-scoped-objects-into-a-singleton-with-autofac/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - Autofac
  - 'C#'
  - testing
  - unobtrusive coding
  - validation
---
This week I had an <a href="https://github.com/robdmoore/UnobtrusiveMVCTechniques/issues/1" target="_blank">issue raised on my Github</a> site for examples of [unobtrusive validation with ASP.NET MVC](http://robdmoore.id.au/blog/2012/04/27/unobtrusive-validation-in-asp-net-mvc-3-and-4/ "Unobtrusive Validation in ASP.NET MVC 3 and 4"). The person that raised the issue was having a problem where they wanted their fluent validation modules to be singleton, but they wanted to inject a factory that can be invoked to return a request-scoped object (in this case some sort of database store). Inevitably they came across the &#8220;_No scope with a Tag matching &#8216;AutofacWebRequest&#8217; is visible from the scope in which the instance was requested_&#8221; error.

I&#8217;ve blogged previously about a technique for <a title="Testing code that uses Autofac + DependencyResolver in ASP.NET MVC" href="http://robdmoore.id.au/blog/2012/04/27/testing-code-that-uses-autofac-dependencyresolver-in-asp-net-mvc/" target="_blank">using DependencyResolver.Current and being able to unit test it</a> for similar situations. It&#8217;s not a great solution, but it does work and at least it can be unit tested.

Low and behold though, thanks to the power of the Internet, the person that raised the issue <a href="http://stackoverflow.com/questions/15538665/autofac-how-to-resolve-func-for-isomething-from-singleton-where-isomething-is" target="_blank">asked a question on StackOverflow</a> and got a _really elegant_ solution for how to inject factories in a singleton that will correctly resolve request-scoped objects. I&#8217;m pretty excited about it so I thought I&#8217;d give it more exposure by doing this blog post.

This is the technique in all it&#8217;s glory (I&#8217;ve renamed the method name slightly to make it more readable):

<pre class="brush: csharp; title: ; notranslate" title="">public Func&lt;T&gt; HttpRequestScopedFactoryFor&lt;T&gt;()
{
    return () =&gt; DependencyResolver.Current.GetService&lt;T&gt;();
}

...

builder.RegisterType&lt;SomeRequestScopedComponent&gt;().As&lt;ISomeRequestScopedComponent&gt;().InstancePerHttpRequest();
builder.RegisterInstance(HttpRequestScopedFactoryFor&lt;ISomeRequestScopedComponent&gt;()); // this is the magic bit
</pre>

This will then allow you to do something like this:

<pre class="brush: csharp; title: ; notranslate" title="">builder.RegisterType&lt;SomeSingletonType&gt;().As&lt;ISomeSingletonType&gt;().SingleInstance();

...

public class SomeSingletonType
{
    private readonly Func&lt;ISomeRequestScopedComponent&gt; _someRequestScopedComponentFactory;

    public SomeSingletonType(Func&lt;ISomeRequestScopedComponent&gt; someRequestScopedComponentFactory())
    {
        _someRequestScopedComponentFactory = someRequestScopedComponentFactory;
    }

    public void SomeMethod() {
        var requestScopedComponent = _requestScopedComponentFactory();
        ...
    }
}
</pre>

Nice and even easier to unit test than using DependencyResolver.Current directly!

Big thanks to <a href="https://github.com/thardy" target="_blank">@thardy</a> and <a href="http://stackoverflow.com/users/1964938/felix" target="_blank">@felix</a>.