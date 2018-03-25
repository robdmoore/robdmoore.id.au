---
id: 4671
title: 'Review of: J.B. Rainsberger &#8211; Integrated Tests Are A Scam'
date: 2015-01-26T11:20:48+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=4671
permalink: /blog/2015/01/26/review-of-j-b-rainsberger-integrated-tests-are-a-scam/
categories:
  - Technical
tags:
  - continuous delivery
  - TDD
  - testing
---
This post discusses the talk &#8220;<a href="http://vimeo.com/80533536" target="_blank">Integrated Tests Are A Scam</a>&#8221; by J.B. Rainsberger, which was given in November 2013. See [my introduction post](http://robdmoore.id.au/blog/2015/01/26/testing-i-dont-even/ "Unit, integration, subcutaneous, UI, fast, slow, mocks, TDD, isolation and scamsâ€¦ What is this? I donâ€™t even!") to get the context behind this post and the other posts I have written in this series.

## Overview

There are a couple of good points in this talk and also quite a few points I disagree with.

The tl;dr of this presentation is that J.B. Rainsberger often sees people deal with the problem of having &#8220;100% of tests pass, but there is still bugs&#8221; be solved by adding _integrated_ tests (note: this isn&#8217;t misspelt, <a href="http://codebetter.com/sebastienlambla/2013/07/11/unit-testing-is-out-vertical-slice-testing-is-in/#comment-967257261" target="_blank">he classifies integrated tests differently from integration tests</a>). He likens this to using &#8220;asprin that gives you a bigger headache&#8221; and says you should instead write isolated tests that test a single object at a time and have matching collaboration and contract tests on each side of the interactions that object has with its peers. He then uses mathematical induction to prove that this will completely test each layer of the application with fast, isolated tests across all logic branches with O(n) tests rather than O(n!).

He says that integrated tests are a scam because they result in you:

<ul class="task-list">
  <li>
    designing code more sloppily
  </li>
  <li>
    making more mistakes
  </li>
  <li>
    writing fewer tests because it&#8217;s harder to write the tests due to the emerging design issues
  </li>
  <li>
    thus being <strong>more</strong> likely to have a situation where &#8220;100% of tests pass, but there is still bugs&#8221;
  </li>
</ul>

### Integrated test definition

He defines an integrated test as a test that touches &#8220;a cluster of objects&#8221; and a unit test as a test that just touches a single object and is &#8220;isolated&#8221;. By this definition and via the premise of his talk every time you write a unit test that touches multiple objects then you aren&#8217;t writing a unit test, but you are writing a &#8220;self-replicating virus that invades your projects, that threatens to destroy your codebase, that threatens your sanity and your life&#8221;. I suspect that some of that sentiment is sensationalised for the purposes of making a good talk (he even has <a href="http://codebetter.com/sebastienlambla/2013/07/11/unit-testing-is-out-vertical-slice-testing-is-in/#comment-967253863" target="_blank">admitted to happily writing tests at a higher level</a>), but the talk is a very popular one and it presents a very one-sided view so I feel it&#8217;s important to point that out.

I disagree with that definition of a unit test and I think that strict approach will lead to not only writing more tests than is needed, but tying a lot of your tests to implementation details that make the tests much more fragile and less useful.

**Side note:** I&#8217;ll be using J.B. Rainsberger&#8217;s definitions of integrated and unit tests for this post to provide less confusing discussion in the context of his presentation.

## Integrated tests and design feedback

The hypothesis that you get less feedback about the design of your software from integrated tests and thus they will result in your application becoming a mess is pretty sketchy in my opinion. Call me naive, but if you are in a team that lets the code get like that with integrated tests then I think that same team will have the same result with more fine-grained tests. If you aren&#8217;t serious about refactoring your code (regardless of whether or not you use TDD and have an explicit refactor step in your process) then yeah, it&#8217;s going to get bad. In my experience, you still get design feedback when writing your test at a higher level of your application stack with real dependencies underneath (apart from mocking dependencies external to your application) and implementing the code to make it pass.

