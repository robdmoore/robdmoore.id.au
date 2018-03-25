---
id: 197
title: Data type validation in ASP.NET MVC 3
date: 2012-04-27T00:21:01+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=197
permalink: /blog/2012/04/27/data-type-validation-in-asp-net-mvc-3/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - jQuery
  - validation
---
This post outlines some experimentation that was conducted to find the different approaches that can be taken to perform data type validation in ASP.NET MVC 3 (when binding a view model).

I did some work on this over a year ago with <a href="http://miguelmadero.blogspot.com.au/" target="_blank">Miguel Madero</a> when he was doing some consulting work with my team. Frankly, I&#8217;m confused that I can&#8217;t find a post on my blog about it because I swear that I did one.

Regardless, this one is a fairly easy post to write because it&#8217;s basically easier said in code. As such I&#8217;ll direct you to the <a href="https://github.com/robdmoore/MVC3CustomValidation" target="_blank">Github repository we created</a> and put a small explanation below.

## What do I mean by data type validation?

I mean validating the semantic form of the data &#8211; e.g. is it an integer number, is it an email address, is it one of a number of enumeration values? etc. I don&#8217;t mean validating the format of the data or the metadata or properties of the data &#8211; e.g. does it have a length greater than _x_ characters, is it smaller than number _y_, does it conform to a given regular expression, is it the same as another property in the view model?

I realise that the line between data type and data format can be blurred, particularly when it comes to strings, so another way to put it is that I&#8217;m referring to the primary validation you will perform before being able to assign the data to the given property in the view model. Then on top of that you might want to perform other validations.

## What are the ways that you can perform this validation in ASP.NET MVC?

We found three ways, feel free to post a comment if you discover any other ways and I&#8217;ll be happy to include that in the Github repo (or even better send me a pull request):

  * Custom validation attributes; e.g. 
        [Digits]
        public string DigitsWithCustomAttribute { get; set; }
        

  * Custom Data Type attribute; e.g. 
        [DataType("Digits")]
        public string DigitsWithDataTypeAttribute { get; set; }
        

  * Custom type; e.g. 
        public Digits DigitsAsCustomType { get; set; }

## Motivation and findings

The reason why we did this was because at the time the documentation for how to perform custom data type validation (outside of the build-in validation MVC provides) was confusing and lacking. It may have improved since then though&#8230;

At the end of the day, the easiest to implement was the custom validation attribute, but the nicest and tersest end result was from the most complex to implement in the custom type. I should note that one of the cool things (that all three methods supported) is that you can pass metadata to the JavaScript for client-side validation (you will have to write JavaScript validation code as well though for anything that jQuery Validate doesn&#8217;t support out of the box). The way that Microsoft have implemented this through their unobtrusive client validation code is pretty clever and well thought out :).

The readme file for the Github repository explains where to look to find the relevant code.

Enjoy!