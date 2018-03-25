---
id: 4641
title: 'Unit, integration, subcutaneous, UI, fast, slow, mocks, TDD, isolation and scams&#8230; What is this? I don&#8217;t even!'
date: 2015-01-26T11:19:35+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=4641
permalink: /blog/2015/01/26/testing-i-dont-even/
categories:
  - Technical
tags:
  - Software Engineering
  - TDD
  - tech evangelism
  - testing
---
As outlined in the first post of my [Automated Testing blog series](http://robdmoore.id.au/blog/2014/01/23/test-naming-automated-testing-series/) I&#8217;ve been on a journey of self reflection and discovery about how best to write, structure and maintain automated tests.

The most confusing and profound realisations that I&#8217;ve had relate to how best to cover a codebase in tests and what type and speed those tests should be. The sorts of questions and considerations that come to mind about this are:

  * Should I be writing unit, subcutaneous, integration, etc. tests to cover a particular piece of code?
  * What is a unit test anyway? Everyone seems to have a different definition!
  * How do I get feedback as fast as possible &#8211; reducing feedback loops is incredibly important.
  * How much time/effort are we prepared to spend testing our software and what level of coverage do we need in return?
  * How do I keep my tests maintainable and how do I reduce the number of tests that break when I need to make a change to the codebase?
  * How do I make sure that my tests give me the maximum confidence that when the code is shipped to production it will work?
  * When should I be mocking the database, filesystem etc.
  * How do I ensure that my application is tested consistently?

In order to answer these questions and more I&#8217;ve watched a range of videos and read a number of blog posts from prominent people, spent time experimenting and reflecting on the techniques via the projects I work on (both professionally and with my <a href="https://github.com/robdmoore" rel="noreferrer">Open Source Software</a> work) and tried to draw my own conclusions.

There are some notable videos that I&#8217;ve come across that, in particular, have helped me with my learning and realisations so I&#8217;ve created a series of posts around them (and might add to it over time if I find other posts). I&#8217;ve tried to summarise the main points I found interesting from the material as well as injecting my own thoughts and experience where relevant.

  * [Review of: J.B. Rainsberger â€“ Integrated Tests Are A Scam](http://robdmoore.id.au/blog/2015/01/26/review-of-j-b-rainsberger-integrated-tests-are-a-scam/ "Review of: J.B. Rainsberger â€“ Integrated Tests Are A Scam")
  * [Review of: Ian Cooper â€“ TDD, where did it all go wrong](http://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong/ "Review of: Ian Cooper â€“ TDD, where did it all go wrong")
  * [Review of: Jimmy Bogard &#8211; Holistic Testing](http://robdmoore.id.au/blog/2015/01/26/review-of-jimmy-bogard-holistic-testing/ "Review of: Jimmy Bogard â€“ Holistic Testing")

There is a great talk by Gary Bernhardt called <a href="https://www.destroyallsoftware.com/talks/boundaries" target="_blank">Boundaries</a>. For completeness, it is worth looking at in relation to the topics discussed in the above articles. IÂ don&#8217;t have much to say about this yet (I&#8217;m still getting my head around where it fits in) apart from the fact that code that maps input(s) to output(s) without side effects are obviously very easy to test and I&#8217;ve found that where I have used immutable value objects in my domain model it has made testing easier.

## Summary

I will summarise my current thoughts (this might change over time) by revisiting the questions I posed above:

  * Should I be writing unit, subcutaneous, integration, etc. tests to cover a particular piece of code? 
      * Typical consultant answer: it depends. In general I&#8217;d say write the fastest possible test you can that gives you the minimum requiredÂ confidence andÂ bakes in the minimum amount of implementation details.
      * I&#8217;ve had a lot of luck covering line-of-business web apps with mostly subcutaneous tests against the MVC controllers, with a smattering of unit tests to check conventions and test really complex logic and I typicallyÂ see how far I can get without writing UI tests, but when I do I test high-value scenarios or complex UIs.
  * What is a unit test anyway? Everyone seems to have a different definition! 
      * I like [Jimmy Bogard&#8217;s definition](http://robdmoore.id.au/blog/2015/01/26/review-of-jimmy-bogard-holistic-testing/ "Review of: Jimmy Bogard â€“ Holistic Testing"): &#8220;Units of behaviour, isolated from other units of behaviour&#8221;
  * How do I get feedback as fast as possible &#8211; reducing feedback loops is incredibly important. 
      * Follow Jimmy&#8217;s advice and focus on writing as many tests that are as fast as possible rather than worrying about whether a test is a unit test or integration test.
      * Be pragmmatic though, you might get adequate speed, but a higher level of confidence by integrating your tests with the database for instance (this has worked well for me)
  * How much time/effort are we prepared to spend testing our software and what level of coverage do we need in return? 
      * I think it depends on the application &#8211; the product owner, users and business in general will all have different tolerances for risk of something going wrong. Do the minimum amount that&#8217;s needed to get the amount of confidence that is required.
      * In general I try and following the mantra of &#8220;challenge yourself to start simple then inspect and adapt&#8221; (thanks <a href="https://twitter.com/jesspanni" target="_blank">Jess</a> for helping refine that). Start off with the simplest testing approach that will work and if you find you are spending too long writing tests or the tests don&#8217;t give you the right confidence then adjust from there.
  * How do I keep my tests maintainable and how do I reduce the number of tests that break when I need to make a change to the codebase? 
      * Focus on removing implementation details from tests. Be comfortable testing multiple classes in a single test (use your production DI container!).
      * Structure the tests according to user behaviour &#8211; they are less likely to have implementation details and they form better documentation of the system.
  * How do I make sure that my tests give me the maximum confidence that when the code is shipped to production it will work? 
      * Reduce the amount of mocking you use to the bare minimum &#8211; hopefully just things external to your application so that you are testing production-like code paths.
      * Subcutaneous tests are a very good middle ground between low-level implementation-focused unit tests and slow and brittle UI tests.
  * When should I be mocking the database, filesystem etc. 
      * When you need the speed and are happy to forgo the lower confidence.
      * Also, if they are external to your application or not completely under your application&#8217;s control e.g. a database that is touched by multiple apps and your app doesn&#8217;t run migrations on it and control the schema.
  * How do I ensure that my application is tested consistently? 
      * Come up with a testing strategy and stick with it. Adjust it over time as you learn new things though.
      * Don&#8217;t beÂ afraid to use different styles of test as appropriate &#8211; e.g. the bulk of tests might be subcutaneous, but you might decide to write lower level unit tests for complex logic.

In closing, I wanted to show a couple of quotes that I think are relevant:

Fellow [Readifarian](http://readify.net/), [Kahne Raja](https://twitter.com/KahneRaja) recently said this on an internal Yammer discussion and I really identify with it:

> &#8220;We should think about our test projects like we think about our solution projects. They involve complex design patterns and regular refactoring.&#8221;

Another Readifarian, <a href="https://twitter.com/PawelPabich" target="_blank">Pawel Pabich</a> , <a href="https://twitter.com/PawelPabich/status/559666146853412864" target="_blank">made the important point that</a>:

> &#8220;[The tests you write]Â depend[<del>s</del>] on the app you are writing. [A] CRUD Web app might require different tests than a calculator.&#8221;

I also like this quote from [Kent Beck](http://stackoverflow.com/questions/153234/how-deep-are-your-unit-tests/153565#153565):

> &#8220;I get paid for code that works, not for tests, so my philosophy is to test as little as possible to reach a given level of confidence.&#8221;