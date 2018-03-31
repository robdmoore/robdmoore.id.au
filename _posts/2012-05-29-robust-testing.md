---
layout: post
title: Robust testing
date: 2012-05-29 21:46:18.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- TDD
- testing
- unobtrusive coding
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


My favourite kind of test is one that automatically applies itself to any changes in your codebase. That way you write the test once and then you can forget about it because it will always give you the assurance that it is testing what you intended it to. Reflection can be really handy for this because it allows you to scan your assembly for classes that you want to apply your test to for instance. I will post a blog post momentarily with an example.



In instances where you can't automatically apply the test I find it useful to put code in the test that will fail the test if your implementation changes. For example if you are testing the filters that are returned from a filter provider and you are checking for the two filters that you are expecting are provided then you might put in a further check to ensure that only 2 filters are provided so that the test fails if you add more filters. Adding more filters is probably the expected behaviour, but at least  it forces you to stop and think about whether the new behaviour what you expect based on your expression of the design of the system (the tests). In the case of the filters, if you are say providing different filters depending on different conditions it's certainly reasonable that an error could be introduced into the code resulting in incorrect filters being provided for some conditions that you want your test to catch.



In saying that, the danger that you may come across when you make your tests explicit is you may find yourself having to constantly make tedious updates to the tests for minor code changes that you often make. If you find yourself in this situation it's important to reassess the test and either make it automatically apply based on your implementation, as mentioned above, or adjust the test to make it less restrictive or remove it completely (obviously you still want to have confidence in your codebase so you need to weigh up the tediousness of the test with the value of what is being tested). This is why controller testing is often not worth it (check out the [controller testing library I have just released](http://robdmoore.id.au/blog/2012/05/29/fluentmvctesting-fluent-terse-and-maintainable-asp-net-mvc-controller-testing/ "FluentMVCTesting: Fluent, terse and maintainable ASP.NET MVC controller testing") though, which goes some way towards addressing that).



At the end of the day, I think a pragmatic approach is required for writing tests and deciding what should and shouldn't be tested and how strictly it should be tested based in balancing cost/maintainability of the testing against the value that the tests provide. If you can write tests that are flexible enough to automatically apply as you write new code then that is the best possible result!

