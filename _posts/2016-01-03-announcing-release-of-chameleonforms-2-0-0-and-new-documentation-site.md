---
layout: post
title: Announcing release of ChameleonForms 2.0.0 and new documentation site
date: 2016-01-03 13:12:06.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- forms
- HTML
- JavaScript
- tech evangelism
author: rob
---


I'm somewhat more subdued with my excitement for announcing this [than I was for 1.0](https://robdmoore.id.au/blog/2013/11/17/chameleonforms-1-0-released/). In fact I just had a chuckle to myself in re-reading that post :) (oh and if you were wondering - did Matt and I enjoy Borderlands 2? Yes we very much did, it's a great game).



Nonetheless, there is some really cool stuff in ChameleonForms 2.0 and I'm particularly excited about the new PartialFor functionality, which I will describe below. My peak excitement about PartialFor was months ago when the code was actually written, but Matt and I have had a particularly busy second half of the year with our work roles expanding in scope and a healthy prioritisation of our personal lives so it took a while to get our act together and get the code merged and released.



There have been a range of point releases that added a bunch of functionality to ChameleonForms since the 1.0 release and before this 2.0 release. You can [peruse the releases list](https://github.com/MRCollective/ChameleonForms/releases) to see the features.


## New docs site


I've taken the lead (as well as a bunch of advice - thanks mate) from [Jake Ginnivan](http://jake.ginnivan.net/) and moved the [documentation for ChameleonForms](http://readthedocs.org/projects/chameleonforms/) to [Read the Docs](http://readthedocs.org/). The new documentation site is now generated from files in the [source repository's docs folder](https://github.com/MRCollective/ChameleonForms/tree/master/docs). This is awesome because it means that the documentation can be tied to current state of the software - no more documentation that is ahead or behind and pull requests can now contain documentation changes corresponding to the code changes.



For those who are curious the process I followed to migrate from GitHub wiki to Read the Docs was:


1. Clone the wiki
2. Move all the files into the docs folder of the repository
3. [Add a mkdocs.yml file to the root of the repository with all of the files](https://github.com/MRCollective/ChameleonForms/blob/master/mkdocs.yml) (this means I need to keep a list of the files in there, but I don't mind since it gives me control of the menu, you can omit the mkdocs.yml file if you want and it alphabetically places all of the files in the menu)
4. Sign up for Read the Docs and create a new project linked to the GitHub repository
5. Enable the fenced code markdown extension
6. Change all internal documentation links to reference the .md file (in my case I had to search for all links to wiki/\* and remove the wiki/ and add in the .md)
7. Change any occurrences of ````c#` with ````csharp` (GitHub supports using c# for the fenced code snippet, but mkdocs doesn't)
8. Check all of the pages since some of them might render weirdly - I had to add some extra spaces between paragraphs and code blocks / bullet lists for instance since the markdown parser is slightly different



There are a bunch of different formats that give more flexibility that Read the Docs supports (e.g. restructured text), but I'm very happy with the markdown support.


## 2.0 minor features and bug fixes


Check out the [release notes for the 2.0 release](https://github.com/MRCollective/ChameleonForms/releases/tag/2.0.0) to see a bunch of minor new features and bug fixes that have been contributed by a bunch of different people - thanks to everyone that contributed! It always give Matt and I a rush when we receive a pull request from someone :).


## PartialFor feature


This is the big feature. [A few breaking changes](https://github.com/MRCollective/ChameleonForms/blob/master/BREAKING_CHANGES.md#version-200) went into the 2.0 release in order to make this possible. This is the first of the [extensibility features](https://github.com/MRCollective/ChameleonForms/issues/107) we have added to ChameleonForms.



Essentially, it allows us to contain a part of a form in a partial view, with full type-safety and intellisense. The form can be included directly against a form or inside a form section. This makes things like common parts of forms for create vs edit screens possible. This allows you to remove even more repetition in your forms, while keeping a clean separation between forms that are actually separate.



The best way to see the power of the feature in it's glory is by glancing over the [acceptance test for it](https://github.com/MRCollective/ChameleonForms/blob/master/ChameleonForms.AcceptanceTests/PartialForTests.Should_render_correctly_when_used_via_form_or_section_and_when_used_for_top_level_property_or_sub_property.approved.html). The output should be fairly self explanatory.



There is also a [documentation page on the feature](http://chameleonforms.readthedocs.org/en/latest/partials/),


## Is ChameleonForms still relevant?


We were very lucky to be included in [Scott Hanselman's NuGet package of the week](http://www.hanselman.com/blog/NuGetPackageOfTheWeekADifferentTakeOnASPNETMVCFormsWithChameleonForms.aspx) earlier this year. The comments of Scott's post are very interesting because it seems our library is somewhat controversial. A lot of people are saying that single page applications and the increasing prevalence of JavaScript make creating forms in ASP.NET MVC redundant.



Matt and I have spent a lot more time in JavaScript land than MVC of late and we concede that there is certainly a lot more scenarios now that don't make sense to break out MVC. That means ChameleonForms isn't as relevant as when we first started developing it.



In saying that, we still firmly believe that there are a range of scenarios that MVC is very much appropriate for. Where you don't need the flexibility of an API and/or you need pure speed of development (in particular developing prototypes) and/or you're building CRUD applications or heavily forms-based applications (especially where you need consistency of your forms) we believe MVC + ChameleonForms is very much a good choice and often is the best choice.

