---
layout: post
title: Automating Azure Resource Manager
date: 2015-04-30 19:07:18.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- Azure Resource Manager
- dev ops
- powershell
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


I've recently been (finally) getting to speed with [Azure Resource Manager](http://channel9.msdn.com/Events/Build/2014/2-607) (ARM). It's the management layer that drives the new [Azure Portal](https://portal.azure.com) and also features like [Resource Groups](http://azure.microsoft.com/en-us/documentation/articles/azure-preview-portal-using-resource-groups/) and [Role-Based Access Control](http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/).



You can interact with ARM in a number of ways:


- [new Portal](https://portal.azure.com)
- [PowerShell commandlets](https://msdn.microsoft.com/en-us/library/dn654592.aspx)
- [HTTP API](https://msdn.microsoft.com/en-us/library/azure/dn790568.aspx)
- [ARMClient](https://github.com/projectkudu/ARMClient)
- [.NET Library](http://azure.microsoft.com/en-us/documentation/api/management-resource-sdk-net/)



To authenticate to the ARM API you need to use an Azure AD credential. This is all well and good if you are logged into the Portal, or running a script on your computer (where a web browser login prompt to Azure AD will pop up), but when automating your API calls that's not available.



Luckily there is a [post by David Ebbo](http://blog.davidebbo.com/2014/12/azure-service-principal.html) that describes how to generate a [Service Principal](https://msdn.microsoft.com/en-us/library/azure/dn132633.aspx) (equivalent of the concept of an [Active Directory Service Account](https://servergeeks.wordpress.com/2012/10/29/service-account-in-ad/)) attached to an [Azure AD application](https://msdn.microsoft.com/en-us/library/azure/dn151122.aspx).



The only problem with this post is that there are a few manual steps and it's quite fiddly to do (by David's own admission). I've developed a PowerShell module that you can use to idempotently create a Service Principal against either an entire Azure subscription or against a specific Resource Group that you can then use to automate your ARM code.



I've [published the code to GitHub](https://github.com/robdmoore/azure-resource-manager-api-credentials).



In order to use it you need to:


1. Ensure you have the [Windows Azure PowerShell commandlets](http://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/) installed
2. Download the [Set-ARMServicePrincipalCredential.psm1](https://github.com/robdmoore/azure-resource-manager-api-credentials/blob/master/Set-ARMServicePrincipalCredential.psm1) file from my GitHub repository
3. Download the Azure Key Vault PowerShell commandlets and put the AADGraph.ps1 file next to the file from GitHub
4. Execute the Set-ARMServicePrincipalCredential command as per the [examples on GitHub](https://github.com/robdmoore/azure-resource-manager-api-credentials/blob/master/Examples.ps1)



This will pop up a web browser prompt to authenticate (this will happen twice since I'm using two disjointed libraries - hopefully this will get resolved if Azure AD commandlets end up becoming integrated with the Azure Commandlets) give you the following information:


- Tenant ID
- Client ID
- Password



From there you have all the information you need to authenticate your automated script with ARM.



If using PowerShell then this will look like:



```
    $securePassword = ConvertTo-SecureString $Password -AsPlainText -Force
    $servicePrincipalCredentials = New-Object System.Management.Automation.PSCredential ($ClientId, $securePassword)
    Add-AzureAccount -ServicePrincipal -Tenant $TenantId -Credential $servicePrincipalCredentials | Out-Null
```



If using ARMClient then this will look like:



```
    armclient spn $TenantId $ClientId $Password | Out-Null
```



One last note: make sure you store the password securely when automating the script, e.g. [TeamCity password](https://confluence.jetbrains.com/display/TCD9/Typed+Parameters), [Bamboo password](https://utoolity.atlassian.net/wiki/pages/viewpage.action?pageId=19464201) or [Octopus sensitive variable](http://docs.octopusdeploy.com/display/OD/Variables).

