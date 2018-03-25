---
id: 2131
title: Announcing AzureWebFarm.OctopusDeploy
date: 2014-01-05T21:47:00+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=2131
permalink: /blog/2014/01/05/announcing-azurewebfarm-octopusdeploy/
categories:
  - Technical
tags:
  - continuous delivery
  - dev ops
  - NuGet
  - powershell
  - Windows Azure
---
I&#8217;m very proud to announce the public 1.0 release of a new project that I&#8217;ve been working on with <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a> over the last couple of weeks &#8211; <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy" target="_blank">AzureWebFarm.OctopusDeploy</a>.

This project allows you to easily create anÂ [infinitely-scalable farm of IIS 8 / Windows Server 2012 web servers using Windows Azure Web Roles](http://www.windowsazure.com/en-us/services/cloud-services/)Â that are deployed to by anÂ [OctopusDeploy](http://octopusdeploy.com/)Â server.

If you haven&#8217;t used OctopusDeploy before then head over to the <a href="http://octopusdeploy.com" target="_blank">homepage</a> and check it out now because it&#8217;s AMAZING.

The <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy#installation-instructions" target="_blank">installation instructions</a> are on the AzureWebFarm.OctopusDeploy homepage (<a href="http://youtu.be/2-tdTMt4dfE" target="_blank">including a screencast</a>!), but in short it amounts to:

  1. Configure a standard Web Role project in Visual Studio
  2. `Install-Package AzureWebFarm.OctopusDeploy`
  3. Configure 4 cloud service variables &#8211;Â `OctopusServer`,Â `OctopusApiKey`,Â `TentacleEnvironment`Â and `TentacleRole`
  4. Deploy to Azure and watch the magic happen!

We also have a really cool logo that a friend of ours,Â Aoife Doyle, drew and graciously let us use![<img class="aligncenter size-full wp-image-2141" alt="AzureWebFarm.OctopusDeploy logo" src="http://media.robdmoore.id.au/uploads/2014/01/octo_logo.jpg" width="646" height="960" srcset="https://media.robdmoore.id.au/uploads/2014/01/octo_logo.jpg 646w, https://media.robdmoore.id.au/uploads/2014/01/octo_logo-201x300.jpg 201w, https://media.robdmoore.id.au/uploads/2014/01/octo_logo-624x927.jpg 624w" sizes="(max-width: 646px) 100vw, 646px" />](http://media.robdmoore.id.au/uploads/2014/01/octo_logo.jpg)

&nbsp;

It&#8217;s been a hell of a lot of fun developing this project as it&#8217;s not only been very technically challenging, but the end result is just plain cool! In particular the <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy/blob/master/AzureWebFarm.OctopusDeploy/Tools/install.ps1" target="_blank">install.ps1</a> file for the NuGet package was very fun to write and results in a seamless installation experience!

Also, a big thanks to <a href="https://twitter.com/nblumhardt" target="_blank">Nicholas Blumhardt</a>, who gave me some assistance for a few difficulties I had with Octopus and implemented a new feature I needed really quickly!