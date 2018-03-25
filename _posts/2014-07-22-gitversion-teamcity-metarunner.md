---
id: 3511
title: GitVersion TeamCity MetaRunner
date: 2014-07-22T14:35:31+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3511
permalink: /blog/2014/07/22/gitversion-teamcity-metarunner/
categories:
  - Technical
tags:
  - convention
  - dev ops
  - powershell
  - TeamCity
  - tech evangelism
---
I&#8217;ve [blogged previously](http://robdmoore.id.au/blog/2014/03/22/githubflowversion-teamcity-metarunner/ "GitHubFlowVersion TeamCity MetaRunner") about using GitHubFlowVersion for versioning and how I created a TeamCity meta-runner for it.

A lot has happened since then in that space andÂ that has been nicely summarised by my friendÂ <a href="http://jake.ginnivan.net/blog/2014/05/25/simple-versioning-and-release-notes/" target="_blank">Jake Ginnivan</a>. tl;dr GitHubFlow version has been merged with the GitFlowVersion project to form <a href="https://github.com/Particular/GitVersion" target="_blank">GitVersion</a>.

This project is totally awesome and I highly recommend that you use it. In short:

> GitVersion uses your git repository branching conventions to determine the current Semantic Version of your application. It supports GitFlow and the much simpler GitHubFlow.

I&#8217;ve gone ahead and developed a much more comprehensiveÂ TeamCity meta-runner for GitVersion and I&#8217;ve submitted it to the <a href="https://github.com/JetBrains/meta-runner-power-pack/tree/master/gitversion" target="_blank">TeamCity meta-runner PowerPack</a>. This meta-runner allows you to use GitVersion without needing toÂ install any binaries on your build server or your source repository &#8211; it automatically downloads it from Chocolatey ðŸ™‚

Happy building!