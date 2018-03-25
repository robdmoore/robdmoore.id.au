---
id: 259
title: Web Deploy Package Connection String Parameterisation Problem
date: 2012-05-21T23:39:54+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=259
permalink: /blog/2012/05/21/web-deploy-package-connection-string-parameterisation-problem/
categories:
  - Technical
tags:
  - continuous delivery
  - continuous integration
  - MSBuild
  - MSDeploy
  - Visual Studio
---
I recently came across a problem using web deploy packages, and more specifically with connection string parameterisation. I was generating a web deploy package using the &#8220;Package&#8221; MSBuild command and then deploying to a remote server using MSDeploy. The problem I came across was that the parameterised connection strings weren&#8217;t being replaced.

That resulted in the deployed web.config file looking something like this:

<pre class="brush: xml; title: ; notranslate" title="">&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;configuration&gt;
  ...
  &lt;connectionStrings&gt;
      &lt;add name="SomeConnectionString" connectionString="$(ReplacableToken_SomeConnectionString-Web.config Connection String_0)" /&gt;
  &lt;/connectionStrings&gt;
  ...
&lt;/configuration&gt;
</pre>

I used a variety of approaches &#8211; DeployOnBuild MSBuild command, Visual Studio GUI interface, the generated .cmd file and direct msdeploy call &#8211; to deploy the package to check whether the problem was simply that I was somehow deploying it incorrectly, but they all resulted in the same problem.

Most of the Google results that came up simply said to <a href="http://stackoverflow.com/questions/3629850/replacabletoken-when-using-web-config-transform" target="_blank">turn off parameterisation</a>, but in this instance I wanted to use parameterisation. While I was using XDT transformations, I also wanted to use connection string parameterisation so I could substitute the connection strings for entries in a password safe as part of an automated deployment step.

The build output wasn&#8217;t terribly helpful, so I passed the <a href="http://technet.microsoft.com/en-us/library/dd569089(v=ws.10).aspx" target="_blank">verbose option</a> to msdeploy and got the following interesting output:

    ...
    <strong>[16:08:33][Step 2/2] Verbose: Parameter entry 'SomeConnectionString-Web.config Connection String/1' could not be applied anywhere.</strong>
    [16:08:33][Step 2/2] Verbose: The dependency check 'DependencyCheckInUse' found no issues.
    [16:08:33][Step 2/2] Verbose: The synchronization completed in 2 pass(es).
    [16:08:33][Step 2/2] Total changes: 10 (0 added, 0 deleted, 10 updated, 0 parameters changed, 1004778 bytes copied)
    [16:08:33][Step 2/2] Process exited with code 0
    

This didn&#8217;t really make a huge amount of sense and after some sanity checking to make sure parameterisation does actually work (created a new ASP.NET website and deployed it successfully) I started comparing all the differences in my .csproj configuration to a blank project. After some tedious trial and error I managed to narrow the errant configuration to the following (seemingly) innocuous line:

<pre class="brush: xml; title: ; notranslate" title="">&lt;BaseIntermediateOutputPath&gt;$(ProjectDir)..obj&lt;/BaseIntermediateOutputPath&gt;
</pre>

You might be asking why I had that line in there in the first place? It is certainly a bit weird and you would normally expect it to be set to &#8220;obj&#8221;. In this case it was there so that when MvcBuildViews was next executed after building a package it didn&#8217;t choke with the following error (on the intermediate web.config files in the obj folder):

<pre>It is an error to use a section registered as allowDefinition='MachineToApplication' beyond application level.  This error can be caused by a virtual directory not being configured as an application in IIS.</pre>

When I initially came across that problem I changed the location of the obj folder since it seemed the best option compared to the other options such as running clean before all builds or deleting the obj folder, both of which would slow down the build and be tedious and annoying. Also, I didn&#8217;t want to turn MvcBuildViews off since I want assurance on the build server that the views all compiled fine.

Since this was no longer an option (up until this point all web deploys were done manually so we hadn&#8217;t actually come across this new problem!) I came up with the following configuration as a solution (props to my Senior Dev, Matt Davies, for finding the <a href="http://stackoverflow.com/a/5585393" target="_blank">relevant StackOverflow post</a> for the inspiration):

<pre class="brush: xml; title: ; notranslate" title="">&lt;Target Name="CleanPackage" BeforeTargets="MvcBuildViews" Condition="'$(MvcBuildViews)'=='true'"&gt;
    &lt;CallTarget Targets="CleanWebsitesPackage" /&gt;
    &lt;CallTarget Targets="CleanWebsitesPackageTempDir" /&gt;
    &lt;CallTarget Targets="CleanWebsitesTransformParametersFiles" /&gt;
  &lt;/Target&gt;
  &lt;Target Name="MvcBuildViews" AfterTargets="Build" Condition="'$(MvcBuildViews)'=='true'"&gt;
    &lt;AspNetCompiler VirtualPath="temp" PhysicalPath="$(WebProjectOutputDir)" /&gt;
  &lt;/Target&gt;
</pre>

Basically, if you have MvcBuildViews set to true then it will run MvcBuildViews directly after the build and before running MvcBuildViews it will run the CleanWebsitesPackage, CleanWebsitesPackageTempDir and CleanWebsitesTransformParametersFiles targets which clean up the web deploy package files and thus the web.config files that mess with MvcBuildViews.

## Update (17 Feb 2013)

If you are trying to use the above MSBuild with Visual Studio 2012 then it won&#8217;t work. I have [blogged a solution that works in both Visual Studio 2012 and Visual Studio 2010](http://robdmoore.id.au/blog/2013/02/17/running-aspnetcompiler-after-creating-web-deploy-package-using-visualstudio-2012-with-round-tripping-to-2010/ "Running AspNetCompiler after creating web deploy package using VisualStudio 2012 with round-tripping to 2010") though.