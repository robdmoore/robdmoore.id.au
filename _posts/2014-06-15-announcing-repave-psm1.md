---
layout: post
title: Announcing repave.psm1
date: 2014-06-15 20:19:26.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- dev ops
- powershell
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


So after 18 months of not repaving my machine and occasionally (especially lately) having to deal with the machine filling up and slowing down I'm finally at the point where it's time to repave. I wanted to do it ages ago, but I avoided it because of how painful it is to do.



This time around I've decided to bite the bullet and finally do something I've been meaning to do all along - create a script to make it much easier / quicker as well as form documentation about what programs / what setup I want for my machine.



I've been interested in [Chocolatey](http://chocolatey.org/) and [Boxstarter](http://boxstarter.org/) for ages to do this very thing. In this instance I didn't bother using Boxstarter since I didn't have any restarts in there, but I encourage people to look into it particularly if doing VM install scripts - it's AMAZING.



I started writing this crazy PowerShell script to automate all the installs and settings I wanted and eventually I refactored it until it became like [this](https://github.com/MRCollective/repave.psm1/blob/master/robdmoore.ps1). I think it's really readable and maintainable and acts really well as documentation for myself.



While developing it I initially had a bunch of cinst calls, but the problem with that is each call incurs a 2s startup cost for some reason - this made developing it painful. In order to develop the script incrementally (I was doing it inside of a VM so I could trash it and start from the beginning again) I wanted three things:


- Speed (if something is already installed I want it to skip it instantly, not wait for cinst to spin up for 2s)
- Idempotency (I want to run and re-run the script again and again and again after making small changes to see their effect)
- Fail fast (if something is wrong I want it to just fail and print an error so I can see what happened - I don't want it to continue trying to install other things that might be dependent on the thing that failed)



I managed to achieve all of that and the other advantage I see in this approach is that it makes it really easy for me to reuse the script as an update mechanism if I decide to change things between re-paves. This is awesome and I think makes the script way more useful.



Long-story short: I've abstracted all of the main functionality into a PowerShell module and open-sourced it as [repave.psm1](https://github.com/MRCollective/repave.psm1) on GitHub. Check it out and feel free to fork it to create your own scripts and submit back a pull request with any fixes or additions.



It's a bit rough around the edges since I've knocked it up in a hurry this weekend, but I did put in some initial documentation to describe all the functionality and there are two example scripts in there that use it.



Enjoy!

