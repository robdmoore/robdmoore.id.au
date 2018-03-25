---
id: 262
title: 'FluentMVCTesting: Fluent, terse and maintainable ASP.NET MVC controller testing'
date: 2012-05-29T01:08:21+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=262
permalink: /blog/2012/05/29/fluentmvctesting-fluent-terse-and-maintainable-asp-net-mvc-controller-testing/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - FluentMVCTesting
  - NuGet
  - TDD
  - testing
---
I would like to announce the release of a software library I have been using for the last year or so as open source via <a href="https://nuget.org/packages/FluentMVCTesting" target="_blank">NuGet</a> / <a href="https://github.com/robdmoore/FluentMVCTesting" target="_blank">Github</a>: FluentMVCTesting.

The motivation behind this library is to provide a way to test MVC actions quickly, tersely and maintainably. Most examples I find on MVC controller testing are incredibly verbose, repetitive and time-consuming to write and maintain.

Given how quickly you can write controller actions and how simple they are (assuming you are following best practices and keeping them lean) the time to test them generally isn&#8217;t worth it given you can glance at most of your controller actions and know they are right or wrong instantly.

This library aims to make the time to implement the tests inconsequential and then the value your tests are providing is worth it.

The other problem that I&#8217;ve noticed with most examples of controller testing is that there are a lot of magic strings being used to test view and action names; this library also aims to (where possible) utilise the type system to resolve a lot of those magic strings, thus ensuring your tests are more maintainable and require less re-work when you perform major refactoring of your code.

I came up with this library after using theÂ [MVCContrib.TestHelper](http://mvccontrib.codeplex.com/wikipage?title=TestHelper) library for quite a while, but becoming frustrated with it; the library was initially created during theÂ [experiment I conducted](http://robdmoore.id.au/blog/2011/03/14/terse-controller-testing-with-asp-net-mvc/) to try and create terse controller tests (which I still have to write a follow-up post for at some point!). I have been using the library for over a year on a number of projects both personally and professionally.

A small code snippet to whet your appetite (go to theÂ <a href="https://nuget.org/packages/FluentMVCTesting" target="_blank">NuGet</a> site for more detailed documentation and examples):

<pre class="brush: csharp; title: ; notranslate" title="">// Check that a post to the Login action with model errors returns the Login view passing through the model
var vm = new LoginViewModel();
_controller.WithModelErrors().WithCallTo(c =&gt; c.Login(vm)).ShouldRenderDefaultView().WithModel(vm);

// Check that a post to the Login action without model errors redirects to the site homepage
_controller.WithCallTo(c =&gt; c.Login(new LoginViewModel())).ShouldRedirectTo&lt;HomeController&gt;(c =&gt; c.Index());
</pre>

Enjoy!