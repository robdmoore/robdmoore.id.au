---
layout: post
title: HTML Forms
date: 2011-01-22 11:43:32.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- ASP.NET MVC
- ColdFusion
- forms
- HTML
- Ruby On Rails (RoR)
meta:
  _edit_last: '1'
  _wp_old_slug: ''
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


As any web developer will likely tell you, the most tedious,  time-consuming and annoying job a web developer can be tasked with is  the creation of a form. There are a number of reasons for this,  including:  
<!--more-->


- There is repetition in referencing each field in the form in  numerous locations, i.e. default values, server-side validation,  printing out the form <abbr title="HyperText Markup Language">HTML</abbr> and potentially also in client-side validation code
- Printing out the HTML form the form is tedious because each field  has practically the same HTML except for the field id repeated a few  times, and occasionally a different type of form control (e.g. select or  textarea)
- Similarly, the repetition between server-side and client-side validation is tedious
- You need to be careful when printing out the HTML to ensure there is no possibility of [HTML injection](http://en.wikipedia.org/wiki/Code_injection "Opens new window") (i.e. you need to use `HTMLEditFormat` (in ColdFusion, `htmlentities` in <abbr title="PHP: Hypertext Preprocessor">PHP</abbr> etc.) before printing out form scoped values, this is easy to forget or miss)
- You need to be careful to include labels for all fields for  accessibility reasons and ensure their ids match up; it's easy to miss a  few if you are copying and pasting the same HTML for each field and  changing a few attributes (although the HTMLValidator plugin for Firefox  shows duplicate / un-matched ids making it easy to identify this for  the astute developer)



Without continuing further with other reasons, the above list serves  to demonstrate that the process of creating a form is a tedious and  repetitive process and certainly does not conform to the <acronym title="Don't Repeat Yourself"><a href="http://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank">DRY</a></acronym> principle. This means that form creation is often an error-prone  process, resulting in inconsistencies. This means that forms often have  usability and accessibility issues.



With this in mind, any solution that can reduce the amount of repetition that developers need to use to specify a full-featured form (client-side and server-side validation, fully accessible, remembers the submitted values when you get the form back after producing an error with server-side validation, etc.) is great.



Tools like Ruby on Rails and ASP.NET MVC that provide things like Active Record, form helpers tied to models, and concise annotations / methods that can be used for both client and server-side validation are great.



At the same time, there are often situations where you need some slightly different field layouts that require different HTML and automated solutions often lack flexibility to facilitate this. Often in these situations it's easier to break out into a more manual approach (depending on the flexibility of the solution, sometimes you might need to do the whole form manually!). This is a good indicator that whatever solution you are using goes too far and you should be looking elsewhere.



At Curtin we created a forms library in ColdFusion that allowed us to succinctly specify the layout of the form, but was flexible enough for us to break out completely manually or semi-automated for particular fields. It also included very succinct server-side validation code. Layout and client-side validation were taken care of by a globally shared library that was developed, which made things easier. I will blog about the solution we used in more detail sometime soon.