There is a tieback here to the role of TDD in software design and I think that TDD still helps with design when writing tests that encapsulate more than a single object; it influences the design of your public interface from the level you are testing against and everything underneath is just an implementation detail of that public interface (more on this in other posts in the series).

It&#8217;s worth noting that I&#8217;m coming from the perspective of a staticly typed language where I can safely create implementation details without needing fine-grained tests to cover every little detail. I can imagine that in situations where you are writing with a dynamic language you _might_ feel the need to make up for a lack of compiler by writing more fine-grained tests.

This is one of the reasons why I have a preference for statically typed languages &#8211; the compiler obviates the need for writing mundane tests to check things like property names are correct (although<a href="http://blog.ploeh.dk/2013/03/08/test-trivial-code/" target="_blank">some people still like to write these kinds of tests</a>).

If you are using a dynamic language and your application structure isn&#8217;t overly complex (i.e. it&#8217;s not structured with layer upon layer upon layer) then you can probably still test from a higher level with a dynamic language without too much pain. For instance, I&#8217;ve written Angular JS applications where I&#8217;ve tested services from the controller level (with real dependencies) successfully.

It&#8217;s also relevant to consider the points that <a href="https://twitter.com/dhh" target="_blank">@dhh</a> makes in his post about <a href="http://david.heinemeierhansson.com/2014/test-induced-design-damage.html" target="_blank">test-induced design damage</a> and the subsequent <a href="http://martinfowler.com/articles/is-tdd-dead/" target="_blank">TDD is dead video series</a>.

### Integrated tests and identifying problems

J.B. Rainsberger says a big problem with integrated tests is that when they fail you have no idea where the problem is. I agree that by glancing at the name of the test that&#8217;s broken you might not immediately know which line of code is at fault.

If you structure your tests and code well then usually when there is a test failure in a higher level test you can look at the exception message to get a pretty good idea unless it&#8217;s a generic exception like aÂ `NullReferenceException`. In those scenarios you can spend a little bit more time and look at the stack trace to nail down the offending line of code. This is slower, but I personally think that the trade-off that you get (as discussed throughout this series) it worth this small increase.

## Motivation to write integrated tests

J.B. Rainsberger puts forward that the motivation people usually have to write integrated tests is to find bugs that unit tests can&#8217;t uncover by testing the interaction between objects. While it is a nice benefit to test the code closer to how it&#8217;s executed in production, with real collaborators, it&#8217;s not the main reason I write tests that cover multiple objects. I write this style of tests because they allow us to divorce the tests from knowing about implementation details and write them at a much more useful level of abstraction, closer to what the end user cares about. This gives full flexibility to refactor code without breaking tests since the tests can describe user scenarios rather than developer-focussed implementation concerns. It&#8217;s appropriate to name drop <a href="http://guide.agilealliance.org/guide/bdd.html" target="_blank">BDD</a> and <a href="http://testobsessed.com/wp-content/uploads/2011/04/atddexample.pdf" target="_blank">ATDD</a> here.

## Integrated tests necessitate a combinatorial explosion in the number of tests

Lack of design feedback aside, the main criticism that J.B. Rainsberger has against integrated tests is that to test all pathways through a codebase you need to have a combinatorial explosion of tests (O(n!)). While this is technically true I question the practicality of this argument for a well designed system:

