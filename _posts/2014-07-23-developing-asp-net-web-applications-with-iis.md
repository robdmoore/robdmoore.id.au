---
id: 3721
title: Developing ASP.NET web applications with IIS
date: 2014-07-23T16:18:58+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3721
permalink: /blog/2014/07/23/developing-asp-net-web-applications-with-iis/
categories:
  - Technical
tags:
  - dev ops
  - IIS
  - powershell
  - sql
  - tech evangelism
  - Visual Studio
---
When you File -> New Project an ASP.NET application in Visual Studio and then F5 by default it will spin up <a href="http://msdn.microsoft.com/en-AU/library/58wxa9w5.aspx" target="_blank">IIS Express</a> and navigate to the site for you.

IIS Express is pretty cool &#8211; it runs under your user account so no need to mess around with elevated privileges, it has most of the power of IIS (think web.config) and it &#8220;just works&#8221; out of the box without extra configuration needed across all dev machines ðŸ™‚

For projects that I work on every day though, I really dislike using IIS Express as a development server for the following reasons:

  * It will randomly crash
  * When it crashes I have to F5 or Ctrl+F5 in Visual Studio to restart it &#8211; I can&#8217;t just go to the last url it was deployed to (e.g. http://localhost:port/)
  * If your code has an uncaught exception then aÂ crash dialog pops up in your taskbar in a way that isn&#8217;t obvious and requires you to click a button until the code continues running (this can be very confusing)
  * Setting up a custom domain is tricky to do, is a tedious manual process and can&#8217;tÂ run on port 80 side-by-side with proper IIS 
      * Using a custom domain is oftenÂ essential too &#8211; think sharing cookies between domains orÂ performing something like integrating with third parties where you need to provide a URL other than localhost

Part of the reason IIS Express exists is because setting up IIS with a site is not a trivial process. However, when you do eventually get it set up I usually find it works great from then on:

  * It&#8217;s stable
  * The URL is always available &#8211; you don&#8217;t have to use Visual Studio at all
  * Uncaught exceptionsÂ behave as expected
  * Custom domains are easy in both the IISÂ Manager GUI and via a variety of commandline options

In order to reduce the pain involved with setting up IIS IÂ do two things:

  * I modify myÂ Visual Studio taskbar icon to <a href="http://superuser.com/questions/462912/always-start-visual-studio-as-an-administrator-on-windows-8" target="_blank">always run as admin</a> (necessary to open a project bound to IIS)
  * I add a Developer Setup script to the project thatÂ developers must run once when they first clone the repository that sets up everything up for them in a matter of seconds (hopefully giving the same Open Solution -> F5 and start developinging experience) 
      * I&#8217;ve added an example of such a script to a <a href="https://gist.github.com/robdmoore/59fcce5ebdab26fd3834" target="_blank">Gist</a>Â &#8211; the script also includes setting up the hosts file and a SQL Express database
      * I can&#8217;t claim full credit for the script &#8211; it&#8217;s been a collaborative effort over a number of projects by all of the <a href="http://readify.net/" target="_blank">Readifarians</a> I&#8217;ve worked with ðŸ˜€