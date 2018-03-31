---
layout: post
title: 'Azure Web Sites: Paid shared hosting, custom domain names and continuous deployment'
date: 2012-09-18 01:19:33.000000000 +08:00
type: post
categories:
- Technical
tags:
- tech evangelism
- Windows Azure
author: rob
---


There was a [set of announcements about Azure Web Sites](http://weblogs.asp.net/scottgu/archive/2012/09/17/announcing-great-improvements-to-windows-azure-web-sites.aspx) today, which give some insight into how the feature is developing and the focus areas for Microsoft with this particular service.


## The Announcements


In short:


- A new paid shared hosting model to supplement the free one
  - You pay a per-site cost, but it's very low at under $10/month for a single site
  - It removes the upper limit on bandwidth (I'm not sure if that had been announced previously - I hadn't heard about that before) for the free instances which is 165MB/day
  - [You get 5GB of outbound bandwidth for free each month for the moment](https://www.windowsazure.com/en-us/pricing/details/#data-transfers) and then [pay standard outbound rates after that](https://www.windowsazure.com/en-us/pricing/details/#web-sites)
- Based on what Scott said in his post it looks like you can have an unlimited number of web sites in reserved mode ([with the initial release it was 10](/blog/2012/06/09/windows-azure-web-sites-vs-web-roles/ "Windows Azure Web Sites vs Web Roles"))
  - I suspect this also applies to the paid shared hosting, but regardless at a point you would upgrade to reserved anyway since it's not a per-site cost so it becomes cheaper than a whole heap of shared hosting sites
- You can now use CNames against the (paid) shared hosting model
- You can now use A records against (paid) shared hosting or against reserved hosting!
  - This is huge - it means you can [host your “naked” domain name (i.e. without www.) in a supported way](http://weblogs.asp.net/scottgu/archive/2012/09/17/announcing-great-improvements-to-windows-azure-web-sites.aspx) rather than (for Web Roles) having to resort to [external services](http://dnsazure.com/), [clever programmatic solutions](http://www.voiceoftech.com/swhitley/index.php/2011/03/naked-domains-and-dynamic-dns-with-windows-azure/) or being careful [not to nuke your deployment](http://blogs.msdn.com/b/ryancrawcour/archive/2012/01/09/windows-azure-and-fixed-ip-addresses.aspx) or (for Web Sites or Web Roles) doing a 301 redirect from your non-www to your www from a non-Azure environment (ugh!)
- Support for doing continuous deployment from a Github or Codeplex account
  - This means you don't need to push your changes to azure explicitly and can instead use azure as a bit of a CI server (although you can't ensure tests pass first, but the TFS integration allows for that!)
  - This mimics similar functionality in App Harbor
  - There isn't support for private keys yet so public repos only, but Scott did say that it will be supported soon :)



> Note: today’s release supports establishing connections with public GitHub/CodePlex repositories.  Support for private repositories will be enabled in a few weeks.


- Support for multiple branches, which can be used to provide test and production deployments from the same repository (pretty cool!)


## SSL


The thing I've been waiting for the most with Azure Web Sites is the ability to use SSL with your custom domain name. Whilst it was unfortunately not announced today mention was made of it; more specifically:



> We will also in the future enable SNI based SSL as a built-in feature with shared mode web-sites (this functionality isn’t supported with today’s release – but will be coming later this year to both the shared and reserved tiers).



This is particularly exciting because it's the main reason I haven't used Web Sites much yet!


## Commentary


The announcement of the new paid shared hosting model is really interesting, but it makes a lot of sense. It does two things:


- Provides an accessible service for people that need a custom domain name and more than 165MB/day of bandwidth, but can't afford a small instance
- Provides a monetisation strategy for Microsoft for people in the above situation that places them on-par with most standard hosting companies ($113.88/year), but of course the service they are providing and the performance is really great so it's something that could really take off. That can only be a good thing; the more popular Azure is the more it can grow! Bring it on!



The continuous deployment announcement is cool, but not surprising; it's more of the same stuff that has been coming out in releases and blog posts by the awesome people that are currently driving a lot of this stuff. It's great that Microsoft is supporting Github as a first class citizen rather than just their own platform (Codeplex).



Interestingly for me is that yet again there is a set of features in Web Sites that aren't exposed in Web Roles either. It's still unclear whether Web Sites will eventually replace Web Roles. I don't think that's likely to happen at least in the short term because there is too many things that are different about them and all the documentation clearly places them as filling separate needs (Web Roles is for when you need more control / advanced use cases).



For instance, I don't ever see them giving RDP for Web Sites given it's multi-tenanted and your web site could be hosted on one of a whole heap of random servers at any point in time and that can (probably) change over time too.



The whole point is Web Sites is simple and abstracts all that complexity away from you. For that reason Web Sites is well targeted at less technically inclined people and thus is more accessible to more people (all of the tutorials and presentations and marketing is around how easy it is to get up and running with minimal code and configuration!) - a great thing!



So, given that Web Roles probably isn't going anywhere I'm surprised that they haven't released A Record and better deployment support to Web Roles.

