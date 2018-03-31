---
layout: post
title: Web Deploy Package Connection String Parameterisation Problem
date: 2012-05-21 23:39:54.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- continuous delivery
- continuous integration
- MSBuild
- MSDeploy
- Visual Studio
meta:
  _syntaxhighlighter_encoded: '1'
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


I recently came across a problem using web deploy packages, and more specifically with connection string parameterisation. I was generating a web deploy package using the "Package" MSBuild command and then deploying to a remote server using MSDeploy. The problem I came across was that the parameterised connection strings weren't being replaced.



That resulted in the deployed web.config file looking something like this:



```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  ...
  <connectionStrings>
      <add name="SomeConnectionString" connectionString="$(ReplacableToken_SomeConnectionString-Web.config Connection String_0)" />
  </connectionStrings>
  ...
</configuration>
```



I used a variety of approaches - DeployOnBuild MSBuild command, Visual Studio GUI interface, the generated .cmd file and direct msdeploy call - to deploy the package to check whether the problem was simply that I was somehow deploying it incorrectly, but they all resulted in the same problem.



Most of the Google results that came up simply said to [turn off parameterisation](http://stackoverflow.com/questions/3629850/replacabletoken-when-using-web-config-transform), but in this instance I wanted to use parameterisation. While I was using XDT transformations, I also wanted to use connection string parameterisation so I could substitute the connection strings for entries in a password safe as part of an automated deployment step.



The build output wasn't terribly helpful, so I passed the [verbose option](http://technet.microsoft.com/en-us/library/dd569089(v=ws.10).aspx) to msdeploy and got the following interesting output:


```
    ...
    [16:08:33][Step 2/2] Verbose: Parameter entry 'SomeConnectionString-Web.config Connection String/1' could not be applied anywhere.
    [16:08:33][Step 2/2] Verbose: The dependency check 'DependencyCheckInUse' found no issues.
    [16:08:33][Step 2/2] Verbose: The synchronization completed in 2 pass(es).
    [16:08:33][Step 2/2] Total changes: 10 (0 added, 0 deleted, 10 updated, 0 parameters changed, 1004778 bytes copied)
    [16:08:33][Step 2/2] Process exited with code 0
```


This didn't really make a huge amount of sense and after some sanity checking to make sure parameterisation does actually work (created a new ASP.NET website and deployed it successfully) I started comparing all the differences in my .csproj configuration to a blank project. After some tedious trial and error I managed to narrow the errant configuration to the following (seemingly) innocuous line:



```xml
<BaseIntermediateOutputPath>$(ProjectDir)..obj</BaseIntermediateOutputPath>
```



You might be asking why I had that line in there in the first place? It is certainly a bit weird and you would normally expect it to be set to "obj". In this case it was there so that when MvcBuildViews was next executed after building a package it didn't choke with the following error (on the intermediate web.config files in the obj folder):



>  It is an error to use a section registered as allowDefinition='MachineToApplication' beyond application level.  This error can be caused by a virtual directory not being configured as an application in IIS.



When I initially came across that problem I changed the location of the obj folder since it seemed the best option compared to the other options such as running clean before all builds or deleting the obj folder, both of which would slow down the build and be tedious and annoying. Also, I didn't want to turn MvcBuildViews off since I want assurance on the build server that the views all compiled fine.



Since this was no longer an option (up until this point all web deploys were done manually so we hadn't actually come across this new problem!) I came up with the following configuration as a solution (props to my Senior Dev, Matt Davies, for finding the [relevant StackOverflow post](http://stackoverflow.com/a/5585393) for the inspiration):



```xml
  <Target Name="CleanPackage" BeforeTargets="MvcBuildViews" Condition="'$(MvcBuildViews)'=='true'">
    <CallTarget Targets="CleanWebsitesPackage" />
    <CallTarget Targets="CleanWebsitesPackageTempDir" />
    <CallTarget Targets="CleanWebsitesTransformParametersFiles" />
  </Target>
  <Target Name="MvcBuildViews" AfterTargets="Build" Condition="'$(MvcBuildViews)'=='true'">
    <AspNetCompiler VirtualPath="temp" PhysicalPath="$(WebProjectOutputDir)" />
  </Target>
```



Basically, if you have MvcBuildViews set to true then it will run MvcBuildViews directly after the build and before running MvcBuildViews it will run the CleanWebsitesPackage, CleanWebsitesPackageTempDir and CleanWebsitesTransformParametersFiles targets which clean up the web deploy package files and thus the web.config files that mess with MvcBuildViews.


## Update (17 Feb 2013)


If you are trying to use the above MSBuild with Visual Studio 2012 then it won't work. I have [blogged a solution that works in both Visual Studio 2012 and Visual Studio 2010](http://robdmoore.id.au/blog/2013/02/17/running-aspnetcompiler-after-creating-web-deploy-package-using-visualstudio-2012-with-round-tripping-to-2010/ "Running AspNetCompiler after creating web deploy package using VisualStudio 2012 with round-tripping to 2010") though.

