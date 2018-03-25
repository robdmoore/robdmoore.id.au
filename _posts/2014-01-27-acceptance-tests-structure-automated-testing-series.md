---
id: 2431
title: 'Acceptance Tests Structure [Automated Testing Series]'
date: 2014-01-27T17:13:43+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=2431
permalink: /blog/2014/01/27/acceptance-tests-structure-automated-testing-series/
categories:
  - Technical
tags:
  - 'C#'
  - consistency
  - ReSharper
  - Software Engineering
  - TDD
  - testing
---
This is part of my ongoing Automated Testing blog series:

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

## Acceptance Tests Structure

When writing high level acceptance tests (as opposed to unit tests) I will always try to use separate methods for the Given, When and Then since usually the Given and possibly When are more complex so there might need to be multiple methods for each. My favourite framework for writing tests with this structure by far isÂ <a href="https://github.com/TestStack/TestStack.Bddfy" target="_blank">Bddfy</a>Â (disclaimer: I am a core contributor of the TestStack organisation). When I say high-level acceptance tests I usually refer to automated UI / full system tests, but it&#8217;s possible they could also be complexÂ <a href="http://martinfowler.com/bliki/SubcutaneousTest.html" target="_blank">subcutaneous tests</a>Â (where subcutaneous tests fit in is part of my thinking I&#8217;m not quite sure on yet).

I&#8217;ve said before and I still maintain thatÂ <a href="http://robdmoore.id.au/blog/2012/09/01/consistency-maintainability/" target="_blank">consistency is the most important aspect when it comes to keeping a software application maintainable</a>Â so I think that within a particular set of tests if you are writing some that are single method Arrange, Act, Assert tests then you shouldn&#8217;t mix those tests with something like Bddfy since it&#8217;s wildly different. I feel that theÂ <a href="http://robdmoore.id.au/blog/2014/01/27/general-test-structure-automated-testing-series/" target="_blank">techniques I described for structuring tests using test-per-class</a>Â in the last post in the series is OK to mix with AAA tests though as I discussed in that post.

The above two paragraphs have led me to the following thoughts:

  * I keep my high-level acceptance tests in a separate project from my unit/integration/etc. tests since they are: 
      * Inconsistently specified as discussed above
      * As seen below the way I structure the tests into namespaces / folders and the way I name the test class is very different too
      * They have a different purpose and intent &#8211; one is to check your implementation is sound / help design the technical implementation and the other is to specify/check the business requirements of the system i.e. the concept of anÂ <a href="http://specificationbyexample.com/key_ideas.html" target="_blank">executable specification</a>
  * If possible use something likeÂ <a href="https://github.com/TestStack/TestStack.BDDfy" target="_blank">Bddfy</a>Â and a Specification base class (see below) that allows you to specify the implementation of your scenario 
      * Yes I know aboutÂ <a href="http://www.specflow.org/" target="_blank">SpecFlow</a>, but I don&#8217;t think that the maintenance overhead is worth it unless you actually have your product owner writing the specifications, but by all accounts I&#8217;ve heard (and based on my experiences) it&#8217;s tricky for them to get it right and the developers end up writing the scenarios anyway &#8211; do yourself a favour and use a framework that is built for developers and get the devs to sit with the product owner to write the test &#8211;Â <a href="http://gojko.net/2014/01/13/divide-responsibility-for-defining-stories/" target="_blank">that&#8217;s what they are good at</a>!
      * One of the many cool things about Bddfy is its reporting functionality &#8211; out of the box it generates a HTML report, but it&#8217;s also flexible enough to allow you to <a href="http://michael-whelan.net/bddfy-in-action/custom-reports" target="_blank">define your own output</a>; I think this fits in nicely with the idea of an executable specification
  * I&#8217;ve used the base class shown below to make it really easy to define Bddfy tests (then you simply need to specify methods according to the Bddfy conventions and it will automatically pick them up 
      * If you want to reuse Given&#8217;s, When&#8217;s or Then&#8217;s then simply use inheritance (e.g. you might define anÂ `AuthenticationUserSpecification`Â that extendsÂ `Specification`Â and provides aÂ `GivenUserIsAuthenticated`Â method)
      * If you need to use a data-driven test then see below for an example of how to do it

### Basic Specification base class

You can add any setup / teardown that is required to this for your purposes or wrap the run method code if needed (e.g. for automated UI tests I catch any exception from theÂ `this.BDDfy()`Â call and take a screenshot).

<pre class="brush: csharp; title: ; notranslate" title="">public abstract class Specification
{
    [Test]
    public virtual void Run()
    {
        this.BDDfy();
    }
}
</pre>

