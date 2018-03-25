---
id: 3271
title: Announcing repave.psm1
date: 2014-06-15T20:19:26+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3271
permalink: /blog/2014/06/15/announcing-repave-psm1/
categories:
  - Technical
tags:
  - dev ops
  - powershell
  - tech evangelism
---
So after 18 months of not repaving my machine and occasionally (especially lately) having to deal with the machine filling up and slowing down I&#8217;m finally at the point where it&#8217;s time to repave. I wanted to do it ages ago, but I avoided it because of how painful it is to do.

This time around I&#8217;ve decided to bite the bullet and finally do something I&#8217;ve been meaning to do all along &#8211; create a script to make it much easier / quicker as well as form documentation about what programs / what setup I want for my machine.

I&#8217;ve been interested in <a href="http://chocolatey.org/" target="_blank">Chocolatey</a> and <a href="http://boxstarter.org/" target="_blank">Boxstarter</a> for ages to do this very thing. In this instance I didn&#8217;t bother using Boxstarter since I didn&#8217;t have any restarts in there, but I encourage people to look into it particularly if doing VM install scripts &#8211; it&#8217;s AMAZING.

I started writing this crazy PowerShell script to automate all the installs and settings I wanted and eventually I refactored it until it became like <a href="https://github.com/MRCollective/repave.psm1/blob/master/robdmoore.ps1" target="_blank">this</a>. I think it&#8217;s really readable and maintainable and acts really well as documentation for myself.

While developing it I initially had a bunch of cinst calls, but the problem with that is each call incurs a 2s startup cost for some reason &#8211; this made developing it painful. In order to develop the script incrementally (I was doing it inside of a VM so I could trash it and start from the beginning again) I wanted three things:

  * Speed (if something is already installed I want it to skip it instantly, not wait for cinst to spin up for 2s)
  * Idempotency (I want to run and re-run the script again and again and again after making small changes to see their effect)
  * Fail fast (if something is wrong I want it to just fail and print an error so I can see what happened &#8211; I don&#8217;t want it to continue trying to install other things that might be dependent on the thing that failed)

I managed to achieve all of that and the other advantage I see in this approach is that it makes it really easy for me to reuse the script as an update mechanism if I decide to change things between re-paves. This is awesome and I think makes the script way more useful.

Long-story short: I&#8217;ve abstracted all of the main functionality into a PowerShell module and open-sourced it as <a href="https://github.com/MRCollective/repave.psm1" target="_blank">repave.psm1</a> on GitHub. Check it out and feel free to fork it to create your own scripts and submit back a pull request with any fixes or additions.

It&#8217;s a bit rough around the edges since I&#8217;ve knocked it up in a hurry this weekend, but I did put in some initial documentation to describe all the functionality and there are two example scripts in there that use it.

Enjoy!