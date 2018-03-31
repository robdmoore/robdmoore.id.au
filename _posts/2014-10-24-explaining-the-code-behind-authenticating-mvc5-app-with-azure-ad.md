---
layout: post
title: Explaining the code behind authenticating MVC5 app with Azure AD
date: 2014-10-24 13:41:02.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- Azure AD
- C#
- Windows Azure
author: rob
---


This post explains the code outlined in the [last post](/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/ "Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory") on installing Azure AD authentication to an existing (or new) ASP.NET MVC 5 (or 3 or 4) application.


## Practical Microsoft Azure Active Directory Blog Series


This post is part of the [Practical Microsoft Azure Active Directory Blog Series](/blog/2014/06/29/practical-microsoft-azure-active-directory-blog-series/ "Practical Microsoft Azure Active Directory Blog Series").


- [Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory](/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/)
- [Explaining the code behind authenticating MVC5 app with Azure AD](/blog/2014/10/24/explaining-the-code-behind-authenticating-mvc5-app-with-azure-ad/)
- [Add role-based authorisation based on Azure AD group membership](/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/)
- [Creating a SharePoint-style user lookup control backed by Azure AD](/blog/2014/11/04/creating-a-sharepoint-style-user-lookup-control-backed-by-azure-ad/)


## Microsoft.Owin.Security.ActiveDirectory


