---
id: 3361
title: Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory
date: 2014-06-29T22:20:44+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3361
permalink: /blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - Windows Azure
---
This post outlines how to easily add Azure AD authentication to anÂ existing (or new) ASP.NET MVC 5 (or 3 or 4) application.

## Practical Microsoft Azure Active Directory Blog Series

This post is part of theÂ [Practical Microsoft Azure Active Directory Blog Series](http://robdmoore.id.au/blog/2014/06/29/practical-microsoft-azure-active-directory-blog-series/ "Practical Microsoft Azure Active Directory Blog Series").

  * [Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory](http://robdmoore.id.au/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/)
  * [Explaining the code behind authenticating MVC5 app with Azure AD](http://robdmoore.id.au/blog/2014/10/24/explaining-the-code-behind-authenticating-mvc5-app-with-azure-ad/)
  * [Add role-based authorisation based on Azure AD group membership](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/)
  * [Creating a SharePoint-style user lookup control backed by Azure AD](http://robdmoore.id.au/blog/2014/11/04/creating-a-sharepoint-style-user-lookup-control-backed-by-azure-ad/)

## Add Azure AD Authentication

These instructions will help youÂ easily add authentication to your new or existing ASP.NET application, based on what the Visual Studio Identity and Access tools do. It&#8217;s a basic setup for a single tenant. Read the next post in the series to understand what&#8217;s going on and ways that it can be extended. The links show either a commit from the <a href="https://github.com/robdmoore/AzureAdMvcExample" target="_blank">example project</a> or to relevant documentation.

**Note:** Ignore the `...`&#8216;s and replace the {SPECIFIED_VALUES} with the correct values.

  1. <a href="http://technet.microsoft.com/library/jj573650" target="_blank">Create an Azure Active Directory tenant</a>; note: AD tenants are not associated with your Azure Subscription, they are &#8220;floating&#8221; so add any live ids for people you want to <a href="http://msdn.microsoft.com/en-us/library/azure/dn468213.aspx" target="_blank">administer it as Global Administrators</a>
  2. <a href="http://msdn.microsoft.com/en-US/library/azure/dn132599.aspx" target="_blank">Create an Application in your AD tenant with audience URL and realm being your website homepage (minus the slash at the end)</a> 
      * Record the name of your AD tenant e.g. {name}.onmicrosoft.com
      * Record the GUID of your AD tenant byÂ looking at theÂ FEDERATION METADATA DOCUMENT URL under View Endpoints
      * The image upload and Sign On URL are used for the <a href="https://account.activedirectory.windowsazure.com/applications/" target="_blank">Azure AD Applications Portal</a>
  3. <a href="http://msdn.microsoft.com/en-us/library/azure/hh967632.aspx" target="_blank">Create a user account in your tenant that you can use to log in with</a>
  4. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/9c561ef3f1c360569b29d65da62ceba0ed9739c0" target="_blank">Install-Package Microsoft.Owin.Security.ActiveDirectory</a>
  5. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/edfec2357e3791f8afe766b8d8847716f861b701" target="_blank">Install-Package System.IdentityModel.Tokens.ValidatingIssuerNameRegistry</a>
  6. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a" target="_blank">Add a reference to System.IdentityModel</a>
  7. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a" target="_blank">Add a reference to System.IdentityModel.Services</a>
  8. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a" target="_blank">Add a Startup.cs file (if it doesn&#8217;t already exist) and configure OWIN to use Azure Active Directory</a>Â (<a href="https://github.com/robdmoore/AzureAdMvcExample/commit/d4432a14c07a2b2f8fc571efe1540827ccba7386" target="_blank">edit for new version</a>) <pre class="brush: csharp; title: ; notranslate" title="">using System.Configuration;
using Microsoft.Owin.Security.ActiveDirectory;
using Owin;

namespace {YOUR_NAMESPACE}
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseWindowsAzureActiveDirectoryBearerAuthentication(
                new WindowsAzureActiveDirectoryBearerAuthenticationOptions
                {
                    TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidAudience = ConfigurationManager.AppSettings["ida:AudienceUri"]
                    },
                    Tenant = ConfigurationManager.AppSettings["AzureADTenant"]
                });
        }
    }
}
</pre>

  9. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a" target="_blank">Add the correct configuration to your web.config file</a>; change requireSsl and requireHttps to true if using a https:// site (absolutely requiredÂ for production scenarios) <pre class="brush: xml; title: ; notranslate" title="">&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;configuration&gt;
  &lt;configSections&gt;
    &lt;section name="system.identityModel" type="System.IdentityModel.Configuration.SystemIdentityModelSection, System.IdentityModel, Version=4.0.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" /&gt;
    &lt;section name="system.identityModel.services" type="System.IdentityModel.Services.Configuration.SystemIdentityModelServicesSection, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" /&gt;
  &lt;/configSections&gt;
