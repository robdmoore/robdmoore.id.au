---
layout: post
title: ChameleonForms 1.0 Released
date: 2013-11-17 01:11:33.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- forms
- HTML
- JavaScript
- jQuery
- NuGet
- validation
author: rob
---


I'm incredibly excited and proud to finally announce the **release of 1.0 of the [ChameleonForms](https://github.com/MRCollective/ChameleonForms) library** I've been working on with [Matt Davies](http://mdavies.net/). My blog has been fairly quiet the last couple of months while I've poured time and energy in finally getting ChameleonForms to 1.0.


## WOOOOOOOOOOOOOOOO


(Apologies; I'm releasing months of built-up anticipation and excitement here).



I'm biased of course, but I think this library is amazing to use and results in immensely more maintainable form generation code when using ASP.NET MVC. It extends on the knowledge that MVC developers would have in generating forms using the (already pretty awesome) built-in stuff, but [adds the things I think are missing](https://github.com/MRCollective/ChameleonForms/wiki/why). For me, this library epitomises over 7 years of exploration in the best way to do web-based forms and I'm excited to be able to share the beginnings of my current vision via this library.


## What is ChameleonForms?


In short, ChameleonForms takes away the pain and repetition of building forms with ASP.NET MVC by following a philosophy of:


- **Model-driven** defaults (e.g. enum is drop-down, `[DataType(DataType.Password)]` is password textbox)
- **DRY** up your forms - your forms will be quicker to write and easier to maintain and you won't get stuck writing the same form boilerplate markup form after form after form
- **Consistent** - consistency of the API and form structure within your forms and consistency across all forms in your site via templating
- **Declarative** syntax - specify how the form is structured rather than worrying about the boilerplate HTML markup of the form; this has the same beneficial effect as separating HTML markup and CSS
- **Beautiful, terse, fluent APIs** - it's a pleasure to read and write the code
- **Extensible and flexible** core - you can extend or completely change anything you want at any layer of ChameleonForms and you can drop out to plain HTML at any point in your form for those moments where pre-prepared field types and templates just don't cut it



[More info](https://github.com/MRCollective/ChameleonForms/wiki).


## What are the big improvements in 1.0?


We've been [releasing pretty often](http://nuget.org/packages/ChameleonForms) so that depends on what version you are currently using, but these are the most important things:


- Extensive usage across a number of production websites - we are happy that this library is mature, stable and ready for prime-time
- [Twitter Bootstrap 3 Template](https://github.com/MRCollective/ChameleonForms/wiki/bootstrap-template) out-of-the-box supported by a [NuGet package](https://www.nuget.org/packages/ChameleonForms.TwitterBootstrap3) to get you up and running faster - this is HUGE for a number of reasons:
  - Bootstrap is pretty darn popular right now so this is immediately useful to a lot of people
  - In creating this template we had to do some pretty sophisticated changes to allow the template to drive a lot of changes unobtrusively to the form structure you are adding in your views - this is great because it means it's really easy for you to create your own form templates and accomplish similarly complex transformations of your form markup
  - The ASP.NET MVC templates that come with Visual Studio 2013 come with Bootstrap by default now - and boy do they have gross repetitive boilerplate in them, which you can clean right up using this library
  - The vision that we have for this library is coming to fruition, which is personally gratifying - this is a beautiful demonstration of being able to declaratively specify the structure of your form and then completely change the markup/template of your form across a whole application with a single line of code when it changes
- [Really comprehensive documentation](https://github.com/MRCollective/ChameleonForms/wiki) of everything in the library - we've spent many hours writing up the documentation - the idea was to make it comprehensive, but accessible/terse; hopefully we've met that goal!
- Really solid code coverage to help prevent regressions or breaking changes as well as some refactorings that give us a solid codebase to continue with the other features we want to add - hopefully this can support us into the future with minimal breaking changes


## How can I get it?


Checkout the [GitHub release](https://github.com/MRCollective/ChameleonForms/releases/tag/1.0.0) or go to [NuGet](http://nuget.org/packages/ChameleonForms).


## Versioning


From this point on we are following semver thanks to the [GitHubFlowVersion project](https://github.com/JakeGinnivan/GitHubFlowVersion). The fourth number in the NuGet version number is actually build metadata.


## Borderlands 2 here I come!


Over a year ago now (yes it's been a long journey - our first NuGet package was published on November 1, 2012) Matt Davies and I made an agreement to each other that neither of us would play the recently released Borderlands 2 game (we were both huge fans of Borderlands so this was a big deal) until we released 1.0 of ChameleonForms so that we would remain focussed on it and not get distracted. Now, while we both didn't realise that it would take this long and while the last couple of months have seemed like forever (I'm pretty sure we had a phone conversation at least once a week where one of us would say "dude, we are sooooo close to 1.0 and BORDERLANDS 2!") we are both incredibly proud of the library and are happy with what we've managed to get into 1.0.



Needless to say, we will probably be taking a break from open source for a few weekends to play Borderlands 2 :)



We hope you enjoy using the library!



As usual hit us up with issues and pull requests on [GitHub](https://github.com/MRCollective/ChameleonForms) - they make our day :)

