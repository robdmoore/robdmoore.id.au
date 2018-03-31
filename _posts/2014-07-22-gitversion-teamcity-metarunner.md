---
layout: post
title: GitVersion TeamCity MetaRunner
date: 2014-07-22 14:35:31.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- convention
- dev ops
- powershell
- TeamCity
- tech evangelism
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


I've [blogged previously](http://robdmoore.id.au/blog/2014/03/22/githubflowversion-teamcity-metarunner/ "GitHubFlowVersion TeamCity MetaRunner") about using GitHubFlowVersion for versioning and how I created a TeamCity meta-runner for it.



A lot has happened since then in that space and that has been nicely summarised by my friend [Jake Ginnivan](http://jake.ginnivan.net/blog/2014/05/25/simple-versioning-and-release-notes/). tl;dr GitHubFlow version has been merged with the GitFlowVersion project to form [GitVersion](https://github.com/Particular/GitVersion).



This project is totally awesome and I highly recommend that you use it. In short:



> GitVersion uses your git repository branching conventions to determine the current Semantic Version of your application. It supports GitFlow and the much simpler GitHubFlow.



I've gone ahead and developed a much more comprehensive TeamCity meta-runner for GitVersion and I've submitted it to the [TeamCity meta-runner PowerPack](https://github.com/JetBrains/meta-runner-power-pack/tree/master/gitversion). This meta-runner allows you to use GitVersion without needing to install any binaries on your build server or your source repository - it automatically downloads it from Chocolatey :)



Happy building!

