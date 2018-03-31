---
layout: post
title: 'Windows Azure Web Sites (App Service: Web Apps) vs Web Roles'
date: 2012-06-09 19:18:27.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- accelerator for web roles
- continuous delivery
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


Welcome! This is a post that covers in great detail the differences between Windows Azure Web Sites ([App Service: Web Apps as they are now called](http://weblogs.asp.net/scottgu/announcing-the-new-azure-app-service) - this article will just refer to them by their original name) and Windows Azure Web Roles (azurewebsites.net vs cloudapp.net). It was first written a couple of days after Web Sites was first released, but I have been keeping it up to date as changes to Web Sites are announced. There is a change log of updates at the bottom of the post and I have struck out content that becomes out of date over time. There is also a good [official Microsoft post](http://azure.microsoft.com/en-us/documentation/articles/choose-web-site-cloud-service-vm/) that gives a similar comparison, but  not quite as comprehensive that you can also refer to.



Shameless Plug: If you are interested in using the power of Azure Web Roles with the nice deployment experience of Azure Web Sites then check out the [AzureWebFarm](https://github.com/robdmoore/azurewebfarm) and [AzureWebFarm.OctopusDeploy](https://github.com/MRCollective/AzureWebFarm.OctopusDeploy) libraries I work on.


## Diagrammatic Overview


The Windows Azure Training Kit has a slide with a really nice overview of the three options for deploying web applications in Windows Azure (note: Virtual Machines are outside the scope of this post):



[![Azure Web Apps Options Overview]({{ site.baseurl }}/assets/azure-web-overview.png)](http://media.robdmoore.id.au/uploads/2012/06/azure-web-overview.png)  
*Options for deploying websites in Azure and comparison to on-premise hosting.*


## tl;dr


Azure Web Sites has the following advantages:


- Out of the box support for ASP.NET, python, PHP, node.js and classic ASP
- Out of the box support for near-instant Git, VSO, FTP, Web Deploy and Dropbox deployments
- Out of the box support for configuring a VSO build that can compile code and run tests as part of the deployment
- Instant roll-backs (when using Git or VSO deployments)
- Free, out-of-the-box valid HTTPS when using default azurewebsites.net domain
- Out-of-the-box manual and automated backup and restore
- Much faster site provisioning and scaling (often takes seconds)
- Simpler Visual Studio solution (no need for extra Cloud project)
- One-click install of common open-source blog and CMS platforms
- Friendlier, comprehensive in-built (read: one-click to activate) monitoring and diagnostics
- Automatic configuration modification and config transforms on deploy
- Multiple websites (deployed separately) on a single farm out of the box
- Memory dumps via a REST API
- Out-of-the-box support for remote debugging from Visual Studio
- Ability to have staging environment with custom domain name and ability to change configuration settings at the same time
- Always On Support to keep your application pool warmed up and (optionally) auto-heal any problems in your app pool
- Multiple programming language support for periodic and continuous background jobs
- Ability to view processes running the machine and their CPU and memory use from the Azure Portal and remotely kill rogue processes
- Ability to add pre-packaged extensibility via Site Extensions
- Ability to connect to on-premise resources securely without needing VPN via Hybrid connections
- In-built A/B testing / canary deployment ability using Testing in Production  (TiP) / Traffic Routing feature



Azure Web Roles has the following advantages:


- Use non-standard HTTP and/or TCP ports
- Remote desktop into the VMs
- Faster Windows Azure Virtual Network connection
- Run arbitrary startup scripts with or without elevated privileges
- Use Azure Drive to mount NTFS volumes from blob storage
- More control over what diagnostic information you would like to collect
- Full control to configure IIS
- Perform complex autoscaling
- Scale to hundreds of VM instances (max in Web Sites is currently 10)
- Use Extra Small (low cost) and A4 (Extra Large) / A5 / A6 / A7 / A8 / A9 (intense workloads), D-series and G-series VM sizes
- Install SSL for unlimited custom domain names for free
- Resolve arbitrary domain names to your site without specifying them in the portal
- Configure affinity groups and make use of upgrade and fault domains
- Use the CDN against your web site content
- In-role cache nodes
- 99.95% SLA as opposed to a 99.9% SLA
- You get more than 50GB of disk space
- Ability to use GDI+, Report Viewer and DNS lookups in your code
- Ability to make calls to localhost
- Access to performance counters



Sometimes Virtual Machines are a valid choice - check out my [whitepaper on deploying web applications in Azure](http://readify.net/insights/whitepapers/developing-and-deploying-web-applications-in-windows-azure/) for more information.


### Conclusion


If you need enormous scale, a non-standard/complex configuration (e.g. full IIS customisation, non-standard ports, complex diagnostics or start up scripts / custom software installs), more than 50GB of disk space or RDP then you need Web Roles.



In most other scenarios Web Sites is the best choice since it’s the simplest option and is fully-managed. The Web Sites platform is being constantly innovated on with new features surfacing almost every month – Microsoft are investing a lot of resources into making sure it’s a state of the art platform. If your application grows in complexity over time and needs to migrate from Web Sites to Web Roles or Web Roles to Virtual Machines this is a relatively easy process so you should be able to start with the simplest option initially (Web Sites) with confidence you can change later if required.


## Web Sites


Long-story short: Convention-over-configuration IIS-as-a-service to get you up and running quickly in Azure with a minimum of fuss (kind of like App Harbor). Also, it allows you to use a certain amount of Azure resources for free ([10 websites on shared instances with limited bandwidth](http://www.windowsazure.com/en-us/pricing/details/web-sites/)), which is a welcome addition and will be great for proof of concepts or just playing around with stuff!



The advantages that Web Sites seems to have over Web Roles are:


- Out of the box support for [Git](https://www.windowsazure.com/en-us/develop/net/common-tasks/publishing-with-git/) (including hosted within Azure, CodePlex, Github and Bitbucket), [VSO](http://azure.microsoft.com/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/), [FTP and Web Deploy](http://social.msdn.microsoft.com/Forums/en-US/windowsazurewebsitespreview/thread/4ffc50e0-56ca-43c1-8c5c-a3171daf5c34) and [Dropbox](http://blogs.msdn.com/b/windowsazure/archive/2013/03/19/new-deploy-to-windows-azure-web-sites-from-dropbox.aspx) deployments, which makes automated deployments and continuous delivery dead easy (not that it's terribly difficult [using PowerShell](https://www.windowsazure.com/en-us/develop/net/common-tasks/continuous-delivery/) for Web Roles), and importantly, **quick**.
  - Annoyingly (unless I've missed something), the git publishing doesn't use private keys so you have to keep typing in the password, although from watching [David Ebbo's Youtube video](http://www.youtube.com/watch?v=72SAHWUHnzA&amp;feature=youtu.be) on publishing from Git there must be some way to make it remember the password (I wouldn't know as I always use private keys). [*See update at end of post for instructions*]
  - [It would be cool](http://robdmoore.id.au/blog/2012/09/18/azure-web-sites-paid-shared-hosting-custom-domain-names-and-continuous-deployment/ "Azure Web Sites: Paid shared hosting, custom domain names and continuous deployment") if some of these features were added to Web Roles and Worker Roles<del>; I'm not sure if <a href="https://twitter.com/davidebbo/status/211266524269391873" target="_blank">this tweet from David Ebbo</a> is any indication that might happen!</del>
  - <del>It seems that</del> Microsoft have open sourced their [Git-IIS deployment library, Kudu](https://github.com/projectkudu/kudu), which is cool :)
  - I tried to deploy a solution that had multiple web projects, but no matter what I did it kept deploying the first web project that I had deployed. I'm not sure what conventions it uses, but if you need to configure which project is deployed then I imagine you can consult the [relevant Kudu documentation](https://github.com/projectkudu/kudu/wiki/Customizing-deployments) (edit: looks like there are [some](http://www.devtrends.co.uk/blog/azure-web-sites-git-deploy-for-multiple-project-solutions) [ways](http://blog.amitapple.com/post/38419111245/azurewebsitecustomdeploymentpart3) to address it).
  - If you use the Git publishing model [<del>(and I assume the TFS publishing model)</del>](http://blog.maartenballiauw.be/post/2012/06/07/Use-NuGet-Package-Restore-to-avoid-pushing-assemblies-to-Windows-Azure-Websites.aspx) then you don't have to commit your NuGet package binaries as they will automatically get resolved when you push (<del>you do have to turn on Package Restore on the solution in Visual Studio for it to do it though</del> - edit: [package restore is being deprecated](http://blog.davidebbo.com/2014/01/the-right-way-to-restore-nuget-packages.html)). This is great because it makes your deployment much faster. It does mean that if you use packages that aren't in the official NuGet repository (e.g. in a private repository, or using a [package service](http://www.myget.org/)) then you will need to include those ones [or update the nuget config](http://blog.maartenballiauw.be/post/2012/06/07/Use-NuGet-Package-Restore-to-avoid-pushing-assemblies-to-Windows-Azure-Websites.aspx)<del> - I haven't tried seeing what happens when you do that though yet, so try with caution</del>.
- Gives you the ability to roll-back to previous deployments instantly via the management portal if you are using Git <del>(and I assume TFS)</del> deployments.  
[![Redeploy previous deployments]({{ site.baseurl }}/assets/redeploy-150x150.png "Redeploy previous deployments")](http://media.robdmoore.id.au/uploads/2012/06/redeploy.png)
- You can deploy almost instantly out of the box (with the above mentioned deployment methods), rather than in 8-12 minutes or having to set up something like <del>Accelerator for Web Roles</del>[Azure Web Farm](https://github.com/robdmoore/azurewebfarm) or [AzureWebFarm.OctopusDeploy](https://github.com/MRCollective/AzureWebFarm.OctopusDeploy).
- You can provision a new Web Site much faster than a Web Role (seconds rather than 8+ minutes); I'm guessing Microsoft will always have spare capacity spun up and ready at any point in time - their capacity management software must be fascinating!
- For .NET web apps: You don't have to set up a [separate project](http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx) in your Visual Studio solution to deploy to Azure - you can simply deploy a normal web app solution as-is.
  - This also means you don't have to maintain two sets of configurations and set up a storage account for diagnostics so you can be up and running much quicker.
- Out of the box support for installing ready-to-go, open source web applications (from a list of common ones; mainly CMS's and blogs).[![Create Azure Web Site with CMS]({{ site.baseurl }}/assets/cms-150x150.png "Create an Azure Web Sites site from a pre-built CMS")](http://media.robdmoore.id.au/uploads/2012/06/cms.png)
- <del style="line-height: 1.714285714; font-size: 1rem;">Built-in monitoring from the management portal</del><del> (Web Roles has CPU and (optionally) memory as well now, but this also includes HTTP errors, requests and data)</del>[Web Sites has out of the box support for per-minute diagnostics now](http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx), which you can get the data for with Web Roles, but it's all in-built into the portal for Web Sites and easier to use / consume:  
[![Monitoring dashboard]({{ site.baseurl }}/assets/stats2-150x150.png "Windows Azure Web Sites monitoring dashboard")](http://media.robdmoore.id.au/uploads/2012/06/stats2.png)
- Extra diagnostics options at the click of a button:  
[![Azure Web Sites Diagnostics Options]({{ site.baseurl }}/assets/azure-web-sites-diagnostics-300x179.png)](http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-diagnostics.png)
- Ability to inject configuration variables to your web.config file rather than having to package the final version with the deployment.
  - This means you don't have to use [encrypted web.config files](http://blogs.msdn.com/b/sqlazure/archive/2010/09/07/10058942.aspx) if you want to keep production configuration information in source control so you can do automated deployments, but still prevent developers from accessing the production environment.
  - It does mean you potentially need to be more careful about who you give access to the management portal for your instances because the connection strings will <del>appear in plain text</del> be accessible to them.
- If you have a web.release.config file then the XDT transformations in this file will automatically be applied before deploying your site.
- You can add multiple host names that your site responds to (if it's using <del>reserved instances</del> standard or shared tier, but not for <del>shared</del> free tier).
  - It appears you have to do this if you want to point a CName record at the site - given there are multiple sites being hosted on the same IIS instances this makes sense.
  - Given Web Roles allow you to point as many domain names as you want at it and it will resolve for all of them (assuming you are trying to resolve the main web site that is deployed in the Azure package rather than using a solution like <del>Accelerator for Web Roles</del>[Azure Web Farm](https://github.com/robdmoore/azurewebfarm), which does require you to specify the host name) this isn't really an advantage that Web Sites has over Web Roles.
  - What it does mean though is that **you can host multiple sites on a single set of reserved servers****out of the box** (which is why Web Sites [deprecated Accelerator for Web Roles](http://ntotten.com/2012/06/21/update-on-the-windows-azure-accelerators/) in combination with near-instant deployments).
  - There is an implication if you are using <del>shared</del> free tier rather than <del>reserved</del> standard or shared tiers that you can't point custom domain names to your web site and thus have to use the azurewebsites.net domain name (which is probably fine if you are doing a prototype or proof of concept).
  - <del>It seems that for a given subscription in a given region you can have either free/shared <strong>or</strong> reserved Web Sites and thus any web sites that you add for a given subscription / region that has reserved Web Sites will be shared on your reserved servers.</del>
    - <del>I can't confirm this explicitly, but it's the only thing that makes sense to me after seeing the management portal and reading between the lines in the documentation.</del>[![Web Site Mode]({{ site.baseurl }}/assets/web_site_mode-150x150.png "Azure Web Sites - Web Site Mode")](http://media.robdmoore.id.au/uploads/2012/06/web_site_mode.png)[![Shared to Reserved]({{ site.baseurl }}/assets/shared_to_reserved-150x150.png "Azure Web Sites - Shared to Reserved")](http://media.robdmoore.id.au/uploads/2012/06/shared_to_reserved.png)[![Reserved to Shared]({{ site.baseurl }}/assets/reserved_to_shared-150x150.png "Azure Web Sites - Reserved to Shared")](http://media.robdmoore.id.au/uploads/2012/06/reserved_to_shared.png)
    - <del>I would suggest that it will be important to keep this in mind if you want to segregate the servers that certain combinations of web sites that you deploy. You might want to do this due to their load profiles conflicting with each other. This is important unless Microsoft provides an easy way in the future to segregate your reserved instances within a single subscription or provide an easy way to migrate a site to a different subscription or region (unless I am missing something!).</del>
- [You can use MySQL](https://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-git/) (edit: You can use this with Web Roles easily too now by adding a MySQL database using Add-ons).
- You only need one instance to get the SLA rather than 2 instances in Web Roles
- It supports [multiple programming languages out of the box](http://www.windowsazure.com/en-us/services/web-sites/)
- It takes seconds rather than minutes to scale up and out as well as changing tier.
- You can [host your "naked" domain name (i.e. without www.) in a supported way](http://weblogs.asp.net/scottgu/archive/2012/09/17/announcing-great-improvements-to-windows-azure-web-sites.aspx) rather than having to resort to [external services](http://dnsazure.com), [clever programmatic solutions](http://www.voiceoftech.com/swhitley/index.php/2011/03/naked-domains-and-dynamic-dns-with-windows-azure/) or being careful [not to nuke your deployment](http://blogs.msdn.com/b/ryancrawcour/archive/2012/01/09/windows-azure-and-fixed-ip-addresses.aspx).
- You can get [memory dumps via a REST API](http://weblogs.asp.net/scottgu/archive/2013/06/27/windows-azure-general-availability-release-of-web-sites-mobile-services-new-autoscale-alerts-support-no-credit-card-needed-for-msdn-subscribers.aspx) via [Kudu](https://github.com/projectkudu/kudu/wiki/Process-list-and-minidump)
- You can perform [remote debugging from Visual Studio](http://azure.microsoft.com/blog/2014/05/06/introduction-to-remote-debugging-on-azure-web-sites/)
- You can keep your application pool constantly warmed up with [Always On Support](http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx?utm_source=twitterfeed&amp;utm_medium=twitter)
- As part of the Always On support you can [define triggers that result in your app pool recycling automatically to auto-heal any problems in your website](http://blogs.msdn.com/b/windowsazure/archive/2014/02/06/auto-healing-windows-azure-web-sites.aspx)
- You can run [periodic or continuous background jobs in multiple languages out of the box](http://www.hanselman.com/blog/IntroducingWindowsAzureWebJobs.aspx) and you can [deploy them as part of deploying your web application](http://blog.amitapple.com/post/74215124623/deploy-azure-webjobs)
- You can use a [staging environment](http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx) and immediately switch the files to production, while changing connection strings etc. plus you can assign a custom DNS name to your staging environment rather than the random <guid>.cloudapp.net domain name for the Web Role staging slot (see the below comment from joshka though)
- You get [free, valid HTTPS out-of-the-box with the azurewebsites.net domain](http://azure.microsoft.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/)
- You get [out-of-the-box support for manual and automated backup and restore](http://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/)
- Ability to [view processes running the machine and their CPU and memory use from the Azure Portal](https://weblogs.asp.net/scottgu/azure-new-documentdb-nosql-service-new-search-service-new-sql-alwayson-vm-template-and-more) and remotely kill rogue processes
- Ability to add [pre-packaged extensibility to your web site at the click of a button via Site Extensions](http://azure.microsoft.com/blog/2014/06/20/azure-web-sites-extensions/)
- You can connect to on-premise resources securely without needing a VPN using [Hybrid Connections](http://azure.microsoft.com/en-us/documentation/articles/integration-hybrid-connection-overview/)
- There is an in-built function that allows you to perform A/B testing and canary deployments called [Testing in Production (TiP) / Traffic Routing](https://glamcoder.ru/azure-websites-testing-in-production-to-win-en/)


## Web Roles


With all that in mind, this is what I see as the advantages of / situations you would use Web Roles (a lot of those also apply to Virtual Machines, but that is outside the scope of this post):


- If you need to create an application that has [non standard HTTP ports open](http://msdn.microsoft.com/en-us/library/windowsazure/hh881877.aspx) (or frankly ports open for non-HTTP traffic) you can't use Web Sites.
- You can't [RDP into the server](https://www.windowsazure.com/en-us/develop/net/common-tasks/remote-desktop/) for debugging or other purposes when using Web Sites.
- <del>If you want surety about network / virtual machine isolation of your application for security reasons you may not want to use (at the very least free/shared) Web Sites. This is a bit of conjecture though because without knowing the internals of how Web Sites is implemented it's hard to say what kind of isolation it provides.</del> (edit: VM isolation will be the same for standard tier, see next point about network isolation)
- <del>You can use <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj218759.aspx" target="_blank">Windows Azure Virtual Networks to get network isolation of your Web Roles</a>, but this can't be used with Web Sites</del> (edit: you can [connect an Azure Web Site to a Virtual Network using a Point-To-Site VPN connection](http://azure.microsoft.com/blog/2014/09/15/azure-websites-virtual-network-integration/), [which is limited to 100 Mbps](http://azure.microsoft.com/blog/2014/06/10/expressroute-or-virtual-network-vpn-whats-right-for-me/), whereas Web Roles can be directly connected to the network)
- <del>If you want to deploy a worker role to perform background processing <a href="http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/2010/12/how-to-combine-worker-and-web-role-in.html" target="_blank">alongside your web site</a> via a worker role then you can do it using the same instance with a Web Role (thus costing less money; also, <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">Azure Web Farm</a> has the ability to support execution of console applications packaged with your web application providing the same kind of benefit).</del> (edit: Web Sites now supports Web Jobs so this point is no longer relevant)
- You can run [elevated start up scripts](http://msdn.microsoft.com/en-us/library/windowsazure/gg456327.aspx) with a Web Role that then allow you to install any software you want or configure it in any way you desire.
- You can mount a NTFS filesystem stored in blob storage using [Azure Drive](http://convective.wordpress.com/2010/02/27/azure-drive/)
- You have [full control over what diagnostic information is collected from a Web Role](https://www.windowsazure.com/en-us/develop/net/common-tasks/diagnostics/), which you may want to use for [auto scaling](http://msdn.microsoft.com/en-us/library/hh680892(v=pandp.50).aspx), or customised [monitoring](http://www.cerebrata.com/products/AzureDiagnosticsManager/) [solutions](http://communities.quest.com/docs/DOC-9906).
- You have full control over how [IIS is configured](http://msdn.microsoft.com/en-us/library/windowsazure/gg433059.aspx) in a Web Role; note: it's worth noting that [Microsoft are consistently opening up IIS configuration options from web.config](http://blogs.msdn.com/b/windowsazure/archive/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites.aspx).
- <del>Your Web Role endpoint resolves to a <a href="http://blogs.msdn.com/b/ryancrawcour/archive/2012/01/09/windows-azure-and-fixed-ip-addresses.aspx" target="_blank">static IP address</a> assuming you don't nuke your deployment.  edit: the fact you can have A Record support means this can be achieved with Web Sites too.</del> edit: both Web Sites and Web Roles allow for A-record support, with Web Roles you can [reserve a static IP address](http://azure.microsoft.com/blog/2014/05/14/reserved-ip-addresses/).
- <del>You can <a href="http://blogs.msdn.com/b/gonzalorc/archive/2010/02/07/auto-scaling-in-azure.aspx" target="_blank">automatically scale your web site</a> using Web Roles.</del> You can perform much more complex auto-scaling with Web Roles - the slider-based auto-scaling in the portal is much more comprehensive and allows CPU and Azure Storage Queue based scaling <del>and time schedules</del> (edit: Web Sites now has the ability to scale using time schedules in the portal) and if you want even more complex auto-scaling you can use the [Autoscaling Application Block (aka WASABi)  
](http://msdn.microsoft.com/en-us/library/hh680892(v=pandp.50).aspx)    

    [![Azure Web Roles CPU portal autoscaling]({{ site.baseurl }}/assets/azure-web-roles-cpu-auto-scale-150x150.png)](http://media.robdmoore.id.au/uploads/2012/06/azure-web-roles-cpu-auto-scale.png)  
*Web Roles CPU autoscaling*

    [![Azure Web Roles Storage Queue portal autoscaling]({{ site.baseurl }}/assets/azure-web-roles-queue-auto-scale-150x150.png)](http://media.robdmoore.id.au/uploads/2012/06/azure-web-roles-queue-auto-scale.png)  
*Web Roles queue autoscaling*

    [![Azure Web Sites CPU portal autoscaling]({{ site.baseurl }}/assets/azure-web-sites-cpu-autoscale-150x150.png)](http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-cpu-autoscale.png)  
*Web Sites CPU autoscaling*
- You can scale out to a very large number of instances for extremely high load web sites (I know of a [situation](http://blogs.msdn.com/b/windowsazure/archive/2010/12/22/real-world-windows-azure-interview-with-wayne-houlden-chief-executive-officer-at-janison.aspx) where at least 250 instances were used). Web Sites <del>(at least at the moment, and with the default configuration when you first get it - it's potentially possible to increase this) seems to have a maximum of three instances</del> has a maximum of [6 shared or 10 <del>reserved</del> standard instances](http://www.windowsazure.com/en-us/pricing/details/web-sites/).
- <del>Furthermore, as per above screen shot and at least for the moment,</del> Web Sites doesn't have Extra Small (great for cost effective hosting of low load web sites - but the free and shared instances make up for this) or A4 (Extra Large) / A5 / A6 / A7 / A8 / A9 / D-series / G-series (if you need extreme vertical scale - but you probably only need this for intense Worker Role processing rather than for web sites [unless you are doing something very wrong/weird with your web application :P]).
- <del>At the moment you can only have SSL connections to your custom domain name by using Web Roles since there is no ability to upload Security Certificates to your Web Site instances, but this <a href="http://blog.ntotten.com/2012/06/08/three-more-things-about-windows-azure-web-sites/" target="_blank">will probably be added soon</a>. There is <a href="http://blog.ntotten.com/2012/06/08/three-more-things-about-windows-azure-web-sites/" target="_blank">SSL for the azurewebsites.net domain name</a> that you get though.</del> edit: SSL for custom domain names in Azure Web Sites has been released, [but it comes at a cost](http://www.windowsazure.com/en-us/pricing/details/web-sites/#), whereas you can install SSL to your Web Role for free.
- <del>If you want securely managed Security Certificates for any other purpose than SSL e.g. config encryption, authentication, etc. then you will need to use Web Roles (for now at least).</del> edit: y[ou can now use Azure Web Sites for arbitrary certificates](http://azure.microsoft.com/blog/2014/10/27/using-certificates-in-azure-websites-applications).
- <del>Apparently, during the preview there is a limit of 1GB of space per subscription that can be used with Web Sites and you can have a maximum of 10 web sites. I found this in a <a href="http://stackoverflow.com/a/10956429/1445713" target="_blank">Stack Overflow answer</a> from a <a href="http://stackoverflow.com/users/1325423/avkashchauhan" target="_blank">Microsoft employee working on Azure</a></del>. Free and paid shared instances have a [limit of 1GB of space](https://www.windowsazure.com/en-us/pricing/details/#web-sites) with free instances having a limit of 10 websites and shared instances having a limit of 100 websites (<del>reserved</del> **standard instances have 10GB of space** and a 500 website limit [I wonder if this is an IIS limit otherwise why would it be there since you have a complete VM(s) at your disposal?]). With <del>Accelerator for Web Roles</del>[Azure Web Farm](https://github.com/robdmoore/azurewebfarm) and [AzureWebFarm.OctopusDeploy](https://github.com/MRCollective/AzureWebFarm.OctopusDeploy) there is no limit on the number of sites, and depending on your role size you can certainly have more than 1 GB of storage (apart from the fact you have have more than one hosted service, each with more than 1 GB of space).
- If you want to have any domain name you want to resolve against your web site using a CName without having to specify those domain names explicitly in the management portal then you will need to use Web Roles (see the comments section below for explanation).
- <del>You have the option of using VIP swap as a deployment option - this allows you to fully test the deployment you are about to make and then switch between old and new very quickly (and more usefully, vice versa if something goes wrong)</del> (edit: [Web Sites now has a staging environment](http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx) with similar (but more advanced) functionality)
  - While I think this is very useful in some circumstances, particularly if the act of deploying is accompanied by separate, long-running processes that could go wrong (e.g. complex database changes that are triggered before the vip swap) I think in general if you can simplify your deployment process such that it's not required (and simply make it really quick and easy to rollback to the last version) then that's better (Web Sites enables this due to it's out-of-the-box deployment options)
- Affinity groups to allow you to ensure that Web Roles are close to storage accounts and potentially other roles within the datacentre (decreasing latency and increasing performance).
  - <del>I suspect that Web Sites may well do this behind the scenes for the storage account you associate with the Web Site, but of course you can only do it with that storage account and not with multiple ones or other sites / roles</del>
  - You can create linked resources, which may (I can't verify or find any information to back this up) provide the same effect - you can do this for Azure SQL Databases and storage accounts:  
[![Azure Web Sites Add Linked Resource Dialog]({{ site.baseurl }}/assets/azure-web-sites-linked-resource-150x150.png)](http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-linked-resource.png)
- Explicit upgrade and fault domains
  - Web Sites makes upgrade domains redundant given the deployment options (see note above about VIP swap) and I assume that fault domains are likely transparently implemented for you, but that could be wrong
- [In-role cache nodes](http://www.windowsazure.com/en-us/manage/services/cache/net/how-to-in-role-cache/)
- The cscfg file and ability to edit in the portal
  - You can edit web.config variables and connection strings within the portal for Web Sites so this makes it somewhat redundant
- If you want to use Traffic Manager to distribute your application in multiple data centres across the globe then you can't use Web Sites, however you can get a similar affect using an Azure Virtual Machine and IIS ARR as per [http://stackoverflow.com/questions/13697863/is-it-possible-to-provision-the-same-domain-name-on-multiple-azure-websites](http://stackoverflow.com/questions/13697863/is-it-possible-to-provision-the-same-domain-name-on-multiple-azure-websites)
- If you want to use the Content Delivery Network against your web site rather than a static Storage Account then you need a Cloud Service and can't use Web Sites.
- <del>Windows Azure Web Roles has an SLA (99.95%), but Web Sites has no SLA.</del>[Web Sites has a 99.9% SLA whereas Web Roles has a 99.95% SLA](http://www.windowsazure.com/en-us/support/legal/sla/).
- Web Roles can be easily deleted and redeployed from a package in blob storage so if you only need your site functioning for part of the day you could delete the deployment when it's not needed and have a significant cost saving.
  - Web Roles are charged by the minute - I can't work out if Web Sites are the same or not though, but I assume so since the [pricing page](http://www.windowsazure.com/en-us/pricing/details/web-sites/) talks about converting the usage to Compute hour equivalents.
- Web Roles have 64-bit app pools by default - Web Sites are 32-bit by default and in fact you have to [upgrade to standard mode to get a 64-bit app pool](http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure/#howtochangeconfig); it is possible to [downgrade the Web Role app pool to 32-bit](http://blogs.msdn.com/b/zxue/archive/2011/10/31/enabling-support-for-32-bit-iis-applications-in-windows-azure.aspx)
- If you want to use GDI+ or report viewer then that is not currently supported in Web Sites (but does work on Web Roles) - it is in the long term plan to add support and you can keep track of progress via the [MSDN forums](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/b4a6eb43-0013-435f-9d11-00ee26a8d017/report-viewer-error-on-export-pdf-or-excel-from-azure-web-sites)
- If you want to use DNS lookups in code then that isn't possible in Azure Web Sites (sorry - I can't find a link for this one)
- <del>The regions that you can deploy Web Sites to are currently restricted while this feature is in preview, but there are probably <a href="http://blog.ntotten.com/2012/06/07/10-things-about-windows-azure-web-sites/#comment-287" target="_blank">plans to roll out wider</a> (see point 3 in the link) (edit: it's available in all regions except South East Asia - I can't find any reason why it's not available in that region).</del>[  
](http://media.robdmoore.id.au/uploads/2012/06/websites_regions.png)
- You can make calls to localhost on the role, which isn't possible in Azure Web Sites since it doesn't use a \* binding in IIS - instead you have to use the domain name of the site, which will go out through the Azure load balancer
- You can access performance counters



While reading up on this post I found out something about Web Roles that I didn't know - apparently you can [deploy a Web Role package that contains multiple web sites](http://blog.structuretoobig.com/post/2012/01/17/One-Azure-Web-Role-Multiple-Websites.aspx) (by specifying their host headers), but it does mean that you have to always deploy all the websites at the same time and keep them all in the same Visual Studio solution.


## Updates

### Update (10 June 2012)


David Ebbo send me a message via Twitter to let me know the [solution he is using to remember his Git password](https://github.com/anurse/git-credential-winstore). Also, [I found a post](https://github.com/projectkudu/kudu/wiki/Blog-posts-and-screencasts) that describes how to [point to other NuGet feeds than the official one when using package restore](http://blog.maartenballiauw.be/post/2012/06/07/Use-NuGet-Package-Restore-to-avoid-pushing-assemblies-to-Windows-Azure-Websites.aspx).


### Update (28 August 2012)


I read a [truly excellent post yesterday about Virtual Networks](http://convective.wordpress.com/2012/08/26/windows-azure-cloud-services-and-virtual-networks/) and it made the point that you can't join a Web Site to a Virtual Network, but of course you can join a VM or Web/Worker Role. Thus I added that as another limitation above.


### Update (15 September 2012)


[West US Azure data centres now support Web Sites](https://twitter.com/windowsazure/status/245223869638660096).


### Update (18 September 2012)


There were a few [big announcements today about Azure Web Sites](http://weblogs.asp.net/scottgu/archive/2012/09/17/announcing-great-improvements-to-windows-azure-web-sites.aspx) and I've updated this post with some minor corrections accordingly.


### Update (9 October 2012)


Added some rather obvious differences I originally missed thanks to the comment below from Roland.


### Update (1 January 2013)


Updated to reflect the fact that East Asia is now supported for Azure Web Sites (as per [this announcement](http://weblogs.asp.net/scottgu/archive/2012/11/19/more-great-improvements-to-the-windows-azure-management-portal.aspx)) and the fact you can now have up to 6 shared and 10 reserved instances rather than the original 3 (as per [this announcement](http://weblogs.asp.net/scottgu/archive/2012/12/21/great-updates-to-windows-azure-mobile-services-web-sites-sql-data-sync-acs-media-more.aspx)).


### Update (27 April 2013)


Updated to add the fact that Traffic Manager isn't supported for Web Sites.


### Update (25 May 2013)


Updated to add a note about CDN support as pointed out by Teo below.


### Update (17 July 2013)


Overhaul of the post to get it up to date with recent changes to Web Sites and Web Roles as well as a general tidy up and making it more friendly (e.g. added diagram, new intro and tl;dr section and moved around some of the points that were in the wrong section).


### Update (8 September 2013)


Added information about GDI+/Report Viewer as pointed out by Travis below.


### Update (26 January 2014)


Added information about Web Sites staging environment, Always On Support, DNS lookups, AzureWebFarm.OctopusDeploy and In-role cache and emphasised the 10GB limit for Azure Web Sites.


### Update (29 January 2014)


Added note about the web.config options for configuring IIS that are increasingly being opened up for Azure Web Sites.


### Update (8 February 2014)


Added notes about A8 and A9 VM sizes, 32-bit vs 64-bit app pools and auto healing.


### Update (22 October 2014)


Updated post to reflect the following:


- Out-of-the-box HTTPS with Azure Web Sites
- Azure Web Sites Backup
- Azure Web Sites Processes
- D-series and G-series VMs for Azure Web Roles
- VPN connection to a Virtual Network for Azure Web Sites
- South East Asia available for Azure Web Sites and TFS support is now VSO support with a build as per [Josh's comment](http://robdmoore.id.au/blog/2012/06/09/windows-azure-web-sites-vs-web-roles/#comment-104971)
- Can't make localhost calls on Azure Web Sites
- Site Extensions for Azure Web Sites
- Clarified that you can reserve a static IP for Web Roles for A record support now
- Out-of-the-box Remote Debugging with Azure Web Sites


### Update (31 October 2014)


Updated post to mention Hybrid Connections support in Azure Web Sites and the fact that you can use custom certificates in Azure Web Sites now.


### Update (6 April 2015)


Added some notes about App Service: Web Apps and added information about the TiP feature.


### Update (3 January 2016)


Added note about access to performance counters as pointed out by Matt below.

