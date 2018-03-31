---
layout: post
title: AzureWebFarm 0.9.2 Released
date: 2013-04-29 23:41:25.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- accelerator for web roles
- AzureWebFarm
- C#
- dev ops
- NuGet
- Windows Azure
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


I'm happy to announce that I've just released AzureWebFarm 0.9.2 to Nuget.



This release involves months of work by myself and [Matt Davies](http://blog.mdavies.net/) to really tighten up the farm, perform a lot of stress testing on it (including some reasonably heavy production loads) and take the (larger than we expected - I'll do a separate blog post on this in the next few days) step to upgrade to Windows Server 2012 / .NET 4.5 support. We will be deploying this version to production farms over the next few weeks and if there are no issues then we will be releasing v1.0 in the near future.



I'm pleased to announce that with Windows Server 2012 and the Azure SDK 1.8 (which we've discovered comes with some quite massive and [seemingly undocumented](http://msdn.microsoft.com/en-us/library/windowsazure/ff683673.aspx#BK_October2012) deployment speed improvements that we are reliably getting deployment times (including package upload) **of around 9 minutes for a new web farm!**We think this is incredible that you can get an**enterprise-grade, clustered, load-balanced, IIS8 / Windows Server 2012 powered web farm with background execution capabilities that you can scale up and down in less than 10 minutes**!!!


## What's new?


The changes we've introduced in this version are (in no particular order):


- If a web.config file is included with a background worker application then it will no longer cause an exception in the web farm and in fact will not be overwritten
- Upgraded to Azure SDK 1.8 along with the deployment speed improvements this entails
- Decreased the number of files that are needed in the web farm web project significantly (now it's just web.config, app.config, Probe.aspx, Probe.aspx.cs and WebRole.cs)
- Added missing HTTP certificate config in the example cloud project config files
- Set a bunch of internally used classes to `internal` from `public` to reduce the possibility of any confusion
- Refactored core code to make it easier to unit test and maintain
- Improved the test coverage of the codebase
- Changes to config settings while the farm is deployed will now update the farm without requiring the roles to be manually restarted (the roles won't automatically restart either - they will always use the latest version of the config settings)
- Added handling to OnStop to ensure all ASP.NET requests are served before a role is restarted as per [http://blogs.msdn.com/b/windowsazure/archive/2013/01/14/the-right-way-to-handle-azure-onstop-events.aspx](http://blogs.msdn.com/b/windowsazure/archive/2013/01/14/the-right-way-to-handle-azure-onstop-events.aspx)
- Added configurable logging via Castle.Core so you can adjust the verbosity of the trace logs and intercept the logs if you would like to redirect it to different instrumentation
- Removed dependencies on Azure Storage within uncaught code called from OnRun() - this means that the web farm should not go down if there is an Azure Storage outage
- Added configuration setting to allow for syncing to be disabled without needing to redeploy the farm
- Added functionality to ensure all web deploy connections get funnelled to a single role instance at a time (with robust failover if that role instance fails). This resolves an issue when using MsDeploy v3+ on the server that we discovered and will be documented in a later blog post.
- Changed the example config files to use Windows Server 2012
- Opened up a readme.txt file when you install the NuGet package to outline any breaking changes
- Improved [documentation on github](https://github.com/robdmoore/azurewebfarm)


## Breaking Changes


If you are upgrading from a previous version of Azure Web Farm then make sure you look at the [breaking changes](https://github.com/robdmoore/AzureWebFarm/blob/master/BREAKING_CHANGES.md) file to see upgrade instructions as **there are a number of breaking changes in this release**.


## Future Direction


What's in store for Azure Web Farm in the future? This is a rough idea of the sorts of things we are looking into (we don't have a timeline on this - if you want to help out to make it happen faster though please contact us):


- Out of the box auto-scaling support using Wasabi
- Better installation experience - using nuget install scripts to take away some of the tedious manual configuration when creating a new farm
- Improving the syncing speed - it currently takes 30-90s to sync a new deployment across the farm and we are confident we can get that down significantly

