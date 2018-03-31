---
layout: post
title: 'Review of: Jimmy Bogard - Holistic Testing'
date: 2015-01-26 23:43:06.000000000 +08:00
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


This post discusses the talk "[Holistic Testing](http://vimeo.com/68390508)" by Jimmy Bogard, which was given in June 2013. See my [introduction post](http://robdmoore.id.au/blog/2015/01/26/testing-i-dont-even/) to get the context behind this post and the other posts I have written in this series.



I really resonate with the points raised by Jimmy since I've been using a lot of similar techniques recently. In this article I outline how I've been using the techniques talked about by Jimmy (including code snippets for context).


## Overview


In this insightful presentation Jimmy outlines the testing strategy that he tends to use for the projects he works on. He covers the level that he tests from, the proportion of the different types of tests he writes and covers the intimate technical detail about how he implements the tests. Like Ian Cooper, Jimmy likes writing his unit tests from a relatively high level in his application, specifically he said that he likes the definition of unit test to be:



> "Units of behaviour, isolated from other units of behaviour"


## Code coverage and shipping code


> "The ultimate goal here is to ship code it's not to write tests; tests are just a means to the end of shipping code."
> 
> 
> 
> "I can have 100% code coverage and have noone use my product and I can have 0% code coverage and it's a huge success; there is no correlation between the two things."



Enough said.


## Types of tests


Jimmy breathes a breath of fresh air when throwing away the testing pyramid (and all the conflicting definitions of unit, integration, etc. tests) in favour of a pyramid that has a small number of "slow as hell tests", a slightly larger number of "slow" tests and a lot of "fast" tests.



This takes away the need to classify if a test is unit, integration or otherwise and focuses on the important part - how fast can you get feedback from that test. This is something that I've often said - there is no point in distinguishing between unit and integration tests in your project until the moment that you need to separate out tests because your feedback cycle is too slow (which will take a while in a greenfield project).



It's worth looking at the ideas expressed by [Sebastien Lambla on Vertical Slide Testing (VEST)](http://codebetter.com/sebastienlambla/2013/07/11/unit-testing-is-out-vertical-slice-testing-is-in/), which provides another interesting perspective in this area by turning your traditionally slow "integration" tests into fast in-memory tests. Unfortunately, the idea seems to be fairly immature and there isn't a lot of support for this type of approach.


## Mocks


Similar to the ideas [expressed by Ian Cooper](http://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong/ "Review of: Ian Cooper – TDD, where did it all go wrong"), Jimmy tells us not to mock internal implementation details (e.g. collaborators passed into the constructor) and indicates that he rarely uses mocks. In fact he admitted that he would rather make the process of using mocks more painful and hand rolling them to discourage their use unless it's necessary.



Jimmy says that he creates "seams" for the things he can't control or doesn't own (e.g. webservices, databases, etc.) and then mocks those seams when writing his test.



The cool thing about hand-rolled mocks that I've found is that you can codify real-like behaviour (e.g. interactions between calls and real-looking responses) and contain that behaviour in one place (helping to form documentation about how the thing being mocked works). These days I tend to use a combination of hand-rolled mocks for some things and [NSubstitute](http://nsubstitute.github.io/) for others. I'll generally use hand-rolled mocks when I want to codify behaviour or if I want to provide a separate API surface area to interact with the mock e.g.:



```csharp
// Interface
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
```


## Container-driven unit tests


One of the most important points that Jimmy raises in his talk is that he uses his DI container to resolve dependencies in his "fast" tests. This makes a lot of sense because it allows you to:


- Prevent implementation detail leaking into your test by resolving the component under test and all of it's real dependencies without needing to know the dependencies
- Mimic what happens in production
- Easily provide mocks for those things that do need mocks without needing to know what uses those mocks



Container initialisation can be (relatively) slow so in order to ensure this cost is incurred once you can simply set up a global fixture or static instance of the initialised container.



The other consideration is how to isolate the container across test runs - if you modify a mock for instance then you don't want that mock to be returned in the next test. Jimmy overcomes this by using child containers, which he has [separately blogged about](http://lostechies.com/jimmybogard/2012/03/19/integrating-and-isolating-the-container-in-tests/).



The other interesting thing that Jimmy does is uses an extension of [AutoFixture's](https://autofixture.codeplex.com/) AutoDataAttribute attribute to resolve parameters to his test method from the container. It's pretty nifty and explained in more detail [by Sebastian Weber](https://outlawtrail.wordpress.com/2013/07/03/behavioral-testing/).



I've recently used a variation of the following test fixture class (in my case using Autofac):



```csharp
public static class ContainerFixture
{
    private static readonly IContainer Container;
    static ContainerFixture()
    {
        Container = ContainerConfig.CreateContainer(); // This is what my production App_Start calls
        AppDomain.CurrentDomain.DomainUnload += (sender, args) => Container.Dispose();
    }
    public static ILifetimeScope GetTestLifetimeScope(Action<ContainerBuilder> modifier = null)
    {
        return Container.BeginLifetimeScope(MatchingScopeLifetimeTags.RequestLifetimeScopeTag, cb => {
            ExternalMocks(cb);
            if (modifier != null)
                modifier(cb);
        });
    }
    private static void ExternalMocks(ContainerBuilder cb)
    {
        cb.Register(_ => new StaticDateTimeProvider(DateTimeOffset.UtcNow.AddMinutes(1)))
            .AsImplementedInterfaces()
            .AsSelf()
            .InstancePerTestRun();
        // Other overrides of externals to the application ...
    }
}
public static class RegistrationExtensions
{
    // This extension method makes the registrations in the ExternalMocks method clearer in intent - I create a HTTP request lifetime around each test since I'm using my container in a web app
    public static IRegistrationBuilder<TLimit, TActivatorData, TStyle> InstancePerTestRun
        <TLimit, TActivatorData, TStyle>(this IRegistrationBuilder<TLimit, TActivatorData, TStyle> registration,
            params object[] lifetimeScopeTags)
    {
        return registration.InstancePerRequest(lifetimeScopeTags);
    }
}
```


## Isolating the database


Most applications that I come across will have a database of some sort. Including a database connection usually means out of process communication and this likely turns your test from "fast" to "slow" in Jimmy's terminology. It also makes it harder to write a good test since databases are stateful and thus we need to isolate tests against each other. It's often difficult to run tests in parallel against the same database as well.



There are a number of ways of dealing with this, which Jimmy outlined in his talk and also [on](http://lostechies.com/jimmybogard/2012/10/18/isolating-database-data-in-integration-tests/) [his](http://lostechies.com/jimmybogard/2013/06/18/strategies-for-isolating-the-database-in-tests/) blog:


1. Use a transaction and rollback at the end of the test. The tricky thing here is making sure that you simulate multiple requests - you need to make sure that your seeding, work and verification all happen separately otherwise your ORM caching might give you a false positive. I find this to be quite an effective strategy and it's what I've used for years now in various forms.
  - One option is to use `TransactionScope` to transparently initiate a transaction and rollback that allows multiple database connections to connect to the database and you can have real, committed transactions that will then get rolled back. The main downsides are that you need MSDTC enabled on all dev machines and your CI server agents and you can't run tests in parallel against the same database.
  - Another option is to initiate a single connection with a transaction and then to reuse that connection across your ORM contexts - this allows you to avoid MSDTC and run tests in parallel, but it also means you can't use explicit transactions in your code (or to make them noops for your test code) and it's not possible with all ORMs. I can't claim credit for this idea - I was introduced to it by [Jess Panni](https://twitter.com/jesspanni) and [Matt Davies](https://twitter.com/mdaviesnet).
  - If your ORM doesn't support attaching multiple contexts to a single connection with an open transaction ([hi NHibernate!](http://stackoverflow.com/questions/16350459/multiple-nhibernate-sessions-in-one-transanction)) then another option would be to clear the cache after seeding and after work. This has the same advantages and disadvantages as the previous point.
2. Drop/recreate the database each test run.
  - The most practical way to do this is to use some sort of in-memory variation e.g. [sqlite in-memory](https://www.sqlite.org/inmemorydb.html), [Raven in-memory](http://ravendb.net/), [Effort for Entity Framework](https://effort.codeplex.com/) and the upcoming [Entity Framework 7 in-memory provider](https://github.com/aspnet/EntityFramework)
    - This has the advantage of working in-process and thus you might be able to make the test a "fast" test
    - This allows you to run tests in parallel and isolated from each other by wiping the database every test run
    - The downside is the database is very different from your production database and in fact might not have some features your code needs
    - Also, it might be difficult to migrate the database to the correct schema (e.g. sqlite doesn't support `ALTER` statements) so you are stuck with getting your ORM to automatically generate the schema for you rather than testing your migrations
    - Additionally, it can actually be quite slow to regenerate the schema every test run as the complexity of your schema grows
3. Delete all of the non-seed data in the database every test run - this can be quite tricky to get right without violating foreign keys, but Jimmy has some clever SQL scripts for it (in the above-linked article) and finds that it's quite a fast option.
4. Ensure that the data being entered by each test will necessarily be isolated from other test runs (e.g. random GUID ids etc.) - the danger here is that it can get quite complex to keep on top of this and it's likely your tests will be fragile - I generally wouldn't recommend this option.



I generally find that database integration tests are *reasonably* fast (after the initial spin-up time for EntityFramework or NHibernate). For instance, in a recent project the first database test would take 26s and subsequent tests took ~15ms for a test with an empty database query, ~30-50ms for a fairly basic query test with populated data and 100-200ms for a more complex test with a lot more database interaction.



In some cases I will write all of my behavioural tests touching the database because the value of testing against a production-like database with the real SQL being issued against the real migrations is incredibly valuable in terms of confidence. If you are using a DI container in your tests I'm sure that it would be possible to run the test suite in two different modes - one with an in-memory variant and parallelisation to get fast feedback and one with full database integration for full confidence. If you had a project that was big enough that the feedback time was getting too large investigating this type of approach is worth it - I personally haven't found a need yet.



I've recently been using variations on this fixture class to set up the database integration for my tests using Entity Framework:



```csharp
public class DatabaseFixture : IDisposable
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
```


## Subcutaneous testing


It's pretty well known/documentated that UI-tests are slow and unless you [get](http://www.mehdi-khalili.com/presentations/automated-ui-testing-done-right-at-dddsydney) [them](http://code.tutsplus.com/tutorials/maintainable-automated-ui-tests--net-35089) [right](http://code.tutsplus.com/tutorials/tips-to-avoid-brittle-ui-tests--net-35188) are brittle. Most people recommend that you only test happy paths. Jimmy classifies UI tests in his "slow as hell" category and also recommends on testing (important) happy paths. I like to recommend that UI tests are used for high value scenarios (such as a user performing the primary action that makes you money), functionality that continually breaks and can't be adequately covered with other tests or complex UIs.



Subcutaneous tests allow you to get a lot of the value from UI tests in that you are testing the full stack of your application with its real dependencies (apart from those external to the application like web services), but without the fragility of talking to a fragile and slow UI layer. These kinds of tests are what Jimmy classifies as "slow", and will include integration with the database as outlined in the previous sub-section.



In his presentation, Jimmy suggests that he writes subcutaneous tests against the command/query layer (if you are using CQS). I've recently used subcutaneous tests from the MVC controller using a base class like this:



```csharp
public abstract class SubcutaneousMvcTest<TController> : IDisposable
    where TController : Controller
{
    private DatabaseFixture _databaseFixture;
    private readonly HttpSimulator _httpRequest;
    private readonly ILifetimeScope _lifetimeScope;
    protected TController Controller { get; private set; }
    protected ControllerResultTest<TController> ActionResult { get; set; }
    protected MyAppContext SeedDbContext { get { return _databaseFixture.SeedDbContext; } }
    protected MyAppContext VerifyDbContext { get { return _databaseFixture.VerifyDbContext; } }
    protected SubcutaneousMvcTest()
    {
        _databaseFixture = new DatabaseFixture();
        _lifetimeScope = ContainerFixture.GetTestLifetimeScope(cb =>
            cb.Register(_ => _databaseFixture.WorkDbContext).AsSelf().AsImplementedInterfaces().InstancePerTestRun());
        var routes = new RouteCollection();
        RouteConfig.RegisterRoutes(routes); // This is what App_Start calls in production
        _httpRequest = new HttpSimulator().SimulateRequest(); // Simulates HttpContext.Current so I don't have to mock it
        Controller = _lifetimeScope.Resolve<TController>(); // Resolve the controller with real dependencies via ContainerFixture
        Controller.ControllerContext = new ControllerContext(new HttpContextWrapper(HttpContext.Current), new RouteData(), Controller);
        Controller.Url = new UrlHelper(Controller.Request.RequestContext, routes);
    }
    // These methods make use of my TestStack.FluentMVCTesting library so I can make nice assertions against the action result, which fits in with the BDD style
    protected void ExecuteControllerAction(Expression<Func<TController, Task<ActionResult>>> action)
    {
        ActionResult = Controller.WithCallTo(action);
    }
    protected void ExecuteControllerAction(Expression<Func<TController, ActionResult>> action)
    {
        ActionResult = Controller.WithCallTo(action);
    }
    [Fact]
    public virtual void ExecuteScenario()
    {
        this.BDDfy(); // I'm using Bddfy
    }
    protected TDependency Resolve<TDependency>()
    {
        return _lifetimeScope.Resolve<TDependency>();
    }
    public void Dispose()
    {
        _databaseFixture.Dispose();
        _httpRequest.Dispose();
        _lifetimeScope.Dispose();
    }
}
```



Here is an example test:



```csharp
public class SuccessfulTeamResetPasswordScenario : SubcutaneousMvcTest<TeamResetPasswordController>
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
        ExecuteControllerAction(c => c.Index(_viewModel));
    }
    public Task ThenResetThePassword()
    {
        var team = await VerifyDbConnection.Teams.SingleAsync();
        team.Password.Matches(NewPassword).ShouldBe(true); // Matches method is from BCrypt
        team.Password.Matches(ExistingPassword).ShouldNotBe(true);
    }
    public void AndTakeUserToASuccessPage()
    {
        ActionResult.ShouldRedirectTo(c => c.Success);
    }
}
```



Note:


- The Object Mother with builder syntax is as per [my existing article on the matter](http://robdmoore.id.au/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/)
- I defined `LoginTeam` in the `SubcutaneousMvcTest` base class and it sets the `Controller.User`object to a `ClaimsPrincipal` object for the given team (what ASP.NET MVC does for me when a team is actually logged in)
- The `SaveAsync` method on `SeedDbConnection` is an extension method in my test project that I defined that takes a builder object, calls `.Build` and persists the object (and returns it for terseness):
    ```csharp
    public static class MyAppContextExtensions
    {
        public static async Task<Team> SaveAsync(this MyAppContext context, TeamBuilder builder)
        {
            var team = builder.Build();
            context.Teams.Add(team);
            await context.SaveChangesAsync();
            return team;
        }
    }
    ```


### When to use subcutaneous tests


In my experience over the last few projects (line of business applications) I've found that I can write subcutaneous tests against MVC controllers and that replaces the need for most other tests (as discussed in the [previous post](http://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong/)). A distinction over the previous post is that I'm writing these tests from the MVC Controller rather than the port (the command object). By doing this I'm able to provide that extra bit of confidence that the binding from the view model through to the command layer is correct without writing extra tests. I was able to do this because I was confident that there was definitely only going to be a single UI/client and the application wasn't likely to grow a lot in complexity. If I was sure the command layer would get reused across multiple clients then I would test from that layer and only test the controller with a mock of the port if I felt it was needed.



One thing that should be noted with this approach is that, given I'm using real database connections, the tests aren't lightning fast, but for the applications I've worked on I've been happy with the speed of feedback, low cost and high confidence this approach has gotten me. This differs slightly from the premise in Jimmy's talk where he favours more fast as hell tests. As I talked about above though, if speed becomes a problem you can simply adjust your approach.



I should note that when testing a web api then I have found that writing full-stack tests against an in-memory HTTP server (passed into the constructor of `HttpClient`) are similarly effective and it tests from something that the user/client cares about (the issuance of a HTTP request).

