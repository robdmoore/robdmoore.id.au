---
id: 132
title: Web application testing
date: 2011-03-12T14:10:06+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=132
permalink: /blog/2011/03/12/web-application-testing/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - convention
  - HTML
  - JavaScript
  - mocking
  - testing
---
This post outlines some of my views about testing web applications, and why automated testing of web applications is important. This post somewhat assumes an MVC pattern, but the same concepts apply if you aren&#8217;t using MVC.
  
<!--more-->

## Testing web applications (an oxymoron?)

Testing web applications is hard; there are all kinds of things to consider both with the testing and the development:

  * Some of the server-side code can only be easily tested by making a HTTP Request e.g. session start, application start, ensuring that any data passed to a view is correct and doesn&#8217;t throw an exception. But this means you need to have the application up and running in a test environment somewhere that your tests know about.
  * HTTP is a stateless protocol, however there is value in having state in a web application (think about shopping carts and logging into a secure area), however if you introduce state to your web application then that might make some of it harder to test since you will either need to mock the state or undergo a series of steps to get the state &#8220;ready&#8221; to test the part of the application you want to test.
  * Testing the UI is difficult &#8211; at what level do you go to; should you test that the HTML produced is exactly correct (difficult, and stupid because you will be changing your tests all the time with tiny tweaks to the UI) or should you look for key elements, or should you not bother at all? What about how the UI looks, it&#8217;s prohibitively hard to test that without image recognition or comparison of CSS (again, difficult and stupid).
  * Testing the JavaScript is difficult since it will often rely on the HTML and JavaScript runs in the browser not on the server-side, so how do you test that?
  * There are a multitude of browsers, operating systems, screen resolutions etc. that people might be using to look at your site
  * Web servers are implicitly multi-threaded so you can potentially have race conditions which are hard to detect and test.

There are other things, but these are the main ones that immediately come to mind at the time of writing.

## What testing actually happens?

When testing of web applications actually takes place (it&#8217;s becoming more common now, but historically most web development probably isn&#8217;t tested other than manual (smoke) testing) it will usually consist of testing the easiest things to test &#8211; namely the business logic and possibly the data retrieval logic. Luckily, these areas are probably the most important to be testing because they are the bits that the client doesn&#8217;t immediately see. Thus, making sure they are correct and don&#8217;t hide obscure bugs that are hard to debug later is good.

## Why is it important to test web apps?

The reason why automated testing is important in general (regression testing, it&#8217;s time-consuming, annoying and probably results in inconsistent coverage to do manual testing only) are equally applicable to web applications (if not more so, as I said above, web apps are complicated!) and this means that it&#8217;s important to try and bridge the gaps and provide testing of the whole application &#8211; database through to UI.

## What tools are out there to help web app testing?

There are bound to be a [whole heap of unit testing frameworks](http://en.wikipedia.org/wiki/List_of_unit_testing_frameworks) for your server-side language &#8211; go searching. If your using .NET I&#8217;d recommend [NUnit](http://www.nunit.org/) or [xUnit](http://xunit.codeplex.com/).

Tools like [QUnit](http://docs.jquery.com/Qunit), [WatiN](http://watin.sourceforge.net/), [Selenium](http://seleniumhq.org/) and the various [BDD](http://dannorth.net/introducing-bdd/) type testing languages / tools (e.g. [Cucumber](http://cukes.info/), [RSpec](http://rspec.info/), [JSpec](http://jspec.info), [JBehave](http://jbehave.org/), [NBehave](http://nbehave.org/), [SpecFlow](http://www.specflow.org/)) go a long way towards reaching the goal of being able to test the whole web application, so I recommend you look into them.

At the moment, it&#8217;s probably prohibitively hard to test the look of the site, and really there isn&#8217;t much point. Either the client will be happy with it or not. And it&#8217;s one of the first things you will find out about if they don&#8217;t like it.

## What do I test?

### RoI

At the end of the day, I think you should perform as much automated testing as possible. In saying that, you need to balance the value of the tests with the cost of writing and maintaining (don&#8217;t forget this!) the tests. **You should ensure your tests have an appropriate return on investment.**

How do you measure this? It&#8217;s hard because it will be mostly subjective. A good pointer is that one line tests to test trivial things are probably worth it since they are easy and quick to write and maintain so it&#8217;s worth it to get the code coverage. Writing 5-10 line tests for trivial things probably isn&#8217;t worth it. Conversely, if you have 5-10 line tests to test complex, customised business logic then it&#8217;s probably a good RoI.

If you find yourself writing the same logic in your tests again and again it&#8217;s time to re-factor; <acronym title="Don't Repeat Yourself">DRY</acronym> applies as much to tests as it does application code &#8211; tests need to be maintainable too otherwise you won&#8217;t update them and then they are useless to you.

### Ok; so what should I test?

This is what my team has decided on this week (we are creating ASP.NET MVC3 web apps and using Autofac, NHibernate, Migrator.NET, NUnit, NSubstitute, QUnit):

<ul type="disc">
  <li>
    Utils / Helpers / Libraries <ul>
      <li>
        Unit test
      </li>
    </ul>
  </li>
  
  <li>
    Model and ViewModel business logic <ul>
      <li>
        Unit test
      </li>
    </ul>
  </li>
  
  <li>
    Controllers <ul>
      <li>
        Unit test with RoI in mind (and work on making trivial testing more terse so we can test with 1 line of code)
      </li>
      <li>
        Integration test (currently investigating getting this for free by running the unit test with non-mocked objects)
      </li>
    </ul>
  </li>
  
  <li>
    Migrations / Nhibernate <ul type="circle">
      <li>
        Use Fluent NHibernate persistence verification
      </li>
    </ul>
  </li>
  
  <li>
    Repositories <ul type="circle">
      <li>
        Use best judgement to choose methods that are more complicated than the standard methods and deserve unit testing
      </li>
    </ul>
  </li>
  
  <li>
    JavaScript <ul type="circle">
      <li>
        Unit test
      </li>
    </ul>
  </li>
  
  <li>
    UI / Specification <ul type="circle">
      <li>
        Investigate Specflow with Selenium or WatiN
      </li>
      <li>
        Investigate integration testing the JavaScript
      </li>
    </ul>
  </li>
  
  <li>
    UAT / Manual <ul>
      <li>
        Get the BA and the client to test user stories when completed to sign them off
      </li>
    </ul>
  </li>
</ul>

## Further reading

  * [Keep stateless Web pages in mind when planning your Web site](http://www.techrepublic.com/article/keep-stateless-web-pages-in-mind-when-planning-your-web-site/5030231)
  * [Web Application Testing: Back to the Drawing Board?](http://www.info-source.us/system_assurance_software_quality_and_testing/Web_Application_Testing.html)