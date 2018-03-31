---
layout: post
title: Developing ASP.NET web applications with IIS
date: 2014-07-23 16:18:58.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- dev ops
- IIS
- powershell
- sql
- tech evangelism
- Visual Studio
meta:
  _edit_last: '1'
  _wp_old_slug: developing-asp-net-web-applications-in-iis
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


When you File -> New Project an ASP.NET application in Visual Studio and then F5 by default it will spin up [IIS Express](http://msdn.microsoft.com/en-AU/library/58wxa9w5.aspx) and navigate to the site for you.



IIS Express is pretty cool - it runs under your user account so no need to mess around with elevated privileges, it has most of the power of IIS (think web.config) and it "just works" out of the box without extra configuration needed across all dev machines :)



For projects that I work on every day though, I really dislike using IIS Express as a development server for the following reasons:


- It will randomly crash
- When it crashes I have to F5 or Ctrl+F5 in Visual Studio to restart it - I can't just go to the last url it was deployed to (e.g. http://localhost:port/)
- If your code has an uncaught exception then a crash dialog pops up in your taskbar in a way that isn't obvious and requires you to click a button until the code continues running (this can be very confusing)
- Setting up a custom domain is tricky to do, is a tedious manual process and can't run on port 80 side-by-side with proper IIS
  - Using a custom domain is often essential too - think sharing cookies between domains or performing something like integrating with third parties where you need to provide a URL other than localhost



Part of the reason IIS Express exists is because setting up IIS with a site is not a trivial process. However, when you do eventually get it set up I usually find it works great from then on:


- It's stable
- The URL is always available - you don't have to use Visual Studio at all
- Uncaught exceptions behave as expected
- Custom domains are easy in both the IIS Manager GUI and via a variety of commandline options



In order to reduce the pain involved with setting up IIS I do two things:


- I modify my Visual Studio taskbar icon to [always run as admin](http://superuser.com/questions/462912/always-start-visual-studio-as-an-administrator-on-windows-8) (necessary to open a project bound to IIS)
- I add a Developer Setup script to the project that developers must run once when they first clone the repository that sets up everything up for them in a matter of seconds (hopefully giving the same Open Solution -> F5 and start developinging experience)
  - I've added an example of such a script to a [Gist](https://gist.github.com/robdmoore/59fcce5ebdab26fd3834) - the script also includes setting up the hosts file and a SQL Express database
  - I can't claim full credit for the script - it's been a collaborative effort over a number of projects by all of the [Readifarians](http://readify.net/) I've worked with :D