...
  &lt;appSettings&gt;
    ...
    &lt;add key="ida:AudienceUri" value="{YOUR_WEBSITE_HOMEPAGE_WITHOUT_TRAILING_SLASH}" /&gt;
    &lt;add key="ida:FederationMetadataLocation" value="https://login.windows.net/{YOUR_AD_TENANT_NAME}.onmicrosoft.com/FederationMetadata/2007-06/FederationMetadata.xml" /&gt;
    &lt;add key="AzureADTenant" value="{YOUR_AD_TENANT_NAME}.onmicrosoft.com" /&gt;
  &lt;/appSettings&gt;
...
  &lt;system.webServer&gt;
    ...
    &lt;modules&gt;
      &lt;add name="WSFederationAuthenticationModule" type="System.IdentityModel.Services.WSFederationAuthenticationModule, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" preCondition="managedHandler" /&gt;
      &lt;add name="SessionAuthenticationModule" type="System.IdentityModel.Services.SessionAuthenticationModule, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" preCondition="managedHandler" /&gt;
    &lt;/modules&gt;
  &lt;/system.webServer&gt;
...
  &lt;system.identityModel&gt;
    &lt;identityConfiguration&gt;
      &lt;issuerNameRegistry type="System.IdentityModel.Tokens.ValidatingIssuerNameRegistry, System.IdentityModel.Tokens.ValidatingIssuerNameRegistry"&gt;
        &lt;authority name="https://sts.windows.net/{YOUR_AD_TENANT_GUID}/"&gt;
          &lt;keys&gt;
            &lt;add thumbprint="0000000000000000000000000000000000000000" /&gt;
          &lt;/keys&gt;
          &lt;validIssuers&gt;
            &lt;add name="https://sts.windows.net/{YOUR_AD_TENANT_GUID}/" /&gt;
          &lt;/validIssuers&gt;
        &lt;/authority&gt;
      &lt;/issuerNameRegistry&gt;
      &lt;audienceUris&gt;
        &lt;add value="{YOUR_WEBSITE_HOMEPAGE_WITHOUT_TRAILING_SLASH}" /&gt;
      &lt;/audienceUris&gt;
      &lt;securityTokenHandlers&gt;
        &lt;add type="System.IdentityModel.Services.Tokens.MachineKeySessionSecurityTokenHandler, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" /&gt;
        &lt;remove type="System.IdentityModel.Tokens.SessionSecurityTokenHandler, System.IdentityModel, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" /&gt;
      &lt;/securityTokenHandlers&gt;
      &lt;certificateValidation certificateValidationMode="None" /&gt;
    &lt;/identityConfiguration&gt;
  &lt;/system.identityModel&gt;
  &lt;system.identityModel.services&gt;
    &lt;federationConfiguration&gt;
      &lt;cookieHandler requireSsl="false" /&gt;
      &lt;wsFederation passiveRedirectEnabled="true" issuer="https://login.windows.net/{YOUR_AD_TENANT_NAME}.onmicrosoft.com/wsfed" realm="{YOUR_WEBSITE_HOMEPAGE_WITHOUT_TRAILING_SLASH}" requireHttps="false" /&gt;
    &lt;/federationConfiguration&gt;
  &lt;/system.identityModel.services&gt;
