---
layout: post
title: Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory
date: 2014-06-29 22:20:44.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- Windows Azure
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


This post outlines how to easily add Azure AD authentication to an existing (or new) ASP.NET MVC 5 (or 3 or 4) application.


## Practical Microsoft Azure Active Directory Blog Series


This post is part of the [Practical Microsoft Azure Active Directory Blog Series](http://robdmoore.id.au/blog/2014/06/29/practical-microsoft-azure-active-directory-blog-series/ "Practical Microsoft Azure Active Directory Blog Series").


- [Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory](http://robdmoore.id.au/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/)
- [Explaining the code behind authenticating MVC5 app with Azure AD](http://robdmoore.id.au/blog/2014/10/24/explaining-the-code-behind-authenticating-mvc5-app-with-azure-ad/)
- [Add role-based authorisation based on Azure AD group membership](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/)
- [Creating a SharePoint-style user lookup control backed by Azure AD](http://robdmoore.id.au/blog/2014/11/04/creating-a-sharepoint-style-user-lookup-control-backed-by-azure-ad/)


## Add Azure AD Authentication


These instructions will help you easily add authentication to your new or existing ASP.NET application, based on what the Visual Studio Identity and Access tools do. It's a basic setup for a single tenant. Read the next post in the series to understand what's going on and ways that it can be extended. The links show either a commit from the [example project](https://github.com/robdmoore/AzureAdMvcExample) or to relevant documentation.



**Note:** Ignore the `...`'s and replace the {SPECIFIED\_VALUES} with the correct values.


1. [Create an Azure Active Directory tenant](http://technet.microsoft.com/library/jj573650); note: AD tenants are not associated with your Azure Subscription, they are "floating" so add any live ids for people you want to [administer it as Global Administrators](http://msdn.microsoft.com/en-us/library/azure/dn468213.aspx)
2. [Create an Application in your AD tenant with audience URL and realm being your website homepage (minus the slash at the end)](http://msdn.microsoft.com/en-US/library/azure/dn132599.aspx)
  - Record the name of your AD tenant e.g. {name}.onmicrosoft.com
  - Record the GUID of your AD tenant by looking at the FEDERATION METADATA DOCUMENT URL under View Endpoints
  - The image upload and Sign On URL are used for the [Azure AD Applications Portal](https://account.activedirectory.windowsazure.com/applications/)
3. [Create a user account in your tenant that you can use to log in with](http://msdn.microsoft.com/en-us/library/azure/hh967632.aspx)
4. [Install-Package Microsoft.Owin.Security.ActiveDirectory](https://github.com/robdmoore/AzureAdMvcExample/commit/9c561ef3f1c360569b29d65da62ceba0ed9739c0)
5. [Install-Package System.IdentityModel.Tokens.ValidatingIssuerNameRegistry](https://github.com/robdmoore/AzureAdMvcExample/commit/edfec2357e3791f8afe766b8d8847716f861b701)
6. [Add a reference to System.IdentityModel](https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a)
7. [Add a reference to System.IdentityModel.Services](https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a)
8. [Add a Startup.cs file (if it doesn't already exist) and configure OWIN to use Azure Active Directory](https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a) ([edit for new version](https://github.com/robdmoore/AzureAdMvcExample/commit/d4432a14c07a2b2f8fc571efe1540827ccba7386))
  ```csharp
  using System.Configuration;
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
  ```
9. [Add the correct configuration to your web.config file](https://github.com/robdmoore/AzureAdMvcExample/commit/3c55318f24455884b6186fe6a3904fdc3418c78a); change requireSsl and requireHttps to true if using a https:// site (absolutely required for production scenarios)
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <configSections>
        <section name="system.identityModel" type="System.IdentityModel.Configuration.SystemIdentityModelSection, System.IdentityModel, Version=4.0.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" />
        <section name="system.identityModel.services" type="System.IdentityModel.Services.Configuration.SystemIdentityModelServicesSection, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" />
      </configSections>
      ...
      <appSettings>
        ...
        <add key="ida:AudienceUri" value="{YOUR_WEBSITE_HOMEPAGE_WITHOUT_TRAILING_SLASH}" />
        <add key="ida:FederationMetadataLocation" value="https://login.windows.net/{YOUR_AD_TENANT_NAME}.onmicrosoft.com/FederationMetadata/2007-06/FederationMetadata.xml" />
        <add key="AzureADTenant" value="{YOUR_AD_TENANT_NAME}.onmicrosoft.com" />
      </appSettings>
      ...
      <system.webServer>
        ...
        <modules>
          <add name="WSFederationAuthenticationModule" type="System.IdentityModel.Services.WSFederationAuthenticationModule, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" preCondition="managedHandler" />
          <add name="SessionAuthenticationModule" type="System.IdentityModel.Services.SessionAuthenticationModule, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" preCondition="managedHandler" />
        </modules>
      </system.webServer>
      ...
      <system.identityModel>
        <identityConfiguration>
          <issuerNameRegistry type="System.IdentityModel.Tokens.ValidatingIssuerNameRegistry, System.IdentityModel.Tokens.ValidatingIssuerNameRegistry">
            <authority name="https://sts.windows.net/{YOUR_AD_TENANT_GUID}/">
              <keys>
                <add thumbprint="0000000000000000000000000000000000000000" />
              </keys>
              <validIssuers>
                <add name="https://sts.windows.net/{YOUR_AD_TENANT_GUID}/" />
              </validIssuers>
            </authority>
          </issuerNameRegistry>
          <audienceUris>
            <add value="{YOUR_WEBSITE_HOMEPAGE_WITHOUT_TRAILING_SLASH}" />
          </audienceUris>
          <securityTokenHandlers>
            <add type="System.IdentityModel.Services.Tokens.MachineKeySessionSecurityTokenHandler, System.IdentityModel.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" />
            <remove type="System.IdentityModel.Tokens.SessionSecurityTokenHandler, System.IdentityModel, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" />
          </securityTokenHandlers>
          <certificateValidation certificateValidationMode="None" />
        </identityConfiguration>
      </system.identityModel>
      <system.identityModel.services>
        <federationConfiguration>
          <cookieHandler requireSsl="false" />
          <wsFederation passiveRedirectEnabled="true" issuer="https://login.windows.net/{YOUR_AD_TENANT_NAME}.onmicrosoft.com/wsfed" realm="{YOUR_WEBSITE_HOMEPAGE_WITHOUT_TRAILING_SLASH}" requireHttps="false" />
        </federationConfiguration>
      </system.identityModel.services>
    </configuration>
    ```
10. [Configure AntiForgery to use the correct claim type to uniquely identify users](https://github.com/robdmoore/AzureAdMvcExample/commit/992acae2f9c87bd70c5a8ab3c18c712fc6986893)
    ```csharp
    // Global.asax.cs
              protected void Application_Start()
              {
                  ...
                  IdentityConfig.ConfigureIdentity();
              }

    // App_Start\IdentityConfig.cs
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
    ```
11. [Configure the application to refresh issuer keys when they change](https://github.com/robdmoore/AzureAdMvcExample/commit/19c2d208a133960201b4e46c2d80561f21effede)
  ```csharp
        public static void ConfigureIdentity()
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
  ```
12. [Add LogoutController](https://github.com/robdmoore/AzureAdMvcExample/commit/636205bfd34ddb772aca801b776393a69974e3fa)
    ```csharp
    // Controllers\LogoutController.cs
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
    ```
    ```html
    <!-- Views\Logout\Callback.cshtml -->
    @{
        ViewBag.Title = "Logged out";
    }
    <h1>Logged out</h1>
    <p>You have successfully logged out of this site. @Html.ActionLink("Log back in", "Index", "Home").</p>
    ```
13. [Add logout link somewhere](https://github.com/robdmoore/AzureAdMvcExample/commit/636205bfd34ddb772aca801b776393a69974e3fa) - `@Html.ActionLink("Logout", "Index", "Logout")`
14. [Add authentication to the app](https://github.com/robdmoore/AzureAdMvcExample/commit/2dfc9414ba022c47a251d2fa4fd101c441cac5a2); do this as you normally would with `[Authorize]` to specific controller(s) or action(s) or globally by adding to `GlobalFilters.Filters.Add(new AuthorizeAttribute());`
15. Load the site and navigate to one of the authenticated pages - it should redirect you to your Azure AD tenant login page whereupon you need to log in as one of the users you created and it should take you back to that page, logged in
16. The usual `User.Identity.Name` and `User.Identity.IsAuthenticated` objects should be populated and if you want access to the claims to get the user's name etc. then use [something like](https://github.com/robdmoore/AzureAdMvcExample/commit/003c0e0a44dc4ce60116d11360abae3b67de34cc) `ClaimsPrincipal.Current.FindFirst(ClaimTypes.GivenName).Value`

