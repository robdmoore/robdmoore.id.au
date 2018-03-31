---
layout: post
title: Test Naming [Automated Testing Series]
date: 2014-01-23 22:14:19.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- Software Engineering
- TDD
- testing
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


For the last 6 months I've been thinking and reading **a lot** about how best to write automated tests for applications - including data generation, structure, naming, etc. This blog series is a foray into my current thinking (which will probably change over time; for instance I'm looking back at tests I wrote 6 months ago that I thought were awesome and now thinking that I hate them :P). I'm inviting you to join me on this journey by publishing this series and I encourage thoughtful comments to provoke further thinking and discussion.


- [Test Naming](http://robdmoore.id.au/blog/2014/01/23/test-naming-automated-testing-series/)
- [General Test Structure](http://robdmoore.id.au/blog/2014/01/27/general-test-structure-automated-testing-series/)
- [Acceptance Tests Structure](http://robdmoore.id.au/blog/2014/01/27/acceptance-tests-structure-automated-testing-series/)
- [Making Intent Clear](http://robdmoore.id.au/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
  - [Derived Values](http://robdmoore.id.au/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
  - Anonymous Variables
  - Equivalence Classes and Constrained Non-Determinism
- Unit Testing
  - What should a unit be / what level should we be testing at?
  - What role should mocking have in unit testing?
- UI Testing
  - What should be your goal with UI Testing?
  - What are the best practices for keeping UI tests robust?


## Test Naming


I have always been a fan of the [Arrange Act Assert](http://agileinaflash.blogspot.com.au/2009/03/arrange-act-assert.html) structure within a test and started by naming my test classes like `&lt;ThingBeingTested&gt;Should` with each test method named like `A_statement_indicating_what_the_thing_being_tested_should_do`. You can see examples of this type of approach in some of my older repositories such as [TestStack.FluentMVCTesting](https://github.com/TestStack/TestStack.FluentMVCTesting/tree/master/TestStack.FluentMVCTesting.Tests).



More recently I've started naming my tests with a Given, When, Then description (be it an acceptance test or a unit test). I like the Given, When, Then method naming because:


- Generally the Given will map directly to the Arrange, The When will map directly to the Act and the Then will map directly to the Assert - this provides a way of quickly cross checking that a test does what the name suggests it should by comparing the name to the implementation
  - I find this really useful when [reviewing pull requests](http://robdmoore.id.au/blog/2013/12/01/using-pull-requests-for-commercialprivateproprietary-development/) to quickly understand that the author of a test didn't make a mistake and structured their test correctly
  - e.g. it's probably wrong if there is a Given in the name, but no clear Arrange section
- It requires that you put more thought into the test name, which forces you to start by thinking about **what** scenario you are trying to test rather than "phoning in" an *arbitrary* test name and diving into the implementation and focussing on **how** you are testing it
  - My gut feel along with anecdotal evidence from the last few projects I've worked on - with developers of varying skill levels - suggests this leads to better written, more understandable tests
  - **Side note:** I really like the idea discussed by [Grzegorz Gałęzowski](https://github.com/grzesiek-galezowski) in his [TDD e-book](https://github.com/grzesiek-galezowski/tdd-ebook) about the order in which you should write a TDD test (from the section "Start From The End") - he suggests you start with the Then section and then work backwards from there
    - I can't honestly say I usually do this though, but rather just that it sounds like a good idea; generally I know exactly what I want to write when writing a test (yes, it's possible I'm just naive and/or arrogant ;))



To clarify, I still use Arrange, Act, Assert in my tests. I could write a whole blog post on how I structure the AAA sections in my tests, but luckily I don't have to because [Mark Seemann has already written a really good post that mimics my thoughts exactly](http://blog.ploeh.dk/2013/06/24/a-heuristic-for-formatting-code-according-to-the-aaa-pattern/).

