---
layout: post
title: 'Review of: Ian Cooper - TDD, where did it all go wrong'
date: 2015-01-26 18:41:52.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- TDD
- testing
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


This post discusses the talk "[TDD, where did it all go wrong](http://vimeo.com/68375232)" by Ian Cooper, which was given in June 2013. See [my introduction post](http://robdmoore.id.au/blog/2015/01/26/testing-i-dont-even/) to get the context behind this post and the other posts I have written in this series.



It's taken me quite a few views of this video to really get my head around it. It's fair to say that this video in combination with discussions with various colleagues such as [Graeme Foster](https://twitter.com/graefoster), [Jess Panni](https://twitter.com/jesspanni), [Bobby Lat](https://twitter.com/iaintdoingit) and [Matt Davies](https://twitter.com/mdaviesnet) has changed the way I perform automated testing.



I'll freely admit that I used to write a unit test across each branch of most methods in the applications I wrote and rely heavily on mocking to segregate out the external dependencies of the test (all other classes). Most of the applications I worked on were reasonably small and didn't span for multiple years so I didn't realise the full potential pain of this approach. In saying that, I did still found myself spending a lot of time writing tests and at times it felt tedious and time consuming in a way that didn't feel productive. Furthermore, refactoring would sometimes result in tests breaking that really shouldn't have. As I said - the applications I worked on were *relatively* small so the pain was also small enough that I put up with it assuming that was the way it needed to be.


## Overview


The tl;dr of Ian's talk is that TDD has been interpreted by a lot of people to be that you should write unit tests for every method and class that you introduce in an application, but this will necessarily result in you baking implementation details into your tests causing them to be fragile when refactoring, contain a lot of mocking, result in a high proportion of test code to implementation code and ultimately slowing you down from delivering and making changes to the codebase.


## Testing behaviours rather than implementations


Ian suggests that the trigger for adding a new test to the system should be [adding a new behaviour rather than adding a method or class](http://codebetter.com/iancooper/2011/10/06/avoid-testing-implementation-details-test-behaviours/). By doing this your tests can focus on expressing and verifying behaviours that users care about rather than implementation details that developers care about.



In my eyes this naturally fits in to BDD and ATDD by allowing you to write the bulk of your tests in that style. I feel this necessarily aligns your tests and thus implementation to things that your product owner and users care about. If you buy into the notion of tests forming an important part of a system's documentation like I do then having tests that are behaviour focussed rather than implementation focussed is even more of an advantage since they are the tests that make sense in terms of documenting a system.


## TDD and refactoring


Ian suggests that the original TDD Flow outlined by Kent Beck has been lost in translation by most people. This is summed up nicely by [Steve Fenton](https://www.stevefenton.co.uk/Content/Blog/Date/201305/Blog/My-Unit-Testing-Epiphany/) in his summary of Ian's talk (highlight mine):



> Red. Green. Refactor. We have all heard this. I certainly had. But I didn't really get it. I thought it meant... "write a test, make sure it fails. Write some code to pass the test. Tidy up a bit". Not a million miles away from the truth, but certainly not the complete picture. Let's run it again.
> 
> 
> 
> Red. You write a test that represents the behaviour that is needed from the system. You make it compile, but ensure the test fails. You now have a requirement for the program.
> 
> 
> 
> Green. You write minimal code to make the test green. This is sometimes interpreted as "return a hard-coded value" - but this is simplistic. What it really means is write code with no design, no patterns, no structure. We do it the naughty way. We just chuck lines into a method; lines that shouldn't be in the method or maybe even in the class. Yes - we should avoid adding more implementation than the test forces, but the real trick is to do it sinfully.
> 
> 
> 
> Refactor. This is the only time you should add design. This is when you might extract a method, add elements of a design pattern, create additional classes or whatever needs to be done to pay penance to the sinful way you achieved green.
> 
> 
> 
> When you do this right, you end up with several classes that are all tested by a single test-class. This is how things should be. **The tests document the requirements of the system with minimal knowledge of the implementation. The implementation could be One Massive Function or it could be a bunch of classes.**



Ian points out that you cannot refactor if you have implementation details in your tests because by definition, refactoring is where you change implementation details and not the public interface or the tests.


## Ports and adapters


Ian suggests that one way to test behaviours rather than implementation details is to use a [ports and adapters architecture](http://alistair.cockburn.us/Hexagonal+architecture) and test via the ports.



There is another video where he provides some [more concrete examples of what he means](https://skillsmatter.com/skillscasts/5744-decoupling-from-asp-net-hexagonal-architectures-in-net). He suggests using a [command dispatcher](https://github.com/iancooper/Paramore) or [command processor](http://codebetter.com/iancooper/2011/04/27/why-use-the-command-processor-pattern-in-the-service-layer/) pattern as the port.



That way your adapter (e.g. MVC or API controller) can create a command object and ask for it to be executed and all of the domain logic can be wrapped up and taken care of from there. This leaves the adapter very simple and declarative and it *could* be easily unit tested. Ian recommends not bothering to unit test the adapter because it should be really simple and I wholeheartedly agree with this. If you use this type of pattern then your controller action will be be a few lines of code.



Here is an example from a recent project I worked on that illustrates the sort of pattern:



```csharp
public class TeamEditContactDetailsController : AuthenticatedTeamController
{
    private readonly IQueryExecutor _queryExecutor;
    private readonly ICommandExecutor _commandExecutor;
    public TeamEditContactDetailsController(IQueryExecutor queryExecutor, ICommandExecutor commandExecutor)
    {
        _queryExecutor = queryExecutor;
        _commandExecutor = commandExecutor;
    }
    public async Task<ActionResult> Index()
    {
        var team = await _queryExecutor.QueryAsync(new GetTeam(TeamId));
        return View(new EditContactDetailsViewModel(team));
    }
    [HttpPost]
    public async Task<ActionResult> Index(EditContactDetailsViewModel vm)
    {
        if (!await ModelValidAndSuccess(() => _commandExecutor.ExecuteAsync(vm.ToCommand(TeamId))))
            return View(vm);
        return RedirectToAction("Success");
    }
}
```



This is a pretty common pattern that I end up using in a lot of my applications. `ModelValidAndSuccess`is a method that checks the `ModelState` is valid, executes the command, and if there are exceptions from the domain due to invariants being violated it will propagate them into `ModelState` and return`false`. `vm.ToCommand()` is a method that news up the command object (in this case`EditTeamContactDetails`) from the various properties bound onto the view model. Side note: some people seem to take issue with to ToCommand method, personally I'm comfortable that the purpose of the view model being to bind data and translate that data to a command object - either way, it's by no means essential to the overall pattern.



Both the query (`GetTeam`) and the command (`EditTeamContactDetails`) can be considered ports into the domain and can be tested independently from this controller using BDD tests. At that point there is probably little value in testing this controller because it's very declarative. [Jimmy Bogard sums this up nicely in one of his posts](http://lostechies.com/jimmybogard/2012/11/06/testing-with-queries-and-repositories-a-simple-example/).



Ian does say that if you feel the need to test the connection between the port and adapter then you can write some integration tests, but should be careful not to test things that are outside of your control and have already been tested (e.g. you don't need to test ASP.NET MVC or NHibernate).


## Mocking


One side effect of having unit tests for every method/class is that you are then trying to mock out every collaborator of every object and that necessarily means that you are trying to mock implementation details - the fact I used a `TeamRepository` or a `TeamService` shouldn't matter if you are testing the ability for a team to be retrieved and viewed. I should be able to change what classes I use to get the Team without breaking tests.



Using mocks of implementation details significantly increases the fragility of tests reducing their effectiveness. Ian says in his talk that you shouldn't mock internals, privates or adapters.



Mocks still have their place - if you want to test a port and would like to isolate it from another port (e.g. an API call to an external system) then it makes sense to mock that out. This was covered further [in the previous article](http://robdmoore.id.au/blog/2015/01/26/review-of-j-b-rainsberger-integrated-tests-are-a-scam/) in the "Contract and collaboration tests" section.


## Problems with higher level unit tests


I'm not advocating that this style of testing is a silver bullet - far from it. Like everything in software development it's about [trade-offs](http://stackoverflow.com/a/25825936) and I'm sure that there are scenarios that it won't be suitable for. Ian covered some of the problems in his talk, I've already talked about the [combinatorial problem](http://robdmoore.id.au/blog/2015/01/26/review-of-j-b-rainsberger-integrated-tests-are-a-scam/) and [Martyn Frank covers some more in his post about Ian's talk](http://frankcode.wordpress.com/2014/07/01/tdd-where-did-i-go-wrong/). I've listed out all of the problems I know of below.


### Complex implementation


One of the questions that was raised and answered in Ian's presentation was about what to do when the code you are implementing to make a high-level unit test test pass is really complex and you find yourself needing more guidance. In that instance you can do what Ian calls "shifting down a gear" and guide your implementation by writing lower-level, implementation-focussed unit tests. Once you have finished your implementation you can then decide whether to:


- Throw away the tests because they aren't needed anymore - the code is covered by your higher-level behaviour test
- Keep the tests because you think they will be useful for the developers that have to support the application to understand the code in question
- Keep the tests because the fact you needed them in the first place tells you that they will be useful when making changes to that code in the future



The first point is important and not something that is often considered - throwing away the tests. If you decide to keep these tests the trade-off is you have some tests tied to your implementation that will be more brittle than your other tests. The main thing to keep in mind is that you don't have to have all of your tests at that level; just the ones that it makes sense for.



In a lot of ways this hybrid approach also helps with the combinatorial explosion problem; if the code you are testing is incredibly complex and it's too hard to feasibly provide enough coverage with a higher level test then dive down and do those low level unit tests. I've found this hybrid pattern very useful for recent projects and I've found that only 5-10% of the code is complex enough to warrant the lower level tests.


### Combinatorial explosion


I've covered this comprehensively in the [previous article](http://robdmoore.id.au/blog/2015/01/26/review-of-j-b-rainsberger-integrated-tests-are-a-scam/). This can be a serious problem, but as per the previous section in those instances just write the lower-level tests.


### Complex tests


The other point that Ian raised is that you are interacting with more objects this might mean there is more you need to set up in your tests, which then make the arrange section of the tests harder to understand and maintain and reducing the advantage of writing the tests in the first place. Ian indicates that because you are rarely setting up mocks for complex interactions he usually sees simpler arrange sections, but he mentions that the test data buider and object mother patterns can be helpful to reduce complexity too. I have [covered these patterns in the past](http://robdmoore.id.au/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/) and can confirm that they have helped me significantly in reducing complexity and improving maintainability of the arrange section of the tests.



I also make use of the excellent [Bddfy](https://github.com/TestStack/TestStack.BDDfy) and [Shouldly](https://github.com/shouldly/shouldly) libraries and they both make a big positive difference to the terseness and understandability of tests.



Another technique that I find to be incredibly useful is [Approval Tests](https://github.com/approvals/ApprovalTests.Net#approvaltests). If you are generating a complex artifact such as a CSV, some JSON or HTML or a complex object graph then it's really quick and handy to approve the payload rather than have to create tedious assertions about every aspect.



In my experience, with a bit of work and by **diligently refactoring your test code** (this is a key point!!!) as you would your production code you can get very tidy, terse tests. You will typically have a smaller number of tests (one per user scenario rather than one for every class) and they will be organised and named around a particular user scenario (e.g.`Features.TeamRegistration.SuccessfulTeamRegistrationScenario`) so it should be easy to find the right test to inspect and modify when maintaining code.


### Multiple test failures


It's definitely possible that you can cause multiple tests to fail by changing one thing. I'll be honest, I don't really see this as a huge disadvantage and I haven't experienced this too much in the wild. When it happens it's generally pretty obvious what the cause is.


### Shared code gets tested twice


Yep, but that's fine because that shared code is an implementation detail - the behaviours that currently use the shared code may diverge in the future and that code may no longer be shared. The fact there is shared code is probably good since it's a probable sign that you have been diligently refactoring your codebase and removing duplication.

