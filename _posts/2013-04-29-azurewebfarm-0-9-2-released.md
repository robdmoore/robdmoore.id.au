---
id: 921
title: AzureWebFarm 0.9.2 Released
date: 2013-04-29T23:41:25+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=921
permalink: /blog/2013/04/29/azurewebfarm-0-9-2-released/
categories:
  - Technical
tags:
  - accelerator for web roles
  - AzureWebFarm
  - 'C#'
  - dev ops
  - NuGet
  - Windows Azure
---
I&#8217;m happy to announce that I&#8217;ve just released AzureWebFarm 0.9.2 to Nuget.

This release involves months of work by myself and <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a>Â to really tighten up the farm, perform a lot of stress testing on it (including some reasonably heavy production loads) and take the (larger than we expected &#8211; I&#8217;ll do a separate blog post on this in the next few days) step to upgrade to Windows Server 2012 / .NET 4.5 support. We will be deploying this version to production farms over the next few weeks and if there are no issues then we will be releasing v1.0 in the near future.

I&#8217;m pleased to announce that with Windows Server 2012 and the Azure SDK 1.8 (which we&#8217;ve discovered comes with some quite massive and <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff683673.aspx#BK_October2012" target="_blank">seemingly undocumented</a>Â deployment speed improvements that we are reliably getting deployment times (including package upload) **of around 9 minutes for a new web farm!Â** We think this is incredible that you can get an **enterprise-grade, clustered, load-balanced, IIS8 / Windows Server 2012 powered web farm with background execution capabilities that you can scale up and down in less than 10 minutes**!!!

## What&#8217;s new?

The changes we&#8217;ve introduced in this version are (in no particular order):

  * If a web.config file is included with a background worker application then it will no longer cause an exception in the web farm and in fact will not be overwritten
  * Upgraded to Azure SDK 1.8 along with the deployment speed improvements this entails
  * Decreased the number of files that are needed in the web farm web project significantly (now it&#8217;s just web.config, app.config, Probe.aspx, Probe.aspx.cs and WebRole.cs)
  * Added missing HTTP certificate config in the example cloud project config files
  * Set a bunch of internally used classes to \`internal\` from \`public\` to reduce the possibility of any confusion
  * Refactored core code to make it easier to unit test and maintain
  * Improved the test coverage of the codebase
  * Changes to config settings while the farm is deployed will now update the farm without requiring the roles to be manually restarted (the roles won&#8217;t automatically restart either &#8211; they will always use the latest version of the config settings)
  * Added handling to OnStop to ensure all ASP.NET requests are served before a role is restarted as per <a href="http://blogs.msdn.com/b/windowsazure/archive/2013/01/14/the-right-way-to-handle-azure-onstop-events.aspx" target="_blank">http://blogs.msdn.com/b/windowsazure/archive/2013/01/14/the-right-way-to-handle-azure-onstop-events.aspx</a>
  * Added configurable logging via Castle.Core so you can adjust the verbosity of the trace logs and intercept the logs if you would like to redirect it to different instrumentation
  * Removed dependencies on Azure Storage within uncaught code called from OnRun() &#8211; this means that the web farm should not go down if there is an Azure Storage outage
  * Added configuration setting to allow for syncing to be disabled without needing to redeploy the farm
  * Added functionality to ensure all web deploy connections getÂ funnelledÂ to a single role instance at a time (with robust failover if that role instance fails). This resolves an issue when using MsDeploy v3+ on the server that we discovered and will be documented in a later blog post.
  * Changed the example config files to use Windows Server 2012
  * Opened up a readme.txt file when you install the NuGet package to outline any breaking changes
  * Improved <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">documentation on github</a>

## Breaking Changes

If you are upgrading from a previous version of Azure Web Farm then make sure you look at the <a href="https://github.com/robdmoore/AzureWebFarm/blob/master/BREAKING_CHANGES.md" target="_blank">breaking changes</a> file to see upgrade instructions as **there are a number of breaking changes in this release**.

## Future Direction

What&#8217;s in store for Azure Web Farm in the future? This is a rough idea of the sorts of things we are looking into (we don&#8217;t have a timeline on this &#8211; if you want to help out to make it happen faster though please contact us):

  * <span style="line-height: 14px;">Out of the box auto-scaling support using Wasabi</span>
  * Better installation experience &#8211; using nuget install scripts to take away some of the tedious manual configuration when creating a new farm
  * Improving the syncing speed &#8211; it currently takes 30-90s to sync a new deployment across the farm and we are confident we can get that down significantly