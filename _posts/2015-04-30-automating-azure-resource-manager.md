---
id: 5111
title: Automating Azure Resource Manager
date: 2015-04-30T19:07:18+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=5111
permalink: /blog/2015/04/30/automating-azure-resource-manager/
categories:
  - Technical
tags:
  - Azure Resource Manager
  - dev ops
  - powershell
  - Windows Azure
---
I&#8217;ve recently been (finally) getting to speed with <a href="http://channel9.msdn.com/Events/Build/2014/2-607" target="_blank">Azure Resource Manager</a>Â (ARM). It&#8217;s the managementÂ layer that drives the new <a href="https://portal.azure.com" target="_blank">Azure Portal</a>Â and also features like <a href="http://azure.microsoft.com/en-us/documentation/articles/azure-preview-portal-using-resource-groups/" target="_blank">Resource Groups</a> and <a href="http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/" target="_blank">Role-Based Access Control</a>.

You can interact with ARM in a number of ways:

  * <a href="https://portal.azure.com" target="_blank">new Portal</a>
  * <a href="https://msdn.microsoft.com/en-us/library/dn654592.aspx" target="_blank">PowerShell commandlets</a>
  * <a href="https://msdn.microsoft.com/en-us/library/azure/dn790568.aspx" target="_blank">HTTP API</a>
  * <a href="https://github.com/projectkudu/ARMClient" target="_blank">ARMClient</a>
  * <a href="http://azure.microsoft.com/en-us/documentation/api/management-resource-sdk-net/" target="_blank">.NET Library</a>

To authenticate to the ARM API you need to use an Azure AD credential. This is all well and good if you areÂ logged into the Portal, or running a script on your computer (where a web browser login prompt to Azure AD will pop up), but when automating your API callsÂ that&#8217;s not available.

Luckily there is a <a href="http://blog.davidebbo.com/2014/12/azure-service-principal.html" target="_blank">post by David Ebbo</a>Â that describes how toÂ generate a <a href="https://msdn.microsoft.com/en-us/library/azure/dn132633.aspx" target="_blank">Service Principal</a> (equivalent of the concept of an <a href="https://servergeeks.wordpress.com/2012/10/29/service-account-in-ad/" target="_blank">Active Directory Service Account</a>) attached to an <a href="https://msdn.microsoft.com/en-us/library/azure/dn151122.aspx" target="_blank">Azure AD application</a>.

The only problem with this post is that there are a few manual steps and it&#8217;s quite fiddly to do (by David&#8217;sÂ own admission). I&#8217;ve developed a PowerShell moduleÂ that you can use to idempotently create a Service Principal against either an entire Azure subscription or against a specific Resource Group that you can then use to automate yourÂ ARM code.

I&#8217;ve <a href="https://github.com/robdmoore/azure-resource-manager-api-credentials" target="_blank">published the code to GitHub</a>.

In order to use it you need to:

  1. Ensure you have the <a href="http://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/" target="_blank">Windows Azure PowerShell commandlets</a> installed
  2. Download the <a href="https://github.com/robdmoore/azure-resource-manager-api-credentials/blob/master/Set-ARMServicePrincipalCredential.psm1" target="_blank">Set-ARMServicePrincipalCredential.psm1</a> file from my GitHub repository
  3. Download the Azure Key Vault PowerShell commandlets and put the AADGraph.ps1 file next to the file from GitHub
  4. Execute the Set-ARMServicePrincipalCredential command asÂ per the <a href="https://github.com/robdmoore/azure-resource-manager-api-credentials/blob/master/Examples.ps1" target="_blank">examples on GitHub</a>

This will pop up a web browser prompt to authenticate (this will happen twice since I&#8217;m using two disjointed libraries &#8211; hopefully this will get resolved if Azure AD commandlets end up becoming integrated with the Azure Commandlets) give you the following information:

  * Tenant ID
  * Client ID
  * Password

From there you have all the information you need to authenticate your automated script with ARM.

If using PowerShell then this will look like:

<pre class="brush: plain; title: ; notranslate" title="">$securePassword = ConvertTo-SecureString $Password -AsPlainText -Force
    $servicePrincipalCredentials = New-Object System.Management.Automation.PSCredential ($ClientId, $securePassword)
    Add-AzureAccount -ServicePrincipal -Tenant $TenantId -Credential $servicePrincipalCredentials | Out-Null
</pre>

If using ARMClient then this will look like:

<pre class="brush: plain; title: ; notranslate" title="">armclient spn $TenantId $ClientId $Password | Out-Null
</pre>

One last note: make sure you store the password securely when automating the script, e.g. <a href="https://confluence.jetbrains.com/display/TCD9/Typed+Parameters" target="_blank">TeamCity password</a>, <a href="https://utoolity.atlassian.net/wiki/pages/viewpage.action?pageId=19464201" target="_blank">Bamboo password</a> or <a href="http://docs.octopusdeploy.com/display/OD/Variables" target="_blank">Octopus sensitiveÂ variable</a>.