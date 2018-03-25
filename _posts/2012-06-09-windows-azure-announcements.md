---
id: 274
title: Windows Azure announcements
date: 2012-06-09T13:06:29+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=274
permalink: /blog/2012/06/09/windows-azure-announcements/
categories:
  - Technical
tags:
  - continuous delivery
  - Windows Azure
---
Microsoft made a <a href="http://weblogs.asp.net/scottgu/archive/2012/06/07/meet-the-new-windows-azure.aspx" target="_blank">HUGE set of announcements</a> to do with Windows Azure the other night (well, day if you are in the US). With this release Microsoft are demonstrating how serious they are about Azure and cloud computing, which can only lead to more innovation and exciting developments! While nothing that Microsoft have announced is particularly unique (most of it is on offer from providers like AWS and App Harbor), it really tightens up the Microsoft offering (which as a PaaS offering was already impressive). If Microsoft continue to pump development into Azure at the rate they have done then the other providers better watch out!

For anyone that saw my tweets after I read the above linked post then you will know that I amÂ EXTREMELYÂ excited about this release. In particular, the things that really struck me were the new portal (the old one is slow, clunky and you have to have Silverlight so no tablet or phone support if you don&#8217;t have a Windows device), the monitoring dashboard (previously you had to roll your own) and the new Websites feature.

I have spent a lot of time in the last few months playing around with speeding up Azure deployments and I wasn&#8217;t terribly happy with the solutions available. For web roles I was using Windows Azure Accelerator for Web Roles in combination with web deploys from a CI server and for worker roles I was using a PowerShell command that did an in place upgrade. This lead to deployment times of around 30 seconds and 8 minutes respectively. I am happy with 30s (although the Accelerator has a few deployment problems that I have come across that make it less robust than I would like), but 8 minutes is way too long. I actually have an idea for getting fast deployments of worker roles using a similar technique to Accelerator that I have been cooking up with my team&#8217;s Senior Developer, Matt Davies, but I&#8217;ll leave that for another post.

As Matt and I expected, the new Azure announcements have left the <a href="https://github.com/microsoft-dpe/wa-accelerator-webroles" target="_blank">Accelerator</a> project in a deprecated state. I actually think there are still valid uses of it, but I&#8217;ll leave that for another post too.

So long story short, I&#8217;m really happy that Microsoft have done a lot of work on making deployments and multi-tenant website hosting on Azure a snap because it was one of the biggest frustrations of Azure. Certainly, it was this that lead to the creation of <a href="https://appharbor.com/" target="_blank">App Harbor</a>. I&#8217;ve had a bit of a play with App Harbor over the last 6 months, and while there are certain aspects of it that are very cool, in particular if you aren&#8217;t using a CI server, I&#8217;m not a huge fan so the Azure announcement is even more welcome news.