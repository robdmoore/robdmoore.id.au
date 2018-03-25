---
id: 376
title: WebApi.Hal
date: 2012-09-01T16:17:34+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=376
permalink: /blog/2012/09/01/webapi-hal/
categories:
  - Technical
tags:
  - 'C#'
  - hypermedia
  - JavaScript
  - REST
  - tech evangelism
  - unobtrusive coding
---
Lately I&#8217;ve been having a bit of fun learning <a href="http://www.asp.net/web-api" target="_blank">ASP.NET Web API</a> and I&#8217;ve been working with <a href="http://jake.ginnivan.net/" target="_blank">Jake Ginnivan</a> to come up with a library that allows you to follow the <a href="http://en.wikipedia.org/wiki/HATEOAS" target="_blank">HATEOS</a> principle of <a href="http://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">REST</a> using it. We&#8217;ve been doing this by implementing a specification that allows you to specify hypermedia for JSON and XML called <a href="http://stateless.co/hal_specification.html" target="_blank">HAL</a>.

Jake did some <a href="https://github.com/JakeGinnivan/WebApi.Hal" target="_blank">awesome work to start it off</a> and <a href="https://github.com/JakeGinnivan/WebApi.Hal/pull/3" target="_blank">more recently I came along and tried to make the specification of the hypermedia as unobtrusive as possible</a>.

It&#8217;s very rough around the edges, and definitely a work-in-progress, but if you are interested feel free to check out the latest work that I&#8217;ve been doing on it at:Â <a href="https://github.com/robdmoore/Hal.PlayAround" target="_blank">https://github.com/robdmoore/Hal.PlayAround</a>.

To see it in action simply fire up the site, the homepage is a HTML page that allows you to interact with the dummy API I created via a set of HTML forms (the actual requests are made with JavaScript). If you inspect the PersonController class you will see that I barely had to add anything to it to get the hypermedia in there.

Enjoy!