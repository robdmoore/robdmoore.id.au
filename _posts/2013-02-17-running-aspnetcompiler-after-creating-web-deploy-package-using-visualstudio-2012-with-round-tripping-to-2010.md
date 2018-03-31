---
layout: post
title: Running AspNetCompiler after creating web deploy package using VisualStudio
  2012 with round-tripping to 2010
date: 2013-02-17 20:37:47.000000000 +08:00
type: post
categories:
- Technical
tags:
- MSBuild
- MSDeploy
author: rob
---


I've previously blogged (as a side-note of an unrelated problem I was having) the approach that I use to [overcome the problem that the AspNetCompiler has when you have the extraneous web.config files in the obj folder after creating a web deploy package](http://robdmoore.id.au/blog/2012/05/21/web-deploy-package-connection-string-parameterisation-problem/ "Web Deploy Package Connection String Parameterisation Problem").



The usual way you will come across this problem is running MvcBuildViews in a subsequent build after creating the package. The solution that I previously posted included a few MSBuild targets that can be called prior to running MvcBuildViews to clean up the web deploy files.



If you have tried using these targets after upgrading your project to Visual Studio 2012 then you will have noticed that some of the targets no longer work because they have been renamed. The following code is what I now use and it is compatible with the Visual Studio 2010 round-tripping support.



```xml
  <Target Name="CleanWebDeploy" BeforeTargets="MvcBuildViews" Condition="'$(MvcBuildViews)'=='true'">
    <Message Text="Running Clean Web Deploy Target" />
    <CallTarget Targets="CleanWebsitesPackage" />
    <CallTarget Targets="CleanWebsitesPackageTempDir" Condition="'$(VisualStudioVersion)'=='10.0'" />
    <CallTarget Targets="CleanWebsitesTransformParametersFiles" Condition="'$(VisualStudioVersion)'=='10.0'" />
    <CallTarget Targets="CleanWebsitesWPPAllFilesInSingleFolder" Condition="'$(VisualStudioVersion)'!='10.0'" />
    <CallTarget Targets="CleanWebPublishPipelineIntermediateOutput" Condition="'$(VisualStudioVersion)'!='10.0'" />
  </Target>
```

