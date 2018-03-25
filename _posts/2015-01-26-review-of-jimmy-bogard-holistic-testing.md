---
id: 4781
title: 'Review of: Jimmy Bogard &#8211; Holistic Testing'
date: 2015-01-26T23:43:06+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=4781
permalink: /blog/2015/01/26/review-of-jimmy-bogard-holistic-testing/
categories:
  - Technical
tags:
  - 'C#'
  - TDD
  - testing
---
This post discusses the talk &#8220;<a href="http://vimeo.com/68390508" target="_blank">Holistic Testing</a>&#8221; by Jimmy Bogard, which was given in June 2013. See my <a href="http://robdmoore.id.au/blog/2015/01/26/testing-i-dont-even/" target="_blank">introduction post</a> to get the context behind this post and the other posts I have written in this series.

I really resonate with the points raised by Jimmy since I&#8217;ve been using a lot of similar techniques recently. In this article I outline how I&#8217;ve been using the techniques talked about by Jimmy (including code snippets for context).

## Overview

In this insightful presentation Jimmy outlines the testing strategy that he tends to use for the projects he works on. He covers the level that he tests from, the proportion of the different types of tests he writes and covers the intimate technical detail about how he implements the tests. Like Ian Cooper, Jimmy likes writing his unit tests from a relatively high level in his application, specifically he said that he likes the definition of unit test to be:

> &#8220;Units of behaviour, isolated from other units of behaviour&#8221;

## Code coverage and shipping code

> &#8220;The ultimate goal here is to ship code it&#8217;s not to write tests; tests are just a means to the end of shipping code.&#8221;
> 
> &#8220;I can have 100% code coverage and have noone use my product and I can have 0% code coverage and it&#8217;s a huge success; there is no correlation between the two things.&#8221;

Enough said.

## Types of tests

Jimmy breathes a breath of fresh air when throwing away the testing pyramid (and all the conflicting definitions of unit, integration, etc. tests) in favour of a pyramid that has a small number of &#8220;slow as hell tests&#8221;, a slightly larger number of &#8220;slow&#8221; tests and a lot of &#8220;fast&#8221; tests.

This takes away the need to classify if a test is unit, integration or otherwise and focuses on the important part &#8211; how fast can you get feedback from that test. This is something that I&#8217;ve often said &#8211; there is no point in distinguishing between unit and integration tests in your project until the moment that you need to separate out tests because your feedback cycle is too slow (which will take a while in a greenfield project).

It&#8217;s worth looking at the ideas expressed by <a href="http://codebetter.com/sebastienlambla/2013/07/11/unit-testing-is-out-vertical-slice-testing-is-in/" target="_blank">Sebastien Lambla on Vertical Slide Testing (VEST)</a>, which provides another interesting perspective in this area by turning your traditionally slow &#8220;integration&#8221; tests into fast in-memory tests. Unfortunately, the idea seems to be fairly immature and there isn&#8217;t a lot of support for this type of approach.

## Mocks

