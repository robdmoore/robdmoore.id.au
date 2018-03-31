---
layout: post
title: Using NTestDataBuilder with classes that have inheritance
date: 2013-11-27 13:46:53.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- testing
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


If you are building test data using the [NTestDataBuilder library](http://robdmoore.id.au/blog/2013/05/26/announcing-ntestdatabuilder-library/ "Announcing NTestDataBuilder library") I released and you are dealing with classes that have an inheritance chain then you might want to have a base builder class that abstracts common properties.



I've created a gist that explains how to achieve this with two different options at: [https://gist.github.com/robdmoore/7671127](https://gist.github.com/robdmoore/7671127).



Enjoy!
