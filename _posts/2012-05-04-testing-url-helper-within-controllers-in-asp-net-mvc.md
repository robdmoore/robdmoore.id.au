---
layout: post
title: Testing Url Helper within controllers in ASP.NET MVC
date: 2012-05-04 20:45:13.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- Autofac
- C#
- mocking
- NSubstitute
- testing
author: rob
---


I recently had some code like the following in a controller that I wanted to test. The Facebook Connect API, despite being fairly awesome, is tied to the URL of the page so whenever you change the URL of your page then you will lose all your comments. This code was to get the initial URL of the page and store it in the database so that URL was used from then on:



```csharp
var url = ControllerContext.RequestContext.HttpContext.Request.Url;
vm.FacebookCommentUrl = string.Format("https://{0}{1}", url.Authority, Url.Action("Detail", new { Id = "000", Controller = ArticleType.ToString() })).Replace("000", "{0}");
```



It's easy to mock Request.Url within the ControllerContext; something like [MVCContrib.TestHelper](http://mvccontrib.codeplex.com/wikipage?title=TestHelper) will mock it out for you with a few lines of code. Personally, I use the following code in conjunction with the [AutoMock](https://www.nuget.org/packages/AutofacContrib.NSubstitute) library to do it:



```csharp
    public static class AutoMockContainer
    {
        public static AutoMock Create()
        {
            var autoMock = new AutoMock();
            var httpContext = Substitute.For<HttpContextBase>();
            autoMock.Provide(httpContext);
            var server = Substitute.For<HttpServerUtilityBase>();
            httpContext.Server.Returns(server);
            var request = Substitute.For<HttpRequestBase>();
            var parameters = new NameValueCollection();
            request.Params.Returns(parameters);
            var formParameters = new NameValueCollection();
            request.Form.Returns(formParameters);
            var qsParameters = new NameValueCollection();
            request.QueryString.Returns(qsParameters);
            var headers = new NameValueCollection();
            headers.Add("Host", "localhost");
            request.Headers.Returns(headers);
            request.AppRelativeCurrentExecutionFilePath.Returns("~/");
            request.ApplicationPath.Returns("/");
            request.Url.Returns(new Uri("http://localhost/"));
            request.Cookies.Returns(new HttpCookieCollection());
            request.ServerVariables.Returns(new NameValueCollection());
            autoMock.Provide(request);
            httpContext.Request.Returns(request);
            var response = Substitute.For<HttpResponseBase>();
            response.Cookies.Returns(new HttpCookieCollection());
            response.ApplyAppPathModifier(Arg.Any<string>()).Returns(a => a.Arg<string>());
            autoMock.Provide(response);
            httpContext.Response.Returns(response);
            var routeData = new RouteData();
            var requestContext = Substitute.For<RequestContext>();
            requestContext.RouteData = routeData;
            requestContext.HttpContext = httpContext;
            autoMock.Provide(requestContext);
            var actionExecutingContext = Substitute.For<ActionExecutingContext>();
            actionExecutingContext.HttpContext.Returns(httpContext);
            actionExecutingContext.RouteData.Returns(routeData);
            actionExecutingContext.RequestContext = requestContext;
            autoMock.Provide(actionExecutingContext);
            var actionExecutedContext = Substitute.For<ActionExecutedContext>();
            actionExecutedContext.HttpContext.Returns(httpContext);
            actionExecutedContext.RouteData.Returns(routeData);
            actionExecutedContext.RequestContext = requestContext;
            autoMock.Provide(actionExecutedContext);
            var controller = Substitute.For<ControllerBase>();
            autoMock.Provide(controller);
            actionExecutingContext.Controller.Returns(controller);
            var controllerContext = Substitute.For<ControllerContext>();
            controllerContext.HttpContext = httpContext;
            controllerContext.RouteData = routeData;
            controllerContext.RequestContext = requestContext;
            controllerContext.Controller = controller;
            autoMock.Provide(controllerContext);
            controller.ControllerContext = controllerContext;
            var iView = Substitute.For<IView>();
            autoMock.Provide(iView);
            var viewDataDictionary = new ViewDataDictionary();
            autoMock.Provide(viewDataDictionary);
            var iViewDataContainer = Substitute.For<IViewDataContainer>();
            iViewDataContainer.ViewData.Returns(viewDataDictionary);
            autoMock.Provide(iViewDataContainer);
            var textWriter = Substitute.For<TextWriter>();
            autoMock.Provide(textWriter);
            var viewContext = new ViewContext(controllerContext, iView, viewDataDictionary, new TempDataDictionary(), textWriter)
            {
                HttpContext = httpContext,
                RouteData = routeData,
                RequestContext = requestContext,
                Controller = controller
            };
            autoMock.Provide(viewContext);
            return autoMock;
        }
        public static T GetController<T>(this AutoMock autoMock) where T : Controller
        {
            var routes = new RouteCollection();
            MyApplication.RegisterRoutes(routes);
            var controller = autoMock.Resolve<T>();
            controller.ControllerContext = autoMock.Resolve<ControllerContext>();
            controller.Url = new UrlHelper(autoMock.Resolve<RequestContext>(), routes);
            return controller;
        }
    }
```



Above is the current version of the code that I use, but I change it every now and then when there is some other part of MVC that I need to mock, but haven't yet. In this particular instance I was having trouble figuring out how to get Url.Action to return the actual URL - it was returning an empty string. I was registering my routes by calling the static method in my MvcApplication class, but that wasn't enough. It took some [Googling](http://stackoverflow.com/questions/674458/asp-net-mvc-unit-testing-controllers-that-use-urlhelper) and perseverance to finally find the right set of steps to get it working (the one that really threw me was having to mock ApplyAppPathModifier in the Response object!):


1. Register your routes in the route table
2. Mock Request.Url (new Uri("http://someurl/"))
3. Mock Request.AppRelativeCurrentExecutionFilePath ("~/")
4. Mock Request.ApplicationPath ("/")
5. Mock Request.ServerVariables (new NameValueCollection())
6. Mock Response.ApplyAppPathModifier(...) (return what is passed into it!)
7. Set the UrlHelper in your controller to: new UrlHelper(A mock for request context with the above mocked, A route collection which has your applications routes registered into it);



Quite a strange an bizarre set of steps, but it's what's required to get around the core implementation within ASP.NET MVC. Maybe they will make it easier to test in the future...



With the above code snippet, I can do the following two lines of code to automatically get a controller with everything mocked correctly (not to mention any interfaces in it's constructor automatically set to an NSubstitute Mock!):



```csharp
var autoMock = AutoMockContainer.Create();
var controller = autoMock.GetController<HomeController>();
```

