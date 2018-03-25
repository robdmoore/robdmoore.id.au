---
id: 140
title: 'NQUnit: JavaScript testing within .NET / CI'
date: 2011-03-13T12:54:49+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=140
permalink: /blog/2011/03/13/nqunit-javascript-testing-within-net-ci/
categories:
  - Technical
tags:
  - 'C#'
  - JavaScript
  - jQuery
  - NuGet
  - QUnit
  - ReSharper
  - testing
---
[QUnit](http://docs.jquery.com/Qunit) is an awesome unit testing framework for JavaScript that is written by the [jQuery](http://jquery.com/) team for unit testing jQuery.

This post describes a package I created to be able to run QUnit testing from within any .NET testing framework, and thus also from continuous integration servers.
  
<!--more-->

## Automated JavaScript testing is hard

The main difficulty with automated testing of JavaScript, [as I alluded to in my previous post](http://robdmoore.id.au/blog/2011/03/12/web-application-testing/ "Web application testing") (Wow, WordPress is cool these days; I was able to create that link without opening another tab to find the URL), is that there is a reliance of having a web browser instance open to do the testing (especially if the JavaScript has any integration with the DOM). This isn&#8217;t a trivial thing to test in an automated way, although there are [some](http://swarm.jquery.org/) [things](http://code.google.com/p/js-test-driver/) [out](http://watin.sourceforge.net/) [there](http://seleniumhq.org/) that go some way in addressing that issue.

## Automated JavaScript testing inside your server-side testing framework is good

If you manage to achieve the difficult task of getting your JavaScript unit tests to run and return results within the context of your server-side testing framework then that is a huge win. I think it&#8217;s a win because it means you can run all of the tests for your application within the same context resulting in:

  * Better efficiency for doing your testing
  * More likelihood you will actually run your JavaScript unit tests regularly since it&#8217;s convenient to do so
  * You get continuous integration for free if you already have a CI server set up.

That last point is important &#8211; this means you get continual regression testing of your JavaScript, and if multiple people are working on the same JavaScript then you get notification as soon as a bug is introduced as a side-effect of integrating the code.

## Introducing NQUnit for .NET

[Joshua Flanagan](http://www.lostechies.com/blogs/joshuaflanagan/archive/2008/09/18/running-jquery-qunit-tests-under-continuous-integration.aspx) did some great work in 2008 to get QUnit JavaScript tests working within NUnit and consequently within the CI server he was using. He did this by firing up a web browser session using WatiN and parsing the resultant HTML to find metadata about the tests. He then presented each test to NUnit as a separate test using the IterativeTest extension.

I tried out his code, but unfortunately it didn&#8217;t work &#8211; both NUnit and WatiN have had newer versions come out that broke his code and I couldn&#8217;t find a version of IterativeTest that worked with the latest version of NUnit. Consequently, I modified Josh&#8217;s code to create something that worked and have now released that effort as a [NuGet package](http://nuget.org/List/Packages/NQUnit) called NQUnit. I&#8217;ve [released the code](https://github.com/robdmoore/NQUnit) via Github with an MIT license.

## Using NQUnit

The NQUnit package itself is simply a DLL that provides an NQUnit namespace. The main method you are likely to call is the static method NQUnit.GetTests, which has the following signature:

<pre class="brush: csharp; title: ; notranslate" title="">public static IEnumerable&lt;QUnitTest&gt; GetTests(params string[] filesToTest)
</pre>

> Member of NQUnit.NQUnit
> 
> **Summary:**
  
> Returns an array of QUnitTest objects that encapsulate the QUnit tests within the passed in files to test.
> 
> **Parameters:**
  
> filesToTest: A list of one or more files to run tests on relative to the root of the test project.
> 
> **Returns:**
  
> An array of QUnitTest objects encapsulating the QUnit tests in the given files

By passing in one or more URIs to test HTML files it will fire up an instance of Internet Explorer, navigate to each of the files, run the QUnit test(s) on that page and parse the results. For each test that was run it will return an instance of a QUnitTest object in an array. This static method wraps around the QUnitParser class and provides STA threading (so you don&#8217;t need to set the whole assembly as needing STA) so WatiN works. It also will catch any exceptions that occurred while running / parsing the tests and will return a single QUnitTest object with the InitializationException parameter set if any exceptions occurred. This was necessary because when integrating with NUnit (see below) it didn&#8217;t provide any useful information when an exception was thrown from within the TestCaseSource attribute.

The QUnitTest object definition is:

<pre class="brush: csharp; title: ; notranslate" title="">/// &lt;summary&gt;
    /// Encapsulates the information about a QUnit test, including the pass or fail status.
    /// &lt;/summary&gt;
    public class QUnitTest
    {
        /// &lt;summary&gt;
        /// The file name the QUnit test was run from.
        /// &lt;/summary&gt;
        public string FileName { get; set; }

        /// &lt;summary&gt;
        /// The name of the test.
        /// &lt;/summary&gt;
        public string TestName { get; set; }

        /// &lt;summary&gt;
        /// The result of the test ("pass" or "fail").
        /// &lt;/summary&gt;
        public string Result { get; set; }

        /// &lt;summary&gt;
        /// If the test failed this contains more information explaining why.
        /// &lt;/summary&gt;
        public string Message { get; set; }

        /// &lt;summary&gt;
        /// Will be thrown if there was a problem initializing the QUnit test.
        /// &lt;/summary&gt;
        public Exception InitializationException { get; set; }

        /// &lt;summary&gt;
        /// Provides a concise string representation of the test so that unit testing libraries can show a reasonable description of the test.
        /// &lt;/summary&gt;
        /// &lt;returns&gt;A concise string representation of the test&lt;/returns&gt;
        public override string ToString()
        {
            return string.Format("[{0}] {1}", FileName, TestName);
        }
    }
</pre>

After calling the static NQUnit.GetTests method you can do what you like with the QUnitTest objects (e.g. integrate them with the testing framework of your choice).

## NQUnit.NUnit

The testing framework that I use is NUnit (although I&#8217;ve been eyeing off xUnit of late &#8211; I love the way they did setup, teardown and fixture setup/teardown &#8211; really semantic). Because of this, I&#8217;ve developed a second NuGet package called [NQUnit.NUnit](http://nuget.org/List/Packages/NQUnit.NUnit) that has code to integrate each QUnitTest object as provided from NQUnit into a separate NUnit test. The NQUnit.NUnit package has no DLLs associated with it, but will insert a heap of content files into your project, namely:

  * JavaScriptTests/NQUnit/NUnitQUnit.cs &#8211; An extension method to the QUnitTest object so you can call .ShouldPass() on the QUnitTest objects to perform an NUnit assertion. At this point the InitializationException parameter I mentioned above is rethrown if it is not null.
  * JavaScriptTests/NQUnit/QUnitTests.cs &#8211; The class with the actual NUnit tests; in order to make it really convenient to add tests it will automatically supply any .html files within the JavaScriptTests folder to NQUnit to run. The tests are provided to NUnit using the TestCaseSource attribute: <pre class="brush: csharp; title: ; notranslate" title="">[TestFixture]
    public class QUnitTests
    {
        [Test, TestCaseSource("GetQUnitTests")]
        public void Test(QUnitTest test)
        {
            test.ShouldPass();
        }

        public IEnumerable&lt;QUnitTest&gt; GetQUnitTests()
        {
            var testsDirectory = Path.Combine(Environment.CurrentDirectory, "JavaScriptTests");
            return global::NQUnit.NQUnit.GetTests(Directory.GetFiles(testsDirectory, "*.html"));
        }
    }
</pre>

  * JavaScriptTests/Scripts/* &#8211; A range of JavaScript files that can be included by the .html files to do the testing; I included: 
      * [jQuery 1.4.4](http://jquery.com/)
      * [jQuery Mockjax](https://github.com/appendto/jquery-mockjax) (for mocking AJAX requests; note: I made a couple of mods to make it so AJAX mocks are synchronous if you specify a response time of 0 so it can be used within specit (which doesn&#8217;t have an equivalent to asyncTest at the moment), but I&#8217;ll send a pull request to the author so the changes may become part of the core code)
      * [JSON2](http://www.json.org/js.html) (to parse objects into JSON strings)
      * [QUnit](http://docs.jquery.com/Qunit)
      * [specit](https://github.com/joshuaclayton/specit) (provides nice [RSpec](http://rspec.info/) style syntax, while wrapping around QUnit; again: I made a couple of mods, this time to fix IE problems, but I&#8217;ve sent a pull request).
  * JavaScriptTests/blank.html &#8211; A sample HTML file to use to create your tests with; It&#8217;s a normal QUnit HTML file with one exception &#8211; in order to get IE to run the JavaScript from the local file system I added a [Mark of the Web](http://www.helpstuff.com/motw.html) at the top of the file.
  * JavaScriptTests/blank.js &#8211; A sample JavaScript file to put the actual QUnit tests in.

## Getting NQUnit.NUnit working

Unfortunately, after installing the NQUnit.NUnit package from NuGet you won&#8217;t be up and running straight away because you need to make two changes:

  * Change the Interop.SHDocVw DLL that was added to your project References so Embed Interop Types is set to False and Copy Local is set to true. Otherwise you will get:
  
    > System.IO.FileNotFoundException : Could not load file or assembly &#8216;Interop.SHDocVw, Version=1.1.0.0, Culture=neutral, PublicKeyToken=db7cfd3acb5ad44e&#8217; or one of its dependencies. The system cannot find the file specified.

  * Set all of the files within JavaScriptTests/Scripts and the blank.html and blank.js files to Copy Local: Copy is newer, otherwise the test won&#8217;t be able to find the files. I might work on a powershell script to get that automatically happening when you install in the NuGet package, but in the meantime you will need to do that manually.

## Compatibility

I should note that the ReSharper test runner is not smart enough to separate out the different tests so it will only return error information for the last test that failed. The NUnit and Test-driven.NET test runners understand the tests. I have tested this on [TeamCity](http://www.jetbrains.com/teamcity/) successfully; you do need to ensure that TeamCity can [interact with the desktop](http://stackoverflow.com/questions/488443/running-watin-on-teamcity/3415992#3415992) to be able to open an IE instance though.

## Integrating with a web project

Your QUnit tests will likely be testing files in a separate (web) project within your solution. In order to get the tests to run against the latest version of the files without having to manually copy them you can add a post-build event to the test project, e.g.:

> copy &#8220;$(ProjectDir)..SampleWebAppScripts&#8221; &#8220;$(TargetDir)JavaScriptTestsScripts&#8221;

Where SampleWebApp is the name of your web project. To see this working in practice [clone my github repository](https://github.com/robdmoore/NQUnit) and check it out. That also shows an example of using the SpecIt syntax for the tests.

## Any questions / problems?

Feel free to leave a comment here or raise an issue on the [Git hub project page](https://github.com/robdmoore/NQUnit).