<ul class="task-list">
  <li>
    He seems to suggest that you are going to build software that contains a lot of layers and within each layer you will have a lot of branches. While I&#8217;m sure there are examples out there like that, most of the applications I&#8217;ve been involved with can be architected to be relatively flat.
  </li>
  <li>
    It&#8217;s possible that I just haven&#8217;t written code for the right industries and thus haven&#8217;t across the kinds of scenarios he is envisaging, but at best it demonstrates that his sweeping statements don&#8217;t always apply and you should take a pragmatic approach based on your codebase.
  </li>
  <li>
    Consider the scenario whereÂ you add a test against new functionality against theÂ behaviour of the system from the user&#8217;s perspective (e.g. a BDD style test for each acceptance criteria in your user story). In that scenario, then, being naive for a moment,Â <em>all</em> code that you add could be tested by these higher level tests.
  </li>
  <li>
    Naivety aside, you will add code that doesn&#8217;t directly relate to the acceptance criteria, this might be infrastructure code or defensive programming, or logging etc. and in those cases I think you just need to evaluate how important it is to test that code: <ul class="task-list">
      <li>
        Sometimes the code is very declarative and obviously wrong or right &#8211; in those instances, where there is unlikely to be complex interactions with other parts of the code (null checks being a great example) then I generally don&#8217;t think it needs to be tested
      </li>
      <li>
        Sometimes it&#8217;s common code that will necessarily be tested by any integrated (or UI) tests you do have anyway
      </li>
      <li>
        Sometimes it&#8217;s code that is complex or important enough to warrant specific, &#8220;implementation focussed&#8221;, unit tests &#8211; add them!
      </li>
      <li>
        If such code didn&#8217;t warrant a test and later turns out to introduce a bug then that gives you feedback that it wasn&#8217;t that obvious afterall and at that point you can introduce a breaking test so it never happens again (<strong>before fixing it</strong> &#8211; that&#8217;s the <a href="http://jasonpolites.github.io/tao-of-testing/ch4-1.1.html#rule-8-write-tests-before-fixing-bugs" target="_blank">first step you take when you have a bug</a> right?)
      </li>
      <li>
        If the above point makes you feel uncomfortable then you should go and look up <a href="http://continuousdelivery.com/" target="_blank">continuous delivery</a> and work on ensuring your team works towards the capability to deliver code to production at <em>any</em> time so <a href="http://www.slideshare.net/500startups/ross-synder-etsy-sxsw-lean-startup-2013" target="_blank">rolling forward with fixes</a> is fast and efficient
      </li>
      <li>
        It&#8217;s important to keep in mind that the point of testing generally <a href="http://martinfowler.com/bliki/TestCoverage.html" target="_blank">isn&#8217;t to get 100% coverage</a>, it&#8217;s to give you confidence that your application is going to work &#8211; I talk about this more later in the series &#8211; I can think of industries where this is probably different (e.g. healthcare, aerospace) so as usual be pragmatic!
      </li>
    </ul>
  </li>
  
  <li>
    There will always be exceptions to the rule, if you find a part of the codebase that is more complex and does require a lower level test to feasibily cover all of the combinations then do it &#8211; <strong>that doesn&#8217;t mean you should write those tests for the whole system though.</strong>
  </li>
</ul>

### Contract and collaboration tests

The part about J.B. Rainsberger&#8217;s presentation that I did like was his solution to the &#8220;problem&#8221;. While I think it&#8217;s fairly basic, common-sense advice that a lot of people probably follow I still think it&#8217;s good advice.

He describes that, where you have two objects collaborating with each other, you might consider one object to be the &#8220;server&#8221; and the other the &#8220;client&#8221; and the server can be tested completely independently of the client since it will simply expose a public API that can be called. In that scenario, he suggests that the following set of tests should be written:

<ul class="task-list">
  <li>
    The client should have a &#8220;collaboration&#8221; test to check that it asks the right questions of the next layer by using an expectation on a mock of the server
  </li>
  <li>
    The client should also have a set of collaboration tests to check it responds correctly to the possible responses that the server can return (e.g. 0 results, 1 result, a few results, lots of results, throws an exception)
  </li>
  <li>
    The server should have a &#8220;contract&#8221; test to check that it tries to answer the question from the client that matches the expectation in the client&#8217;s collaboration test
  </li>
  <li>
    The server should also have a set of contract tests to check that it can reply correctly with the same set of responses tested in the client&#8217;s collaboration tests
  </li>
</ul>

While I disagree with applying this class-by-class through every layer of your application I think that you can and should still apply this at any point that you do need to make a break between two parts of your code that you want to test independently. This type of approach also works well when testing across separate systems/applications too. When testing across systems it&#8217;s worth looking at consumer-driven contracts and in particular at <a href="https://github.com/realestate-com-au/pact" target="_blank">Pact</a> (<a href="https://github.com/SEEK-Jobs/pact-net" target="_blank">.NET version</a>).