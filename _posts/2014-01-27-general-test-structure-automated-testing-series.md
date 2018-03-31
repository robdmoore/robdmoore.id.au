---
layout: post
title: General Test Structure [Automated Testing Series]
date: 2014-01-27 00:37:23.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
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


This is part of my ongoing Automated Testing blog series:


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


## General Test Structure


Recently I found myself experimenting with demon-coder, fellow Readifarian, and all-round-nice-guy [Ben Scott](http://bendetat.com/) (o/ - that's for Ben; he will understand) with trying to extract shared Given, When and/or Then sections of tests by using a pattern whereby the Given and possibly When of a test happens in the test setup (or constructor if using [XUnit](http://xunit.codeplex.com/)). This allows each assertion (or Then) that you want to make to be in a separate test method and avoids both the problem of multiple somewhat/completely unrelated asserts in a single test and massive duplication of test setup.



I realise there are other ways of dealing with the duplication such as abstracting common logic into private methods (this is the technique I have used in the past), but I've found the above solution to be much nicer / cleaner and clearer in intent. It's also worth noting that there are frameworks that directly support testing with the Given, When, Then structure and I cover that further in a later post in this series (as well as why I don't just use them all the time).



I've created a set of code samples to illustrate the different techniques at [https://gist.github.com/robdmoore/8634204](https://gist.github.com/robdmoore/8634204):


- `01_Implementation.cs` contains an example mapper class to be tested - it is mapping from some sort of measurement of a value that has been taken (say, from an API or a hardware device) with a confidence and some kind of identifier to an object that represents the identity (broken down into component parts), the measurement value and an adjusted value (based on the confidence). It's a fairly contrived example, but hopefully it's understandable enough that it illustrates my point.
- `02_MultipleAsserts.cs` shows a single Arrange Act Assert style test that contains multiple asserts for each of the mapped properties and has description strings for each assert so that you can tell which assert was the one that failed.
- `03_RelatedMultipleAsserts.cs` partially addresses the main problem in the first test (multiple somewhat unrelated asserts) by grouping the related asserts together - this introduces repetition in the tests though.
- `04_AbstractedCommonCode` reduces the duplication by abstracting out the common logic into private methods and provides a separate test for each assert - because of this the assertions don't need a description (since there is one assert per test), but the test class is a lot more verbose and there is duplication both across test names and test content.
- `05_GivenAndWhenInSetup.cs` demonstrates the technique I describe above; in this case the constructor of the class (it also could have been a `[SetUp]` method) contains both the Arrange/Given and Act/When part of the test and each test method is both very slim (containing just the assertion) and is named with just the Then.
  - In NUnit you can use `[SetUp]` and in XUnit the constructor, but it's worth noting that this means that code will run for every test (which is usually fine), however if the code you are testing takes a reasonable amount of time to run then you can use a constructor or `[TestFixtureSetUp]` in NUnit or a static constructor (if you need to also use the constructor (say, to perform the When or allow for slightly different behaviour across inherited classes when using inheritance) since the fixtures get injected after the constructor is called) or `IUseFixture&lt;TFixture&gt;` in XUnit.
  - It's worth noting this class is still a lot bigger than the single AAA test , but for a situation like this I feel it's a lot more understandable and better encapsulates the behaviour being tested; this technique also comes into it's own when there is duplication of Given and/or When logic across multiple AAA tests (you can use inheritance to reuse or extend the Given/When code)
- `06_ConcernForBaseClass.cs` shows a variation of the above strategy that provides a common base class that can be used in tests to help make the Given and When code more explicit as well as identifying what the [subject under test](http://xunitpatterns.com/SUT.html) is.



Another technique to reduce the setup of tests is to use AutoFixture's auto data attributes ([XUnit and NUnit are supported](https://github.com/AutoFixture/AutoFixture)) to inject any variables that you need into the test. I'm not going to cover that in this post at this stage because a) I haven't used it in anger and b) I suspect it's too complex for teams that aren't all experienced (i.e. it's a bit too "magic"). It is *very* cool though so I highly encourage you to at least evaluate it as an option.



There are a number of things to note about what I've been doing with this technique so far:


- We still managed to keep the convention of having a test described by Given (where appropriate; sometimes you don't need the Given), When and Then by ensuring that the combination of the class name and the test name cater for them
  - e.g. a class called `GivenX_WhenY` or just `WhenY` with a bunch of test methods called `ThenZ` or class called `GivenX` with a bunch of test methods called `WhenY_ThenZ`
- You can reuse and extend common parts of your test logic by using inheritance e.g. define a base class with common Given and/or When and extend it for different variations of the Given and either reuse Then's from the base class and/or define new ones for each inheriting class
  - I've seen some people use this technique with 5 levels deep of nested classes with one line of code being reused in some of the hierarchy; while I'm a massive fan of [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) I think that there is a point where you can go overboard and in the process lose understandability - 5 level deep nested test classes is in my opinion completely overboard
- An interesting side-effect of this approach is that rather than having one test class per thing being tested you end up with multiple classes
  - I have always followed a convention of putting a test file in the same namespace as the class being tested (except in the Test project and post-fixing with `Tests`) e.g. `MyApp.Commands.CreateInvoiceCommand` would be tested by `MyApp.Tests.Commands.CreateInvoiceCommandTests`, but that doesn't work when you have multiple test files so what I've taken to doing is making a folder at `MyApp.Tests\Commands\CreateInvoiceCommandTests`, which contains all the test classes
  - This allows me to mix and match folders (where needed) and single test classes (sometimes a single class is enough so I don't bother creating a folder) while keeping it clear and consistent how and where to find the tests
- Not all tests need to be written in this way - sometimes a simple, single AAA test (or a bunch of them) is enough
  - As you can see from the above code samples the AAA tests tend to be terser and quicker to write so when there isn't much duplicated logic across tests and you only need one assertion or the assertions are one logical assertion (i.e. belong in a single test) then there is no reason to stray from single AAA tests in my opinion
  - I don't feel that a combination of AAA tests and the common setup tests cause a consistency issue because it's fairly easy to trace what's happening and the common setup logic falls within the normal bounds of what you might have for AAA tests anyway
  - I find it's easier to create data-driven tests using single method tests because you have so much more flexibility to do that using NUnit and XUnit - if you find a good way to do it with test-per-class rather than test-per-method let me know!
    - NUnit's [TestFixture attribute](http://www.nunit.org/index.php?p=testFixture&amp;r=2.6.3) goes some of the way, but it's not as powerful as something like `TestCase` or`TestCaseSource`
- There is a base class (ConcernFor) that we were using for some of the tests that I included in the last code sample above

