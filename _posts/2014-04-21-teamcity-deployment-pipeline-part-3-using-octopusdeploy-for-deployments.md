---
id: 3131
title: 'TeamCity deployment pipeline (part 3: using OctopusDeploy for deployments)'
date: 2014-04-21T13:24:13+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3131
permalink: /blog/2014/04/21/teamcity-deployment-pipeline-part-3-using-octopusdeploy-for-deployments/
categories:
  - Technical
tags:
  - continuous delivery
  - dev ops
  - OctopusDeploy
  - TeamCity
---
This post outlines how using OctopusDeploy for deployments can fit into a TeamCity continuous delivery deployment pipeline.

## Maintainable, large-scale continuous delivery with TeamCity series

This post is part of a blog series jointly written by myself andÂ <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a>Â calledÂ Maintainable, large-scale continuous delivery with TeamCity:

  1. [Intro](http://robdmoore.id.au/blog/2012/08/12/maintainable-large-scale-continuous-delivery-with-teamcity/)
  2. TeamCity deployment pipeline 
      * [TeamCity deployment pipeline (part 1: structure)](http://robdmoore.id.au/blog/2012/09/01/maintainable-teamcity-continuous-deployment-pipeline-configuration/)
      * [TeamCity deployment pipeline (part 2: TeamCity 8, build once and UI tests)](http://blog.mdavies.net/2014/04/21/teamcity-deployment-pipeline-part-2-teamcity-8-build-once-and-ui-tests/)
      * [TeamCity deployment pipeline (part 3: using OctopusDeploy for deployments)](http://robdmoore.id.au/blog/2014/04/21/teamcity-deployment-pipeline-part-3-using-octopusdeploy-for-deployments/)
  3. Deploying Web Applications 
      * MsDeploy (onprem and Azure Web Sites)
      * OctopusDeploy (nuget)
      * Git push (Windows Azure Web Sites)
  4. Deploying Windows Services 
      * MsDeploy
      * OctopusDeploy
      * Git push (Windows Azure Web Sites Web Jobs)
  5. Deploying Windows Azure Cloud Services 
      * OctopusDeploy
      * PowerShell
  6. How to choose your deployment technology 
      * <a href="http://blog.mdavies.net/2012/08/12/microsofts-hidden-gem-msdeploy/" target="_blank">Microsoft&#8217;s hidden gem: MSDeploy</a>

## Using another tool for deployments

If you can have a single tool to create your deployment pipeline and include continuous integration as well as deployments then there are obvious advantages in terms of simplicity of configuration and management (single set of project definitions, user accounts and permissions, single UI to learn, etc.). This is one of the reasons we created this blog series; we loved how powerful TeamCity is out of the box and wanted to expose that awesomeness so other people could experience what we were.

Lately, we have also been experimenting with combining TeamCity with another tool to take care of the deployments:Â <a href="http://octopusdeploy.com/" rel="noreferrer">OctopusDeploy</a>. There are a number of reasons we have been looking at it:

  * Curiosity; OctopusDeploy is getting a lot of attention in the .NET community so it&#8217;s hard not to notice it &#8211; it&#8217;s worth looking at it to see what it does
  * If you are coordinating complex deployments then OctopusDeploy takes care of managing that complexity and the specification of the deployment process in a manageable way (that would start to get complex with TeamCity) 
      * For instance, if you need to perform database migrations then deploy multiple websites and a background worker together then OctopusDeploy makes this easy
  * Visualising the deployment pipeline is much easier in OctopusDeploy, which is great when you are trying to get non-technical product owners involved in deployments
  * It gives you a lot more flexibility around performing deploy-time actions out-of-the-box and makes it easier to do build once packages 
      * It is possible to do the same things with MsDeploy, but it is more complex to do
  * It has greatÂ <a href="http://docs.octopusdeploy.com/display/OD/Home" rel="noreferrer">documentation</a>
  * It comes with plugins that make using it withÂ <a href="http://docs.octopusdeploy.com/display/OD/TeamCity" rel="noreferrer">TeamCity a breeze</a>

We wouldn&#8217;t always use OctopusDeploy exclusively, but it&#8217;s definitely a tool worth having a good understanding of to use judiciously because it can make your life a lot easier.

## <a href="https://gist.github.com/robdmoore/def851e8a10319b19251#generating-the-package" rel="noreferrer" name="user-content-generating-the-package"></a>Generating the package

OctopusDeploy uses theÂ <a href="http://docs.octopusdeploy.com/display/OD/Packaging+applications" rel="noreferrer">NuGet package format to wrap up deployments</a>; there are a number of ways you can generate the NuGet package in TeamCity:

  * OctoPack (if you installÂ <a href="https://github.com/OctopusDeploy/OctoPack" rel="noreferrer">OctoPack</a>Â into your project then it&#8217;s dead easy to get the NuGet package &#8211; you can install theÂ <a href="http://docs.octopusdeploy.com/display/OD/TeamCity" rel="noreferrer">plugin</a>Â to invoke it or pass throughÂ `/p:RunOctoPack=true`Â to MSBuild when you build your solution/project if using .NET)
  * TeamCity NuGet Pack step (if you are using a customÂ `.nuspec`Â file then it&#8217;s easy to package that up and automatically get it as an artifact by usingÂ <a href="http://confluence.jetbrains.com/display/TCD8/NuGet+Pack" rel="noreferrer">TeamCity&#8217;s NuGet Pack step</a>)
  * PowerShell or another scripting language (if you need more flexibility you can create a custom script to run that will package up the files)

## <a href="https://gist.github.com/robdmoore/def851e8a10319b19251#publishing-the-package-to-a-nuget-feed-so-octopusdeploy-can-access-it" rel="noreferrer" name="user-content-publishing-the-package-to-a-nuget-feed-so-octopusdeploy-can-access-it"></a>Publishing the package to a NuGet feed so OctopusDeploy can access it

In order for OctopusDeploy to access the deployment packages they need to be published to a NuGet feed that the OctopusDeploy server can access. You have a number of options of how to do this from TeamCity:

  * Publish the package to TeamCity&#8217;s NuGet feed (this is easy &#8211; simply include theÂ `.nupkg`Â file as an artifact and it will automatically publish toÂ <a href="http://confluence.jetbrains.com/display/TCD8/NuGet" rel="noreferrer">it&#8217;s feed</a>)
  * Publish the package toÂ <a href="http://docs.octopusdeploy.com/display/OD/Package+repositories" rel="noreferrer">OctopusDeploy&#8217;s internal NuGet server</a>
  * Publish the package to some otherÂ <a href="http://docs.nuget.org/docs/creating-packages/hosting-your-own-nuget-feeds" rel="noreferrer">NuGet server</a>Â you set up that OctopusDeploy can access

## <a href="https://gist.github.com/robdmoore/def851e8a10319b19251#automating-releases-and-deployments" rel="noreferrer" name="user-content-automating-releases-and-deployments"></a>Automating releases and deployments

In order to create releases and trigger deployments of those releases from TeamCity there are a number of options:

  * Use theÂ <a href="http://docs.octopusdeploy.com/display/OD/TeamCity" rel="noreferrer">TeamCity plugin from OctopusDeploy</a>
  * UseÂ <a href="https://github.com/OctopusDeploy/Octopus-Tools" rel="noreferrer">Octo.exe</a>
  * Write a custom script or program to talk to theÂ <a href="http://docs.octopusdeploy.com/display/OD/Octopus+REST+API" rel="noreferrer">OctopusDeploy API</a>