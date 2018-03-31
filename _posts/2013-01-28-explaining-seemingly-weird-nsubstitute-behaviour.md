---
layout: post
title: Explaining seemingly weird NSubstitute behaviour
date: 2013-01-28 10:18:01.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- mocking
- NSubstitute
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


I think that [NSubstitute](http://nsubstitute.github.com/) is an absolutely amazing library! I've used a few different mocking libraries and NSubstitute is hands down the best one. Not only is the syntax *beautiful* and terse, but it's the simplest mocking library you could ever use. Don't know the difference between a mock and a stub? WHO CARES! It's not something you should need to know. I couldn't explain it better than the [NSubstitute homepage](http://nsubstitute.github.com/):



> Mock, stub, fake, spy, test double? Strict or loose? Nah, just substitute for the type you need!
> 
> 
> 
> NSubstitute is designed for Arrange-Act-Assert (AAA) testing, so you just need to arrange how it should work, then assert it received the calls you expected once you're done. Because you've got more important code to write than whether you need a mock or a stub.



99 times out of 100 you will have nothing but pleasure with NSubstitute, but like all things it's not perfect. When I first started using NSubstitute I didn't realise how it was implemented and just assumed it used some sort of crazy voodoo magic. More recently, I've actually [contributed to NSubstitute](https://github.com/nsubstitute/NSubstitute/pull/94) to fix a bug I was experiencing. After doing so, I understand a lot more now how it actually works. It turns out it's not magic, but it is very clever.



One of the things that can trip you up about the way it's implemented is due to the fact that .Returns and Arg.Any/Is are based on a static stack and thus sometimes if you do things like set up a received check or return value for a  non-virtual method or set up a return value using the result of a substituted call then what the code looks like it should do doesn't actually happen. When this does happen, if you don't understand the implementation of what's going on then this can be incredibly difficult to diagnose and you will generally spend a few confused hours.



This recently happened for some of the devs on my team and I wanted to try and explain to them what was happening so I came up with a [gist that shows some examples](https://gist.github.com/4618493) for .Returns of the effect the static stack implementation has. I haven't done any for Arg.Is/Any at this stage.



If you come across problems with NSubstitute or you need to explain to other people this behaviour feel free to use my [gist](https://gist.github.com/4618493). It uses NUnit and all of the tests in the gist passed when I ran it (against NSubstitute 1.4.3).

