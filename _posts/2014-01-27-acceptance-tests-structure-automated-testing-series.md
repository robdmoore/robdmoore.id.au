---
layout: post
title: Acceptance Tests Structure [Automated Testing Series]
date: 2014-01-27 17:13:43.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- consistency
- ReSharper
- Software Engineering
- TDD
- testing
author: rob
---


This is part of my ongoing Automated Testing blog series:


- [Test Naming](/blog/2014/01/23/test-naming-automated-testing-series/)
- [General Test Structure](/blog/2014/01/27/general-test-structure-automated-testing-series/)
- [Acceptance Tests Structure](/blog/2014/01/27/acceptance-tests-structure-automated-testing-series/)
- [Making Intent Clear](/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
  - [Derived Values](/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
  - Anonymous Variables
  - Equivalence Classes and Constrained Non-Determinism
- Unit Testing
  - What should a unit be / what level should we be testing at?
  - What role should mocking have in unit testing?
- UI Testing
  - What should be your goal with UI Testing?
  - What are the best practices for keeping UI tests robust?


## Acceptance Tests Structure


When writing high level acceptance tests (as opposed to unit tests) I will always try to use separate methods for the Given, When and Then since usually the Given and possibly When are more complex so there might need to be multiple methods for each. My favourite framework for writing tests with this structure by far is [Bddfy](https://github.com/TestStack/TestStack.Bddfy) (disclaimer: I am a core contributor of the TestStack organisation). When I say high-level acceptance tests I usually refer to automated UI / full system tests, but it's possible they could also be complex [subcutaneous tests](http://martinfowler.com/bliki/SubcutaneousTest.html) (where subcutaneous tests fit in is part of my thinking I'm not quite sure on yet).



I've said before and I still maintain that [consistency is the most important aspect when it comes to keeping a software application maintainable](/blog/2012/09/01/consistency-maintainability/) so I think that within a particular set of tests if you are writing some that are single method Arrange, Act, Assert tests then you shouldn't mix those tests with something like Bddfy since it's wildly different. I feel that the [techniques I described for structuring tests using test-per-class](/blog/2014/01/27/general-test-structure-automated-testing-series/) in the last post in the series is OK to mix with AAA tests though as I discussed in that post.



The above two paragraphs have led me to the following thoughts:


- I keep my high-level acceptance tests in a separate project from my unit/integration/etc. tests since they are:
  - Inconsistently specified as discussed above
  - As seen below the way I structure the tests into namespaces / folders and the way I name the test class is very different too
  - They have a different purpose and intent - one is to check your implementation is sound / help design the technical implementation and the other is to specify/check the business requirements of the system i.e. the concept of an [executable specification](http://specificationbyexample.com/key_ideas.html)
- If possible use something like [Bddfy](https://github.com/TestStack/TestStack.BDDfy) and a Specification base class (see below) that allows you to specify the implementation of your scenario
  - Yes I know about [SpecFlow](http://www.specflow.org/), but I don't think that the maintenance overhead is worth it unless you actually have your product owner writing the specifications, but by all accounts I've heard (and based on my experiences) it's tricky for them to get it right and the developers end up writing the scenarios anyway - do yourself a favour and use a framework that is built for developers and get the devs to sit with the product owner to write the test - [that's what they are good at](http://gojko.net/2014/01/13/divide-responsibility-for-defining-stories/)!
  - One of the many cool things about Bddfy is its reporting functionality - out of the box it generates a HTML report, but it's also flexible enough to allow you to [define your own output](http://michael-whelan.net/bddfy-in-action/custom-reports); I think this fits in nicely with the idea of an executable specification
- I've used the base class shown below to make it really easy to define Bddfy tests (then you simply need to specify methods according to the Bddfy conventions and it will automatically pick them up
  - If you want to reuse Given's, When's or Then's then simply use inheritance (e.g. you might define an `AuthenticationUserSpecification` that extends `Specification` and provides a `GivenUserIsAuthenticated` method)
  - If you need to use a data-driven test then see below for an example of how to do it


### Basic Specification base class


You can add any setup / teardown that is required to this for your purposes or wrap the run method code if needed (e.g. for automated UI tests I catch any exception from the `this.BDDfy()` call and take a screenshot).



```csharp
public abstract class Specification
{
    [Test]
    public virtual void Run()
    {
        this.BDDfy();
    }
}
```



For a more [advanced example](https://github.com/TestStack/TestStack.Seleno/blob/master/src/TestStack.Seleno.Tests/Specify/Specification.cs) of this base class including a [generic version](https://github.com/TestStack/TestStack.Seleno/blob/master/src/TestStack.Seleno.Tests/Specify/SpecificationFor.cs) that identifies the SUT and provides auto-mocking (in this case the tests are unit tests rather than acceptance tests) check out the [TestStack.Seleno tests](https://github.com/TestStack/TestStack.Seleno/blob/master/src/TestStack.Seleno.Tests).


### Example of extracting common parts of scenarios


Here is an example of how you might pull out common logic into a customised specification base class. In this case it is demonstrating what it might look like to have a base class for when the scenario starts with the user not being logged in when using the [TestStack.Seleno](https://github.com/TestStack/TestStack.Seleno) library.



```csharp
public abstract class UnauthenticatedSpecification : Specification
{
    protected MyAppPage InitialPage;
    public void GivenNotLoggedIn()
    {
        InitialPage = Host.Instance
            .NavigateToInitialPage<MyAppPage>()
            .Logout();
    }
}```


### Example test class


Here is an example of what an actual test class might look like. In this case it is a test that ensures a user can register for an account on the site and extends the example `UnauthenticatedSpecification` above. There is some code missing here about how the page objects are implemented, but it's fairly readable so you should be able to follow what's happening:



```csharp
public class ValidRegistration : UnauthenticatedSpecification
{
    private RegistrationViewModel _model;
    private MyAppPage _page;
    private Member _member;
    public void AndGivenValidSubmissionData()
    {
        _model = GetValidViewModel();
    }
    public void AndGivenUserHasntAlreadySignedUp()
    {
        // In this instance the Specification base class has helpfully exposed an NHibernate Session object,
        //  which is connected to the same database as the application being tested
        Session.Delete(Session.Query<Member>().SingleOrDefault(m => m.Email == _model.Email));
    }
    public void WhenVisitingTheJoinPageFillingInTheFormAndSubmitting()
    {
        _page = InitialPage
            .Register()
            .Complete(_model);
    }
    public void ThenTheMemberWasCreated()
    {
        _member = Session.Query<Member>()
            .Single(m => m.Email == _model.Email);
    }
    public void AndTheMembersNameIsCorrect()
    {
        _member.FirstName.ShouldBe(_model.FirstName);
        _member.LastName.ShouldBe(_model.LastName);
    }
    public void AndTheMemberCanLogIn()
    {
        _page.Login()
            .Successfully(_model.Email, _model.Password);
    }
    private RegistrationViewModel GetValidViewModel()
    {
        // This is using the NBuilder library, which automatically populates public properties with values
        // I'm overriding the email and password to make them valid for the form submission
        return Builder<RegistrationViewModel>.CreateNew()
            .With(x => x.Email = "email@domain.tld")
            .With(x => x.Password = "P@ssword!")
            .Build();
    }
}
```


### Demonstration of data-driven test


I mentioned above that it was possible to have a data-driven test with the `Specification` base class. I can do this by using a hack that [Jake Ginnivan](http://jake.ginnivan.net/) showed me when we were creating acceptance tests for [GitHubFlowVersion](https://github.com/JakeGinnivan/GitHubFlowVersion) for XUnit and a technique I have found works for NUnit. I've put a [full code example in a gist](https://gist.github.com/robdmoore/8644975), but see below for an abridged sample.



I should note I've only tried these techniques with the ReSharper test runner so it's possible they function differently with other runners. Another option would be to not inherit the base class for the situations where you need data-driven tests, but I typically find that I would then loose a bunch of useful setup/functionality when doing that; YMMV.


#### NUnit


You might have noticed I set the `Run` method in the `Specification` base class to virtual. If you do this then you can do the following in your test class and it will ignore the test method in the base class and use the data-driven one in this class - it does show the base test up as being ignored though - you could also assign a category to the test and not run that category:



```csharp
    [Test]
    [TestCase(1)]
    [TestCase(2)]
    [TestCase(5)]
    public void RunSpecification(int someValue)
    {
        _privatePropertyTheTestMethodsUse = someValue;
        base.Run();
    }
    [Ignore]
    protected override void Run() { }
```


#### XUnit


You don't have to have the base `Run` method virtual for this one (but it doesn't hurt if it is either). Also, the test from the base class comes up as Inconclusive in the ReSharper test runner (just ignore it):



```csharp
    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(5)]
    public void RunSpecification(int someValue)
    {
        _privatePropertyTheTestMethodsUse = someValue;
        base.Run();
    }
    public new void Run() {}
```


### Namespaces / folder structure


When structuring the acceptance test project I like to have a folder/namespace called `Specifications` and underneath that a folder for each [feature](http://paulstovell.com/blog/horizontal-vertical-project-structure) being tested. Then there can be a file within each feature for each scenario being tested (I generally name the scenario with a short name to easily identify it).



So, for instance the valid registration test above might be found at `Specifications.Registration.ValidRegistration`.

