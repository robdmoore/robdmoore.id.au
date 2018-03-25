---
id: 456
title: On myself and FluentMVCTesting joining TestStack
date: 2012-12-31T14:14:51+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=456
permalink: /blog/2012/12/31/on-myself-and-fluentmvctesting-joining-teststack/
categories:
  - General
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - NuGet
  - tech evangelism
  - testing
---
I&#8217;d like to announce that I&#8217;m joining <a href="http://teststack.github.com/" target="_blank">TestStack</a> and my FluentMCVTesting library will become a TestStack library.

# What is TestStack?

I think it can be summed up nicely by a post from one of the core TestStack team, Michael Whelan, in the <a href="http://michael-whelan.net/introducing-teststack" target="_blank">blog post he wrote</a>. tl;dr: TestStack is a collection of open source projects which mainly focus on making the left side of <a href="http://blog.jonasbandi.net/2010/02/agile-testing-quadrants.html" target="_blank">Marrick&#8217;s Agile Testing Quadrant</a> easier!

# Why am I joining TestStack?

I think that the libraries in TestStack are awesome and the core team are a group of people I trust and respect. It&#8217;s a pleasure to be invited into the core team and I think it&#8217;s really great for the FluentMVCTesting library to be present alongside the other awesome testing libraries.

# What will happen to FluentMVCTesting?

The nuget package and namespace is changing to have a TestStack prefix for consistency with other TestStack libraries, but other than that nothing much &#8211; the library is the same library, but it&#8217;s more likely to have additions made to it and hopefully more people using it.

If you update the existing FluentMVCTesting package then it will include the new package as a dependency and wrap around the new classes, but mark the old classes as deprecated. This should provide a smooth transition to existing users of the package as well as letting them know there is a new package out there.

I&#8217;m also dropping the strong signing support for now to keep consistency with the other TestStack libraries. We will add that in due course to all the libraries if we feel there is enough demand for it.