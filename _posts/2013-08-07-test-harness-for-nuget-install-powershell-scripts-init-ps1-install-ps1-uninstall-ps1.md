---
id: 1631
title: Test Harness for NuGet install PowerShell scripts (init.ps1, install.ps1, uninstall.ps1)
date: 2013-08-07T21:27:03+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=1631
permalink: /blog/2013/08/07/test-harness-for-nuget-install-powershell-scripts-init-ps1-install-ps1-uninstall-ps1/
categories:
  - Technical
tags:
  - 'C#'
  - NuGet
  - powershell
  - testing
---
One thing that I find frustrating when creating NuGet packages is the debug experience when it comes to creating the PowerShell install scripts (init.ps1, install.ps1, uninstall.ps1).

In order to make it easier to do the debugging I&#8217;ve created a test harness Visual Studio solution that allows you to make changes to a file, compile the solution, run a single command in the package manager and then have the package uninstall and then install again. That way you can change a line of code, do a few key strokes and then see the result straight away.

To see the code you can head to the <a href="https://github.com/robdmoore/NuGetCommandTestHarness" target="_blank">GitHub repository</a>.Â The basic instructions are on the readme:

  1. [Once off] Checkout the code
  2. [Once off] Create a <a href="http://docs.nuget.org/docs/creating-packages/hosting-your-own-nuget-feeds" target="_blank">NuGet source directory</a> in checkout directory
  3. Repeat in a loop: 
      1. <span style="line-height: 14px;">Write the code (the structure of the solution is the structure of your nuget package, so put the appropriately named .ps1 scripts in the tools folder)</span>
      2. Compile the solution (this creates a nuget package in the root of the solution with the name Package and version {yymm}.{ddHH}.{mmss}.nupkg &#8211; this means that the package version will increase with time so if you install from that directory it will always install the latest build) <F6> or <Ctrl+Shift+B)
      3. Switch to the Package Manager Console <Ctrl+P, Ctrl+M>
      4. [First time]Â `Uninstall-Package Package; Install-Package Package` <enter> / [Subsequent times] <Up arrow> <enter>
  4. When done simply copy the relevant files out and reset master to get a clean slate

## Other handy hints

  * `Get-Project` in the NuGet console returns the current project as a DTE object (the same as the `$project` parameter that is passed to the NuGet scripts)
  * Look up the relevant <a href="http://msdn.microsoft.com/en-us/library/envdte.project.aspx" target="_blank">MSDN documentation</a> on the Project DTE item
  * If you want to add commands to the NuGet Package Manager Console when people <a href="http://blog.tomasjansson.com/extending-the-nuget-package-manager-console" target="_blank">install your script, put the commands in a .psm1 file and load the module from init.ps1</a> (<a href="http://docs.nuget.org/docs/creating-packages/creating-and-publishing-a-package#Automatically_Running_PowerShell_Scripts_During_Package_Installation_and_Removal" target="_blank">which is loaded every time your solution loads</a>)