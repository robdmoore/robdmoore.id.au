---
layout: post
title: Announcing AzureWebFarm.OctopusDeploy
date: 2014-01-05 21:47:00.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- continuous delivery
- dev ops
- NuGet
- powershell
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


I'm very proud to announce the public 1.0 release of a new project that I've been working on with [Matt Davies](http://blog.mdavies.net/) over the last couple of weeks - [AzureWebFarm.OctopusDeploy](https://github.com/MRCollective/AzureWebFarm.OctopusDeploy).



This project allows you to easily create an [infinitely-scalable farm of IIS 8 / Windows Server 2012 web servers using Windows Azure Web Roles](http://www.windowsazure.com/en-us/services/cloud-services/) that are deployed to by an [OctopusDeploy](http://octopusdeploy.com/) server.



If you haven't used OctopusDeploy before then head over to the [homepage](http://octopusdeploy.com) and check it out now because it's AMAZING.



The [installation instructions](https://github.com/MRCollective/AzureWebFarm.OctopusDeploy#installation-instructions) are on the AzureWebFarm.OctopusDeploy homepage ([including a screencast](http://youtu.be/2-tdTMt4dfE)!), but in short it amounts to:


1. Configure a standard Web Role project in Visual Studio
2. `Install-Package AzureWebFarm.OctopusDeploy`
3. Configure 4 cloud service variables - `OctopusServer`, `OctopusApiKey`, `TentacleEnvironment` and `TentacleRole`
4. Deploy to Azure and watch the magic happen!



We also have a really cool logo that a friend of ours, Aoife Doyle, drew and graciously let us use![![AzureWebFarm.OctopusDeploy logo]({{ site.baseurl }}/assets/octo_logo.jpg)](http://media.robdmoore.id.au/uploads/2014/01/octo_logo.jpg)







It's been a hell of a lot of fun developing this project as it's not only been very technically challenging, but the end result is just plain cool! In particular the [install.ps1](https://github.com/MRCollective/AzureWebFarm.OctopusDeploy/blob/master/AzureWebFarm.OctopusDeploy/Tools/install.ps1) file for the NuGet package was very fun to write and results in a seamless installation experience!



Also, a big thanks to [Nicholas Blumhardt](https://twitter.com/nblumhardt), who gave me some assistance for a few difficulties I had with Octopus and implemented a new feature I needed really quickly!

