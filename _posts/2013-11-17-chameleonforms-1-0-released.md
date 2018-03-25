---
id: 1821
title: ChameleonForms 1.0 Released
date: 2013-11-17T01:11:33+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=1821
permalink: /blog/2013/11/17/chameleonforms-1-0-released/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - forms
  - HTML
  - JavaScript
  - jQuery
  - NuGet
  - validation
---
I&#8217;m incredibly excited and proud to finally announce the **release of 1.0 of the <a href="https://github.com/MRCollective/ChameleonForms" target="_blank">ChameleonForms</a> library** I&#8217;ve been working on with <a href="http://mdavies.net/" target="_blank">Matt Davies</a>. My blog has been fairly quiet the last couple of months while I&#8217;ve poured time and energy in finally getting ChameleonForms to 1.0.

## WOOOOOOOOOOOOOOOO

(Apologies; I&#8217;m releasing months of built-up anticipation and excitement here).

I&#8217;m biased of course, but I think this library is amazing to use and results in immensely more maintainable form generation code when using ASP.NET MVC. It extends on the knowledge that MVC developers would have in generating forms using the (already pretty awesome) built-in stuff, but <a href="https://github.com/MRCollective/ChameleonForms/wiki/why" target="_blank">adds the things I think are missing</a>. For me, this library epitomises over 7 years of exploration in the best way to do web-based forms and I&#8217;m excited to be able to share the beginnings of my current vision via this library.

## What is ChameleonForms?

In short, ChameleonFormsÂ takes away the pain and repetition of building forms with ASP.NET MVC by following a philosophy of:

  * **Model-driven**Â defaults (e.g. enum is drop-down,Â `[DataType(DataType.Password)]`Â is password textbox)
  * **DRY**Â up your forms &#8211; your forms will be quicker to write and easier to maintain and you won&#8217;t get stuck writing the same form boilerplate markup form after form after form
  * **Consistent**Â &#8211; consistency of the API and form structure within your forms and consistency across all forms in your site via templating
  * **Declarative**Â syntax &#8211; specify how the form is structured rather than worrying about the boilerplate HTML markup of the form; this has the same beneficial effect as separating HTML markup and CSS
  * **Beautiful, terse, fluent APIs**Â &#8211; it&#8217;s a pleasure to read and write the code
  * **Extensible and flexible**Â core &#8211; you can extend or completely change anything you want at any layer of ChameleonForms and you can drop out to plain HTML at any point in your form for those moments where pre-prepared field types and templates just don&#8217;t cut it

<a href="https://github.com/MRCollective/ChameleonForms/wiki" target="_blank">More info</a>.

## What are the big improvements in 1.0?

We&#8217;ve been <a href="http://nuget.org/packages/ChameleonForms" target="_blank">releasing pretty often</a> so that depends on what version you are currently using, but these are the most important things:

  * Extensive usage across a number of production websites &#8211; we are happy that this library is mature, stable and ready for prime-time
  * <a href="https://github.com/MRCollective/ChameleonForms/wiki/bootstrap-template" target="_blank">Twitter Bootstrap 3 Template</a> out-of-the-box supported by a <a href="https://www.nuget.org/packages/ChameleonForms.TwitterBootstrap3" target="_blank">NuGet package</a> to get you up and running faster &#8211; this is HUGE for a number of reasons: 
      * Bootstrap is pretty darn popular right now so this is immediately useful to a lot of people
      * In creating this template we had to do some pretty sophisticated changes to allow the template to drive a lot of changes unobtrusively to the form structure you are adding in your views &#8211; this is great because it means it&#8217;s really easy for you to create your own form templates and accomplish similarly complex transformations of your form markup
      * The ASP.NET MVC templates that come with Visual Studio 2013 come with Bootstrap by default now &#8211; and boy do they have gross repetitive boilerplate in them, which you can clean right up using this library
      * The vision that we have for this library is coming to fruition, which is personally gratifying &#8211; this is a beautiful demonstration of being able to declaratively specify the structure of your form and then completely change the markup/template of your form across a whole application with a single line of code when it changes
  * <a href="https://github.com/MRCollective/ChameleonForms/wiki" target="_blank">Really comprehensive documentation</a> of everything in the library &#8211; we&#8217;ve spent many hours writing up the documentation &#8211; the idea was to make it comprehensive, but accessible/terse; hopefully we&#8217;ve met that goal!
  * Really solid code coverage to help prevent regressions or breaking changes as well as some refactorings that give us a solid codebase to continue with the other features we want to add &#8211; hopefully this can support us into the future with minimal breaking changes

## How can I get it?

Checkout the <a href="https://github.com/MRCollective/ChameleonForms/releases/tag/1.0.0" target="_blank">GitHub release</a> or go to <a href="http://nuget.org/packages/ChameleonForms" target="_blank">NuGet</a>.

## Versioning

From this point on we are following semver thanks to the <a href="https://github.com/JakeGinnivan/GitHubFlowVersion" target="_blank">GitHubFlowVersion project</a>. The fourth number in the NuGet version number is actually build metadata.

## Borderlands 2 here I come!

Over a year ago now (yes it&#8217;s been a long journey &#8211; our first NuGet package was published on November 1, 2012) Matt Davies and I made an agreement to each other that neither of us would play the recently released Borderlands 2 game (we were both huge fans of Borderlands so this was a big deal) until we released 1.0 of ChameleonForms so that we would remain focussed on it and not get distracted. Now, while we both didn&#8217;t realise that it would take this long and while the last couple of months have seemed like forever (I&#8217;m pretty sure we had a phone conversation at least once a week where one of us would say &#8220;dude, we are sooooo close to 1.0 and BORDERLANDS 2!&#8221;) we are both incredibly proud of the library and are happy with what we&#8217;ve managed to get into 1.0.

Needless to say, we will probably be taking a break from open source for a few weekends to play Borderlands 2 ðŸ™‚

We hope you enjoy using the library!

As usual hit us up with issues and pull requests on <a href="https://github.com/MRCollective/ChameleonForms" target="_blank">GitHub</a> &#8211; they make our day ðŸ™‚