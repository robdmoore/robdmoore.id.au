---
layout: post
title: Add role-based authorisation based on Azure AD group membership
date: 2014-10-24 18:45:57.000000000 +08:00
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


This post describes how to use Azure AD groups for role-based authorisation in your ASP.NET web application.


## Practical Microsoft Azure Active Directory Blog Series


This post is part of the [Practical Microsoft Azure Active Directory Blog Series](http://robdmoore.id.au/blog/2014/06/29/practical-microsoft-azure-active-directory-blog-series/ "Practical Microsoft Azure Active Directory Blog Series").


- [Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory](http://robdmoore.id.au/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/)
- [Explaining the code behind authenticating MVC5 app with Azure AD](http://robdmoore.id.au/blog/2014/10/24/explaining-the-code-behind-authenticating-mvc5-app-with-azure-ad/)
- [Add role-based authorisation based on Azure AD group membership](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/)
- [Creating a SharePoint-style user lookup control backed by Azure AD](http://robdmoore.id.au/blog/2014/11/04/creating-a-sharepoint-style-user-lookup-control-backed-by-azure-ad/)


## Add role-based authorisation based on Azure AD group membership


These instructions will help you easily add role-based authorisation based on Azure AD group membership to your existing ASP.NET application with [Azure AD authentication](http://robdmoore.id.au/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/ "Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory").  The links show either a commit from the [example project](https://github.com/robdmoore/AzureAdMvcExample) or to relevant documentation.



**Note:** Ignore the `...`‘s and replace the {SPECIFIED\_VALUES} with the correct values.


1. [Create groups in your Azure AD tenant](http://redmondmag.com/articles/2014/02/01/manage-groups-with-windows-azure-active-directory-upgrade.aspx)
2. [Assign your users to relevant groups](http://redmondmag.com/articles/2014/02/01/manage-groups-with-windows-azure-active-directory-upgrade.aspx)
3. [Configure your Azure AD application to have application permissions to read directory data from Azure Active Directory](http://msdn.microsoft.com/en-us/library/azure/b08d91fa-6a64-4deb-92f4-f5857add9ed8#BKMK_Graph)
  - If you get a "Insufficient privileges to complete the operation." exception then you might need to wait for a few minutes or an hour since it seems to cache the old permissions, or it may be the problem mentioned by Jeff Dunlop in the comments
4. In the Configure tab of your Azure AD application create a key in the keys section and copy it
5. [Configure the client id of your Azure AD application and the key you created in the last step in your web.config file](https://github.com/robdmoore/AzureAdMvcExample/commit/395dbe84cca37992a33e5ac2ae20db44d2f8fa56)
    ```xml
    <appSettings>
        ...
        <add key="ida:ClientId" value="{AZURE_AD_APP_CLIENT_ID}" />
        <add key="ida:Password" value="{AZURE_AD_APP_KEY}" />
    </appSettings>
    ```
6. [Install-Package Microsoft.Azure.ActiveDirectory.GraphClient -Version 1.0.3](https://github.com/robdmoore/AzureAdMvcExample/commit/384fbb07ed515bc4801cc820962378719fd13cb8) (alternatively, you can use the latest version if you follow the steps mentioned by Jeff Dunlop in the comments)
7. [Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory](https://github.com/robdmoore/AzureAdMvcExample/commit/ade3c6379f3ca799b9fe732a33a2971be53292dc)
8. [Create an AzureADGraphConnection class](https://github.com/robdmoore/AzureAdMvcExample/commit/ff840598c88302a4f6ab4b81a091aa8a68c924d5):
    ```csharp
    // Infrastructure\Auth\AzureADGraphConnection.cs
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using Microsoft.Azure.ActiveDirectory.GraphClient;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    namespace {YOUR_NAMESPACE}.Infrastructure.Auth
    {
        public interface IAzureADGraphConnection
        {
            IList<string> GetRolesForUser(ClaimsPrincipal userPrincipal);
        }
        public class AzureADGraphConnection : IAzureADGraphConnection
        {
            const string Resource = "https://graph.windows.net";
            public readonly Guid ClientRequestId = Guid.NewGuid();
            private readonly GraphConnection _graphConnection;
            public AzureADGraphConnection(string tenantName, string clientId, string clientSecret)
            {
                var authenticationContext = new AuthenticationContext("https://login.windows.net/" + tenantName, false);
                var clientCred = new ClientCredential(clientId, clientSecret);
                var token = authenticationContext.AcquireToken(Resource, clientCred).AccessToken;
                _graphConnection = new GraphConnection(token, ClientRequestId);
            }
            public IList<string> GetRolesForUser(ClaimsPrincipal userPrincipal)
            {
                return _graphConnection.GetMemberGroups(new User(userPrincipal.Identity.Name), true)
                    .Select(groupId => _graphConnection.Get<Group>(groupId))
                    .Where(g => g != null)
                    .Select(g => g.DisplayName)
                    .ToList();
            }
        }
    }
    ```
9. [Create an AzureADGraphClaimsAuthenticationManager class](https://github.com/robdmoore/AzureAdMvcExample/commit/cdffd2a17123d1ed69d0a5406d862a0e24371085):
    ```csharp
    // Infrastructure\Auth\AzureADGraphClaimsAuthenticationManager.cs
    using System.Configuration;
    using System.Security.Claims;
    namespace AzureAdMvcExample.Infrastructure.Auth
    {
        public class AzureADGraphClaimsAuthenticationManager : ClaimsAuthenticationManager
        {
            public override ClaimsPrincipal Authenticate(string resourceName, ClaimsPrincipal incomingPrincipal)
            {
                if (incomingPrincipal == null || !incomingPrincipal.Identity.IsAuthenticated)
                    return incomingPrincipal;
                // Ideally this should be the code below so the connection is resolved from a DI container, but for simplicity of the demo I'll leave it as a new statement
                //var graphConnection = DependencyResolver.Current.GetService<IAzureADGraphConnection>();
                var graphConnection = new AzureADGraphConnection(
                    ConfigurationManager.AppSettings["AzureADTenant"],
                    ConfigurationManager.AppSettings["ida:ClientId"],
                    ConfigurationManager.AppSettings["ida:Password"]);
                var roles = graphConnection.GetRolesForUser(incomingPrincipal);
                foreach (var r in roles)
                    ((ClaimsIdentity)incomingPrincipal.Identity).AddClaim(
                        new Claim(ClaimTypes.Role, r, ClaimValueTypes.String, "GRAPH"));
                return incomingPrincipal;
            }
        }
    }
    ```
10. [Configure your application to use the AzureADGraphClaimsAuthenticationManager class for processing claims-based authentication in your web.config file](https://github.com/robdmoore/AzureAdMvcExample/commit/5207c9979ad54cee269dbda11834b7e0c90fe79f):
    ```xml
    <system.identityModel>
        <identityConfiguration>
        <claimsAuthenticationManager type="{YOUR_NAMESPACE}.Infrastructure.Auth.AzureADGraphClaimsAuthenticationManager, {YOUR_ASSEMBLY_NAME}" />
        ...
        </identityConfiguration>
    </system.identityModel>
    ```
11. [Add `[Authorize(Roles = "{AZURE_AD_GROUP_NAME}")]` to any controller or action you want to restrict by role and call `User.IsInRole("{AZURE_AD_GROUP_NAME}")` to check if a user is a member of a particular group](https://github.com/robdmoore/AzureAdMvcExample/commit/645adabdc84bc8dc4e82bb98d2621ecb1bcc6824)


## Explaining the code

### Microsoft.Azure.ActiveDirectory.GraphClient and AzureADGraphConnection


The ActiveDirectory.GraphClient provides a wrapper over the [Azure AD Graph API](http://msdn.microsoft.com/en-us/library/azure/hh974476.aspx), which allows you to query the users, groups, etc.



The AzureADGraphConnection class constructs a graph client connection and a method to take a user and return a list of the groups that user is a member of.



This is needed because the claims that the Azure AD token comes with by default do not include any roles.


### AzureADGraphClaimsAuthenticationManager


This class provides a claims authentication manager that hooks into the point that authentication occurs and augments the Claims Principal that is generated by default by getting the Azure AD Groups that the user is a member of (via AzureADGraphConnection) and turning them into a ClaimTypes.Role claim. ClaimTypes.Role is the claim type that automatically hooks into ASP.NETs roles processing.



The web.config change is how you override the Claims Authentication Manager.


## Using an enum for roles


To avoid the use of magic strings in your application and assuming the group names in AD are relatively stable you can encapsulate them in an enum. [There is a corresponding commit in the example project that demonstrates how to do it](https://github.com/robdmoore/AzureAdMvcExample/commit/05e9a52eaa20c4c07c6ec06f873b8b7f842a86ac).



This involves three main steps:


1. Define an enum with your roles and using the [Description] attribute to tag each role with the Display Name of the equivalent Azure AD group
2. Parse the group name into the corresponding enum value by using [Humanizer.Dehumanize](https://github.com/MehdiK/Humanizer#dehumanize-enums) in AzureADGraphConnection
3. Create an AuthorizeRolesAttribute that extends AuthorizeAttribute and an extension on IClaimsPrincipal that provides an IsInRole method that both take the enum you defined rather than magic strings to define the roles

