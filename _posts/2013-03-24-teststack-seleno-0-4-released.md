---
layout: post
title: TestStack.Seleno 0.4 released
date: 2013-03-24 22:16:10.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- TeamCity
- testing
- TestStack
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


Lately I've been spending a fair bit of spare time working hard on getting the TestStack.Seleno project ready for a (rather massive!) 0.4 release. It's been a lot of fun and I'm quite proud of the impact the core TestStack team and other contributors have made on the library. We feel that it is "production ready" now and will be moving towards a 1.0 release in the somewhat near future.



I won't bother going into a huge amount of detail on the release because [Michael Whelan has done that already](http://michael-whelan.net/seleno-04), but I'll list down the major changes here as a tl;dr:


- Added a bunch of global configuration options:
  - Ability to specify a Castle.Core logger factory to intercept our internal logging
  - Ability to more easily specify a non-Firefox web browser
  - Ability to specify a deployed web application out-of-the-box
  - Ability to more explicitly specify your MVC routes
  - Ability to override the [minimum (implicit) wait timeout inside of Selenium](http://blog.mozilla.org/webqa/2012/07/12/webdrivers-implicit-wait-and-deleting-elements/)
- Ability to explicitly specify the initial page for a test and initialise the first page object in one line of code
- Continuous Integration support (now runs in TeamCity)
- A new HTML Control model that provides a nice API on top of Selenium Web Driver to interact with HTML controls (including easy extensibility for your own controls)
- A clearer public API
- Improved test coverage and extensive refactoring of the core library code



You can get the latest version of Seleno on [NuGet](http://nuget.org/packages/TestStack.Seleno/), or check out our [GitHub repository](https://github.com/TestStack/TestStack.Seleno) for the latest source code and the getting started documentation. Let us know what you think, or if there are any features that you would like to see. Feel free to add an issue or pull request - the more community interaction we get the better we can make Seleno!

