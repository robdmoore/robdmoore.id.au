---
id: 32
title: Unobtrusive AJAX with ASP.NET MVC
date: 2011-01-28T00:18:44+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=32
permalink: /blog/2011/01/28/unobtrusive-ajax-with-asp-net-mvc/
categories:
  - Technical
tags:
  - AJAX
  - ASP.NET MVC
  - 'C#'
  - JavaScript
  - jQuery
  - unobtrusive coding
---
So you&#8217;ve created this application using ASP.NET MVC and you want to create a JavaScript interface of some/all the functionality using <acronym title="Asynchronous JavaScript and XML">AJAX</acronym>. How do you do it without rewriting any code?
  
<!--more-->

Easy &#8211; by using Attributes! Consider the following:

<pre class="brush: csharp; title: ; notranslate" title="">public class ReturnJsonForAjaxRequests : ActionFilterAttribute
    {
        public bool FollowRedirects = true;

        public static Func&lt;HttpRequestBase&gt; Request = () =&gt; new HttpRequestWrapper(HttpContext.Current.Request);

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (!Request().IsAjaxRequest())
            {
                return;
            }

            var viewResult = filterContext.Result as ViewResult;
            var c = filterContext.Controller as Controller;

            if(viewResult != null)
            {
                filterContext.Result = c.JSon(viewResult.Model);
                return;
            }

            if (!FollowRedirects)
            {
                var routeResult = filterContext.Result as RedirectToRouteResult;
                if (routeResult != null)
                {
                    routeResult.RouteValues.Add("routeName", routeResult.RouteName);
                    filterContext.Result = c.JSon(routeResult.RouteValues);
                    return;
                }

                var redirectResult = filterContext.Result as RedirectResult;
                if (redirectResult != null)
                {
                    filterContext.Result = c.JSon(new { RedirectUrl = redirectResult.Url });
                    return;
                }
            }
        }
    }
</pre>

This allows you to do something like:

<pre class="brush: csharp; title: ; notranslate" title="">[ReturnJsonForAjaxRequests]
        public ActionResult Validate(SomeModel model)
        {
            // My controller action ...
        }
</pre>

This way if the request for `Validate` occurs normally then whatever view or redirect is returned from `Validate` will be executed. Alternatively, if an AJAX request is made to the route that calls `Validate` then:

  * A <acronym title="JavaScript Object Notation">JSON</acronym> object representing the model passed into the view that is returned from `Validate` is returned
  * If `Validate` doesn&#8217;t return a view then the AJAX request will follow the redirect(s) given and then return the JSON representation of the model given to the final view that is rendered after all redirects (assuming this attribute has been used for the relevant controller action)
  * If `Validate` doesn&#8217;t return a view and the FollowRedirects option is set to false (i.e. `[ReturnJsonForAjaxRequests(FollowRedirects = false)]`) then a JSON representation of the redirect is given instead

For those of you that have jumped the gun and already ran the code or who are cluey enough to have noticed, there is something missing from the above code snippet; the `JSon` method for the Controller class. The following is my implementation for it (using the wonders of <a href="http://en.wikipedia.org/wiki/Extension_method" target="_blank">Extension methods</a>):

<pre class="brush: csharp; title: ; notranslate" title="">public static class ControllerExtensions
    {
        public static ActionResult JSon(this Controller controller, object model)
        {
            var modelStateErrors = controller.ModelState.Keys.SelectMany(key =&gt; controller.ModelState[key].Errors);
            var data = new JsonResponse&lt;object&gt; {Data = model, Success = controller.ModelState.IsValid ? "true" : "false", Errors = new string[modelStateErrors.Count()]};
            var i = 0;
            foreach (var error in modelStateErrors)
            {
                data.Errors[i++] = string.IsNullOrEmpty(error.ErrorMessage) ? error.Exception.ToString() : error.ErrorMessage;
            }
            return new JsonResult {Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet};
        }
    }

    public class JsonResponse&lt;T&gt;
    {
        public string[] Errors { get; set; }

        public string Success { get; set; }

        public T Data { get; set; }
    }
</pre>

What this basically does is returns a `JsonResult` of the data, which is an MVC `ActionResult` that will automatically encode the given data into JSON format and give the correct HTTP headers to serve up JSON.

What it actually does is a little bit more nuanced than that in that is returns the data wrapped up in a `JsonResponse` rather than the data directly. This has a flag indicating the success of getting the data / performing the operation that was requested, an array of any errors that occurred if success is set to `"false"` and the data itself.

