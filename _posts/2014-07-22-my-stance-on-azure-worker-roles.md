---
id: 3491
title: My stance on Azure Worker Roles
date: 2014-07-22T15:11:00+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3491
permalink: /blog/2014/07/22/my-stance-on-azure-worker-roles/
categories:
  - Technical
tags:
  - continuous delivery
  - dev ops
  - MSDeploy
  - Windows Azure
---
tl;dr 99% of the time Worker Role is not the right solution. Read on for more info.

## Worker Role Deployments

I quite often get asked by people about the best way to deploy Worker Roles because it is a pain &#8211; as an Azure Cloud Service the deployment time of a Worker Role is 8-15+ minutes. In the age of continuous delivery and short feedback loops this is unacceptable (as I have said all along).

On the surface though, Worker Roles are the most appropriate and robust way to deploy heavy background processing workloads in Azure. So what do we do?

## Web Jobs

The advice I generally give people when deploying websites to Azure is to use Azure Web Sites unless there is something that [requires themÂ to use Web Roles](http://robdmoore.id.au/blog/2012/06/09/windows-azure-web-sites-vs-web-roles/ "Windows Azure Web Sites vs Web Roles") (and use Virtual Machines as a last resort). That way you are left with the best possibleÂ <span style="color: #333333;">development, deployment, debugging and support experience possibleÂ for your application.</span>

Now that <a href="http://azure.microsoft.com/en-us/documentation/articles/web-sites-create-web-jobs/" target="_blank">Web Jobs</a> have been released for a while and have a level of maturity and stability I have been giving the same sort of advice when it comes to background processing:Â if you have a workload that can run onÂ the [Azure Web Sites platform](http://robdmoore.id.au/blog/2012/06/09/windows-azure-web-sites-vs-web-roles/ "Windows Azure Web Sites vs Web Roles")Â (e.g. doesn&#8217;t need registry/COM+/GDI+/elevated privileges/custom software installed/mounted drives/Virtual Network/custom certificates etc.) and itÂ doesn&#8217;t have intensive CPU or memory resource usage then use Web Jobs.

I should note that when deploying Web Jobs you canÂ deploy them automatically using the <a href="http://visualstudiogallery.msdn.microsoft.com/f4824551-2660-4afa-aba1-1fcc1673c3d0" target="_blank">WebJobsVs Visual StudioÂ extension</a>.

As a side note: some of my colleagues atÂ <a href="http://readify.net/" target="_blank">Readify</a> have recently startedÂ using Web Jobs as a platform for deploying Microservices inÂ asynchronous messaging based systems. It&#8217;s actually quite a nice combination because you can put any configuration / management / monitoring information associated with the micro-service in the web site portion of the deployment and it&#8217;s intrinsically linked to the Web Job in both the source code and the deployment.

## Worker Roles

If you are in a situation where you have an intense workload, you need to scale the workload independently Â of your Web Sites instances or your workload isn&#8217;t supported by the Azure Web Sites platform (and thus can be run as a Web Job) then you need to start looking at Worker Roles or some other form of background processing.

### Treat Worker Roles as infrastructure

One thing that I&#8217;ve been trying to push for a number of years now (particularly via my <a href="https://github.com/MRCollective/AzureWebFarm" target="_blank">AzureWebFarm</a> and <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy" target="_blank">AzureWebFarm.OctopusDeploy</a> projects) is for people to think of Cloud Services deployments as infrastructure rather than applications.

With that mindset shift, Cloud Services becomes amazing rather than a deployment pain:

  * <span style="color: #333333;">Within 8-15+ minutes a number of customised, RDP-accessible, Virtual Machines are being provisioned for you on a static IP address and those machines can be scaled up or down at any time and they have health monitoring and diagnostics capabilities built-in as well as a powerful load balancer and ability to arbitrarily install software or perform configurations with elevated privileges!</span>
  * <span style="color: #333333;">To reiterate: waiting 8-15+ minutes for a VM to be provisioned is amazing; waiting 8-15+ minutes for the latest version of your software application to be deployed is unacceptably slow!</span>

By treating Cloud Services as stateless, scalable infrastructure you will rarely perform deployments and the deployment time is then a non-issue &#8211; you will only perform deployments when scaling up or rolling out infrastructure updates (which should be a rare event and if it rolls out seamlessly then it doesn&#8217;t matter how long it takes).

### Advantages of Web/Worker Roles as infrastructure

  * As above, slow deployments don&#8217;t matter since they are rare events that should be able to happen seamlessly without taking out the applications hosted on them.
  * As above, you can use all of theÂ capabilities available in Cloud Services.
  * Your applications don&#8217;t have to have a separate Azure project in them making the Visual Studio solution simpler / load faster etc.
  * Your applications don&#8217;t have any Azure-specific code in them (e.g. `CloudConfiguationManager`, `RoleEnvironment`, `RoleEntryPoint`, etc.) anymore 
      * This makes your apps simpler and also means that you aren&#8217;t coding anything in them that indicates how/where they should be deployed &#8211; this is important and how it should be!
      * It also means you can deploy the same code on-premise and in Azure seamlessly and easily

### How do I deploy a background processing workload to Worker Role as infrastructure?

So how does this work you might ask? Well, apart from rolling your own code in the Worker Role to detect, deploy and run your application(s) (say, from blob storage) you have two main options that I know of (both of which are open source projects I own along with <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a>):

  * <a href="https://github.com/MRCollective/AzureWebFarm" target="_blank">AzureWebFarm</a> and its <a href="https://github.com/MRCollective/AzureWebFarm#background-worker-setup" target="_blank">background worker functionality</a> 
      * This would see you deploying the background work as part of MSDeploying a web application and it works quite similar to (but admittedly probably less robust than) Web Jobs &#8211; this is suitable for lightÂ workloads
  * <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy" target="_blank">AzureWebFarm.OctopusDeploy</a> and using OctopusDeploy to deploy a <a href="https://octopusdeploy.com/automated-deployments/windows-service-deployment" target="_blank">Windows Service</a> 
      * In general I recommend using <a href="http://topshelf-project.com/" target="_blank">Topshelf</a> to develop Windows Services becauseÂ it allows a nicer development experience (single console app project that you can F5) and deployment experience (you pass an install argument to install it)
      * You should be able to deployÂ heavyweightÂ workloads using this approach (just make sure your <a href="https://azure.microsoft.com/en-us/pricing/details/cloud-services/" target="_blank">role size</a> is suitable)

The thing to note about both of these approaches is that you are actually using Web Roles, not Worker Roles! This is fine because there isn&#8217;t actually any difference between them apart from the fact that Web Roles have IISÂ installed and configured. If you don&#8217;t want anyone to access the servers over HTTP because they are only used for background processing then simply don&#8217;t <a href="http://msdn.microsoft.com/en-us/library/hh180158.aspx" target="_blank">expose a public endpoint</a>.

## So, when should I actually use Worker Roles (aka you said they aren&#8217;t applicable 99% of the time &#8211; what about the other 1%)?

OK, so there is definitely some situations I can think of and have come across beforeÂ _occasionally_ that warrant the application actually being coded as a Worker Role &#8211; remember to be pragmmatic and use the right tool for the job! Here are some examples (but it&#8217;s by no means exhaustive):

  * You need the role to restart if there are anyÂ uncaught exceptions
  * You need the ability to control the server as part of the processing &#8211; e.g. request the server start / stop
  * You want to connect to internal endpoints in aÂ cloud service deployment or do other complex things that require you to useÂ RoleEnvironment
  * There isn&#8217;t really an application-component (or it&#8217;s tiny) &#8211; e.g. you need to install a custom application when the role starts up and then you invoke that application in some way

## What about Virtual Machines?

Sometimes Cloud Services aren&#8217;t going to work either &#8211; in a scenario where you need persistent storage and can&#8217;t code your background processing code to be stateless via RoleEntryPoint then you might need to consider standing up one or more Virtual Machines. If you can avoid this at all then I highly recommend it since you thenÂ needÂ to maintain the VMs rather than using a managed service.

## Other workloads

This post is targeted at the types of background processing workloads you would likely deploy to a Worker Role. There are other background processing technologies in Azure that I have deliberately not covered in this post such as <a href="http://azure.microsoft.com/en-us/services/hdinsight/" target="_blank">Hadoop</a>.