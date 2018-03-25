---
id: 277
title: 'Windows Azure Web Sites (App Service: Web Apps) vs Web Roles'
date: 2012-06-09T19:18:27+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=277
permalink: /blog/2012/06/09/windows-azure-web-sites-vs-web-roles/
categories:
  - Technical
tags:
  - accelerator for web roles
  - continuous delivery
  - Windows Azure
---
Welcome! This is a post that covers in great detail the differences between Windows Azure Web Sites (<a href="http://weblogs.asp.net/scottgu/announcing-the-new-azure-app-service" target="_blank">App Service: Web Apps as they are now called</a> &#8211; this article will just refer to them by their original name) and Windows Azure Web Roles (azurewebsites.net vs cloudapp.net). It was first written a couple of days after Web Sites was first released, but I have been keeping it up to date as changes to Web Sites are announced. There is a change log of updates at the bottom of the post and I have struck out content that becomes out of date over time. There is also a goodÂ <a href="http://azure.microsoft.com/en-us/documentation/articles/choose-web-site-cloud-service-vm/" target="_blank">official Microsoft post</a> that gives a similar comparison, but Â not quite as comprehensive that you can also refer to.

Shameless Plug: If you are interested in using the power of Azure Web Roles with the nice deployment experience of Azure Web Sites then check out theÂ <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">AzureWebFarm</a>Â and <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy" target="_blank">AzureWebFarm.OctopusDeploy</a> libraries I work on.

## Diagrammatic Overview

The Windows Azure Training Kit has a slide with a really nice overview of the three options for deploying web applications in Windows Azure (note: Virtual Machines are outside the scope of this post):<figure id="attachment_1271" style="width: 771px" class="wp-caption aligncenter">

[<img class=" wp-image-1271 " src="http://media.robdmoore.id.au/uploads/2012/06/azure-web-overview.png" alt="Azure Web Apps Options Overview" width="771" height="440" srcset="https://media.robdmoore.id.au/uploads/2012/06/azure-web-overview.png 889w, https://media.robdmoore.id.au/uploads/2012/06/azure-web-overview-300x171.png 300w, https://media.robdmoore.id.au/uploads/2012/06/azure-web-overview-624x355.png 624w" sizes="(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px" />](http://media.robdmoore.id.au/uploads/2012/06/azure-web-overview.png)<figcaption class="wp-caption-text">Options for deploying websites in Azure and comparison to on-premise hosting.</figcaption></figure> 

## tl;dr

Azure Web Sites has the following advantages:

  * Out of the box support for ASP.NET, python, PHP, node.js and classic ASP
  * <span style="line-height: 14px;">Out of the box support for near-instant Git, VSO, FTP, Web Deploy and Dropbox deployments</span>
  * Out of the box support for configuring a VSO build that can compile code and run tests as part of the deployment
  * Instant roll-backs (when using Git or VSOÂ deployments)
  * Free, out-of-the-box valid HTTPS when using default azurewebsites.net domain
  * Out-of-the-box manual and automated backup and restore
  * Much faster site provisioning and scaling (often takes seconds)
  * Simpler Visual Studio solution (no need for extra Cloud project)
  * One-click install of common open-source blog and CMS platforms
  * Friendlier, comprehensive in-built (read: one-click to activate) monitoring and diagnostics
  * Automatic configuration modification and config transforms on deploy
  * Multiple websites (deployed separately) on a single farm out of the box
  * Memory dumps via a REST API
  * Out-of-the-box support for remote debugging from Visual Studio
  * <span style="line-height: 1.714285714; font-size: 1rem;">Ability to have staging environment with custom domain name and ability to change configuration settings at the same time</span>
  * Always On Support to keep your application pool warmed up and (optionally) auto-heal any problems in your app pool
  * Multiple programming language support for periodic and continuous background jobs
  * Ability to view processes running the machine and their CPU and memory use from the Azure PortalÂ and remotely kill rogue processes
  * Ability to add pre-packaged extensibility via Site Extensions
  * Ability to connect to on-premise resources securely without needing VPN via Hybrid connections
  * In-built A/B testing / canaryÂ deployment ability using Testing in Production Â (TiP) / Traffic Routing feature

Azure Web Roles has the following advantages:

  * <span style="line-height: 14px;">Use non-standard HTTP and/or TCP ports</span>
  * Remote desktop into the VMs
  * FasterÂ Windows Azure Virtual Network connection
  * <span style="line-height: 1.714285714; font-size: 1rem;">Run arbitrary startup scripts with or without elevated privileges</span>
  * Use Azure Drive to mount NTFS volumes from blob storage
  * More control over what diagnostic information you would like to collect
  * Full control to configure IIS
  * Perform complex autoscaling
  * Scale to hundreds of VM instances (max in Web Sites is currently 10)
  * Use Extra Small (low cost) and A4 (Extra Large) / A5 / A6 / A7 / A8 / A9 (intense workloads), D-series and G-series VM sizes
  * Install SSL for unlimited custom domain names for free
  * Resolve arbitrary domain names to your site without specifying them in the portal
  * <span style="line-height: 1.714285714; font-size: 1rem;">Configure affinity groups and make use of upgrade and fault domains</span>
  * Use the CDN against your web site content
  * In-role cache nodes
  * 99.95% SLA as opposed to a 99.9% SLA
  * You get more than 50GB of disk space
  * <span style="line-height: 1.714285714; font-size: 1rem;">Ability to use GDI+, Report Viewer and DNS lookups in your code</span>
  * Ability to make calls to localhost
  * Access to performance counters

Sometimes Virtual Machines are a valid choice &#8211; check out my <a href="http://readify.net/insights/whitepapers/developing-and-deploying-web-applications-in-windows-azure/" target="_blank">whitepaper on deploying web applications in Azure</a> for more information.

### Conclusion

If you need enormous scale, a non-standard/complex configuration (e.g. fullÂ IIS customisation, non-standard ports, complex diagnostics or start up scripts / custom software installs), more than 50GB of disk space or RDP then you need Web Roles.

In most other scenarios Web Sites is the best choice since itâ€™s the simplest option and is fully-managed. The Web Sites platform is being constantly innovated on with new features surfacing almost every month â€“ Microsoft are investing a lot of resources into making sure itâ€™s a state of the art platform. If your application grows in complexity over time and needs to migrate from Web Sites to Web Roles or Web Roles to Virtual Machines this is a relatively easy process so you should be able to start with the simplest option initially (Web Sites) with confidence you can change later if required.

## Web Sites

Long-story short: Convention-over-configuration IIS-as-a-service to get you up and running quickly in Azure with a minimum of fuss (kind of like App Harbor). Also, it allows you to use a certain amount of Azure resources for free (<a href="http://www.windowsazure.com/en-us/pricing/details/web-sites/" target="_blank">10 websites on shared instances with limited bandwidth</a>), which is a welcome addition and will be great for proof of concepts or just playing around with stuff!

The advantages that Web Sites seems to have over Web Roles are:

  * Out of the box support forÂ <a href="https://www.windowsazure.com/en-us/develop/net/common-tasks/publishing-with-git/" target="_blank">Git</a>Â (including hosted within Azure, CodePlex, Github and Bitbucket),Â <a href="http://azure.microsoft.com/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/" target="_blank">VSO</a>,Â <a href="http://social.msdn.microsoft.com/Forums/en-US/windowsazurewebsitespreview/thread/4ffc50e0-56ca-43c1-8c5c-a3171daf5c34" target="_blank">FTP and Web Deploy</a>Â andÂ <a href="http://blogs.msdn.com/b/windowsazure/archive/2013/03/19/new-deploy-to-windows-azure-web-sites-from-dropbox.aspx" target="_blank">Dropbox</a> deployments, which makes automated deployments andÂ continuous delivery dead easy (not that it&#8217;s terribly difficultÂ <a href="https://www.windowsazure.com/en-us/develop/net/common-tasks/continuous-delivery/" target="_blank">using PowerShell</a> for Web Roles), and importantly, **quick**. 
      * Annoyingly (unless I&#8217;ve missed something), the git publishing doesn&#8217;t use private keys so you have to keep typing in the password, although from watching <a href="http://www.youtube.com/watch?v=72SAHWUHnzA&feature=youtu.be" target="_blank">David Ebbo&#8217;s Youtube video</a> on publishing from Git there must be some way to make it remember the password (I wouldn&#8217;t know as I always use private keys). [_See update at end of post for instructions_]
      * [It would be cool](http://robdmoore.id.au/blog/2012/09/18/azure-web-sites-paid-shared-hosting-custom-domain-names-and-continuous-deployment/ "Azure Web Sites: Paid shared hosting, custom domain names and continuous deployment") if some of these features were added to Web Roles and Worker Roles<del>; I&#8217;m not sure if <a href="https://twitter.com/davidebbo/status/211266524269391873" target="_blank">this tweet from David Ebbo</a> is any indication that might happen!</del>
      * <del>It seems that</del> Microsoft have open sourced their <a href="https://github.com/projectkudu/kudu" target="_blank">Git-IIS deployment library, Kudu</a>, which is cool ðŸ™‚
      * I tried to deploy a solution that had multiple web projects, but no matter what I did it kept deploying the first web project that I had deployed. I&#8217;m not sure what conventions it uses, but if you need to configure which project is deployed then I imagine you can consult the <a href="https://github.com/projectkudu/kudu/wiki/Customizing-deployments" target="_blank">relevant Kudu documentation</a>Â (edit: looks like there are <a href="http://www.devtrends.co.uk/blog/azure-web-sites-git-deploy-for-multiple-project-solutions" target="_blank">some</a> <a href="http://blog.amitapple.com/post/38419111245/azurewebsitecustomdeploymentpart3" target="_blank">ways</a> to address it).
      * If you use the Git publishing model <a href="http://blog.maartenballiauw.be/post/2012/06/07/Use-NuGet-Package-Restore-to-avoid-pushing-assemblies-to-Windows-Azure-Websites.aspx" target="_blank"><del>(and I assume the TFS publishing model)</del></a> then you don&#8217;t have to commit your NuGet package binaries as they will automatically get resolved when you push (<del>you do have to turn on Package Restore on the solution in Visual Studio for it to do it though</del> &#8211; edit: <a href="http://blog.davidebbo.com/2014/01/the-right-way-to-restore-nuget-packages.html" target="_blank">package restore is being deprecated</a>). This is great because it makes your deployment much faster. It does mean that if you use packages that aren&#8217;t in the official NuGet repository (e.g. in a private repository, or using a <a href="http://www.myget.org/" target="_blank">package service</a>) then you will need to include those ones <a href="http://blog.maartenballiauw.be/post/2012/06/07/Use-NuGet-Package-Restore-to-avoid-pushing-assemblies-to-Windows-Azure-Websites.aspx" target="_blank">or update the nuget config</a> <del>&#8211; I haven&#8217;t tried seeing what happens when you do that though yet, so try with caution</del>.
  * Gives you the ability to roll-back to previous deployments instantly via the management portal if you are using Git <del>(and I assume TFS)</del> deployments.
  
    [<img class="aligncenter size-thumbnail wp-image-283" title="Redeploy previous deployments" src="http://media.robdmoore.id.au/uploads/2012/06/redeploy-150x150.png" alt="Redeploy previous deployments" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/redeploy.png)
  * You can deploy almost instantly out of the box (with the above mentioned deployment methods), rather than in 8-12Â minutes or having to set up something like <del>Accelerator for Web Roles</del>Â <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">Azure Web Farm</a>Â or <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy" target="_blank">AzureWebFarm.OctopusDeploy</a>.
  * You can provision a new Web Site much faster than a Web Role (seconds rather than 8+ minutes); I&#8217;m guessing Microsoft will always have spare capacity spun up and ready at any point in time &#8211; their capacity management software must be fascinating!
  * For .NET web apps: You don&#8217;t have to set up a <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx" target="_blank">separate project</a> in your Visual Studio solution to deploy to Azure &#8211; you can simply deploy a normal web app solution as-is. 
      * This also means you don&#8217;t have to maintain two sets of configurations and set up a storage account for diagnostics so you can be up and running much quicker.
  * Out of the box support for installing ready-to-go, open source web applications (from a list of common ones; mainly CMS&#8217;s and blogs).[<img class="aligncenter size-thumbnail wp-image-284" title="Create an Azure Web Sites site from a pre-built CMS" src="http://media.robdmoore.id.au/uploads/2012/06/cms-150x150.png" alt="Create Azure Web Site with CMS" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/cms.png)
  * <del style="line-height: 1.714285714; font-size: 1rem;">Built-in monitoring from the management portal</del> <del>(Web Roles has CPU and (optionally) memory as well now, but this also includes HTTP errors, requests and data)</del><a href="http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx" target="_blank">Web Sites has out of the box support for per-minute diagnostics now</a>, which you can get the data for with Web Roles, but it&#8217;s all in-built into the portal for Web Sites and easier to use / consume:
  
    [<img class="aligncenter size-thumbnail wp-image-281" title="Windows Azure Web Sites monitoring dashboard" src="http://media.robdmoore.id.au/uploads/2012/06/stats2-150x150.png" alt="Monitoring dashboard" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/stats2.png)
  * Extra diagnostics options at the click of a button:
  
    [<img class="aligncenter size-medium wp-image-1301" src="http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-diagnostics-300x179.png" alt="Azure Web Sites Diagnostics Options" width="300" height="179" srcset="https://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-diagnostics-300x179.png 300w, https://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-diagnostics-624x373.png 624w, https://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-diagnostics.png 877w" sizes="(max-width: 300px) 100vw, 300px" />](http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-diagnostics.png)
  * Ability to inject configuration variables to your web.config file rather than having to package the final version with the deployment. 
      * This means you don&#8217;t have to use <a href="http://blogs.msdn.com/b/sqlazure/archive/2010/09/07/10058942.aspx" target="_blank">encrypted web.config files</a> if you want to keep production configuration information in source control so you can do automated deployments, but still prevent developers from accessing the production environment.
      * It does mean you potentially need to be more careful about who you give access to the management portal for your instances because the connection strings will <del>appear in plain text</del> be accessible to them.
  * If you have a web.release.config file then the XDT transformations in this file will automatically be applied before deploying your site.
  * You can add multiple host names that your site responds to (if it&#8217;s using <del>reserved instances</del>Â standard or shared tier, but not for <del>shared</del> free tier). 
      * It appears you have to do this if you want to point a CName record at the site &#8211; given there are multiple sites being hosted on the same IIS instances this makes sense.
      * Given Web Roles allow you to point as many domain names as you want at it and it will resolve for all of them (assuming you are trying to resolve the main web site that is deployed in the Azure package rather than using a solution like <del>Accelerator for Web Roles</del>Â <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">Azure Web Farm</a>, which does require you to specify the host name) this isn&#8217;t really an advantage that Web Sites has over Web Roles.
      * What it does mean though is that **you can host multiple sites on a single set of reserved servers** **out of the box** (which is why Web Sites <a href="http://ntotten.com/2012/06/21/update-on-the-windows-azure-accelerators/" target="_blank">deprecated Accelerator for Web Roles</a> in combination with near-instant deployments).
      * There is an implication if you are using <del>shared</del> free tier rather than <del>reserved</del>Â standard or shared tiers that you can&#8217;t point custom domain names to your web site and thus have to use theÂ azurewebsites.net domain name (which is probably fine if you are doing a prototype or proof of concept).
      * <del>It seems that for a given subscription in a given region you can have either free/shared <strong>or</strong> reserved Web Sites and thus any web sites that you add for a given subscription / region that has reserved Web Sites will be shared on your reserved servers.</del> 
          * <del>I can&#8217;t confirm this explicitly, but it&#8217;s the only thing that makes sense to me after seeing the management portal and reading between the lines in the documentation.</del>[<img class="aligncenter size-thumbnail wp-image-288" title="Azure Web Sites - Web Site Mode" src="http://media.robdmoore.id.au/uploads/2012/06/web_site_mode-150x150.png" alt="Web Site Mode" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/web_site_mode.png)[<img class="aligncenter size-thumbnail wp-image-287" title="Azure Web Sites - Shared to Reserved" src="http://media.robdmoore.id.au/uploads/2012/06/shared_to_reserved-150x150.png" alt="Shared to Reserved" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/shared_to_reserved.png)<a style="color: #ff4b33; line-height: 24px;" href="http://media.robdmoore.id.au/uploads/2012/06/reserved_to_shared.png"><img class="aligncenter size-thumbnail wp-image-286" title="Azure Web Sites - Reserved to Shared" src="http://media.robdmoore.id.au/uploads/2012/06/reserved_to_shared-150x150.png" alt="Reserved to Shared" width="150" height="150" /></a>
          * <del>I would suggest that it will be important to keep this in mind if you want to segregate the servers that certain combinations of web sites that you deploy. You might want to do this due to their load profiles conflicting with each other. This is important unless Microsoft provides an easy way in the future to segregate your reserved instances within a single subscription or provide an easy way to migrate a site to a different subscription or region (unless I am missing something!).</del>
  * <a href="https://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-git/" target="_blank">You can use MySQL</a>Â (edit: You can use this with Web Roles easily too now by adding a MySQL database using Add-ons).
  * You only need one instance to get the SLA rather than 2 instances in Web Roles
  * It supports <a href="http://www.windowsazure.com/en-us/services/web-sites/" target="_blank">multiple programming languages out of the box</a>
  * It takes seconds rather than minutes to scale up and out as well as changing tier.
  * You can <a href="http://weblogs.asp.net/scottgu/archive/2012/09/17/announcing-great-improvements-to-windows-azure-web-sites.aspx" target="_blank">host your &#8220;naked&#8221; domain name (i.e. without www.) in a supported way</a> rather than having to resort to <a href="http://dnsazure.com" target="_blank">external services</a>, <a href="http://www.voiceoftech.com/swhitley/index.php/2011/03/naked-domains-and-dynamic-dns-with-windows-azure/" target="_blank">clever programmatic solutions</a> or being careful <a href="http://blogs.msdn.com/b/ryancrawcour/archive/2012/01/09/windows-azure-and-fixed-ip-addresses.aspx" target="_blank">not to nuke your deployment</a>.
  * You can get <a href="http://weblogs.asp.net/scottgu/archive/2013/06/27/windows-azure-general-availability-release-of-web-sites-mobile-services-new-autoscale-alerts-support-no-credit-card-needed-for-msdn-subscribers.aspx" target="_blank">memory dumps via a REST API</a> via <a href="https://github.com/projectkudu/kudu/wiki/Process-list-and-minidump" target="_blank">Kudu</a>
  * You can perform <a href="http://azure.microsoft.com/blog/2014/05/06/introduction-to-remote-debugging-on-azure-web-sites/" target="_blank">remote debugging from Visual Studio</a>
  * You can keep your application pool constantly warmed up with <a href="http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx?utm_source=twitterfeed&utm_medium=twitter" target="_blank">Always On Support</a>
  * As part of the Always On support you can <a href="http://blogs.msdn.com/b/windowsazure/archive/2014/02/06/auto-healing-windows-azure-web-sites.aspx" target="_blank">define triggers that result in your app pool recycling automatically to auto-heal any problems in your website</a>
  * You can run <a href="http://www.hanselman.com/blog/IntroducingWindowsAzureWebJobs.aspx" target="_blank">periodic or continuous background jobs in multiple languages out of the box</a>Â and you can <a href="http://blog.amitapple.com/post/74215124623/deploy-azure-webjobs" target="_blank">deploy them as part of deploying your web application</a>
  * You can use a <a href="http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx" target="_blank">staging environment</a> and immediately switch the files to production, while changing connection strings etc. plus you can assign a custom DNS name to your staging environment rather than the random <guid>.cloudapp.net domain name for the Web Role staging slot (see [the belowÂ comment from joshka though](http://robdmoore.id.au/blog/2012/06/09/windows-azure-web-sites-vs-web-roles/#comment-104971))
  * You get <a href="http://azure.microsoft.com/en-us/documentation/articles/web-sites-configure-ssl-certificate/" target="_blank">free, valid HTTPS out-of-the-box with the azurewebsites.net domain</a>
  * You get <a href="http://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/" target="_blank">out-of-the-box support for manual and automated backup and restore</a>
  * Ability to <a href="https://weblogs.asp.net/scottgu/azure-new-documentdb-nosql-service-new-search-service-new-sql-alwayson-vm-template-and-more" target="_blank">view processes running the machine and their CPU and memory use from the Azure Portal</a>Â and remotely kill rogue processes
  * Ability to add <a href="http://azure.microsoft.com/blog/2014/06/20/azure-web-sites-extensions/" target="_blank">pre-packaged extensibility to your web site at the click of a button via Site Extensions</a>
  * You can connect to on-premise resources securely without needing a VPN using <a href="http://azure.microsoft.com/en-us/documentation/articles/integration-hybrid-connection-overview/" target="_blank">Hybrid Connections</a>
  * There is an in-built function that allows you to perform A/B testing and canary deployments called <a href="https://glamcoder.ru/azure-websites-testing-in-production-to-win-en/" target="_blank">Testing in Production (TiP) / Traffic Routing</a>

## Web Roles

With all that in mind, this is what I see as the advantages of / situations you would use Web Roles (a lot of those also apply to Virtual Machines, but that is outside the scope of this post):

  * <span style="line-height: 1.714285714; font-size: 1rem;">If you need to create an application that has </span><a style="line-height: 1.714285714; font-size: 1rem;" href="http://msdn.microsoft.com/en-us/library/windowsazure/hh881877.aspx" target="_blank">non standard HTTP ports open</a> <span style="line-height: 1.714285714; font-size: 1rem;">(or frankly ports open for non-HTTP traffic) you can&#8217;t use Web Sites.</span>
  * You can&#8217;tÂ <a href="https://www.windowsazure.com/en-us/develop/net/common-tasks/remote-desktop/" target="_blank">RDP into the server</a> for debugging or other purposes when using Web Sites.
  * <del>If you want surety about network / virtual machine isolation of your application for security reasons you may not want to use (at the very least free/shared) Web Sites. This is a bit of conjecture though because without knowing the internals of how Web Sites is implemented it&#8217;s hard to say what kind of isolation it provides.</del> (edit: VM isolation will be the same for standard tier, see next point about network isolation)
  * <del>You can use <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj218759.aspx" target="_blank">Windows Azure Virtual Networks to get network isolation of your Web Roles</a>, but this can&#8217;t be used with Web Sites</del>Â (edit: you can <a href="http://azure.microsoft.com/blog/2014/09/15/azure-websites-virtual-network-integration/" target="_blank">connect an Azure Web Site to a Virtual Network using a Point-To-Site VPN connection</a>, <a href="http://azure.microsoft.com/blog/2014/06/10/expressroute-or-virtual-network-vpn-whats-right-for-me/" target="_blank">which is limited to 100 Mbps</a>, whereas Web Roles can be directly connected to the network)
  * <del>If you want to deploy a worker role to perform background processing <a href="http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/2010/12/how-to-combine-worker-and-web-role-in.html" target="_blank">alongside your web site</a> via a worker role then you can do it using the same instance with a Web Role (thus costing less money; also,Â <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">Azure Web Farm</a>Â has the ability to support execution of console applications packaged with your web application providing the same kind of benefit).</del> (edit: Web Sites now supports Web Jobs so this point is no longer relevant)
  * You can run <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg456327.aspx" target="_blank">elevated start up scripts</a> with a Web Role that then allow you to install any software you want or configure it in any way you desire.
  * You can mount a NTFS filesystem stored in blob storage using <a href="http://convective.wordpress.com/2010/02/27/azure-drive/" target="_blank">Azure Drive</a>
  * You have <a href="https://www.windowsazure.com/en-us/develop/net/common-tasks/diagnostics/" target="_blank">full control over what diagnostic information is collected from a Web Role</a>, which you may want to use for <a href="http://msdn.microsoft.com/en-us/library/hh680892(v=pandp.50).aspx" target="_blank">auto scaling</a>, or customised <a href="http://www.cerebrata.com/products/AzureDiagnosticsManager/" target="_blank">monitoring</a> <a href="http://communities.quest.com/docs/DOC-9906" target="_blank">solutions</a>.
  * You have full control over how <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433059.aspx" target="_blank">IIS is configured</a> in a Web Role; note: it&#8217;s worth noting that <a href="http://blogs.msdn.com/b/windowsazure/archive/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites.aspx" target="_blank">Microsoft are consistently opening up IIS configuration options from web.config</a>.
  * <del>Your Web Role endpoint resolves to a <a href="http://blogs.msdn.com/b/ryancrawcour/archive/2012/01/09/windows-azure-and-fixed-ip-addresses.aspx" target="_blank">static IP address</a> assuming you don&#8217;t nuke your deployment.Â Â edit: the fact you can have A Record support means this can be achieved with Web Sites too.</del>Â edit: both Web Sites and Web Roles allow for A-record support, with Web Roles you can <a href="http://azure.microsoft.com/blog/2014/05/14/reserved-ip-addresses/" target="_blank">reserve a static IP address</a>.
  * <del>You can <a href="http://blogs.msdn.com/b/gonzalorc/archive/2010/02/07/auto-scaling-in-azure.aspx" target="_blank">automatically scale your web site</a> using Web Roles.</del>Â You can perform much more complex auto-scaling with Web Roles &#8211; the slider-based auto-scaling in the portal is much more comprehensive and allows CPU and Azure Storage Queue based scaling <del>and time schedules</del>Â (edit: Web Sites now has the ability to scale using time schedules in the portal)Â and if you want even more complex auto-scaling you can use the <a href="http://msdn.microsoft.com/en-us/library/hh680892(v=pandp.50).aspx" target="_blank">Autoscaling Application Block (aka WASABi)<br /> </a></p> <figure id="attachment_1371" style="width: 150px" class="wp-caption aligncenter">[<img class="size-thumbnail wp-image-1371" src="http://media.robdmoore.id.au/uploads/2012/06/azure-web-roles-cpu-auto-scale-150x150.png" alt="Azure Web Roles CPU portal autoscaling" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/azure-web-roles-cpu-auto-scale.png)<figcaption class="wp-caption-text">Web Roles CPU autoscaling</figcaption></figure> <figure id="attachment_1381" style="width: 150px" class="wp-caption aligncenter">[<img class="size-thumbnail wp-image-1381" src="http://media.robdmoore.id.au/uploads/2012/06/azure-web-roles-queue-auto-scale-150x150.png" alt="Azure Web Roles Storage Queue portal autoscaling" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/azure-web-roles-queue-auto-scale.png)<figcaption class="wp-caption-text">Web Roles queue autoscaling</figcaption></figure> 
    <figure id="attachment_1391" style="width: 150px" class="wp-caption aligncenter">[<img class="size-thumbnail wp-image-1391" src="http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-cpu-autoscale-150x150.png" alt="Azure Web Sites CPU portal autoscaling" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-cpu-autoscale.png)<figcaption class="wp-caption-text">Web Sites CPU autoscaling</figcaption></figure></li> 
    
      * You can scale out to a very large number of instances for extremely high load web sites (I know of a <a href="http://blogs.msdn.com/b/windowsazure/archive/2010/12/22/real-world-windows-azure-interview-with-wayne-houlden-chief-executive-officer-at-janison.aspx" target="_blank">situation</a> where at least 250 instances were used). Web Sites <del>(at least at the moment, and with the default configuration when you first get it &#8211; it&#8217;s potentially possible to increase this) seems to have a maximum of three instances</del> has a maximum of <a href="http://www.windowsazure.com/en-us/pricing/details/web-sites/" target="_blank">6 shared or 10 <del>reserved</del>Â standard instances</a>.
      * <del>Furthermore, as per above screen shot and at least for the moment,</del> Web Sites doesn&#8217;t have Extra Small (great for cost effective hosting of low load web sites &#8211; but the free and shared instances make up for this) or A4 (Extra Large) / A5 / A6 / A7 / A8 / A9 / D-series / G-series (if you need extreme vertical scale &#8211; but you probably only need this for intense Worker Role processing rather than for web sites [unless you are doing something very wrong/weird with your web application :P]).
      * <del>At the moment you can only have SSL connections to your custom domain name by using Web Roles since there is no ability to upload Security Certificates to your Web Site instances, but this <a href="http://blog.ntotten.com/2012/06/08/three-more-things-about-windows-azure-web-sites/" target="_blank">will probably be added soon</a>. There is <a href="http://blog.ntotten.com/2012/06/08/three-more-things-about-windows-azure-web-sites/" target="_blank">SSL for the azurewebsites.net domain name</a> that you get though.</del>Â edit: SSL for custom domain names in Azure Web Sites has been released, <a href="http://www.windowsazure.com/en-us/pricing/details/web-sites/#" target="_blank">but it comes at a cost</a>, whereas you can install SSL to your Web Role for free.
      * <del>If you want securely managed Security Certificates for any other purpose than SSL e.g. config encryption, authentication, etc. then you will need to use Web Roles (for now at least).</del>Â edit: y<a href="http://azure.microsoft.com/blog/2014/10/27/using-certificates-in-azure-websites-applications" target="_blank">ou can now use Azure Web Sites for arbitrary certificates</a>.
      * <del>Apparently, during the preview there is a limit of 1GB of space per subscription that can be used with Web Sites and you can have a maximum of 10 web sites. I found this in a <a href="http://stackoverflow.com/a/10956429/1445713" target="_blank">Stack Overflow answer</a> from a <a href="http://stackoverflow.com/users/1325423/avkashchauhan" target="_blank">Microsoft employee working on Azure</a></del>. Free and paid shared instances have a <a href="https://www.windowsazure.com/en-us/pricing/details/#web-sites" target="_blank">limit of 1GB of space</a> with free instances having a limit of 10 websites and shared instances having a limit of 100 websites (<del>reserved</del> **standard instances have 10GB of space** and a 500 website limit [I wonder if this is an IIS limit otherwise why would it be there since you have a complete VM(s) at your disposal?]). With <del>Accelerator for Web Roles</del>Â <a href="https://github.com/robdmoore/azurewebfarm" target="_blank">Azure Web Farm</a>Â and <a href="https://github.com/MRCollective/AzureWebFarm.OctopusDeploy" target="_blank">AzureWebFarm.OctopusDeploy</a> there is no limit on the number of sites, and depending on your role size you can certainly have more than 1 GB of storage (apart from the fact you have have more than one hosted service, each with more than 1 GB of space).
      * If you want to have any domain name you want to resolve against your web site using a CName without having to specify those domain names explicitly in the management portal then you will need to use Web Roles (see the comments section below for explanation).
      * <del>You have the option of using VIP swap as a deployment option &#8211; this allows you to fully test the deployment you are about to make and then switch between old and new very quickly (and more usefully, vice versa if something goes wrong)</del> (edit: <a href="http://weblogs.asp.net/scottgu/archive/2014/01/16/windows-azure-staging-publishing-support-for-web-sites-monitoring-improvements-hyper-v-recovery-manager-ga-and-pci-compliance.aspx" target="_blank">Web Sites now has a staging environment</a>Â with similar (but more advanced) functionality) 
          * While I think this is very useful in some circumstances, particularly if the act of deploying is accompanied by separate, long-running processes that could go wrong (e.g. complex database changes that are triggered before the vip swap) I think in general if you can simplify your deployment process such that it&#8217;s not required (and simply make it really quick and easy to rollback to the last version) then that&#8217;s better (Web Sites enables this due to it&#8217;s out-of-the-box deployment options)
      * Affinity groups to allow you to ensure that Web Roles are close to storage accounts and potentially other roles within the datacentre (decreasing latency and increasing performance). 
          * <del>I suspect that Web Sites may well do this behind the scenes for the storage account you associate with the Web Site, but of course you can only do it with that storage account and not with multiple ones or other sites / roles</del>
          * You can create linked resources, which may (I can&#8217;t verify or find any information to back this up) provide the same effect &#8211; you can do this for Azure SQL Databases and storage accounts:
  
            [<img class="aligncenter size-thumbnail wp-image-1361" src="http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-linked-resource-150x150.png" alt="Azure Web Sites Add Linked Resource Dialog" width="150" height="150" />](http://media.robdmoore.id.au/uploads/2012/06/azure-web-sites-linked-resource.png)
      * Explicit upgrade and fault domains 
          * Web Sites makes upgrade domains redundant given the deployment options (see note above about VIP swap) and I assume that fault domains are likely transparently implemented for you, but that could be wrong
      * <a href="http://www.windowsazure.com/en-us/manage/services/cache/net/how-to-in-role-cache/" target="_blank">In-role cache nodes</a>
      * The cscfg file and ability to edit in the portal 
          * You can edit web.config variables and connection strings within the portal for Web Sites so this makes it somewhat redundant
      * If you want to use Traffic Manager to distribute your application in multiple data centres across the globe then you can&#8217;t use Web Sites, however you can get a similar affect using an Azure Virtual Machine and IIS ARR as per <a href="http://stackoverflow.com/questions/13697863/is-it-possible-to-provision-the-same-domain-name-on-multiple-azure-websites" target="_blank">http://stackoverflow.com/questions/13697863/is-it-possible-to-provision-the-same-domain-name-on-multiple-azure-websites</a>
      * If you want to use the Content Delivery Network against your web site rather than a static Storage Account then you need a Cloud Service and can&#8217;t use Web Sites.
      * <del>Windows Azure Web Roles has an SLA (99.95%), but Web Sites has no SLA.</del>Â <a href="http://www.windowsazure.com/en-us/support/legal/sla/" target="_blank">Web Sites has a 99.9% SLA whereas Web Roles has a 99.95% SLA</a>.
      * Web Roles can be easily deleted and redeployed from a package in blob storage so if you only need your site functioning for part of the day you could delete the deployment when it&#8217;s not needed and have a significant cost saving. 
          * Web Roles are charged by the minute &#8211; I can&#8217;t work out if Web Sites are the same or not though, but I assume so since the <a href="http://www.windowsazure.com/en-us/pricing/details/web-sites/" target="_blank">pricing page</a> talks about converting the usage to Compute hour equivalents.
      * Web Roles have 64-bit app pools by default &#8211; Web Sites are 32-bit by default and in fact you have to <a href="http://www.windowsazure.com/en-us/documentation/articles/web-sites-configure/#howtochangeconfig" target="_blank">upgrade to standard mode to get a 64-bit app pool</a>; it is possible to <a href="http://blogs.msdn.com/b/zxue/archive/2011/10/31/enabling-support-for-32-bit-iis-applications-in-windows-azure.aspx" target="_blank">downgrade the Web Role app pool to 32-bit</a>
      * If you want to use GDI+ or report viewer then that is not currently supported in Web Sites (but does work on Web Roles) &#8211; it is in the long term plan to add support and you can keep track of progress via the <a href="http://social.msdn.microsoft.com/Forums/windowsazure/en-US/b4a6eb43-0013-435f-9d11-00ee26a8d017/report-viewer-error-on-export-pdf-or-excel-from-azure-web-sites" target="_blank">MSDN forums</a>
      * If you want to use DNS lookups in code then that isn&#8217;t possible in Azure Web Sites (sorry &#8211; I can&#8217;t find a link for this one)
      * <del>The regions that you can deploy Web Sites to are currently restrictedÂ while this feature is in preview, but there are probablyÂ <a href="http://blog.ntotten.com/2012/06/07/10-things-about-windows-azure-web-sites/#comment-287" target="_blank">plans to roll out wider</a>Â (see point 3 in the link)Â (edit: it&#8217;s available in all regions except South East Asia &#8211; I can&#8217;t find any reason why it&#8217;s not available in that region).</del>[
  
](http://media.robdmoore.id.au/uploads/2012/06/websites_regions.png) 
      * You can make calls to localhost on the role, which isn&#8217;t possible in Azure Web Sites since it doesn&#8217;t use a * binding in IIS &#8211; instead you have to use the domain name of the site, which will go out through the Azure load balancer
      * You can access performance counters</ul> 
    
    While reading up on this post I found out something about Web Roles that I didn&#8217;t know &#8211; apparently you can <a href="http://blog.structuretoobig.com/post/2012/01/17/One-Azure-Web-Role-Multiple-Websites.aspx" target="_blank">deploy a Web Role package that contains multiple web sites</a> (by specifying their host headers), but it does mean that you have to always deploy all the websites at the same time and keep them all in the same Visual Studio solution.
    
    ## Updates
    
    ### Update (10 June 2012)
    
    David Ebbo send me a message via Twitter to let me know the <a href="https://github.com/anurse/git-credential-winstore" target="_blank">solution he is using to remember his Git password</a>. Also, <a href="https://github.com/projectkudu/kudu/wiki/Blog-posts-and-screencasts" target="_blank">I found a post</a> that describes how to <a href="http://blog.maartenballiauw.be/post/2012/06/07/Use-NuGet-Package-Restore-to-avoid-pushing-assemblies-to-Windows-Azure-Websites.aspx" target="_blank">point to other NuGet feeds than the official one when using package restore</a>.
    
    ### Update (28 August 2012)
    
    I read a <a href="http://convective.wordpress.com/2012/08/26/windows-azure-cloud-services-and-virtual-networks/" target="_blank">truly excellent post yesterday about Virtual Networks</a> and it made the point that you can&#8217;t join a Web Site to a Virtual Network, but of course you can join a VM or Web/Worker Role. Thus I added that as another limitation above.
    
    ### Update (15 September 2012)
    
    <a href="https://twitter.com/windowsazure/status/245223869638660096" target="_blank">West US Azure data centres now support Web Sites</a>.
    
    ### Update (18 September 2012)
    
    There were a few <a href="http://weblogs.asp.net/scottgu/archive/2012/09/17/announcing-great-improvements-to-windows-azure-web-sites.aspx" target="_blank">big announcements today about Azure Web Sites</a> and I&#8217;ve updated this post with some minor corrections accordingly.
    
    ### Update (9 October 2012)
    
    Added some rather obvious differences I originally missed thanks to the comment below from Roland.
    
    ### Update (1 January 2013)
    
    Updated to reflect the fact that East Asia is now supported for Azure Web Sites (as per <a href="http://weblogs.asp.net/scottgu/archive/2012/11/19/more-great-improvements-to-the-windows-azure-management-portal.aspx" target="_blank">this announcement</a>) and the fact you can now have up to 6 shared and 10 reserved instances rather than the original 3 (as per <a href="http://weblogs.asp.net/scottgu/archive/2012/12/21/great-updates-to-windows-azure-mobile-services-web-sites-sql-data-sync-acs-media-more.aspx" target="_blank">this announcement</a>).
    
    ### Update (27 April 2013)
    
    Updated to add the fact that Traffic Manager isn&#8217;t supported for Web Sites.
    
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
    
      * Out-of-the-box HTTPS with Azure Web Sites
      * Azure Web Sites Backup
      * Azure Web Sites Processes
      * D-series and G-series VMs for Azure Web Roles
      * VPN connection to a Virtual Network for Azure Web Sites
      * South East Asia available for Azure Web Sites and TFS support is now VSO support with a build as per [Josh&#8217;s comment](http://robdmoore.id.au/blog/2012/06/09/windows-azure-web-sites-vs-web-roles/#comment-104971)
      * Can&#8217;t make localhost calls on Azure Web Sites
      * Site Extensions for Azure Web Sites
      * Clarified that you can reserve a static IP for Web Roles for A record support now
      * Out-of-the-box Remote Debugging with Azure Web Sites
    
    ### Update (31 October 2014)
    
    Updated post to mentionÂ Hybrid Connections support in Azure Web Sites and the fact that you can use custom certificates in Azure Web Sites now.
    
    ## Update (6 April 2015)
    
    Added some notes about App Service: Web Apps and added information about the TiP feature.
    
    ## Update (3 January 2016)
    
    Added note about access to performance counters as pointed out by Matt below.