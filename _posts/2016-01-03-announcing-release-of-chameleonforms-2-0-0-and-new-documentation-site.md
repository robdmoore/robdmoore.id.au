---
id: 5291
title: Announcing release of ChameleonForms 2.0.0 and new documentation site
date: 2016-01-03T13:12:06+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=5291
permalink: /blog/2016/01/03/announcing-release-of-chameleonforms-2-0-0-and-new-documentation-site/
xyz_lnap:
  - "1"
categories:
  - Technical
tags:
  - ASP.NET MVC
  - forms
  - HTML
  - JavaScript
  - tech evangelism
---
I&#8217;m somewhat more subduedÂ with my excitement for announcing this [than I was for 1.0](https://robdmoore.id.au/blog/2013/11/17/chameleonforms-1-0-released/). In fact I just had a chuckle to myself in re-reading that post ðŸ™‚ (oh and if you were wondering &#8211; did Matt and I enjoy Borderlands 2? Yes we very much did, it&#8217;s a great game).

Nonetheless, there is some really cool stuff in ChameleonForms 2.0 and I&#8217;m particularly excited about the new PartialFor functionality, which I will describe below. My peak excitement about PartialFor was months ago when the code was actually written, but Matt and I have had a particularly busyÂ second half of the year with our work roles expanding in scope and a healthy prioritisation of our personal lives so it took a while to get our act together and get the code merged and released.

There have been a range of point releases that added a bunch of functionality to ChameleonForms since the 1.0 release and before this 2.0 release. You can <a href="https://github.com/MRCollective/ChameleonForms/releases" target="_blank">peruse the releases list</a> to see the features.

## New docs site

I&#8217;ve takenÂ the lead (as well as a bunch of advice &#8211; thanks mate) from <a href="http://jake.ginnivan.net/" target="_blank">Jake Ginnivan</a>Â and moved the <a href="http://readthedocs.org/projects/chameleonforms/" target="_blank">documentation forÂ ChameleonForms</a> to <a href="http://readthedocs.org/" target="_blank">Read the Docs</a>. The new documentation site is now generated from files in the <a href="https://github.com/MRCollective/ChameleonForms/tree/master/docs" target="_blank">source repository&#8217;s docs folder</a>. This is awesome because it means that the documentation can be tied to current state of theÂ software &#8211; no more documentation that is ahead or behind and pull requests can now contain documentation changes corresponding to the code changes.

For those who are curious the process I followed to migrate from GitHub wiki to Read the Docs was:

  1. Clone the wiki
  2. Move all the files into the docs folder of the repository
  3. <a href="https://github.com/MRCollective/ChameleonForms/blob/master/mkdocs.yml" target="_blank">Add a mkdocs.yml file to the root of the repository with all of the files</a>Â (this means I need to keep a list of the files in there, but I don&#8217;t mind since it gives me control of the menu, you can omit the mkdocs.yml file if you want and itÂ alphabetically places all of the files in the menu)
  4. Sign up for Read the Docs and create a new project linked to the GitHub repository
  5. EnableÂ the fenced code markdown extension
  6. Change all internal documentation links to reference the .md file (in my case I had to search for all links to wiki/* and remove the wiki/ and add in the .md)
  7. Change any occurrences of ` ```c# ` with ` ```csharp ` (GitHub supports using c# for the fenced code snippet, but mkdocs doesn&#8217;t)
  8. Check all of the pages since some of them might render weirdly &#8211; I had to add some extra spaces between paragraphs and code blocks / bullet lists for instance since the markdown parser is slightly different

There are a bunch of different formats that give more flexibility that Read the Docs supports (e.g. restructured text), but I&#8217;m very happy with the markdown support.

## 2.0 minor features and bug fixes

Check out the <a href="https://github.com/MRCollective/ChameleonForms/releases/tag/2.0.0" target="_blank">release notes for the 2.0 release</a>Â to see a bunch of minor new features and bug fixes that have been contributed by a bunch of different people &#8211; thanks to everyone that contributed! It always give Matt and I a rush when we receive a pull request from someone :).

## PartialFor feature

This is the big feature. <a href="https://github.com/MRCollective/ChameleonForms/blob/master/BREAKING_CHANGES.md#version-200" target="_blank">A few breaking changes</a> went into the 2.0 release in order to make this possible. ThisÂ is the first of theÂ <a href="https://github.com/MRCollective/ChameleonForms/issues/107" target="_blank">extensibility features</a>Â we have added to ChameleonForms.

Essentially, it allows us to contain a part of a form in a partial view, with full type-safety and intellisense. The form can be included directly against a form or inside a form section. This makes things like common parts of forms for create vsÂ edit screens possible. This allows you to remove even more repetition in your forms, while keeping a clean separation between forms that are actually separate.

The best way to see the power of the feature in it&#8217;s glory is by glancing over the <a href="https://github.com/MRCollective/ChameleonForms/blob/master/ChameleonForms.AcceptanceTests/PartialForTests.Should_render_correctly_when_used_via_form_or_section_and_when_used_for_top_level_property_or_sub_property.approved.html" target="_blank">acceptance test for it</a>.Â The output should be fairly self explanatory.

There is also a <a href="http://chameleonforms.readthedocs.org/en/latest/partials/" target="_blank">documentation page on the feature</a>,

## Is ChameleonForms still relevant?

We were very lucky to be included in <a href="http://www.hanselman.com/blog/NuGetPackageOfTheWeekADifferentTakeOnASPNETMVCFormsWithChameleonForms.aspx" target="_blank">Scott Hanselman&#8217;s NuGet package of the week</a>Â earlier this year. The comments of Scott&#8217;s post are very interesting because it seems our library is somewhatÂ controversial. A lot of people are saying that single page applications and the increasing prevalence of JavaScript make creating forms in ASP.NET MVC redundant.

Matt and I have spent a lot more time in JavaScript land than MVC of late and we concede that there is certainly a lot more scenarios now that don&#8217;t make sense to break out MVC. That means ChameleonForms isn&#8217;t as relevant as when we first started developing it.

In saying that, we still firmly believe that there are a range of scenarios that MVC is very much appropriate for. Where you don&#8217;t need the flexibility of an API and/or you need pure speed of development (in particular developing prototypes) and/or you&#8217;re building CRUD applications or heavily forms-based applications (especially where you need consistency of your forms) we believe MVC + ChameleonForms is very much a goodÂ choice and often is the bestÂ choice.