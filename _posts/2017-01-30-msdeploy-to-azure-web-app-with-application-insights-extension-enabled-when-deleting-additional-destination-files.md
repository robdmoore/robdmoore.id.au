---
layout: post
title: MsDeploy to Azure Web App with Application Insights extension enabled when
  deleting additional destination files
date: 2017-01-30 17:44:04.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- continuous delivery
- MSDeploy
- Windows Azure
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


When performing an MsDeploy to an Azure Web App and you have the App Insights extension enabled you may find something interesting happens if you use the option to delete additional files on the destination that don't appear in the source. If you look at the deployment log you may see something like this:



```
2017-01-30T07:29:27.5515545Z Info: Deleting file ({sitename}\ApplicationInsights.config).
2017-01-30T07:29:27.5515545Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.2.2.0\Microsoft.ApplicationInsights.2.2.0.nupkg).
2017-01-30T07:29:27.5515545Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.2.2.0).
2017-01-30T07:29:27.5515545Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.Agent.Intercept.2.0.6\Microsoft.ApplicationInsights.Agent.Intercept.2.0.6.nupkg).
2017-01-30T07:29:27.5515545Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.Agent.Intercept.2.0.6).
2017-01-30T07:29:27.5515545Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.Azure.WebSites.2.2.0\Microsoft.ApplicationInsights.Azure.WebSites.2.2.0.nupkg).
2017-01-30T07:29:27.5515545Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.Azure.WebSites.2.2.0).
2017-01-30T07:29:27.5525645Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.DependencyCollector.2.2.0\Microsoft.ApplicationInsights.DependencyCollector.2.2.0.nupkg).
2017-01-30T07:29:27.5525645Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.DependencyCollector.2.2.0).
2017-01-30T07:29:27.5525645Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.PerfCounterCollector.2.2.0\Microsoft.ApplicationInsights.PerfCounterCollector.2.2.0.nupkg).
2017-01-30T07:29:27.5525645Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.PerfCounterCollector.2.2.0).
2017-01-30T07:29:27.5525645Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.Web.2.2.0\Microsoft.ApplicationInsights.Web.2.2.0.nupkg).
2017-01-30T07:29:27.5525645Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.Web.2.2.0).
2017-01-30T07:29:27.5525645Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.WindowsServer.2.2.0\Microsoft.ApplicationInsights.WindowsServer.2.2.0.nupkg).
2017-01-30T07:29:27.5525645Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.WindowsServer.2.2.0).
2017-01-30T07:29:27.5525645Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.2.2.0\Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.2.2.0.nupkg).
2017-01-30T07:29:27.5525645Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.2.2.0).
2017-01-30T07:29:27.5525645Z Info: Deleting file ({sitename}\App_Data\packages\Microsoft.Web.Infrastructure.1.0.0.0\Microsoft.Web.Infrastructure.1.0.0.0.nupkg).
2017-01-30T07:29:27.5525645Z Info: Deleting directory ({sitename}\App_Data\packages\Microsoft.Web.Infrastructure.1.0.0.0).
2017-01-30T07:29:27.5535680Z Info: Deleting directory ({sitename}\App_Data\packages).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.Agent.Intercept.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.DependencyCollector.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.HttpModule.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.PerfCounterCollector.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.ServerTelemetryChannel.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.Web.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.AI.WindowsServer.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.ApplicationInsights.AzureWebSites.dll).
2017-01-30T07:29:27.5535680Z Info: Deleting file ({sitename}\bin\Microsoft.ApplicationInsights.dll).
```



The cool thing about this is it gives you an indication of what the extension actually does. The fact there is an App\_Data/packages folder with what is clearly unpacked NuGet packages tells us that the extension is installing a NuGet package into your site for you. That makes a lot of sense given you don't need to install the extension if you installed the NuGet package yourself (I generally don't bother because I don't need App Insights locally and see it as a deployment concern so I like App Service adding it for me :)).



Setting the MsDeploy option to delete extraneous files is very useful so it's not something I want to simply turn off. However, a [knowledge of MsDeploy](http://mdavies.net/2012/08/12/microsofts-hidden-gem-msdeploy/) gives us some indication as to a possible solution. In this case we can make use of the [skip option](https://technet.microsoft.com/en-us/library/dd569089(v=ws.10).aspx) to specify that MSDeploy should ignore the above affected files.



Putting it all together, if you specify the following rules in your msdeploy.exe call then you should have success:



```
-skip:objectname='filePath',absolutepath='ApplicationInsights.config' -skip:objectname='dirPath',absolutepath='App_Data\\packages\\*.*' -skip:objectname='filePath',absolutepath='bin\\Microsoft.AI.*.dll'  -skip:objectname='filePath',absolutepath='bin\\Microsoft.ApplicationInsights.*.dll'
```



After doing that your deployment log should look something like this:



```
2017-01-30T08:10:26.7172425Z Info: Object filePath ({sitename}\ApplicationInsights.config) skipped due to skip directive 'CommandLineSkipDirective 1'.
2017-01-30T08:10:26.7182428Z Info: Object dirPath ({sitename}\App_Data\packages) skipped due to skip directive 'CommandLineSkipDirective 2'.
2017-01-30T08:10:26.7192429Z Info: Object filePath ({sitename}\bin\Microsoft.AI.Agent.Intercept.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7192429Z Info: Object filePath ({sitename}\bin\Microsoft.AI.DependencyCollector.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7192429Z Info: Object filePath ({sitename}\bin\Microsoft.AI.HttpModule.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7192429Z Info: Object filePath ({sitename}\bin\Microsoft.AI.PerfCounterCollector.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7192429Z Info: Object filePath ({sitename}\bin\Microsoft.AI.ServerTelemetryChannel.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7202428Z Info: Object filePath ({sitename}\bin\Microsoft.AI.Web.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7202428Z Info: Object filePath ({sitename}\bin\Microsoft.AI.WindowsServer.dll) skipped due to skip directive 'CommandLineSkipDirective 3'.
2017-01-30T08:10:26.7202428Z Info: Object filePath ({sitename}\bin\Microsoft.ApplicationInsights.AzureWebSites.dll) skipped due to skip directive 'CommandLineSkipDirective 4'.
2017-01-30T08:10:26.7202428Z Info: Object filePath ({sitename}\bin\Microsoft.ApplicationInsights.dll) skipped due to skip directive 'CommandLineSkipDirective 4'.
```


## What to do when accidentally deleting App Insights files


If you find yourself in the position that you have accidentally deleted the App Insights files you simply need to delete the App Insights extension and then re-add it and it should work again.


## Adding the SDK to your application


If you eventually end up adding the App Insights SDK to your application then take note that you will need to make sure the [version of the extension and the version of the SDK DLLs match](https://twitter.com/davidebbo/status/858016577127665665) otherwise you'll get a version mismatch exception on app startup.



You still need to install the exception because the SDK alone doesn't collect [all information](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-monitor-performance-live-website-now).

