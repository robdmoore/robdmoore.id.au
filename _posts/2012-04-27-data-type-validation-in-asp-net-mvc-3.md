---
layout: post
title: Data type validation in ASP.NET MVC 3
date: 2012-04-27 00:21:01.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- jQuery
- validation
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


This post outlines some experimentation that was conducted to find the different approaches that can be taken to perform data type validation in ASP.NET MVC 3 (when binding a view model).



I did some work on this over a year ago with [Miguel Madero](http://miguelmadero.blogspot.com.au/) when he was doing some consulting work with my team. Frankly, I'm confused that I can't find a post on my blog about it because I swear that I did one.



Regardless, this one is a fairly easy post to write because it's basically easier said in code. As such I'll direct you to the [Github repository we created](https://github.com/robdmoore/MVC3CustomValidation) and put a small explanation below.


## What do I mean by data type validation?


I mean validating the semantic form of the data - e.g. is it an integer number, is it an email address, is it one of a number of enumeration values? etc. I don't mean validating the format of the data or the metadata or properties of the data - e.g. does it have a length greater than *x* characters, is it smaller than number *y*, does it conform to a given regular expression, is it the same as another property in the view model?



I realise that the line between data type and data format can be blurred, particularly when it comes to strings, so another way to put it is that I'm referring to the primary validation you will perform before being able to assign the data to the given property in the view model. Then on top of that you might want to perform other validations.


## What are the ways that you can perform this validation in ASP.NET MVC?


We found three ways, feel free to post a comment if you discover any other ways and I'll be happy to include that in the Github repo (or even better send me a pull request):


- Custom validation attributes; e.g.
  ```csharp
    [Digits]
    public string DigitsWithCustomAttribute { get; set; }
  ```
- Custom Data Type attribute; e.g.
  ```csharp
    [DataType("Digits")]
    public string DigitsWithDataTypeAttribute { get; set; }
  ```
- Custom type; e.g.
  ```csharp
    public Digits DigitsAsCustomType { get; set; }
  ```


## Motivation and findings


The reason why we did this was because at the time the documentation for how to perform custom data type validation (outside of the build-in validation MVC provides) was confusing and lacking. It may have improved since then though...



At the end of the day, the easiest to implement was the custom validation attribute, but the nicest and tersest end result was from the most complex to implement in the custom type. I should note that one of the cool things (that all three methods supported) is that you can pass metadata to the JavaScript for client-side validation (you will have to write JavaScript validation code as well though for anything that jQuery Validate doesn't support out of the box). The way that Microsoft have implemented this through their unobtrusive client validation code is pretty clever and well thought out :).



The readme file for the Github repository explains where to look to find the relevant code.



Enjoy!

