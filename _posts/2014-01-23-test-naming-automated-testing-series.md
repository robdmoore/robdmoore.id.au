---
id: 2241
title: 'Test Naming [Automated Testing Series]'
date: 2014-01-23T22:14:19+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=2241
permalink: /blog/2014/01/23/test-naming-automated-testing-series/
categories:
  - Technical
tags:
  - Software Engineering
  - TDD
  - testing
---
For the last 6 months I&#8217;ve been thinking and readingÂ **a lot**Â about how best to write automated tests for applications &#8211; including data generation, structure, naming, etc. This blog series is a foray into my current thinking (which will probably change over time; for instance I&#8217;m looking back at tests I wrote 6 months ago that I thought were awesome and now thinking that I hate them :P). I&#8217;m inviting you to join me on this journey by publishing this series and I encourage thoughtful comments to provoke further thinking and discussion.

  * [Test Naming](http://robdmoore.id.au/blog/2014/01/23/test-naming-automated-testing-series/)
  * [General Test Structure](http://robdmoore.id.au/blog/2014/01/27/general-test-structure-automated-testing-series/)
  * [Acceptance Tests Structure](http://robdmoore.id.au/blog/2014/01/27/acceptance-tests-structure-automated-testing-series/)
  * [Making Intent Clear](http://robdmoore.id.au/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/) 
      * [Derived Values](http://robdmoore.id.au/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
      * Anonymous Variables
      * Equivalence Classes and Constrained Non-Determinism
  * Unit Testing 
      * What should a unit be / what level should we be testing at?
      * What role should mocking have in unit testing?
  * UI Testing 
      * What should be your goal with UI Testing?
      * What are the best practices for keeping UI tests robust?

## Test Naming

I have always been a fan of theÂ <a href="http://agileinaflash.blogspot.com.au/2009/03/arrange-act-assert.html" target="_blank">Arrange Act Assert</a>Â structure within a test and started by naming my test classes likeÂ `<ThingBeingTested>Should`Â with each test method named likeÂ `A_statement_indicating_what_the_thing_being_tested_should_do`. You can see examples of this type of approach in some of my older repositories such asÂ <a href="https://github.com/TestStack/TestStack.FluentMVCTesting/tree/master/TestStack.FluentMVCTesting.Tests" target="_blank">TestStack.FluentMVCTesting</a>.

More recently I&#8217;ve started naming my tests with a Given, When, Then description (be it an acceptance test or a unit test). I like the Given, When, Then method naming because:

  * Generally the Given will map directly to the Arrange, The When will map directly to the Act and the Then will map directly to the Assert &#8211; this provides a way of quickly cross checking that a test does what the name suggests it should by comparing the name to the implementation 
      * I find this really useful whenÂ <a href="http://robdmoore.id.au/blog/2013/12/01/using-pull-requests-for-commercialprivateproprietary-development/" target="_blank">reviewing pull requests</a>Â to quickly understand that the author of a test didn&#8217;t make a mistake and structured their test correctly
      * e.g. it&#8217;s probably wrong if there is a Given in the name, but no clear Arrange section
  * It requires that you put more thought into the test name, which forces you to start by thinking aboutÂ **what**Â scenario you are trying to test rather than &#8220;phoning in&#8221; anÂ _arbitrary_Â test name and diving into the implementation and focussing onÂ **how**Â you are testing it 
      * My gut feel along with anecdotal evidence from the last few projects I&#8217;ve worked on &#8211; with developers of varying skill levels &#8211; suggests this leads to better written, more understandable tests
      * **Side note:**Â I really like the idea discussed byÂ <a href="https://github.com/grzesiek-galezowski" target="_blank">Grzegorz GaÅ‚Ä™zowski</a>Â in hisÂ <a href="https://github.com/grzesiek-galezowski/tdd-ebook" target="_blank">TDD e-book</a>Â about the order in which you should write a TDD test (from the section &#8220;Start From The End&#8221;) &#8211; he suggests you start with the Then section and then work backwards from there 
          * I can&#8217;t honestly say I usually do this though, but rather just that it sounds like a good idea; generally I know exactly what I want to write when writing a test (yes, it&#8217;s possible I&#8217;m just naive and/or arrogant ;))

To clarify, I still use Arrange, Act, Assert in my tests. I could write a whole blog post on how I structure the AAA sections in my tests, but luckily I don&#8217;t have to becauseÂ <a href="http://blog.ploeh.dk/2013/06/24/a-heuristic-for-formatting-code-according-to-the-aaa-pattern/" target="_blank">Mark Seemann has already written a really good post that mimics my thoughts exactly</a>.