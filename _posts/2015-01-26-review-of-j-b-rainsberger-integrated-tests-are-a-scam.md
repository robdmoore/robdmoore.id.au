---
layout: post
title: 'Review of: J.B. Rainsberger - Integrated Tests Are A Scam'
date: 2015-01-26 11:20:48.000000000 +08:00
type: post
categories:
- Technical
tags:
- continuous delivery
- TDD
- testing
author: rob
---


This post discusses the talk "[Integrated Tests Are A Scam](http://vimeo.com/80533536)" by J.B. Rainsberger, which was given in November 2013. See [my introduction post](/blog/2015/01/26/testing-i-dont-even/ "Unit, integration, subcutaneous, UI, fast, slow, mocks, TDD, isolation and scams… What is this? I don’t even!") to get the context behind this post and the other posts I have written in this series.


## Overview


There are a couple of good points in this talk and also quite a few points I disagree with.



The tl;dr of this presentation is that J.B. Rainsberger often sees people deal with the problem of having "100% of tests pass, but there is still bugs" be solved by adding *integrated* tests (note: this isn't misspelt, [he classifies integrated tests differently from integration tests](http://codebetter.com/sebastienlambla/2013/07/11/unit-testing-is-out-vertical-slice-testing-is-in/#comment-967257261)). He likens this to using "asprin that gives you a bigger headache" and says you should instead write isolated tests that test a single object at a time and have matching collaboration and contract tests on each side of the interactions that object has with its peers. He then uses mathematical induction to prove that this will completely test each layer of the application with fast, isolated tests across all logic branches with O(n) tests rather than O(n!).



He says that integrated tests are a scam because they result in you:


- designing code more sloppily
- making more mistakes
- writing fewer tests because it's harder to write the tests due to the emerging design issues
- thus being **more** likely to have a situation where "100% of tests pass, but there is still bugs"


### Integrated test definition


He defines an integrated test as a test that touches "a cluster of objects" and a unit test as a test that just touches a single object and is "isolated". By this definition and via the premise of his talk every time you write a unit test that touches multiple objects then you aren't writing a unit test, but you are writing a "self-replicating virus that invades your projects, that threatens to destroy your codebase, that threatens your sanity and your life". I suspect that some of that sentiment is sensationalised for the purposes of making a good talk (he even has [admitted to happily writing tests at a higher level](http://codebetter.com/sebastienlambla/2013/07/11/unit-testing-is-out-vertical-slice-testing-is-in/#comment-967253863)), but the talk is a very popular one and it presents a very one-sided view so I feel it's important to point that out.



I disagree with that definition of a unit test and I think that strict approach will lead to not only writing more tests than is needed, but tying a lot of your tests to implementation details that make the tests much more fragile and less useful.



**Side note:** I'll be using J.B. Rainsberger's definitions of integrated and unit tests for this post to provide less confusing discussion in the context of his presentation.


## Integrated tests and design feedback


The hypothesis that you get less feedback about the design of your software from integrated tests and thus they will result in your application becoming a mess is pretty sketchy in my opinion. Call me naive, but if you are in a team that lets the code get like that with integrated tests then I think that same team will have the same result with more fine-grained tests. If you aren't serious about refactoring your code (regardless of whether or not you use TDD and have an explicit refactor step in your process) then yeah, it's going to get bad. In my experience, you still get design feedback when writing your test at a higher level of your application stack with real dependencies underneath (apart from mocking dependencies external to your application) and implementing the code to make it pass.



There is a tieback here to the role of TDD in software design and I think that TDD still helps with design when writing tests that encapsulate more than a single object; it influences the design of your public interface from the level you are testing against and everything underneath is just an implementation detail of that public interface (more on this in other posts in the series).



It's worth noting that I'm coming from the perspective of a staticly typed language where I can safely create implementation details without needing fine-grained tests to cover every little detail. I can imagine that in situations where you are writing with a dynamic language you *might* feel the need to make up for a lack of compiler by writing more fine-grained tests.



This is one of the reasons why I have a preference for statically typed languages - the compiler obviates the need for writing mundane tests to check things like property names are correct (although[some people still like to write these kinds of tests](http://blog.ploeh.dk/2013/03/08/test-trivial-code/)).



If you are using a dynamic language and your application structure isn't overly complex (i.e. it's not structured with layer upon layer upon layer) then you can probably still test from a higher level with a dynamic language without too much pain. For instance, I've written Angular JS applications where I've tested services from the controller level (with real dependencies) successfully.



It's also relevant to consider the points that [@dhh](https://twitter.com/dhh) makes in his post about [test-induced design damage](http://david.heinemeierhansson.com/2014/test-induced-design-damage.html) and the subsequent [TDD is dead video series](http://martinfowler.com/articles/is-tdd-dead/).


### Integrated tests and identifying problems


J.B. Rainsberger says a big problem with integrated tests is that when they fail you have no idea where the problem is. I agree that by glancing at the name of the test that's broken you might not immediately know which line of code is at fault.



If you structure your tests and code well then usually when there is a test failure in a higher level test you can look at the exception message to get a pretty good idea unless it's a generic exception like a `NullReferenceException`. In those scenarios you can spend a little bit more time and look at the stack trace to nail down the offending line of code. This is slower, but I personally think that the trade-off that you get (as discussed throughout this series) it worth this small increase.


## Motivation to write integrated tests


J.B. Rainsberger puts forward that the motivation people usually have to write integrated tests is to find bugs that unit tests can't uncover by testing the interaction between objects. While it is a nice benefit to test the code closer to how it's executed in production, with real collaborators, it's not the main reason I write tests that cover multiple objects. I write this style of tests because they allow us to divorce the tests from knowing about implementation details and write them at a much more useful level of abstraction, closer to what the end user cares about. This gives full flexibility to refactor code without breaking tests since the tests can describe user scenarios rather than developer-focussed implementation concerns. It's appropriate to name drop [BDD](http://guide.agilealliance.org/guide/bdd.html) and [ATDD](http://testobsessed.com/wp-content/uploads/2011/04/atddexample.pdf) here.


## Integrated tests necessitate a combinatorial explosion in the number of tests


Lack of design feedback aside, the main criticism that J.B. Rainsberger has against integrated tests is that to test all pathways through a codebase you need to have a combinatorial explosion of tests (O(n!)). While this is technically true I question the practicality of this argument for a well designed system:


- He seems to suggest that you are going to build software that contains a lot of layers and within each layer you will have a lot of branches. While I'm sure there are examples out there like that, most of the applications I've been involved with can be architected to be relatively flat.
- It's possible that I just haven't written code for the right industries and thus haven't across the kinds of scenarios he is envisaging, but at best it demonstrates that his sweeping statements don't always apply and you should take a pragmatic approach based on your codebase.
- Consider the scenario where you add a test against new functionality against the behaviour of the system from the user's perspective (e.g. a BDD style test for each acceptance criteria in your user story). In that scenario, then, being naive for a moment, *all* code that you add could be tested by these higher level tests.
- Naivety aside, you will add code that doesn't directly relate to the acceptance criteria, this might be infrastructure code or defensive programming, or logging etc. and in those cases I think you just need to evaluate how important it is to test that code:
  - Sometimes the code is very declarative and obviously wrong or right - in those instances, where there is unlikely to be complex interactions with other parts of the code (null checks being a great example) then I generally don't think it needs to be tested
  - Sometimes it's common code that will necessarily be tested by any integrated (or UI) tests you do have anyway
  - Sometimes it's code that is complex or important enough to warrant specific, "implementation focussed", unit tests - add them!
  - If such code didn't warrant a test and later turns out to introduce a bug then that gives you feedback that it wasn't that obvious afterall and at that point you can introduce a breaking test so it never happens again (**before fixing it** - that's the [first step you take when you have a bug](http://jasonpolites.github.io/tao-of-testing/ch4-1.1.html#rule-8-write-tests-before-fixing-bugs) right?)
  - If the above point makes you feel uncomfortable then you should go and look up [continuous delivery](http://continuousdelivery.com/) and work on ensuring your team works towards the capability to deliver code to production at *any* time so [rolling forward with fixes](http://www.slideshare.net/500startups/ross-synder-etsy-sxsw-lean-startup-2013) is fast and efficient
  - It's important to keep in mind that the point of testing generally [isn't to get 100% coverage](http://martinfowler.com/bliki/TestCoverage.html), it's to give you confidence that your application is going to work - I talk about this more later in the series - I can think of industries where this is probably different (e.g. healthcare, aerospace) so as usual be pragmatic!
- There will always be exceptions to the rule, if you find a part of the codebase that is more complex and does require a lower level test to feasibily cover all of the combinations then do it - **that doesn't mean you should write those tests for the whole system though.**


### Contract and collaboration tests


The part about J.B. Rainsberger's presentation that I did like was his solution to the "problem". While I think it's fairly basic, common-sense advice that a lot of people probably follow I still think it's good advice.



He describes that, where you have two objects collaborating with each other, you might consider one object to be the "server" and the other the "client" and the server can be tested completely independently of the client since it will simply expose a public API that can be called. In that scenario, he suggests that the following set of tests should be written:


- The client should have a "collaboration" test to check that it asks the right questions of the next layer by using an expectation on a mock of the server
- The client should also have a set of collaboration tests to check it responds correctly to the possible responses that the server can return (e.g. 0 results, 1 result, a few results, lots of results, throws an exception)
- The server should have a "contract" test to check that it tries to answer the question from the client that matches the expectation in the client's collaboration test
- The server should also have a set of contract tests to check that it can reply correctly with the same set of responses tested in the client's collaboration tests



While I disagree with applying this class-by-class through every layer of your application I think that you can and should still apply this at any point that you do need to make a break between two parts of your code that you want to test independently. This type of approach also works well when testing across separate systems/applications too. When testing across systems it's worth looking at consumer-driven contracts and in particular at [Pact](https://github.com/realestate-com-au/pact) ([.NET version](https://github.com/SEEK-Jobs/pact-net)).

