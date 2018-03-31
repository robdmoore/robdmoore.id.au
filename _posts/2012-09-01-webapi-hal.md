---
layout: post
title: WebApi.Hal
date: 2012-09-01 16:17:34.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- hypermedia
- JavaScript
- REST
- tech evangelism
- unobtrusive coding
author: rob
---


Lately I've been having a bit of fun learning [ASP.NET Web API](http://www.asp.net/web-api) and I've been working with [Jake Ginnivan](http://jake.ginnivan.net/) to come up with a library that allows you to follow the [HATEOS](https://en.wikipedia.org/wiki/HATEOAS) principle of [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) using it. We've been doing this by implementing a specification that allows you to specify hypermedia for JSON and XML called [HAL](http://stateless.co/hal_specification.html).



Jake did some [awesome work to start it off](https://github.com/JakeGinnivan/WebApi.Hal) and [more recently I came along and tried to make the specification of the hypermedia as unobtrusive as possible](https://github.com/JakeGinnivan/WebApi.Hal/pull/3).



It's very rough around the edges, and definitely a work-in-progress, but if you are interested feel free to check out the latest work that I've been doing on it at: [https://github.com/robdmoore/Hal.PlayAround](https://github.com/robdmoore/Hal.PlayAround).



To see it in action simply fire up the site, the homepage is a HTML page that allows you to interact with the dummy API I created via a set of HTML forms (the actual requests are made with JavaScript). If you inspect the PersonController class you will see that I barely had to add anything to it to get the hypermedia in there.



Enjoy!

