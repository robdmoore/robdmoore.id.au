---
id: 791
title: TestStack.Seleno 0.4 released
date: 2013-03-24T22:16:10+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=791
permalink: /blog/2013/03/24/teststack-seleno-0-4-released/
categories:
  - Technical
tags:
  - 'C#'
  - TeamCity
  - testing
  - TestStack
---
Lately I&#8217;ve been spending a fair bit of spare time working hard on getting the TestStack.Seleno project ready for a (rather massive!) 0.4 release. It&#8217;s been a lot of fun and I&#8217;m quite proud of the impact the core TestStack team and other contributors have made on the library. We feel that it is &#8220;production ready&#8221; now and will be moving towards a 1.0 release in the somewhat near future.

I won&#8217;t bother going into a huge amount of detail on the release because <a href="http://michael-whelan.net/seleno-04" target="_blank">Michael Whelan has done that already</a>, but I&#8217;ll list down the major changes here as a tl;dr:

  * Added a bunch of global configuration options: 
      * <span style="line-height: 1.714285714; font-size: 1rem;">Ability to specify a Castle.Core logger factory to intercept our internal logging</span>
      * Ability to more easily specify a non-Firefox web browser
      * Ability to specify a deployed web application out-of-the-box
      * Ability to more explicitly specify your MVC routes
      * Ability to override theÂ [minimum (implicit) wait timeout inside of Selenium](http://blog.mozilla.org/webqa/2012/07/12/webdrivers-implicit-wait-and-deleting-elements/)
  * Ability to explicitly specify the initial page for a test and initialise the first page object in one line of code
  * Continuous Integration support (now runs in TeamCity)
  * A new HTML Control model that provides a nice API on top of Selenium Web Driver to interact with HTML controls (including easy extensibility for your own controls)
  * A clearer public API
  * Improved test coverage and extensive refactoring of the core library code

You can get the latest version of Seleno onÂ <a href="http://nuget.org/packages/TestStack.Seleno/" target="_blank">NuGet</a>, or check out ourÂ <a href="https://github.com/TestStack/TestStack.Seleno" target="_blank">GitHub repository</a> for the latest source code and the getting started documentation. Let us know what you think, or if there are any features that you would like to see. Feel free to add an issue or pull request &#8211; the more community interaction we get the better we can make Seleno!