Similar to the ideas [expressed by Ian Cooper](http://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong/ "Review of: Ian Cooper – TDD, where did it all go wrong"), Jimmy tells us not to mock internal implementation details (e.g. collaborators passed into the constructor) and indicates that he rarely uses mocks. In fact he admitted that he would rather make the process of using mocks more painful and hand rolling them to discourage their use unless it&#8217;s necessary.

Jimmy says that he creates &#8220;seams&#8221; for the things he can&#8217;t control or doesn&#8217;t own (e.g. webservices, databases, etc.) and then mocks those seams when writing his test.

The cool thing about hand-rolled mocks that I&#8217;ve found is that you can codify real-like behaviour (e.g. interactions between calls and real-looking responses) and contain that behaviour in one place (helping to form documentation about how the thing being mocked works). These days I tend to use a combination of hand-rolled mocks for some things and <a href="http://nsubstitute.github.io/" target="_blank">NSubstitute</a> for others. I&#8217;ll generally use hand-rolled mocks when I want to codify behaviour or if I want to provide a separate API surface area to interact with the mock e.g.:

<pre class="brush: csharp; title: ; notranslate" title="">// Interface
public interface IDateTimeProvider
{
    DateTimeOffset Now();
}

// Production code
public class DateTimeProvider : IDateTimeProvider
{
    public DateTimeOffset Now()
    {
        return DateTimeOffset.UtcNow;
    }
}

// Hand-rolled mock
public class StaticDateTimeProvider : IDateTimeProvider
{
    private DateTimeOffset _now;

    public StaticDateTimeProvider()
    {
        _now = DateTimeOffset.UtcNow;
    }

    public StaticDateTimeProvider(DateTimeOffset now)
    {
        _now = now;
    }

    // This one is good for data-driven tests that take a string representation of the date
    public StaticDateTimeProvider(string now)
    {
        _now = DateTimeOffset.Parse(now);
    }

    public DateTimeOffset Now()
    {
        return _now;
    }

    public StaticDateTimeProvider SetNow(string now)
    {
        _now = DateTimeOffset.Parse(now);
        return this;
    }

    public StaticDateTimeProvider MoveTimeForward(TimeSpan amount)
    {
        _now = _now.Add(amount);
        return this;
    }
}
</pre>

## Container-driven unit tests

One of the most important points that Jimmy raises in his talk is that he uses his DI container to resolve dependencies in his &#8220;fast&#8221; tests. This makes a lot of sense because it allows you to:

<ul class="task-list">
  <li>
    Prevent implementation detail leaking into your test by resolving the component under test and all of it&#8217;s real dependencies without needing to know the dependencies
  </li>
  <li>
    Mimic what happens in production
  </li>
  <li>
    Easily provide mocks for those things that do need mocks without needing to know what uses those mocks
  </li>
</ul>

Container initialisation can be (relatively) slow so in order to ensure this cost is incurred once you can simply set up a global fixture or static instance of the initialised container.

The other consideration is how to isolate the container across test runs &#8211; if you modify a mock for instance then you don&#8217;t want that mock to be returned in the next test. Jimmy overcomes this by using child containers, which he has <a href="http://lostechies.com/jimmybogard/2012/03/19/integrating-and-isolating-the-container-in-tests/" target="_blank">separately blogged about</a>.

The other interesting thing that Jimmy does is uses an extension of <a href="https://autofixture.codeplex.com/" target="_blank">AutoFixture&#8217;s</a> AutoDataAttribute attribute to resolve parameters to his test method from the container. It&#8217;s pretty nifty and explained in more detail <a href="https://outlawtrail.wordpress.com/2013/07/03/behavioral-testing/" target="_blank">by Sebastian Weber</a>.

I&#8217;ve recently used a variation of the following test fixture class (in my case using Autofac):

<pre class="brush: csharp; title: ; notranslate" title="">public static class ContainerFixture
{
    private static readonly IContainer Container;

    static ContainerFixture()
    {
        Container = ContainerConfig.CreateContainer(); // This is what my production App_Start calls
        AppDomain.CurrentDomain.DomainUnload += (sender, args) =&gt; Container.Dispose();
    }

    public static ILifetimeScope GetTestLifetimeScope(Action&lt;ContainerBuilder&gt; modifier = null)
    {
        return Container.BeginLifetimeScope(MatchingScopeLifetimeTags.RequestLifetimeScopeTag, cb =&gt; {
            ExternalMocks(cb);
            if (modifier != null)
                modifier(cb);
        });
    }

    private static void ExternalMocks(ContainerBuilder cb)
    {
        cb.Register(_ =&gt; new StaticDateTimeProvider(DateTimeOffset.UtcNow.AddMinutes(1)))
            .AsImplementedInterfaces()
            .AsSelf()
            .InstancePerTestRun();
        // Other overrides of externals to the application ...
    }
}

public static class RegistrationExtensions
{
    // This extension method makes the registrations in the ExternalMocks method clearer in intent - I create a HTTP request lifetime around each test since I'm using my container in a web app
    public static IRegistrationBuilder&lt;TLimit, TActivatorData, TStyle&gt; InstancePerTestRun
        &lt;TLimit, TActivatorData, TStyle&gt;(this IRegistrationBuilder&lt;TLimit, TActivatorData, TStyle&gt; registration,
            params object[] lifetimeScopeTags)
    {
        return registration.InstancePerRequest(lifetimeScopeTags);
    }
}
</pre>

## Isolating the database

Most applications that I come across will have a database of some sort. Including a database connection usually means out of process communication and this likely turns your test from &#8220;fast&#8221; to &#8220;slow&#8221; in Jimmy&#8217;s terminology. It also makes it harder to write a good test since databases are stateful and thus we need to isolate tests against each other. It&#8217;s often difficult to run tests in parallel against the same database as well.

There are a number of ways of dealing with this, which Jimmy outlined in his talk and also <a href="http://lostechies.com/jimmybogard/2012/10/18/isolating-database-data-in-integration-tests/" target="_blank">on</a> <a href="http://lostechies.com/jimmybogard/2013/06/18/strategies-for-isolating-the-database-in-tests/" target="_blank">his</a> blog:

<ol class="task-list">
  <li>
    Use a transaction and rollback at the end of the test. The tricky thing here is making sure that you simulate multiple requests &#8211; you need to make sure that your seeding, work and verification all happen separately otherwise your ORM caching might give you a false positive. I find this to be quite an effective strategy and it&#8217;s what I&#8217;ve used for years now in various forms. <ul class="task-list">
      <li>
        One option is to use <code>TransactionScope</code> to transparently initiate a transaction and rollback that allows multiple database connections to connect to the database and you can have real, committed transactions that will then get rolled back. The main downsides are that you need MSDTC enabled on all dev machines and your CI server agents and you can&#8217;t run tests in parallel against the same database.
      </li>
      <li>
        Another option is to initiate a single connection with a transaction and then to reuse that connection across your ORM contexts &#8211; this allows you to avoid MSDTC and run tests in parallel, but it also means you can&#8217;t use explicit transactions in your code (or to make them noops for your test code) and it&#8217;s not possible with all ORMs. I can&#8217;t claim credit for this idea &#8211; I was introduced to it by <a href="https://twitter.com/jesspanni" target="_blank">Jess Panni</a> and <a href="https://twitter.com/mdaviesnet" target="_blank">Matt Davies</a>.
      </li>
      <li>
        If your ORM doesn&#8217;t support attaching multiple contexts to a single connection with an open transaction (<a href="http://stackoverflow.com/questions/16350459/multiple-nhibernate-sessions-in-one-transanction" target="_blank">hi NHibernate!</a>) then another option would be to clear the cache after seeding and after work. This has the same advantages and disadvantages as the previous point.
      </li>
    </ul>
  </li>
  
  <li>
    Drop/recreate the database each test run. <ul class="task-list">
      <li>
        The most practical way to do this is to use some sort of in-memory variation e.g. <a href="https://www.sqlite.org/inmemorydb.html" target="_blank">sqlite in-memory</a>, <a href="http://ravendb.net/" target="_blank">Raven in-memory</a>, <a href="https://effort.codeplex.com/" target="_blank">Effort for Entity Framework</a> and the upcoming <a href="https://github.com/aspnet/EntityFramework" target="_blank">Entity Framework 7 in-memory provider</a> <ul class="task-list">
          <li>
            This has the advantage of working in-process and thus you might be able to make the test a &#8220;fast&#8221; test
          </li>
          <li>
            This allows you to run tests in parallel and isolated from each other by wiping the database every test run
          </li>
          <li>
            The downside is the database is very different from your production database and in fact might not have some features your code needs
          </li>
          <li>
            Also, it might be difficult to migrate the database to the correct schema (e.g. sqlite doesn&#8217;t support <code>ALTER</code> statements) so you are stuck with getting your ORM to automatically generate the schema for you rather than testing your migrations
          </li>
          <li>
            Additionally, it can actually be quite slow to regenerate the schema every test run as the complexity of your schema grows
          </li>
        </ul>
      </li>
    </ul>
  </li>
  
  <li>
    Delete all of the non-seed data in the database every test run &#8211; this can be quite tricky to get right without violating foreign keys, but Jimmy has some clever SQL scripts for it (in the above-linked article) and finds that it&#8217;s quite a fast option.
  </li>
  <li>
    Ensure that the data being entered by each test will necessarily be isolated from other test runs (e.g. random GUID ids etc.) &#8211; the danger here is that it can get quite complex to keep on top of this and it&#8217;s likely your tests will be fragile &#8211; I generally wouldn&#8217;t recommend this option.
  </li>
</ol>

I generally find that database integration tests are _reasonably_ fast (after the initial spin-up time for EntityFramework or NHibernate). For instance, in a recent project the first database test would take 26s and subsequent tests took ~15ms for a test with an empty database query, ~30-50ms for a fairly basic query test with populated data and 100-200ms for a more complex test with a lot more database interaction.

In some cases I will write all of my behavioural tests touching the database because the value of testing against a production-like database with the real SQL being issued against the real migrations is incredibly valuable in terms of confidence. If you are using a DI container in your tests I&#8217;m sure that it would be possible to run the test suite in two different modes &#8211; one with an in-memory variant and parallelisation to get fast feedback and one with full database integration for full confidence. If you had a project that was big enough that the feedback time was getting too large investigating this type of approach is worth it &#8211; I personally haven&#8217;t found a need yet.

I&#8217;ve recently been using variations on this fixture class to set up the database integration for my tests using Entity Framework:

<pre class="brush: csharp; title: ; notranslate" title="">public class DatabaseFixture : IDisposable
{
    private readonly MyAppContext _parentContext;
    private readonly DbTransaction _transaction;

    static DatabaseFixture()
    {
        var testPath = Path.GetDirectoryName(typeof (DatabaseFixture).Assembly.CodeBase.Replace("file:///", ""));
        AppDomain.CurrentDomain.SetData("DataDirectory", testPath); // For localdb connection string that uses |DataDirectory|
        using (var migrationsContext = new MyAppContext())
        {
            migrationsContext.Database.Initialize(false); // Performs EF migrations
        }
    }

    public DatabaseFixture()
    {
        _parentContext = new MyAppContext();
        _parentContext.Database.Connection.Open(); // This could be a simple SqlConnection if using sql express, but if using localdb you need a context so that EF creates the database if it doesn't exist (thanks EF!)
        _transaction = _parentContext.Database.Connection.BeginTransaction();

        SeedDbContext = GetNewDbContext();
        WorkDbContext = GetNewDbContext();
        VerifyDbContext = GetNewDbContext();
    }

    public MyAppContext SeedDbContext { get; private set; }
    public MyAppContext WorkDbContext { get; private set; }
    public MyAppContext VerifyDbContext { get; private set; }

    private MyAppContext GetNewDbContext()
    {
        var context = new MyAppContext(_parentContext.Database.Connection);
        context.Database.UseTransaction(_transaction);
        return context;
    }

    public void Dispose()
    {
        SeedDbContext.Dispose();
        WorkDbContext.Dispose();
        VerifyDbContext.Dispose();
        _transaction.Dispose(); // Discard any inserts/updates since we didn't commit
        _parentContext.Dispose();
    }
}
</pre>

## Subcutaneous testing

It&#8217;s pretty well known/documentated that UI-tests are slow and unless you <a href="http://www.mehdi-khalili.com/presentations/automated-ui-testing-done-right-at-dddsydney" target="_blank">get</a> <a href="http://code.tutsplus.com/tutorials/maintainable-automated-ui-tests--net-35089" target="_blank">them</a> <a href="http://code.tutsplus.com/tutorials/tips-to-avoid-brittle-ui-tests--net-35188" target="_blank">right</a> are brittle. Most people recommend that you only test happy paths. Jimmy classifies UI tests in his &#8220;slow as hell&#8221; category and also recommends on testing (important) happy paths. I like to recommend that UI tests are used for high value scenarios (such as a user performing the primary action that makes you money), functionality that continually breaks and can&#8217;t be adequately covered with other tests or complex UIs.

Subcutaneous tests allow you to get a lot of the value from UI tests in that you are testing the full stack of your application with its real dependencies (apart from those external to the application like web services), but without the fragility of talking to a fragile and slow UI layer. These kinds of tests are what Jimmy classifies as &#8220;slow&#8221;, and will include integration with the database as outlined in the previous sub-section.

In his presentation, Jimmy suggests that he writes subcutaneous tests against the command/query layer (if you are using CQS). I&#8217;ve recently used subcutaneous tests from the MVC controller using a base class like this:

<pre class="brush: csharp; title: ; notranslate" title="">public abstract class SubcutaneousMvcTest&lt;TController&gt; : IDisposable
    where TController : Controller
{
    private DatabaseFixture _databaseFixture;
    private readonly HttpSimulator _httpRequest;
    private readonly ILifetimeScope _lifetimeScope;

    protected TController Controller { get; private set; }
    protected ControllerResultTest&lt;TController&gt; ActionResult { get; set; }
    protected MyAppContext SeedDbContext { get { return _databaseFixture.SeedDbContext; } }
    protected MyAppContext VerifyDbContext { get { return _databaseFixture.VerifyDbContext; } }

    protected SubcutaneousMvcTest()
    {
        _databaseFixture = new DatabaseFixture();
        _lifetimeScope = ContainerFixture.GetTestLifetimeScope(cb =&gt;
            cb.Register(_ =&gt; _databaseFixture.WorkDbContext).AsSelf().AsImplementedInterfaces().InstancePerTestRun());
        var routes = new RouteCollection();
        RouteConfig.RegisterRoutes(routes); // This is what App_Start calls in production
        _httpRequest = new HttpSimulator().SimulateRequest(); // Simulates HttpContext.Current so I don't have to mock it
        Controller = _lifetimeScope.Resolve&lt;TController&gt;(); // Resolve the controller with real dependencies via ContainerFixture
        Controller.ControllerContext = new ControllerContext(new HttpContextWrapper(HttpContext.Current), new RouteData(), Controller);
        Controller.Url = new UrlHelper(Controller.Request.RequestContext, routes);
    }

    // These methods make use of my TestStack.FluentMVCTesting library so I can make nice assertions against the action result, which fits in with the BDD style
    protected void ExecuteControllerAction(Expression&lt;Func&lt;TController, Task&lt;ActionResult&gt;&gt;&gt; action)
    {
        ActionResult = Controller.WithCallTo(action);
    }

    protected void ExecuteControllerAction(Expression&lt;Func&lt;TController, ActionResult&gt;&gt; action)
    {
        ActionResult = Controller.WithCallTo(action);
    }

    [Fact]
    public virtual void ExecuteScenario()
    {
        this.BDDfy(); // I'm using Bddfy
    }

    protected TDependency Resolve&lt;TDependency&gt;()
    {
        return _lifetimeScope.Resolve&lt;TDependency&gt;();
    }

    public void Dispose()
    {
        _databaseFixture.Dispose();
        _httpRequest.Dispose();
        _lifetimeScope.Dispose();
    }
}
</pre>

Here is an example test:

<pre class="brush: csharp; title: ; notranslate" title="">public class SuccessfulTeamResetPasswordScenario : SubcutaneousMvcTest&lt;TeamResetPasswordController&gt;
{
    private ResetPasswordViewModel _viewModel;
    private const string ExistingPassword = "correct_password";
    private const string NewPassword = "new_password";

    public async Task GivenATeamHasRegisteredAndIsLoggedIn()
    {
        var registeredTeam = await SeedDbConnection.SaveAsync(
            ObjectMother.Teams.Default.WithPassword(ExistingPassword));
        LoginTeam(registeredTeam);
    }

    public void AndGivenTeamSubmitsPasswordResetDetailsWithCorrectExistingPassword()
    {
        _viewModel = new ResetPasswordViewModel
        {
            ExistingPassword = ExistingPassword,
            NewPassword = NewPassword
        };
    }

    public void WhenTeamConfirmsThePasswordReset()
    {
        ExecuteControllerAction(c =&gt; c.Index(_viewModel));
    }

    public Task ThenResetThePassword()
    {
        var team = await VerifyDbConnection.Teams.SingleAsync();
        team.Password.Matches(NewPassword).ShouldBe(true); // Matches method is from BCrypt
        team.Password.Matches(ExistingPassword).ShouldNotBe(true);
    }

    public void AndTakeUserToASuccessPage()
    {
        ActionResult.ShouldRedirectTo(c =&gt; c.Success);
    }
}
</pre>

Note:

<ul class="task-list">
  <li>
    The Object Mother with builder syntax is as per <a href="http://robdmoore.id.au/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/" target="_blank">my existing article on the matter</a>
  </li>
  <li>
    I defined <code>LoginTeam</code> in the <code>SubcutaneousMvcTest</code> base class and it sets the <code>Controller.User</code>object to a <code>ClaimsPrincipal</code> object for the given team (what ASP.NET MVC does for me when a team is actually logged in)
  </li>
  <li>
    The <code>SaveAsync</code> method on <code>SeedDbConnection</code> is an extension method in my test project that I defined that takes a builder object, calls <code>.Build</code> and persists the object (and returns it for terseness): <pre class="brush: csharp; title: ; notranslate" title="">public static class MyAppContextExtensions
{
    public static async Task&lt;Team&gt; SaveAsync(this MyAppContext context, TeamBuilder builder)
    {
        var team = builder.Build();
        context.Teams.Add(team);
        await context.SaveChangesAsync();
        return team;
    }
}
</pre>
  </li>
</ul>

### When to use subcutaneous tests

In my experience over the last few projects (line of business applications) I&#8217;ve found that I can write subcutaneous tests against MVC controllers and that replaces the need for most other tests (as discussed in the <a href="http://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong/" target="_blank">previous post</a>). A distinction over the previous post is that I&#8217;m writing these tests from the MVC Controller rather than the port (the command object). By doing this I&#8217;m able to provide that extra bit of confidence that the binding from the view model through to the command layer is correct without writing extra tests. I was able to do this because I was confident that there was definitely only going to be a single UI/client and the application wasn&#8217;t likely to grow a lot in complexity. If I was sure the command layer would get reused across multiple clients then I would test from that layer and only test the controller with a mock of the port if I felt it was needed.

One thing that should be noted with this approach is that, given I&#8217;m using real database connections, the tests aren&#8217;t lightning fast, but for the applications I&#8217;ve worked on I&#8217;ve been happy with the speed of feedback, low cost and high confidence this approach has gotten me. This differs slightly from the premise in Jimmy&#8217;s talk where he favours more fast as hell tests. As I talked about above though, if speed becomes a problem you can simply adjust your approach.

I should note that when testing a web api then I have found that writing full-stack tests against an in-memory HTTP server (passed into the constructor of `HttpClient`) are similarly effective and it tests from something that the user/client cares about (the issuance of a HTTP request).