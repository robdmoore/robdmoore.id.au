---
id: 3301
title: Practical Microsoft Azure Active Directory Blog Series
date: 2014-06-29T20:46:11+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3301
permalink: /blog/2014/06/29/practical-microsoft-azure-active-directory-blog-series/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - dev ops
  - Windows Azure
---
I finally had a chance to play with Microsoft Azure Active Directory in a recent project. I found the experience to be very interesting &#8211; Azure AD itself is an amazing, powerful product with a lot of potential. It certainly has a few rough edges here and there, but it&#8217;s pretty clear Microsoft are putting a lot of effort into it as it&#8217;s forming the cornerstone of <a href="http://azure.microsoft.com/blog/2013/04/08/windows-azure-active-directory-ready-for-production-with-over-265-billion-authentications-2-9-million-organizations-served/" target="_blank">how it authenticates all of it&#8217;s services including Office 365</a>.

Azure AD gives you the ability to securely manage a set of users and also gives the added benefit of allowing two-factor authentication (2FA), single-sign-on across applications, multi-tenancy support and ability to allow external organisations to authenticate against your application.

This blog series willÂ outline the minimum set of steps that you need to perform to quickly and easily add Azure AD authentication to an existing ASP.NET MVC 5 (or 3 or 4) site (or a new one if you select the No Authentication option when creating it) as well as configure things like API authentication, role authorisation, programmatic logins and deployments to different environments.

## There are already tools and libraries out there for this &#8211; why are you writing this series?

Microsoft have made it fairly easy to integrate Azure AD authentication with your applications by providing NuGet packages with most of the code you need and also tooling support to configure your project in Visual Studio. This is combined with a <a href="http://technet.microsoft.com/en-us/library/hh967611.aspx" target="_blank">slew</a> <a href="http://msdn.microsoft.com/en-us/library/azure/dn151790.aspx" target="_blank">of</a> <a href="http://msdn.microsoft.com/library/azure/jj673460.aspx" target="_blank">MSDN</a> <a href="http://blogs.technet.com/b/keithmayer/archive/2013/04/09/step-by-step-provisioning-windows-azure-active-directory-free-for-production-use.aspx" target="_blank">and</a> <a href="http://blogs.technet.com/b/ad/archive/2014/03/25/identity-and-access-management-for-every-user-in-every-organization-using-any-service-on-any-device.aspx" target="_blank">technet</a> posts covering most of it.

When it comes to trying to understand the code that is added to your solution however, things become a bit tricky as the documentation is hard to navigate through unless you want to spend a lot of time. Also, if you have Visual Studio 2013 rather than <a href="http://msdn.microsoft.com/en-us/library/azure/dn151790.aspx#BKMK_Connecting" target="_blank">Visual Studio 2012</a> you can only add authentication to a new app as part of the File ->Â New Project workflow by choosing the Organizational Authentication option:<figure id="attachment_3321" style="width: 1159px" class="wp-caption aligncenter">