The [Microsoft.Owin.Security.ActiveDirectory](https://www.nuget.org/packages/Microsoft.Owin.Security.ActiveDirectory/) package is part of the [Katana](https://katanaproject.codeplex.com/) project, which produces a bunch of libraries that build on top of [Owin](http://owin.org/).



It allows your application to accept a [Bearer](https://tools.ietf.org/html/rfc6750) Authorization header in the HTTP request that contains a [JSON Web Token (JWT)](http://jwt.io/) token issued from Azure AD and will create a [ClaimsPrincipal](http://dotnetcodr.com/2013/02/11/introduction-to-claims-based-security-in-net4-5-with-c-part-1/) in the thread from that token. This is mainly useful for creating Web APIs and thus is optional if you just need web authentication.



Note: if you [use bearer tokens make sure you request resources with HTTPS](http://hueniverse.com/2010/09/29/oauth-bearer-tokens-are-a-terrible-idea/).



This package is enabled up by the `app.UseWindowsAzureActiveDirectoryBearerAuthentication(...)` call in `Startup.cs`.



There are two configurations in the Startup.cs code to configure the package:


- [TokenValidationParameters](http://msdn.microsoft.com/en-us/library/microsoft.owin.security.activedirectory.windowsazureactivedirectorybearerauthenticationoptions.tokenvalidationparameters(v=vs.113).aspx) - this controls how tokens that are presented by a user are checked for validity
  - In the code example in the previous blog post we set ValidAudience, which ensures that any tokens presented are valid for the given audience (alternatively, you can use ValidAudiences if you want to accept tokens from multiple audiences)
  - There is more information later in this post about audiences
- [Tenant](http://msdn.microsoft.com/en-us/library/microsoft.owin.security.activedirectory.windowsazureactivedirectorybearerauthenticationoptions.tenant(v=vs.113).aspx) - This sets which Azure AD tenant you are accepting tokens from


## WSFederationAuthenticationModule (WS-FAM) and SessionAuthenticationModule (SAM)


These modules are part of [WIF](http://msdn.microsoft.com/en-au/security/aa570351.aspx) via System.IdentityModel.Services and are the mechanism by which the authentication hooks into ASP.NET and works. For this to work you need to enter a bunch of code in web.config, but Microsoft is [currently working on](https://github.com/AzureADSamples/) OWIN-only components that hide all of that away and provide for a much simpler configuration so in the future you won't need to do any of this. At the time of writing the samples don't quite seem to work ([for me at least](https://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet/issues/10)) yet, so for now it makes sense to keep using the WIF modules, but it's worth keeping out an eye on what happens with the samples Microsoft are working on, in particular the [OpenIdConnect one](https://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet).



So what do these WIF modules do? From the [WSFederationAuthenticationModule documentation](http://msdn.microsoft.com/en-us/library/jj191638.aspx):



> When an unauthenticated user tries to access a protected resource, the [[Relying Party (RP)](https://en.wikipedia.org/wiki/Relying_party)] returns a “401 authorization denied” HTTP response. The WS-FAM intercepts this response instead of allowing the client to receive it, then it redirects the user to the specified [[Security Token Service](https://en.wikipedia.org/wiki/Security_token_service) (STS)]. The STS issues a security token, which the WS-FAM again intercepts. The WS-FAM uses the token to create an instance of [ClaimsPrincipal](http://msdn.microsoft.com/en-us/library/system.security.claims.claimsprincipal.aspx) for the authenticated user, which enables regular .NET Framework authorization mechanisms to function.
> 
> 
> 
> Because HTTP is stateless, we need a way to avoid repeating this whole process every time that the user tries to access another protected resource. This is where the [SessionAuthenticationModule](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.sessionauthenticationmodule.aspx) comes in. When the STS issues a security token for the user, [SessionAuthenticationModule](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.sessionauthenticationmodule.aspx) also creates a session security token for the user and puts it in a cookie. On subsequent requests, the [SessionAuthenticationModule](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.sessionauthenticationmodule.aspx) intercepts this cookie and uses it to reconstruct the user’s [ClaimsPrincipal](http://msdn.microsoft.com/en-us/library/system.security.claims.claimsprincipal.aspx).



From [the SessionAuthenticationModule documentation](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.sessionauthenticationmodule(v=vs.110).aspx):



> The SAM adds its [OnAuthenticateRequest](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.sessionauthenticationmodule.onauthenticaterequest(v=vs.110).aspx) event handler to the [HttpApplication.AuthenticateRequest](http://msdn.microsoft.com/en-us/library/system.web.httpapplication.authenticaterequest(v=vs.110).aspx) event in the ASP.NET pipeline. This handler intercepts sign-in requests, and, if there is a session cookie, deserializes it into a session token, and sets the [Thread.CurrentPrincipal](http://msdn.microsoft.com/en-us/library/system.threading.thread.currentprincipal(v=vs.110).aspx) and [HttpContext.User](http://msdn.microsoft.com/en-us/library/system.web.httpcontext.user(v=vs.110).aspx) properties to the claims principal contained in the session token.



These modules are then configured by the `system.identityModel` and `system.identityModel.services` sections in `web.config`.


### issuerNameRegistry and signing key refresh


This configures [which tenants and issuers of authentication your application trusts](http://msdn.microsoft.com/en-us/library/dn205067(v=vs.110).aspx) as well as the thumbprint of their public signing key certificates.



The certificate thumbprints will [change over time](http://msdn.microsoft.com/en-us/library/azure/dn641920.aspx) for security reasons so hardcoding the keys in web.config is not a good option hence you need to make sure to implement code that changes the keys for you. The simplest, built-in way to do that is using `ValidatingIssuerNameRegistry.WriteToConfig`, which updates `web.config` for you automatically when it changes. That's the instruction that was given in the last blog post.



Another option is to store the keys in a database, which is what the default code that Visual Studio's Identity and Access Tools add (using EntityFramework). Yet another option is to store them in-memory and there is a [class floating about](https://gist.github.com/ducas/17bfbe67710dfd4137f9) that you can use to do that. Storing it in-memory is probably the nicest option.


### Audiences and realm


The [`audienceUris` configuration](http://msdn.microsoft.com/en-us/library/hh568654(v=vs.110).aspx) in `web.config` allows your application to control a list of identifiers that will be accepted for the scope of a presented authentication token (in Azure AD this maps to the App ID URI of your Azure AD application).



The `realm` attribute in the `wsFederation` element of the `federationConfiguration` in `web.config` tells the WSFederationAuthenticationModule to [specify](http://msdn.microsoft.com/en-us/library/hh568665(v=vs.110).aspx) the [WS Federation](http://msdn.microsoft.com/en-us/library/bb498017.aspx)[wtrealm](http://msdn.microsoft.com/en-au/library/cc236491.aspx) to use for the request, which identifies the [security realm](http://msdn.microsoft.com/en-au/library/54feef42-621a-40ee-9363-43f1d12ea64a#SecurityRealm) that will be used for the request. For Azure AD this provides the App ID URI of the Azure AD application that should be used to service the authentication request. Thus, this value will generally be the same as the audience you configured unless you are doing multi-tenancy.



The difference between realm and audience is explained in [this StackOverflow post](http://stackoverflow.com/questions/11778658/audienceuris-vs-realm).


### securityTokenHandlers


A [security token handler](http://msdn.microsoft.com/en-us/library/system.identitymodel.tokens.securitytokenhandler(v=vs.110).aspx) provides a way for interpreting a security token of some sort into a Claims Principal for a given request. The code in the previous post gets you to remove the [default handler](http://msdn.microsoft.com/en-us/library/hh568671(v=vs.110).aspx) that takes care of looking at cookies in the request, [SessionSecurityTokenHandler](http://msdn.microsoft.com/en-us/library/system.identitymodel.tokens.sessionsecuritytokenhandler(v=vs.110).aspx), because it uses [DPAPI](http://msdn.microsoft.com/en-us/library/ms995355.aspx) to encrypt and decrypt the cookies and that doesn't work in an environment with [multiple web servers](http://msdn.microsoft.com/en-us/library/hh545457(v=vs.110).aspx). Instead you are guided to add a [MachineKeySessionSecurityTokenHandler](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.tokens.machinekeysessionsecuritytokenhandler(v=vs.110).aspx), which uses the [machine key](http://msdn.microsoft.com/en-us/library/vstudio/w8h3skw9(v=vs.100).aspx) to encrypt and decrypt the cookie.



The configured securityTokenHandler will be what the SessionAuthenticationModule will make use of to store and retrieve the token from and to the cookie.


### certificateValidation


On first thought, it might be confusing to see that certificate validation is turned off, but this is by design. The validating issuer name registry as explained above is a replacement for standard certificate validation. The only information that I've been able to find that explains this further is a [post on the MSDN forums](https://social.msdn.microsoft.com/Forums/office/en-US/730dedff-6ff6-4705-9834-ae92c2339b45/unable-to-use-json-web-token-handler-ga-with-windows-store-and-rest-scenario?forum=WindowsAzureAD).



To illustrate what happens when you try using certificate validation, you can change `certificateValidationMode` to, say, `ChainTrust` and then you will get the following error:



> The X.509 certificate CN=accounts.accesscontrol.windows.net chain building failed. The certificate that was used has a trust chain that cannot be verified. Replace the certificate or change the certificateValidationMode. A certificate chain processed, but terminated in a root certificate which is not trusted by the trust provider.


### HTTPS


You can ensure that the security cookie is set to require SSL with the `requireSSL` attribute of the `cookieHandler` element in `web.config` and ensure that the authentication requests require a HTTPS connection with the `requireHttps` attribute of the `wsFederation` element in `web.config`.



In production environments it's absolutely essential that you set both to true otherwise you are vulnerable to [MITM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks. You can set them to true locally if you use https with IIS Express or via a self-signed cert with IIS.


### issuer


Setting this [attribute](http://msdn.microsoft.com/en-us/library/hh568665(v=vs.110).aspx) on the `wsFederation` element in `web.config` determines where sign-in and sign-out requests are redirected.


### passiveRedirectEnabled


Setting this [attribute](http://msdn.microsoft.com/en-us/library/hh568665(v=vs.110).aspx) on the `wsFederation` element in `web.config` to true allows the WSFederationAuthenticationModule to automatically redirect the user to the authentication server in the event of a 401. Without this set to true you would need to explicitly call [SignIn](http://msdn.microsoft.com/en-us/library/system.identitymodel.services.wsfederationauthenticationmodule.signin(v=vs.110).aspx) to log the user in.


### reply


Setting this [attribute](http://msdn.microsoft.com/en-us/library/hh568665(v=vs.110).aspx) on the `wsFederation` element in `web.config` allows the application to control where the user is taken after they authenticate. The last post didn't tell you to set it because by default it's not required. When using Azure AD, in the instance that it's not specified, the user will be redirected to the [first Reply URL](http://samritchie.net/2013/07/17/azure-ad-single-sign-on-with-multiple-environments-reply-urls/) specified in the Azure AD application.



This requires that you can only have a one-to-one relationship between an Azure AD application and a web application requiring authentication. You can actually add multiple reply URLs to your Azure AD application though. This fact in combination with the reply attribute means that you can support multiple web applications (e.g. local, dev, staging, prod or even just different applications altogether) with the same Azure AD application. You just need to config transform your web.config file for each different environment as explained in [this post](http://samritchie.net/2013/07/17/azure-ad-single-sign-on-with-multiple-environments-reply-urls/).



If you are in a situation where you want to only change an app setting to control the reply URL (e.g. you are using VSO to deploy different branches to separate Azure Web Sites) then you can change the reply URL in code like so:



```csharp
    public static class IdentityConfig
    {
        public static void ConfigureIdentity()
        {
            ...
            FederatedAuthentication.FederationConfigurationCreated += FederatedAuthentication_FederationConfigurationCreated;
        }
        ...
        private static void FederatedAuthentication_FederationConfigurationCreated(object sender, FederationConfigurationCreatedEventArgs e)
        {
            var federationConfiguration = new FederationConfiguration();
            federationConfiguration.WsFederationConfiguration.Reply =
                ConfigurationManager.AppSettings["AuthenticationReplyUrl"];
            e.FederationConfiguration = federationConfiguration;
        }
    }
```


### Anti-forgery config


[`AntiForgeryConfig.UniqueClaimTypeIdentifier`](http://msdn.microsoft.com/en-us/library/system.web.helpers.antiforgeryconfig.uniqueclaimtypeidentifier(v=vs.111).aspx) allows you to set which claim from the claims-based authentication token can be used to uniquely identify a user for the purposes of creating an appropriate [anti-forgery token](http://www.asp.net/web-api/overview/security/preventing-cross-site-request-forgery-(csrf)-attacks). Side note: [this post about anti-forgery token is great](http://www.diaryofaninja.com/blog/2014/01/29/htmlantiforgerytoken-ndash-balancing-security-with-usability). The claim that was shown in the last post is the correct one to use for Azure AD.


## Logout


There are two parts to the logout code in the last post. Firstly, there is a call to the SessionAuthenticationModule, which will cause the cookie you have on the current site to be dropped by your browser. Secondly, there is a redirect to a URL that the WS Federation code generates that will log you out of the source system (in this case your Azure AD session) and then redirect you back to a callback page with `[AllowAnonymous]` so they don't get redirected back to login again straight away.

