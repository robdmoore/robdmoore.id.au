---
id: 323
title: Type-safe ViewBag use to pass generic view data to views / layouts
date: 2012-07-11T01:45:33+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=323
permalink: /blog/2012/07/11/type-safe-viewbag-use-to-pass-generic-view-data-to-views-layouts/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
---
It seems there are a number of different approaches to passing data (that doesn&#8217;t make sense to put into the view model) to the view in ASP.NET MVC:

  * <http://stackoverflow.com/questions/78548/passing-data-to-master-page-in-asp-net-mvc>
  * <http://stackoverflow.com/questions/6979629/alternative-to-viewbag-title-in-asp-net-mvc-3>
  * <http://www.heartysoft.com/ViewBag-can-be-goode280a6honestly>

## My preferred approach

I think that using the ViewBag is great because syntactically it&#8217;s much terser than ViewData and once you have used it once on a page then you will get intellisense for it. Personally, I think that having a base view model class that you use across your whole site is probably asking for trouble and from a separation of concerns point of view is just plain bad practice.

That&#8217;s one of the reasons why the ViewBag or even ViewData is good &#8211; they are completely separate from the view model so for data that it semantically doesn&#8217;t make sense to in include the view model of the page it&#8217;s the best place to put it.

I will say this with a disclaimer though, I think it&#8217;s important to minimise the amount of data you do pass in this way because otherwise you will get crazy spaghetti code that is hard to test and maintain. I will usually restrict using these data structures to data that I want to pass through to the base site layout. Things like the object representing the currently logged in user (e.g. their name, email address etc.) or a list of JavaScript and / or CSS files that should be included for the current page. **Wherever it&#8217;s possible and it makes sense to put data in the strongly typed view model I think this is the best approach.**

## What I don&#8217;t like about ViewBag

The topic of using dynamics in C# is a pretty heated topic and there is much debate on either side. I think as always a pragmatic approach is required, but where possible I do prefer to avoid dynamics because they aren&#8217;t compile safe. While some people love to argue that it doesn&#8217;t matter and that the compiler is the first in a series of checks that you will perform, coming from an embedded background (I studied Embedded Software Engineering at University), I can&#8217;t help but appreciate and respect type-safety (let alone intellisense, which makes code easier to read/write and thus maintain!) ðŸ™‚

## Type-safe / intellisensed ViewBag access in views

In the interest of providing some consistency and assurance about using the ViewBag there is a technique I have been using for a while now to expose the getting (and setting if from views) of ViewBag properties by wrapping them in properties within the base page class.

In order to do this I simply extend the default base page class (`WebViewPage<T>`) and add relevant properties. I will usually locate this class directly in the Views folder (it semantically makes sense to me). An example implementation might be:

<pre class="brush: csharp; title: ; notranslate" title="">namespace MyWebApp.Views
{
    public abstract class BasePage&lt;T&gt; : WebViewPage&lt;T&gt;
    {
        public User CurrentUser { get { return (User) ViewBag.CurrentUser; } }
        public string Title { get { return (string) ViewBag.Title; } set { ViewBag.Title = value; } }
        public bool HideMenu { get { return (bool)(ViewBag.HideMenu ?? false); } set { ViewBag.HideMenu = value; } }
    }

    public abstract class BasePage : BasePage&lt;dynamic&gt; {}
}</pre>

There are a few things to note here:

  * The classes are abstract because they shouldn&#8217;t be instantiated directly, but rather extended by the Razor engine when compiling each page &#8211; <a href="http://stackoverflow.com/questions/4163545/why-is-webviewpage-in-mvc3-abstract" target="_blank">more info</a>.
  * I provide a non-generic class (BasePage) as well as the generic one (the generic type being the view model type) because otherwise the intellisense in the web.config (see below) file complains. I used to think this was for views that don&#8217;t specify an @model type, but I just tried it and it worked without that class there.
  * The properties that I want the views to set values for have setters &#8211; this ensures that views can only set the correct type of value into the given ViewBag property (making the assumption you use this in preference to direct ViewBag calls in views from now on!).
  * There is a property that I expect to be injected into ViewBag by the controller or a filter so it only has a getter.

Once you have done this then setting / accessing the properties in the view becomes dead simple (and terser than using ViewBag!) as well as giving you wonderful intellisense:

<pre class="brush: csharp; title: ; notranslate" title="">@{
    Title = "My Page Title";
    HideMenu = true;
}
&lt;h1&gt;My page&lt;/h1&gt;
@if (CurrentUser == null)
{
    &lt;p&gt;You aren't logged in&lt;/p&gt;
}
else
{
    &lt;p&gt;@CurrentUser.FirstName is your first name!&lt;/p&gt;
}
</pre>

There is one thing I&#8217;ve missed out, which is <a href="http://develoq.net/2011/how-to-change-base-type-of-razor-view-engine-pages/" target="_blank">to get Razor to compile using this new base page and to get intellisense working you have to either</a>:

  * Use @inherits on every page &#8211; ugh; or
  * Change the pageBaseType attribute in the pages element in the system.web.webPages.razor element in the web.config file in the Views directory to be the class you&#8217;ve created e.g.Â <pages pageBaseType=&#8221;MyWebApp.Views.BasePage&#8221;> (also, feel free to add any common namespaces that you use across your views to the namespaces element and that way you don&#8217;t have to put in an @using statement for those namespaces in the views any more!)

## Injecting information from the controller

One thing that I&#8217;ve noticed some people do with this technique is to return something from DependencyResolver in the properties or use property injection from their dependency injection framework. While I&#8217;m all for unobtrusively setting these properties where possible (e.g. say you have an enumeration with the current environment (test / prod etc.) so you can do simple <a href="http://martinfowler.com/bliki/FeatureToggle.html" target="_blank">feature toggles</a> in your views), it strikes me that it&#8217;s probably not a good idea because it will encourage business logic to be called from within views (e.g. if you decided it would be easier to inject a database repository in one of the properties). I think it&#8217;s way more testable and consistent to have any properties that are set outside of the views to be set from either:

  * The controller &#8211; for instance you might have a base controller (if you rely on the base controller being used across the site it might be worth <a title="Controller instantiation testing" href="http://robdmoore.id.au/blog/2012/05/29/controller-instantiation-testing/" target="_blank">adding tests to check that this is the case</a> [see Other Applications at the bottom of that post])
  * A global filter

## Grouping ViewBag access together

One of the really nice side-effects of this approach (of abstracting ViewBag access to the base page) is that your ViewBag access is now grouped together in the same file so it&#8217;s easy to see at a glance how you are using it. This means you are less likely to let the ViewBag use explode out of control!

## Other applications of a custom base page

The custom base page is a really nice abstraction and opens up a lot of interesting possibilities. One example that I have used it for is to include page-specific CSS and JavaScript files into the <head> of the document by specifying them within each page using functions on the base page. These functions set the JavaScript and CSS files into the ViewBag and then the layout simply uses these when outputting the HTML in <head>. Razor seems to execute the view before the layout hence why this works!

<pre class="brush: csharp; title: ; notranslate" title="">protected void AddScript(string script)
        {
            var localPath = new Regex(@"^w");
            if (localPath.Match(script).Success)
            {
                script = "~/Scripts/" + script;
                if (!script.EndsWith(".js"))
                {
                    script += ".js";
                }
            }

            if (ViewBag.Scripts == null)
            {
                ViewBag.Scripts = new List&lt;string&gt;();
            }

            ViewBag.Scripts.Add(script);
        }

        public void AddStylesheet(string cssFile)
        {
            var localPath = new Regex(@"^w");
            if (localPath.Match(cssFile).Success)
            {
                cssFile = "~/Content/Css/" + cssFile;
                if (!cssFile.EndsWith(".css"))
                {
                    cssFile += ".css";
                }
            }

            if (ViewBag.Stylesheets == null)
            {
                ViewBag.Stylesheets = new List&lt;string&gt;();
            }

            ViewBag.Stylesheets.Add(cssFile);
        }
</pre>

## A note about the current user property in the base page

I illustrated some code above that exposed the current user to the views. To populate this value you probably need a database call and if you are in the situation where you don&#8217;t need to use the CurrentUser property on every page it makes sense to lazy load the value so you don&#8217;t take an unnecessary hit to the database on every request. One approach I&#8217;ve used in the past to combat this is to expose CurrentUser in the ViewBag as a functor rather than a straight object value, e.g.:

<pre class="brush: csharp; title: ; notranslate" title="">public abstract class BaseController : Controller
    {
        private readonly IUserRepository _userRepository;
        private User _currentUser;

        public User CurrentUser
        {
            get { return _currentUser ?? (_currentUser = GetCurrentUser()); }
        }

        protected BaseController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
            Func&lt;User&gt; userGetter = () =&gt; CurrentUser;
            ViewBag.CurrentUser = userGetter;
        }

        private User GetCurrentUser()
        {
            return ControllerContext.HttpContext.User.Identity.IsAuthenticated
               ? _userRepository.Get(HttpContext.User.Identity.Name)
               : null;
        }
    }
...

    public abstract class BasePage&lt;T&gt; : WebViewPage&lt;T&gt;
    {
        protected User CurrentUser
        {
            get
            {
                return ViewBag.CurrentUser != null ? ViewBag.CurrentUser() : null;
            }
        }
    }
</pre>