---
layout: post
title: Resolving request-scoped objects into a singleton with Autofac
date: 2013-03-23 13:21:57.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- Autofac
- C#
- testing
- unobtrusive coding
- validation
author: rob
---


This week I had an [issue raised on my Github](https://github.com/robdmoore/UnobtrusiveMVCTechniques/issues/1) site for examples of [unobtrusive validation with ASP.NET MVC](/blog/2012/04/27/unobtrusive-validation-in-asp-net-mvc-3-and-4/ "Unobtrusive Validation in ASP.NET MVC 3 and 4"). The person that raised the issue was having a problem where they wanted their fluent validation modules to be singleton, but they wanted to inject a factory that can be invoked to return a request-scoped object (in this case some sort of database store). Inevitably they came across the "*No scope with a Tag matching 'AutofacWebRequest' is visible from the scope in which the instance was requested*" error.



I've blogged previously about a technique for [using DependencyResolver.Current and being able to unit test it](/blog/2012/04/27/testing-code-that-uses-autofac-dependencyresolver-in-asp-net-mvc/ "Testing code that uses Autofac + DependencyResolver in ASP.NET MVC") for similar situations. It's not a great solution, but it does work and at least it can be unit tested.



Low and behold though, thanks to the power of the Internet, the person that raised the issue [asked a question on StackOverflow](http://stackoverflow.com/questions/15538665/autofac-how-to-resolve-func-for-isomething-from-singleton-where-isomething-is) and got a *really elegant* solution for how to inject factories in a singleton that will correctly resolve request-scoped objects. I'm pretty excited about it so I thought I'd give it more exposure by doing this blog post.



This is the technique in all it's glory (I've renamed the method name slightly to make it more readable):



```csharp
public Func<T> HttpRequestScopedFactoryFor<T>()
{
    return () => DependencyResolver.Current.GetService<T>();
}
...
builder.RegisterType<SomeRequestScopedComponent>().As<ISomeRequestScopedComponent>().InstancePerHttpRequest();
builder.RegisterInstance(HttpRequestScopedFactoryFor<ISomeRequestScopedComponent>()); // this is the magic bit
```



This will then allow you to do something like this:



```csharp
builder.RegisterType<SomeSingletonType>().As<ISomeSingletonType>().SingleInstance();
...
public class SomeSingletonType
{
    private readonly Func<ISomeRequestScopedComponent> _someRequestScopedComponentFactory;
    public SomeSingletonType(Func<ISomeRequestScopedComponent> someRequestScopedComponentFactory())
    {
        _someRequestScopedComponentFactory = someRequestScopedComponentFactory;
    }
    public void SomeMethod() {
        var requestScopedComponent = _requestScopedComponentFactory();
        ...
    }
}
```



Nice and even easier to unit test than using DependencyResolver.Current directly!



Big thanks to [@thardy](https://github.com/thardy) and [@felix](http://stackoverflow.com/users/1964938/felix).

