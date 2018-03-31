---
layout: post
title: Web application testing
date: 2011-03-12 14:10:06.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- convention
- HTML
- JavaScript
- mocking
- testing
author: rob
---


This post outlines some of my views about testing web applications, and why automated testing of web applications is important. This post somewhat assumes an <abbr title="Model-View-Controller">MVC</abbr> pattern, but the same concepts apply if you aren't using MVC.  
<!--more-->


## Testing web applications (an oxymoron?)


Testing web applications is hard; there are all kinds of things to consider both with the testing and the development:


- Some of the server-side code can only be easily tested by making a <abbr title="Hyper-text Transfer Protocol">HTTP</abbr> Request e.g. session start, application start, ensuring that any data passed to a view is correct and doesn't throw an exception. But this means you need to have the application up and running in a test environment somewhere that your tests know about.
- HTTP is a stateless protocol, however there is value in having state in a web application (think about shopping carts and logging into a secure area), however if you introduce state to your web application then that might make some of it harder to test since you will either need to mock the state or undergo a series of steps to get the state "ready" to test the part of the application you want to test.
- Testing the <abbr title="User Interface">UI</abbr> is difficult - at what level do you go to; should you test that the <abbr title="HyperText Markup Language">HTML</abbr> produced is exactly correct (difficult, and stupid because you will be changing your tests all the time with tiny tweaks to the UI) or should you look for key elements, or should you not bother at all? What about how the UI looks, it's prohibitively hard to test that without image recognition or comparison of <abbr title="Cascading Style Sheets">CSS</abbr> (again, difficult and stupid).
- Testing the JavaScript is difficult since it will often rely on the HTML and JavaScript runs in the browser not on the server-side, so how do you test that?
- There are a multitude of browsers, operating systems, screen resolutions etc. that people might be using to look at your site
- Web servers are implicitly multi-threaded so you can potentially have race conditions which are hard to detect and test.



There are other things, but these are the main ones that immediately come to mind at the time of writing.


## What testing actually happens?


When testing of web applications actually takes place (it's becoming more common now, but historically most web development probably isn't tested other than manual (smoke) testing) it will usually consist of testing the easiest things to test - namely the business logic and possibly the data retrieval logic. Luckily, these areas are probably the most important to be testing because they are the bits that the client doesn't immediately see. Thus, making sure they are correct and don't hide obscure bugs that are hard to debug later is good.


## Why is it important to test web apps?


The reason why automated testing is important in general (regression testing, it's time-consuming, annoying and probably results in inconsistent coverage to do manual testing only) are equally applicable to web applications (if not more so, as I said above, web apps are complicated!) and this means that it's important to try and bridge the gaps and provide testing of the whole application - database through to UI.


## What tools are out there to help web app testing?


There are bound to be a [whole heap of unit testing frameworks](http://en.wikipedia.org/wiki/List_of_unit_testing_frameworks) for your server-side language - go searching. If your using .NET I'd recommend [NUnit](http://www.nunit.org/) or [xUnit](http://xunit.codeplex.com/).



Tools like [QUnit](http://docs.jquery.com/Qunit), [WatiN](http://watin.sourceforge.net/), [Selenium](http://seleniumhq.org/) and the various [BDD](http://dannorth.net/introducing-bdd/) type testing languages / tools (e.g. [Cucumber](http://cukes.info/), [RSpec](http://rspec.info/), [JSpec](http://jspec.info), [JBehave](http://jbehave.org/), [NBehave](http://nbehave.org/), [SpecFlow](http://www.specflow.org/)) go a long way towards reaching the goal of being able to test the whole web application, so I recommend you look into them.



At the moment, it's probably prohibitively hard to test the look of the site, and really there isn't much point. Either the client will be happy with it or not. And it's one of the first things you will find out about if they don't like it.


## What do I test?

### <abbr title="Return on Investment">RoI</abbr>


At the end of the day, I think you should perform as much automated testing as possible. In saying that, you need to balance the value of the tests with the cost of writing and maintaining (don't forget this!) the tests. **You should ensure your tests have an appropriate return on investment.**



How do you measure this? It's hard because it will be mostly subjective. A good pointer is that one line tests to test trivial things are probably worth it since they are easy and quick to write and maintain so it's worth it to get the code coverage. Writing 5-10 line tests for trivial things probably isn't worth it. Conversely, if you have 5-10 line tests to test complex, customised business logic then it's probably a good RoI.



If you find yourself writing the same logic in your tests again and again it's time to re-factor; <acronym title="Don't Repeat Yourself">DRY</acronym> applies as much to tests as it does application code - tests need to be maintainable too otherwise you won't update them and then they are useless to you.


### Ok; so what should I test?


This is what my team has decided on this week (we are creating ASP.NET MVC3 web apps and using Autofac, NHibernate, Migrator.NET, NUnit, NSubstitute, QUnit):


- Utils / Helpers /      Libraries
  - Unit test
- Model and ViewModel      business logic
  - Unit test
- Controllers
  - Unit test with RoI in mind (and work on making trivial testing more terse so we can test with 1 line of code)
  - Integration test (currently investigating getting this for free by running the unit test with non-mocked objects)
- Migrations / Nhibernate
  - Use Fluent NHibernate       persistence verification
- Repositories
  - Use best judgement to choose       methods that are more complicated than the standard methods and deserve       unit testing
- JavaScript
  - Unit test
- UI / Specification
  - Investigate Specflow with       Selenium or WatiN
  - Investigate integration        testing the JavaScript
- UAT / Manual
  - Get the BA and the client to test user stories when completed to sign them off


## Further reading

- [Keep stateless Web pages in mind when planning your Web site](http://www.techrepublic.com/article/keep-stateless-web-pages-in-mind-when-planning-your-web-site/5030231)
- [Web Application Testing: Back to the Drawing Board?](http://www.info-source.us/system_assurance_software_quality_and_testing/Web_Application_Testing.html)

