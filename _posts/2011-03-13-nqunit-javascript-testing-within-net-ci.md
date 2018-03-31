---
layout: post
title: 'NQUnit: JavaScript testing within .NET / CI'
date: 2011-03-13 12:54:49.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- JavaScript
- jQuery
- NuGet
- QUnit
- ReSharper
- testing
author: rob
---


[QUnit](http://docs.jquery.com/Qunit) is an awesome unit testing framework for JavaScript that is written by the [jQuery](http://jquery.com/) team for unit testing jQuery.



This post describes a package I created to be able to run QUnit testing from within any .NET testing framework, and thus also from continuous integration servers.  
<!--more-->


## Automated JavaScript testing is hard


The main difficulty with automated testing of JavaScript, [as I alluded to in my previous post](/blog/2011/03/12/web-application-testing/ "Web application testing") (Wow, Wordpress is cool these days; I was able to create that link without opening another tab to find the URL), is that there is a reliance of having a web browser instance open to do the testing (especially if the JavaScript has any integration with the DOM). This isn't a trivial thing to test in an automated way, although there are [some](http://swarm.jquery.org/) [things](http://code.google.com/p/js-test-driver/) [out](http://watin.sourceforge.net/) [there](http://seleniumhq.org/) that go some way in addressing that issue.


## Automated JavaScript testing inside your server-side testing framework is good


If you manage to achieve the difficult task of getting your JavaScript unit tests to run and return results within the context of your server-side testing framework then that is a huge win. I think it's a win because it means you can run all of the tests for your application within the same context resulting in:


- Better efficiency for doing your testing
- More likelihood you will actually run your JavaScript unit tests regularly since it's convenient to do so
- You get continuous integration for free if you already have a <abbr title="Continuous Integration">CI</abbr> server set up.



That last point is important - this means you get continual regression testing of your JavaScript, and if multiple people are working on the same JavaScript then you get notification as soon as a bug is introduced as a side-effect of integrating the code.


## Introducing NQUnit for .NET


[Joshua Flanagan](http://www.lostechies.com/blogs/joshuaflanagan/archive/2008/09/18/running-jquery-qunit-tests-under-continuous-integration.aspx) did some great work in 2008 to get QUnit JavaScript tests working within NUnit and consequently within the CI server he was using. He did this by firing up a web browser session using WatiN and parsing the resultant HTML to find metadata about the tests. He then presented each test to NUnit as a separate test using the IterativeTest extension.



I tried out his code, but unfortunately it didn't work - both NUnit and WatiN have had newer versions come out that broke his code and I couldn't find a version of IterativeTest that worked with the latest version of NUnit. Consequently, I modified Josh's code to create something that worked and have now released that effort as a [NuGet package](http://nuget.org/List/Packages/NQUnit) called NQUnit. I've [released the code](https://github.com/robdmoore/NQUnit) via Github with an MIT license.


## Using NQUnit


The NQUnit package itself is simply a DLL that provides an NQUnit namespace. The main method you are likely to call is the static method NQUnit.GetTests, which has the following signature:



```csharp
public static IEnumerable<QUnitTest> GetTests(params string[] filesToTest)
```



> Member of NQUnit.NQUnit
> 
> 
> 
> **Summary:**  
> Returns an array of QUnitTest objects that encapsulate the QUnit tests within the passed in files to test.
> 
> 
> 
> **Parameters:**  
> filesToTest: A list of one or more files to run tests on relative to the root of the test project.
> 
> 
> 
> **Returns:**  
> An array of QUnitTest objects encapsulating the QUnit tests in the given files



By passing in one or more URIs to test HTML files it will fire up an instance of Internet Explorer, navigate to each of the files, run the QUnit test(s) on that page and parse the results. For each test that was run it will return an instance of a QUnitTest object in an array. This static method wraps around the QUnitParser class and provides STA threading (so you don't need to set the whole assembly as needing STA) so WatiN works. It also will catch any exceptions that occurred while running / parsing the tests and will return a single QUnitTest object with the InitializationException parameter set if any exceptions occurred. This was necessary because when integrating with NUnit (see below) it didn't provide any useful information when an exception was thrown from within the TestCaseSource attribute.



The QUnitTest object definition is:



```csharp
    /// <summary>
    /// Encapsulates the information about a QUnit test, including the pass or fail status.
    /// </summary>
    public class QUnitTest
    {
        /// <summary>
        /// The file name the QUnit test was run from.
        /// </summary>
        public string FileName { get; set; }
        /// <summary>
        /// The name of the test.
        /// </summary>
        public string TestName { get; set; }
        /// <summary>
        /// The result of the test ("pass" or "fail").
        /// </summary>
        public string Result { get; set; }
        /// <summary>
        /// If the test failed this contains more information explaining why.
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// Will be thrown if there was a problem initializing the QUnit test.
        /// </summary>
        public Exception InitializationException { get; set; }
        /// <summary>
        /// Provides a concise string representation of the test so that unit testing libraries can show a reasonable description of the test.
        /// </summary>
        /// <returns>A concise string representation of the test</returns>
        public override string ToString()
        {
            return string.Format("[{0}] {1}", FileName, TestName);
        }
    }
```



After calling the static NQUnit.GetTests method you can do what you like with the QUnitTest objects (e.g. integrate them with the testing framework of your choice).


## NQUnit.NUnit


The testing framework that I use is NUnit (although I've been eyeing off xUnit of late - I love the way they did setup, teardown and fixture setup/teardown - really semantic). Because of this, I've developed a second NuGet package called [NQUnit.NUnit](http://nuget.org/List/Packages/NQUnit.NUnit) that has code to integrate each QUnitTest object as provided from NQUnit into a separate NUnit test. The NQUnit.NUnit package has no DLLs associated with it, but will insert a heap of content files into your project, namely:


- JavaScriptTests/NQUnit/NUnitQUnit.cs - An extension method to the QUnitTest object so you can call .ShouldPass() on the QUnitTest objects to perform an NUnit assertion. At this point the InitializationException parameter I mentioned above is rethrown if it is not null.
- JavaScriptTests/NQUnit/QUnitTests.cs - The class with the actual NUnit tests; in order to make it really convenient to add tests it will automatically supply any .html files within the JavaScriptTests folder to NQUnit to run. The tests are provided to NUnit using the TestCaseSource attribute:  
    ```csharp
    [TestFixture]
    public class QUnitTests
    {
        [Test, TestCaseSource("GetQUnitTests")]
        public void Test(QUnitTest test)
        {
            test.ShouldPass();
        }
        public IEnumerable<QUnitTest> GetQUnitTests()
        {
            var testsDirectory = Path.Combine(Environment.CurrentDirectory, "JavaScriptTests");
            return global::NQUnit.NQUnit.GetTests(Directory.GetFiles(testsDirectory, "*.html"));
        }
    }
```
- JavaScriptTests/Scripts/\* - A range of JavaScript files that can be included by the .html files to do the testing; I included:
  - [jQuery 1.4.4](http://jquery.com/)
  - [jQuery Mockjax](https://github.com/appendto/jquery-mockjax) (for mocking AJAX requests; note: I made a couple of mods to make it so AJAX mocks are synchronous if you specify a response time of 0 so it can be used within specit (which doesn't have an equivalent to asyncTest at the moment), but I'll send a pull request to the author so the changes may become part of the core code)
  - [JSON2](http://www.json.org/js.html) (to parse objects into JSON strings)
  - [QUnit](http://docs.jquery.com/Qunit)
  - [specit](https://github.com/joshuaclayton/specit) (provides nice [RSpec](http://rspec.info/) style syntax, while wrapping around QUnit; again: I made a couple of mods, this time to fix IE problems, but I've sent a pull request).
- JavaScriptTests/blank.html - A sample HTML file to use to create your tests with; It's a normal QUnit HTML file with one exception - in order to get IE to run the JavaScript from the local file system I added a [Mark of the Web](http://www.helpstuff.com/motw.html) at the top of the file.
- JavaScriptTests/blank.js - A sample JavaScript file to put the actual QUnit tests in.


## Getting NQUnit.NUnit working


Unfortunately, after installing the NQUnit.NUnit package from NuGet you won't be up and running straight away because you need to make two changes:


- Change the Interop.SHDocVw DLL that was added to your project References so Embed Interop Types is set to False and Copy Local is set to true. Otherwise you will get:  


> System.IO.FileNotFoundException : Could not load file or assembly 'Interop.SHDocVw, Version=1.1.0.0, Culture=neutral, PublicKeyToken=db7cfd3acb5ad44e' or one of its dependencies. The system cannot find the file specified.
- Set all of the files within JavaScriptTests/Scripts and the blank.html and blank.js files to Copy Local: Copy is newer, otherwise the test won't be able to find the files. I might work on a powershell script to get that automatically happening when you install in the NuGet package, but in the meantime you will need to do that manually.


## Compatibility


I should note that the ReSharper test runner is not smart enough to separate out the different tests so it will only return error information for the last test that failed. The NUnit and Test-driven.NET test runners understand the tests. I have tested this on [TeamCity](http://www.jetbrains.com/teamcity/) successfully; you do need to ensure that TeamCity can [interact with the desktop](http://stackoverflow.com/questions/488443/running-watin-on-teamcity/3415992#3415992) to be able to open an IE instance though.


## Integrating with a web project


Your QUnit tests will likely be testing files in a separate (web) project within your solution. In order to get the tests to run against the latest version of the files without having to manually copy them you can add a post-build event to the test project, e.g.:



> copy "$(ProjectDir)..SampleWebAppScripts" "$(TargetDir)JavaScriptTestsScripts"



Where SampleWebApp is the name of your web project. To see this working in practice [clone my github repository](https://github.com/robdmoore/NQUnit) and check it out. That also shows an example of using the SpecIt syntax for the tests.


## Any questions / problems?


Feel free to leave a comment here or raise an issue on the [Git hub project page](https://github.com/robdmoore/NQUnit).