&lt;/configuration&gt;
</pre>

 10. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/992acae2f9c87bd70c5a8ab3c18c712fc6986893" target="_blank">Configure AntiForgery to use the correct claim type to uniquely identify users</a> <pre class="brush: csharp; title: ; notranslate" title="">Global.asax.cs

          protected void Application_Start()
          {
              ...
              IdentityConfig.ConfigureIdentity();
          }

App_Start\IdentityConfig.cs

using System.IdentityModel.Claims;
using System.Web.Helpers;

namespace {YOUR_NAMESPACE}
{
    public static class IdentityConfig
    {
        public static void ConfigureIdentity()
        {
            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.Name;
        }
    }
}
</pre>

 11. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/19c2d208a133960201b4e46c2d80561f21effede" target="_blank">Configure the application to refresh issuer keys when they change</a> <pre class="brush: csharp; title: ; notranslate" title="">public static void ConfigureIdentity()
        {
            ...
            RefreshIssuerKeys();
        }

        private static void RefreshIssuerKeys()
        {
            // http://msdn.microsoft.com/en-us/library/azure/dn641920.aspx
            var configPath = AppDomain.CurrentDomain.BaseDirectory + "\\" + "Web.config";
            var metadataAddress = ConfigurationManager.AppSettings["ida:FederationMetadataLocation"];
            ValidatingIssuerNameRegistry.WriteToConfig(metadataAddress, configPath);
        }
</pre>

 12. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/636205bfd34ddb772aca801b776393a69974e3fa" target="_blank">Add LogoutController</a> <pre class="brush: csharp; title: ; notranslate" title="">Controllers\LogoutController.cs

using System;
using System.IdentityModel.Services;
using System.Web.Mvc;

namespace {YOUR_NAMESPACE}.Controllers
{
    public class LogoutController : Controller
    {
        public ActionResult Index()
        {
            var config = FederatedAuthentication.FederationConfiguration.WsFederationConfiguration;

            var callbackUrl = Url.Action("Callback", "Logout", null, Request.Url.Scheme);
            var signoutMessage = new SignOutRequestMessage(new Uri(config.Issuer), callbackUrl);
            signoutMessage.SetParameter("wtrealm", config.Realm);
            FederatedAuthentication.SessionAuthenticationModule.SignOut();

            return new RedirectResult(signoutMessage.WriteQueryString());
        }

        [AllowAnonymous]
        public ActionResult Callback()
        {
            if (Request.IsAuthenticated)
                return RedirectToAction("Index", "Home");

            return View();
        }
    }
}

Views\Logout\Callback.cshtml

@{
    ViewBag.Title = "Logged out";
}

&lt;h1&gt;Logged out&lt;/h1&gt;

&lt;p&gt;You have successfully logged out of this site. @Html.ActionLink("Log back in", "Index", "Home").&lt;/p&gt;
</pre>

 13. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/636205bfd34ddb772aca801b776393a69974e3fa" target="_blank">Add logout link somewhere</a> &#8211; `@Html.ActionLink("Logout", "Index", "Logout")`
 14. <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/2dfc9414ba022c47a251d2fa4fd101c441cac5a2" target="_blank">Add authentication to the app</a>; do this as you normally would with `[Authorize]` to specific controller(s) or action(s) or globally by adding to `GlobalFilters.Filters.Add(new AuthorizeAttribute());`
 15. Load the site and navigate to one of the authenticated pages &#8211; it should redirect you to your Azure AD tenant login page whereupon you need to log in as one of the users you created and it should take you back to that page, logged in
 16. The usual `User.Identity.Name` and `User.Identity.IsAuthenticated` objects should be populated and if you want access to the claims to get the user&#8217;s name etc. then use <a href="https://github.com/robdmoore/AzureAdMvcExample/commit/003c0e0a44dc4ce60116d11360abae3b67de34cc" target="_blank">something like</a> `ClaimsPrincipal.Current.FindFirst(ClaimTypes.GivenName).Value`