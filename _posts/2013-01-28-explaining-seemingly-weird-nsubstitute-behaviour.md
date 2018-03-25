---
id: 471
title: Explaining seemingly weird NSubstitute behaviour
date: 2013-01-28T10:18:01+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=471
permalink: /blog/2013/01/28/explaining-seemingly-weird-nsubstitute-behaviour/
categories:
  - Technical
tags:
  - 'C#'
  - mocking
  - NSubstitute
---
I think thatÂ <a href="http://nsubstitute.github.com/" target="_blank">NSubstitute</a>Â is an absolutely amazing library! I&#8217;ve used a few different mocking libraries and NSubstitute is hands down the best one. Not only is the syntaxÂ _beautiful_Â and terse, but it&#8217;s the simplest mocking library you could ever use. Don&#8217;t know the difference between a mock and a stub? WHO CARES! It&#8217;s not something you should need to know. I couldn&#8217;t explain it better than the <a href="http://nsubstitute.github.com/" target="_blank">NSubstitute homepage</a>:

> Mock, stub, fake, spy, test double? Strict or loose? Nah, just substitute for the type you need!
> 
> NSubstitute is designed for Arrange-Act-Assert (AAA) testing, so you just need to arrange how it should work, then assert it received the calls you expected once you&#8217;re done. Because you&#8217;ve got more important code to write than whether you need a mock or a stub.

99 times out of 100 you will have nothing but pleasure with NSubstitute, but like all things it&#8217;s not perfect. When I first started using NSubstitute I didn&#8217;t realise how it was implemented and just assumed it used some sort of crazy voodoo magic. More recently, I&#8217;ve actually <a href="https://github.com/nsubstitute/NSubstitute/pull/94" target="_blank">contributed to NSubstitute</a> to fix a bug I was experiencing. After doing so, I understand a lot more now how it actually works. It turns out it&#8217;s not magic, but it is very clever.

One of the things that can trip you up about the way it&#8217;s implemented is due to the fact that .Returns and Arg.Any/Is are based on a static stack and thus sometimes if you do things like set up a received check or return value for a Â non-virtual method or set up a return value using the result of a substituted call then what the code looks like it should do doesn&#8217;t actually happen. When this does happen, if you don&#8217;t understand the implementation of what&#8217;s going on then this can be incredibly difficult to diagnose and you will generally spend a few confused hours.

This recently happened for some of the devs on my team and I wanted to try and explain to them what was happening so I came up with aÂ <a href="https://gist.github.com/4618493" target="_blank">gist that shows some examples</a>Â for .Returns of the effect the static stack implementation has. I haven&#8217;t done any for Arg.Is/Any at this stage.

If you come across problems with NSubstitute or you need to explain to other people this behaviour feel free to use myÂ <a href="https://gist.github.com/4618493" target="_blank">gist</a>. It uses NUnit and all of the tests in the gist passed when I ran it (against NSubstitute 1.4.3).