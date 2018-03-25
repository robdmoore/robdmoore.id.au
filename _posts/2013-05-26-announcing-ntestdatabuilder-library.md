---
id: 1091
title: Announcing NTestDataBuilder library
date: 2013-05-26T15:48:23+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=1091
permalink: /blog/2013/05/26/announcing-ntestdatabuilder-library/
categories:
  - Technical
tags:
  - 'C#'
  - mocking
  - NSubstitute
  - testing
---
Further to the blog post I posted yesterday about the approach to [generating test fixture data for automated tests](http://robdmoore.id.au/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/ "Test Data Generation the right way: Object Mother + Test Data Builders + NSubstitute + NBuilder") that my team has adopted I have open sourced a base class and other supporting code infrastructure to quickly, tersely and maintainably generate fixture data in a consistent way.

I have released this library to <a href="https://github.com/robdmoore/NTestDataBuilder" target="_blank">GitHub</a> and <a href="https://nuget.org/packages/NTestDataBuilder/" target="_blank">NuGet</a> under the name NTestDataBuilder.

<span style="line-height: 1.714285714; font-size: 1rem;">The GitHub page has a bunch of code snippets that will get you started quickly. Read my previous blog post to get a feel for how I use the code and in particular how I combine the approach with the Object Mother pattern for best effect.</span>

Enjoy!