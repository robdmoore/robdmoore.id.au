---
id: 1871
title: Using NTestDataBuilder with classes that have inheritance
date: 2013-11-27T13:46:53+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=1871
permalink: /blog/2013/11/27/using-ntestdatabuilder-with-classes-that-have-inheritance/
categories:
  - Technical
tags:
  - 'C#'
  - testing
---
If you are building test data using the [NTestDataBuilder library](http://robdmoore.id.au/blog/2013/05/26/announcing-ntestdatabuilder-library/ "Announcing NTestDataBuilder library") I released and you are dealing with classes that have an inheritance chain then you might want to have a base builder class that abstracts common properties.

I&#8217;ve created a gist that explains how to achieve this with two different options at:Â <a href="https://gist.github.com/robdmoore/7671127" target="_blank">https://gist.github.com/robdmoore/7671127</a>.

Enjoy!