---
layout: post
title: Announcing ChameleonForms 0.1
date: 2012-11-01 23:36:11.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- convention
- forms
- HTML
- NuGet
- razor
author: rob
---


One of the things I find frustrating with ASP.NET MVC out of the box is creating forms. That's not to say I find it more frustrating than other frameworks or libraries though; on the contrary [I think it's painful almost always](/blog/2011/01/22/html-forms/). I think ASP.NET MVC has an amazingly powerful and useful capacity to handle forms. However, out of the box I find it fiddly and annoying to output the HTML associated with the form in a consistent and maintainable way across a whole website.



The other problem occurs when you want to change the layout of the form. For instance, imagine I create a proof-of-concept application using Twitter Bootstrap to get up and running with something that looks nice quickly. I may well want to scrap the application because it turns out to not be popular or useful. On the other hand, if it became really popular then I might want to spend some more time and effort customising the look-and-feel. At that point I will more than likely want to move away from the HTML template that Twitter Bootstrap imposes on you to use a more semantic markup (e.g. [definition lists](http://blogs.curtin.edu.au/webdev/2010/01/17/form-xhtml-semantics/)).


## Enter Chameleon Forms


For the last 2 years, while I was working at Curtin University I was lucky enough to be able to use a library that we developed for tersely and maintainably developing forms that conformed to the forms standard that we had at Curtin. We had the advantage that the library was able to be specific to the Curtin standard for forms and didn't have to be very generic. We still ensured that the library was very flexible though, because we want to make sure we could use it for most of the use cases we came across and still be able to break out into straight HTML for the weird edge cases.



ChameleonForms is my attempt to use the learnings and concepts from the previous forms library I was using and apply them to a new, open source library that I can use on my personal and professional projects to ease the pain of creating forms and improve the maintainability of them.



I am implementing this library alongside [Matt Davies](http://blog.mdavies.net/), who I often work closely with.



This blog post is announcing the initial release of this library, which contains basic functionality only. There is more information about the library, an example of how to use it and the roadmap we have for it at the [Github page](https://github.com/MRCollective/ChameleonForms).



If you want to install this initial version from NuGet then simply use:



Install-Package ChameleonForms



Enjoy!

