---
id: 3681
title: Scripted/Automated installation script to set up Cordova/PhoneGap and Android on Windows
date: 2014-07-23T15:43:39+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3681
permalink: /blog/2014/07/23/scriptedautomated-installation-script-to-set-up-cordovaphonegap-and-android-on-windows/
categories:
  - Technical
tags:
  - Android
  - Cordova
  - dev ops
  - PhoneGap
  - powershell
  - Windows Azure
---
I recently worked on a Cordova project and one of the things we found is that it&#8217;s an absolute pain to set up a development environment since there is a whole bunch of tools that need to be downloaded and installed and configured in specific ways.

We ended up creating a page in our project&#8217;s OneNote notebook with developer setup instructions, but even though we were using Chocolatey it was still a tediousÂ process with numerous console restarts to refresh environment variables (that had to be manually set).

In the process of writing a post on Cordova I wanted to check something and realised I had repaved my machine since the last time I installed the Android SDK / Cordova etc.

I consulted the OneNote page we had created and looked in despair at the instructions. What a PITA! So what did I do?

I spun up a Windows Azure VM and stumbled through creating a PowerShell script to automate the setup. Then I spun up a second VM to check that the script worked :). Then I deleted both of them &#8211; probably cost a few cents and the servers had a really fast download speed so the installations were really quick. God I love the cloud ðŸ˜€

I&#8217;ve uploaded it to a <a href="https://gist.github.com/robdmoore/af6ec893c85364a97dc4" target="_blank">Gist</a>.Â If you areÂ setting up a PhoneGap/Cordova & Android development environment then I&#8217;m sure it will be useful to you.

Enjoy!