For a moreÂ <a href="https://github.com/TestStack/TestStack.Seleno/blob/master/src/TestStack.Seleno.Tests/Specify/Specification.cs" target="_blank">advanced example</a>Â of this base class including aÂ <a href="https://github.com/TestStack/TestStack.Seleno/blob/master/src/TestStack.Seleno.Tests/Specify/SpecificationFor.cs" target="_blank">generic version</a>Â that identifies the SUT and provides auto-mocking (in this case the tests are unit tests rather than acceptance tests) check out theÂ <a href="https://github.com/TestStack/TestStack.Seleno/blob/master/src/TestStack.Seleno.Tests" target="_blank">TestStack.Seleno tests</a>.

### Example of extracting common parts of scenarios

Here is an example of how you might pull out common logic into a customised specification base class. In this case it is demonstrating what it might look like to have a base class for when the scenario starts with the user not being logged in when using theÂ <a href="https://github.com/TestStack/TestStack.Seleno" target="_blank">TestStack.Seleno</a>Â library.

<pre class="brush: csharp; title: ; notranslate" title="">public abstract class UnauthenticatedSpecification : Specification
{
    protected MyAppPage InitialPage;

    public void GivenNotLoggedIn()
    {
        InitialPage = Host.Instance
            .NavigateToInitialPage&lt;MyAppPage&gt;()
            .Logout();
    }
}</pre>

### Example test class

Here is an example of what an actual test class might look like. In this case it is a test that ensures a user can register for an account on the site and extends the exampleÂ `UnauthenticatedSpecification`Â above. There is some code missing here about how the page objects are implemented, but it&#8217;s fairly readable so you should be able to follow what&#8217;s happening:

<pre class="brush: csharp; title: ; notranslate" title="">public class ValidRegistration : UnauthenticatedSpecification
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
        Session.Delete(Session.Query&lt;Member&gt;().SingleOrDefault(m =&gt; m.Email == _model.Email));
    }

    public void WhenVisitingTheJoinPageFillingInTheFormAndSubmitting()
    {
        _page = InitialPage
            .Register()
            .Complete(_model);
    }

    public void ThenTheMemberWasCreated()
    {
        _member = Session.Query&lt;Member&gt;()
            .Single(m =&gt; m.Email == _model.Email);
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
        return Builder&lt;RegistrationViewModel&gt;.CreateNew()
            .With(x =&gt; x.Email = "email@domain.tld")
            .With(x =&gt; x.Password = "P@ssword!")
            .Build();
    }
}
</pre>

### Demonstration of data-driven test

I mentioned above that it was possible to have a data-driven test with theÂ `Specification`Â base class. I can do this by using a hack thatÂ <a href="http://jake.ginnivan.net/" target="_blank">Jake Ginnivan</a>Â showed me when we were creating acceptance tests forÂ <a href="https://github.com/JakeGinnivan/GitHubFlowVersion" target="_blank">GitHubFlowVersion</a>Â for XUnit and a technique I have found works for NUnit. I&#8217;ve put aÂ <a href="https://gist.github.com/robdmoore/8644975" target="_blank">full code example in a gist</a>, but see below for an abridged sample.

I should note I&#8217;ve only tried these techniques with the ReSharper test runner so it&#8217;s possible they function differently with other runners. Another option would be to not inherit the base class for the situations where you need data-driven tests, but I typically find that I would then loose a bunch of useful setup/functionality when doing that; YMMV.

#### NUnit

You might have noticed I set theÂ `Run`Â method in theÂ `Specification`Â base class to virtual. If you do this then you can do the following in your test class and it will ignore the test method in the base class and use the data-driven one in this class &#8211; it does show the base test up as being ignored though &#8211; you could also assign a category to the test and not run that category:

<pre class="brush: csharp; title: ; notranslate" title="">[Test]
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
</pre>

#### XUnit

You don&#8217;t have to have the baseÂ `Run`Â method virtual for this one (but it doesn&#8217;t hurt if it is either). Also, the test from the base class comes up as Inconclusive in the ReSharper test runner (just ignore it):

<pre class="brush: csharp; title: ; notranslate" title="">[Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(5)]
    public void RunSpecification(int someValue)
    {
        _privatePropertyTheTestMethodsUse = someValue;
        base.Run();
    }

    public new void Run() {}
</pre>

### Namespaces / folder structure

When structuring the acceptance test project I like to have a folder/namespace calledÂ `Specifications`Â and underneath that a folder for eachÂ [feature](http://paulstovell.com/blog/horizontal-vertical-project-structure)Â being tested. Then there can be a file within each feature for each scenario being tested (I generally name the scenario with a short name to easily identify it).

So, for instance the valid registration test above might be found atÂ `Specifications.Registration.ValidRegistration`.