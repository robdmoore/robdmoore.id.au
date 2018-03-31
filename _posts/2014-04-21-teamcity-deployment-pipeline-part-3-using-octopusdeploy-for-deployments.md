---
layout: post
title: 'TeamCity deployment pipeline (part 3: using OctopusDeploy for deployments)'
date: 2014-04-21 13:24:13.000000000 +08:00
type: post
categories:
- Technical
tags:
- continuous delivery
- dev ops
- OctopusDeploy
- TeamCity
author: rob
---


This post outlines how using OctopusDeploy for deployments can fit into a TeamCity continuous delivery deployment pipeline.


## Maintainable, large-scale continuous delivery with TeamCity series


This post is part of a blog series jointly written by myself and [Matt Davies](http://blog.mdavies.net/) called Maintainable, large-scale continuous delivery with TeamCity:


1. [Intro](/blog/2012/08/12/maintainable-large-scale-continuous-delivery-with-teamcity/)
2. TeamCity deployment pipeline
  - [TeamCity deployment pipeline (part 1: structure)](/blog/2012/09/01/maintainable-teamcity-continuous-deployment-pipeline-configuration/)
  - [TeamCity deployment pipeline (part 2: TeamCity 8, build once and UI tests)](http://blog.mdavies.net/2014/04/21/teamcity-deployment-pipeline-part-2-teamcity-8-build-once-and-ui-tests/)
  - [TeamCity deployment pipeline (part 3: using OctopusDeploy for deployments)](/blog/2014/04/21/teamcity-deployment-pipeline-part-3-using-octopusdeploy-for-deployments/)
3. Deploying Web Applications
  - MsDeploy (onprem and Azure Web Sites)
  - OctopusDeploy (nuget)
  - Git push (Windows Azure Web Sites)
4. Deploying Windows Services
  - MsDeploy
  - OctopusDeploy
  - Git push (Windows Azure Web Sites Web Jobs)
5. Deploying Windows Azure Cloud Services
  - OctopusDeploy
  - PowerShell
6. How to choose your deployment technology
  - [Microsoft's hidden gem: MSDeploy](http://blog.mdavies.net/2012/08/12/microsofts-hidden-gem-msdeploy/)


## Using another tool for deployments


If you can have a single tool to create your deployment pipeline and include continuous integration as well as deployments then there are obvious advantages in terms of simplicity of configuration and management (single set of project definitions, user accounts and permissions, single UI to learn, etc.). This is one of the reasons we created this blog series; we loved how powerful TeamCity is out of the box and wanted to expose that awesomeness so other people could experience what we were.



Lately, we have also been experimenting with combining TeamCity with another tool to take care of the deployments: [OctopusDeploy](http://octopusdeploy.com/). There are a number of reasons we have been looking at it:


- Curiosity; OctopusDeploy is getting a lot of attention in the .NET community so it's hard not to notice it - it's worth looking at it to see what it does
- If you are coordinating complex deployments then OctopusDeploy takes care of managing that complexity and the specification of the deployment process in a manageable way (that would start to get complex with TeamCity)
  - For instance, if you need to perform database migrations then deploy multiple websites and a background worker together then OctopusDeploy makes this easy
- Visualising the deployment pipeline is much easier in OctopusDeploy, which is great when you are trying to get non-technical product owners involved in deployments
- It gives you a lot more flexibility around performing deploy-time actions out-of-the-box and makes it easier to do build once packages
  - It is possible to do the same things with MsDeploy, but it is more complex to do
- It has great [documentation](http://docs.octopusdeploy.com/display/OD/Home)
- It comes with plugins that make using it with [TeamCity a breeze](http://docs.octopusdeploy.com/display/OD/TeamCity)



We wouldn't always use OctopusDeploy exclusively, but it's definitely a tool worth having a good understanding of to use judiciously because it can make your life a lot easier.


## Generating the package


OctopusDeploy uses the [NuGet package format to wrap up deployments](http://docs.octopusdeploy.com/display/OD/Packaging+applications); there are a number of ways you can generate the NuGet package in TeamCity:


- OctoPack (if you install [OctoPack](https://github.com/OctopusDeploy/OctoPack) into your project then it's dead easy to get the NuGet package - you can install the [plugin](http://docs.octopusdeploy.com/display/OD/TeamCity) to invoke it or pass through `/p:RunOctoPack=true` to MSBuild when you build your solution/project if using .NET)
- TeamCity NuGet Pack step (if you are using a custom `.nuspec` file then it's easy to package that up and automatically get it as an artifact by using [TeamCity's NuGet Pack step](http://confluence.jetbrains.com/display/TCD8/NuGet+Pack))
- PowerShell or another scripting language (if you need more flexibility you can create a custom script to run that will package up the files)


## Publishing the package to a NuGet feed so OctopusDeploy can access it


In order for OctopusDeploy to access the deployment packages they need to be published to a NuGet feed that the OctopusDeploy server can access. You have a number of options of how to do this from TeamCity:


- Publish the package to TeamCity's NuGet feed (this is easy - simply include the `.nupkg` file as an artifact and it will automatically publish to [it's feed](http://confluence.jetbrains.com/display/TCD8/NuGet))
- Publish the package to [OctopusDeploy's internal NuGet server](http://docs.octopusdeploy.com/display/OD/Package+repositories)
- Publish the package to some other [NuGet server](http://docs.nuget.org/docs/creating-packages/hosting-your-own-nuget-feeds) you set up that OctopusDeploy can access


## Automating releases and deployments


In order to create releases and trigger deployments of those releases from TeamCity there are a number of options:


- Use the [TeamCity plugin from OctopusDeploy](http://docs.octopusdeploy.com/display/OD/TeamCity)
- Use [Octo.exe](https://github.com/OctopusDeploy/Octopus-Tools)
- Write a custom script or program to talk to the [OctopusDeploy API](http://docs.octopusdeploy.com/display/OD/Octopus+REST+API)

