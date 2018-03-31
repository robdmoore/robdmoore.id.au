---
layout: post
title: Automated Testing of ASP.NET Web API and MVC applications
date: 2013-02-02 16:56:41.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- ASP.NET MVC
- ASP.NET Web API
- C#
- NSubstitute
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


Yesterday I started working on my first professional usage of ASP.NET Web API and as part of that created a handy base class to perform full-stack unit and/or integration testing of controller actions in-process. It was based on some stuff I found online, but put my own flair on so I thought I would share it here in case anyone else found it useful. While I'm at it I thought I'd briefly outline my testing strategy for most MVC applications I write.


## ASP.NET MVC Testing


When I'm testing an ASP.NET MVC application I have had good mileage with covering the following (this is a combination of what you might consider to be integration and unit tests):


- **Routes**: Typically you aren't going to change the URLs in your application (because then you would be dealing with potential search engine optimisation and bookmarking issues) so if they do change it's a good indication that (in an MVC application) you've added a new route definition that has broken some existing definitions. I will typically test the URLs for all controller actions (including mapping route values to action input parameters) and test that calling Url.Route with the same parameters results in the same route being generated. This kind of testing has saved my bacon many times in the past and it is quick and effective to write the tests whenever adding a new controller action using the code I use (a version of [MVCContrib.TestHelper](http://mvccontrib.codeplex.com/wikipage?title=TestHelper#Routes) that I modified to use [NSubstitute](http://nsubstitute.github.com/)). It's particularly handy when you have [areas](http://msdn.microsoft.com/en-au/library/ee671793(v=vs.100).aspx) in your application because they have a nasty tendency of breaking your routes.
- **Controllers**: If any particular controller action is more than a few lines of code (and thus it isn't bleedingly obviously that it's either correct or not correct just by looking at it), then like all complex business logic I try and unit test the controllers. I do this using the [Fluent MVC Testing library that I created](http://teststack.github.com/pages/fluentmvctesting.html) because it's terse and easy to write these tests.
- **Controller Instantiation**: [As previously blogged](http://robdmoore.id.au/blog/2012/05/29/controller-instantiation-testing/).
- **Filters, Filter Providers and Model Binders**: I will typically unit test these, for an example see my previous post about [unit testing filter providers](http://robdmoore.id.au/blog/2012/04/27/testing-code-that-uses-autofac-dependencyresolver-in-asp-net-mvc/).
- **UI Testing**: If the circumstances of the project allow for it then well-placed full-stack tests provide a lot of extra confidence. My fellow [TestStacker](http://teststack.github.com/) [Mehdi Khalili](http://www.mehdi-khalili.com/) has a [brilliant slide deck on this](http://www.mehdi-khalili.com/presentations/auit-qmsdnug).
- **Database Layer**: I perform tests against individual queries / commands / repository methods by doing a full integration test against a real database and wrapping the whole thing in a Transaction Scope so I can roll-back any changes in the test teardown. This ensures the test database always remains clean (read: empty) and each test can work in isolation.
- **Database migrations**: I like to include one test that brings the test database to version 0 and then back up to the latest version so that if you ever need to use your down migrations then you have confidence they work (as well as continuing confidence that all of your up migrations work).
- **Business logic / services / domain logic**: I will always unit test this
- **Infrastructure code**: Where practical I try and unit test this. Sometimes this code is tested as a result of other tests e.g. the database tests and controller instantiation tests



If there are any particular types of testing that you would like me to do a more detailed blog post feel free to add a comment below.


## ASP.NET Web API


The tests above have a nice mixture of unit and integrations tests and I find that they combine to provide a good level of confidence and coverage as the codebase evolves. I have only really [played around with Web API in my spare time](http://robdmoore.id.au/blog/2012/09/01/webapi-hal/) so far so the following recommendations are likely to evolve over time, but this is my current gut feel about this kind of testing.



Firstly, there are a few good posts I came across that give a broad idea of the different ways in which you can test Web API:


- [Unit Test ASP.NET Web API](http://www.peterprovost.org/blog/2012/06/16/unit-testing-asp-dot-net-web-api)
- [Testing routes in ASP.NET Web API](http://www.strathweb.com/2012/08/testing-routes-in-asp-net-web-api/)
- [ASP.Net Web Api Integration Tests With Self Hosting](http://cromwellhaus.com/2012/02/asp-net-web-api-integration-tests-with-self-hosting/)



And then my initial approach / thoughts:


- **Routes**:The other day I stumbled across a library someone had created to do [route testing for ASP.NET Web API](https://github.com/AnthonySteele/MvcRouteTester) and while I'm not a fan of the syntax they created (vs MVCContrib.TestHelper style syntax) it's a good start in this direction. For the moment I'm thinking (as you will see) that I can take care of route testing implicitly. Furthermore, at least for my current project, the number of routes I'm dealing with doesn't necessitate route testing. If the routes that you deal with are complex enough and or large enough in number then unit testing routes will likely provide a lot of value.  
**Controllers**: There is less need for a library like Fluent MVC Testing with Web API since most of your controllers will simply return the data that they queried directly and rely on formatters to give the correct response. This makes unit testing the controllers really simple. As for route testing the initial approach I've settled on will cover this testing anyway.
- **Controller Instantiation**: For the same reason this is valuable for ASP.NET MVC projects I think this is valuable (and just as easy to test). In my current project I haven't bothered creating this yet since I'm only dealing with one controller with a couple of dependencies so I don't have any code for this.
- **Filters, etc.**: I think there is value in unit testing these things in the same way as there is for MVC applications. In this instance the approach I've settled on tests these as well because it's a full stack test. This is fine for simple filters / formatters etc., but if you have complex ones then I highly recommend unit testing them as well.
- **UI Testing**: This one is interesting, because at first thought there is no UI to test so this isn't applicable. However, the way I see it, the equivalent in API tests are testing from the viewpoint of the client/consumer e.g. if I make a get request to this URL then I expect that object in JSON format. If you are producing an API according to a specification then this is the viewpoint the specification is written in and depending on how you do things, the acceptance criteria for the work you are doing will also be in terms of this. For these reasons, I think in some ways, while it is integration testing, testing the full stack from the viewpoint of a client provides a lot of bang for buck. As I will explain further below, this is the approach I have decided to initially take. I should note that the traditional pain points of UI testing for MVC applications (cross-browser differences, really slow, out of process so you can't easily mock things, etc.) can easily be mitigated when doing this testing, which is why I find it a suitable approach in lieu of some of the other testing I might normally do.
- **Database / business logic / infrastructure**: None of this changes.


## The approach I've taken for Web API testing


This is heavily based on the [ASP.Net Web Api Integration Tests With Self Hosting](http://cromwellhaus.com/2012/02/asp-net-web-api-integration-tests-with-self-hosting/) post I linked to above. The problems I had with the code shown in that post was:


- The route was defined in the test rather than re-using the routes you define in your application
- The test itself is defined within a lamdba
- There was no abstraction of the code to set up the server
- The base URL was specified multiple times
- The test was really verbose (apart from not abstracting out the server it had a stream reader and WebRequest.Create etc.)



In the end I created a base class (using NUnit, but the same applies to any unit testing framework) that abstracted away the creation of the server as well as the HTTP call. This resulted in tests that were dead simple and very terse (for the moment there is only a get request, but you can easily add other methods and headers etc.). I also exposed the dependency injection so that I could insert mocks to control whether I want to unit test the controller action or integration test it with real dependencies. In this case it uses Autofac, but again the same applies for any DI framework.



Another thing to note is that I've baked in support for detecting if [Fiddler](http://www.fiddler2.com/fiddler2/) is currently running and proxying requests through Fiddler in that instance. That way you can seemlessly move your test between your local computer (with or without Fiddler running) and your CI server without changing any code. The fact it proxies through Fiddler makes it really easy to debug exactly what is going on too.



Two other things to note are that you need to change PingController to a controller (or any class really) in the assembly that contains your API controllers and that this assumes you have created a static method inside the RouteConfig class called RegisterApiRoutes that defines the routes for your API.



```csharp
using System;
using System.Net.Http;
using System.Web.Http.SelfHost;
using Autofac;
using Autofac.Integration.WebApi;
using NUnit.Framework;
using WebApiTesting.App_Start;
using WebApiTesting.Controllers;
namespace WebApiTesting.Tests.TestHelpers
{
    class WebApiTestBase
    {
        private HttpSelfHostServer _webServer;
        protected IContainer Container { get; private set; }
        protected ContainerBuilder ContainerBuilder { get; set; }
        protected Uri BaseUri { get; private set; }
        private bool _fiddlerActive = true;
        [TestFixtureSetUp]
        public void TestFixtureSetup()
        {
            var client = new HttpClient();
            try
            {
                client.GetAsync("http://ipv4.fiddler/").Wait();
            }
            catch (Exception)
            {
                _fiddlerActive = false;
            }
        }
        [SetUp]
        public virtual void Setup()
        {
            BaseUri = new Uri("http://localhost:3000");
            var config = new HttpSelfHostConfiguration(BaseUri);
            ContainerBuilder = ContainerBuilder ?? new ContainerBuilder();
            ContainerBuilder.RegisterApiControllers(typeof(PingController).Assembly);
            Container = ContainerBuilder.Build();
            RouteConfig.RegisterApiRoutes(config);
            config.DependencyResolver = new AutofacWebApiDependencyResolver(Container);
            _webServer = new HttpSelfHostServer(config);
            _webServer.OpenAsync().Wait();
        }
        protected HttpResponse PerformGetTo(string url)
        {
            var client = new HttpClient();
            var response = client.GetAsync((_fiddlerActive ? "http://ipv4.fiddler:3000/" : BaseUri.ToString()) + url).Result;
            var content = response.Content.ReadAsStringAsync().Result;
            return new HttpResponse { Content = content, Response = response };
        }
        [TearDown]
        public void Teardown()
        {
            _webServer.CloseAsync().Wait();
            _webServer.Dispose();
            Container.Dispose();
            ContainerBuilder = null;
            Container = null;
        }
    }
    class HttpResponse
    {
        public string Content { get; set; }
        public HttpResponseMessage Response { get; set; }
    }
}
```



So, how exactly do you use this class? Great question, but first a bit of context. My example will be for a endpoint at /api/ping that takes a GET request and returns the UTC system time in ISO format within an object with a property "Timestamp" along with a 200 OK if the database is up and running or a blank response with a 500 error if the database is not up and running.



Here is my test class:



```csharp
using System;
using System.Net;
using Autofac;
using NSubstitute;
using NUnit.Framework;
using WebApiTesting.Infrastructure;
using WebApiTesting.Tests.TestHelpers;
namespace WebApiTesting.Tests.Controllers
{
    internal class PingControllerTests : WebApiTestBase
    {
        private IDateTimeProvider _dateTimeProvider;
        private IPingRepository _pingRepository;
        [SetUp]
        public override void Setup()
        {
            ContainerBuilder = new ContainerBuilder();
            _dateTimeProvider = Substitute.For<IDateTimeProvider>();
            _pingRepository = Substitute.For<IPingRepository>();
            ContainerBuilder.Register(c => _dateTimeProvider);
            ContainerBuilder.Register(c => _pingRepository);
            base.Setup();
        }
        [Test]
        public void GivenTheDatabaseIsUpAndRunning_WhenGetToPing_ReturnCurrentTimestampAnd200Ok()
        {
            _dateTimeProvider.Now().Returns(new DateTimeOffset(new DateTime(2012, 11, 4, 12, 20, 6), TimeSpan.Zero));
            var response = PerformGetTo("api/ping");
            Assert.That(response.Response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content, Is.EqualTo(@"{""Timestamp"":""2012-11-04 12:20:06""}"));
        }
        [Test]
        public void GivenTheDatabaseIsNotRunning_WhenGetToPing_Return500ErrorWithNoContent()
        {
            _pingRepository.When(r => r.CheckDatabase()).Do(a => { throw new Exception(); });
            var response = PerformGetTo("api/ping");
            Assert.That(response.Response.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
            Assert.That(response.Content, Is.EqualTo(string.Empty));
        }
    }
}
```



There are a few things to note:


- To register the listener to the port you need to run Visual Studio (and your CI test runner) as admin otherwise you will get a could not register port error.
- I used port 3000, but if you are running as admin and get an error saying that port can't be registered it then you might have something else on that port so feel free to change.
- Unfortunately I couldn't make use of [AutoSubstitute](https://github.com/robdmoore/AutofacContrib.NSubstitute), but unfortunately that broke the HTTP server (I imagine because it was giving mocks for things that the server needed real stuff for). The downside of this is that I have to keep track of the dependencies of the controller within the test making the test more verbose.
- Because I need the container builder before starting up the web server I have to create the container builder in the setup method and register everything that I need to mock for any of the tests there, rather than setting up what needs to be mocked in each individual test.
- I am setting up and shutting down the web server for each test to isolate them, but if there are a lot of tests this might be too slow and attaching start up to fixture setup or even test assembly set up might be a better option.
- As mentioned above for now there is only a Perform**Get**To method, but it would be easy to support the other things needed.



I've uploaded the example source code to Github. Feel free to fork it and play around. If you have any suggestions or improvements feel free to add a comment :)



Enjoy!

