---
layout: post
title: Terse controller testing with ASP.NET MVC (part 1)
date: 2011-03-14 23:28:13.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- testing
author: rob
---


As I alluded to in a [previous post](/blog/2011/03/12/web-application-testing/ "Web application testing"), I think that achieving high code coverage in controller tests is often a waste of time in terms of return on investment - most of the stuff in there will be trivial things that either work or don't and will be hard to regressively break (e.g. returning the view with the model if model validation failed). In saying that, if there is a way to get really terse tests then they become easier to write and maintain and then it's worth aiming for high code coverage (since the reward outweighs the cost).  
<!--more-->  
With this in mind, I am performing an experiment to see how terse I can get some 100% code coverage controller tests to become. I'm not sure how many posts this series will end up being or what the outcome will be, but I have a few ideas in my head. Namely around exploring the following techniques in turn to see how they decrease the verbosity of the tests:


- Auto-mocking
- Automatic test object generation
- MVC Contrib test helpers
- A custom syntax to extend the test helpers
- Looking at how to get both unit testing and integration testing of the controller "for free" (or close to it) to reduce duplication



In order to perform this experiment I've implemented a dummy MVC 3 web application that involves managing a list of "People" (First name, last name, email address) via an in-memory "database" (an application-scoped list).



This code can be found [on github](https://github.com/robdmoore/ASP.NET-MVC-Terse-Controller-Testing).



I've written some 100% code coverage unit tests for the controller using [NSubstitute](http://nsubstitute.github.com/) for mocking. There is little to no re-factoring in there (in reality the tests could be a bit terser by extrapolating out some of the common tests, but that's what the investigation is about: identifying where re-factoring and appropriate library use can make the tests more terse). This first-run effort can be found in the TerseControllerTesting.Tests1_Verbose directory.