Wrapping the data into this structure provides some consistency in your error feedback to JavaScript and allows a nice wrapper method in JavaScript like so (note: uses jQuery):

<pre class="brush: jscript; title: ; notranslate" title="">var ajax = function (type, route, data, successCallback, unsuccessfulCallback, resultIsDictionary, errorCallback) {
	if (typeof (errorCallback) === "undefined") {
		errorCallback = defaultErrorCallback;
	}
	if (typeof (resultIsDictionary) === "undefined") {
		resultIsDictionary = false;
	}
	$.ajax({
		type: type,
		data: data,
		dataType: "json",
		error: errorCallback,
		success: function (data) {
			if (data.Success == "true") {
				successCallback(resultIsDictionary ? dictionaryToObject(data.Data) : data.Data);
			} else {
				unsuccessfulCallback(data.Errors, resultIsDictionary ? dictionaryToObject(data.Data) : data.Data);
			}
		},
		url: getRoute(route)
	});
};
</pre>

There are a few extra features in there that aren&#8217;t strictly necessary:

  * `defaultErrorCallback`: You can set that variable to a default function that should be called if a server error (e.g. 404, 500) occurred when the AJAX request was made
  * `resultIsDictionary`: You can set this to true to automatically transform the returned data to a plain old object if you know that .NET will be serialising a dictionary (using, for instance, the following function): <pre class="brush: jscript; title: ; notranslate" title="">var dictionaryToObject = function (dictionary) {
	var object = {};
	for (var i = 0; i &lt; dictionary.length; i++) {
		object[dictionary[i].Key] = dictionary[i].Value;
	}
	return object;
};
</pre>

  * `getRoute(route)`: I decided to define a table of routes and corresponding URLs in the JavaScript so the URLs are defined in one place, e.g.: <pre class="brush: jscript; title: ; notranslate" title="">// Outputted from C# in &lt;head&gt; before any JS includes; uses Razor syntax
	&lt;script type="text/javascript"&gt;
	&lt;!--
		var MyApplication = {basePath: "@Url.Content("~/")"};
	--&gt;
	&lt;/script&gt;
// Somewhere in a JS file
var routes = {
	validate: "~/MyController/Validate",
	create: "~/MyController/Create"
};
var getRoute = function (route) {
	return routes[route].replace(/^~//, MyApplication.basePath);
};
</pre>

It should be noted that the determination of whether or not the data collection was successful and the source of any error messages is done using `ModelState` (although you are likely using this anyway within your controller to get all the great built-in error handling within MVC).

Finally, a quick note about `public static Func Request = () => new HttpRequestWrapper(HttpContext.Current.Request);`; by using a static variable it&#8217;s easy to set it to something else (e.g. a Mock object) when unit testing, however it needs to return the current request which is request scoped rather than application scoped (like a static property), hence the need for the lambda. For more information, see <a href="http://weblogs.asp.net/imranbaloch/archive/2010/05/23/behind-asp-net-mvc-mock-objects.aspx" target="_blank">Behind ASP.NET MVC Mock Objects</a>.

The following is a code snippet on how we set up the mock object to pretend to be an AJAX request (note: uses NUnit / Rhino.Mocks):

<pre class="brush: csharp; title: ; notranslate" title="">class ReturnJsonForAjaxRequestsFilterShould
    {
        private HttpRequestBase _request;
        private ReturnJsonForAjaxRequests _filter;
        private ActionExecutedContext _actionExecutedContext;

        [SetUp]
        public void SetUp()
        {
            _request = MockRepository.GenerateStub&lt;HttpRequestBase&gt;();
            ReturnJsonForAjaxRequests.Request = () =&gt; _request;

            _filter = new ReturnJsonForAjaxRequests();
            _actionExecutedContext = new ActionExecutedContext
                {
                    Controller = MockRepository.GenerateStub&lt;Controller&gt;()
                };
        }

        [Test]
        public void Change_View_ToJsonResult_If_IsAjaxRequest()
        {
            // Arrange
            _request.Stub(r =&gt; r["X-Requested-With"]).Return("XMLHttpRequest");
            _actionExecutedContext.Result = new ViewResult();

            // Act
            _filter.OnActionExecuted(_actionExecutedContext);

            // Assert
            _actionExecutedContext.Result.AssertResultIs&lt;JsonResult&gt;();
        }
        ...
    }
</pre>