[<img class="size-full wp-image-3321" src="http://media.robdmoore.id.au/uploads/2014/06/aspnet_org_auth.png" alt="ASP.NET Organizational Authentication option" width="1159" height="639" srcset="https://media.robdmoore.id.au/uploads/2014/06/aspnet_org_auth.png 1159w, https://media.robdmoore.id.au/uploads/2014/06/aspnet_org_auth-300x165.png 300w, https://media.robdmoore.id.au/uploads/2014/06/aspnet_org_auth-1024x564.png 1024w" sizes="(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px" />](http://media.robdmoore.id.au/uploads/2014/06/aspnet_org_auth.png)<figcaption class="wp-caption-text">Visual Studio: File > New Project > ASP.NET > Change Authentication > Organizational Authentication</figcaption></figure> 

If you have an existing ASP.NET web application and you are using Visual Studio 2013 then you are out of luck.

Furthermore,Â the default code you get requires you to have Entity Framework and a database set up, despite the fact this is only really required if you are using multiple Azure AD tenants (unlikely unless you are creating a fairly hardcore multi-tenant application).

If you then want to add role-based authentication based on membership in Azure AD groups then there is no direction for this either.

For these reasons I&#8217;m developing a reference application that contains the simplest possible implementation of adding theseÂ features in an easy to follow commit-by-commit manner as a quick reference. I will also provide explanations of what all the code means in this blog series so you can understand how it all works if you want to.

You can see the <a href="https://github.com/robdmoore/AzureAdMvcExample" target="_blank">source code of this application here</a> and an <a href="https://azureadmvcexample.azurewebsites.net" target="_blank">example deployment here</a>. The GitHub page outlinesÂ information such as example user logins and what infrastructure I set up in Azure.

## What are you planning on covering?

This will be the rough structure of the posts I am planning in no particular order (I&#8217;ll update this list with links to the posts over time):

  * [Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory](http://robdmoore.id.au/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/ "Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory")
  * [Explaining the code behind authenticating MVC5 app with Azure AD](http://robdmoore.id.au/blog/2014/10/24/explaining-the-code-behind-authenticating-mvc5-app-with-azure-ad/)
  * [Add role-based authorisation based on Azure AD group membership](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/)
  * [Creating a SharePoint-style user lookup control backed by Azure AD](http://robdmoore.id.au/blog/2014/11/04/creating-a-sharepoint-style-user-lookup-control-backed-by-azure-ad/)
  * How to get a list of all users in a particular group
  * Deploying your application to multiple environments
  * How to authenticate against ASP.NET Web API using Azure AD
  * How to authenticateÂ programmatically in a console app (orÂ other non-human application)
  * Multi-tenancy support

I&#8217;m notoriously bad at finishing [blog](http://robdmoore.id.au/blog/2012/08/12/maintainable-large-scale-continuous-delivery-with-teamcity/ "Maintainable, large-scale continuous delivery with TeamCity Blog Series") [series](http://robdmoore.id.au/blog/2014/01/23/test-naming-automated-testing-series/ "Test Naming [Automated Testing Series]")&#8216; that I start, so no promises on when I will complete this, but I have all of the codeÂ figured out in one way or another and the GitHub should at least contain commits with all of the above before I finish the accompanying posts so \*fingers crossed\*! Feel free to comment below if you want me to expedite a particular post.

## More resources

I came across some great posts that have helped me so far so I thought I&#8217;d link to them here to provide further reading if you are interested in digging deeper:

  * <a href="http://adamkorczynski.com/2013/10/15/securing-an-owin-hosted-api-in-azure-with-oauth-2/" target="_blank">Azure OAuth 2.0 â€“ Authorization Code Grant Walkthough</a>
  * <a href="http://adamkorczynski.com/2013/10/19/oauth-2-0/" target="_blank">Azure OAuth 2.0 â€“ Authorization Code Grant</a>
  * <a href="http://adamkorczynski.com/2013/10/20/azure-oauth-2-client-credential-grant/" target="_blank">Azure OAuth 2.0 â€“ Client Credential Grant</a>
  * <a href="http://adamkorczynski.com/2013/10/29/azure-oauth-2-0-tokens-and-endpoints/" target="_blank">Azure OAuth 2.0 â€“ Tokens and Endpoints</a>
  * <a href="http://adamkorczynski.com/2013/10/29/oauth-2-0-overview/" target="_blank">Azure OAuth 2.0 â€“ Overview</a>
  * <a href="http://www.cloudidentity.com/blog/2013/10/29/using-adals-acquiretokenby-authorizationcode-to-call-a-web-api-from-a-web-app/" target="_blank">Using ADALâ€™s AcquireTokenBy AuthorizationCode to Call a Web API From a Web App</a>
  * <a href="http://www.cloudidentity.com/blog/2014/06/16/adal-for-windows-phone-8-1-deep-dive/" target="_blank">ADAL for Windows Phone 8.1 â€“ Deep Dive</a>
  * <a href="http://www.cloudidentity.com/blog/2014/04/28/use-owin-azure-ad-to-secure-both-mvc-ux-and-web-api-in-the-same-project/" target="_blank">Use OWIN & Azure AD to Secure Both MVC UX and Web API in The Same Project</a>
  * <a href="http://www.cloudidentity.com/blog/2013/12/11/setting-up-an-asp-net-project-with-organizational-authentication-requires-an-organizational-account/" target="_blank">Setting Up an ASP.NET Project with Organizational Authentication Requires an Organizational Account</a>