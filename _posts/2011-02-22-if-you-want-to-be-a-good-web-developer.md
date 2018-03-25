---
id: 90
title: If you want to be a good web developer
date: 2011-02-22T01:38:47+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=90
permalink: /blog/2011/02/22/if-you-want-to-be-a-good-web-developer/
categories:
  - Technical
tags:
  - forms
  - HTML
  - JavaScript
  - jQuery
  - semantics
  - testing
---
I&#8217;ve been doing web development professionally since 2004 and in that time I&#8217;ve learnt a lot and I consider myself to be a good web developer. I&#8217;m mostly self-taught, learning most of what I know from research on the Internet, in combination with experimentation, to both find out the way things work and figure out the best ways to use them.

While the Internet is an amazing resource, there is a lot of bad information out there and you should always be careful when taking information at face value. I&#8217;ve compiled a list of links to information that I personally think is important if you want to be a _good_ web developer (or designer).

It&#8217;s really difficult trying to bring to mind all of the most important things that I know so there is probably quite a bit missing, but this is a good start. I may well follow this post with another one later with things I&#8217;ve missed. If you think there is something really important that I&#8217;ve missed fell free to leave a comment.

Without further ado (written in C# for fun, if you don&#8217;t know C# it&#8217;s ok just click on the links):

<!--more-->

<pre class="brush: csharp; title: ; notranslate" title="">var you = new Person(Request.UserHostAddress());
if (you.WantToBeAGoodWebDeveloper()) {

	// Getting started

	you.Should.ReadAndLearn(
		"The ALA Primer Part Two: Resources For Beginners",
		"http://www.alistapart.com/articles/alaprimer2/"
	);
	you.Should.ReadAndLearn(
		"The ALA Primer: A Guide for New Readers",
		"http://www.alistapart.com/articles/ALAprimer/"
	);

	// Programming

	you.Should.ObserveThe(
		"Don't repeat yourself principle",
		"http://en.wikipedia.org/wiki/Don%27t_repeat_yourself"
	);
	you.Should.ObserveThe(
		"Separation of concerns principle",
		"http://en.wikipedia.org/wiki/Separation_of_concerns"
	);
	you.Should.Try(
		"Test-Driven Development (TDD)",
		"http://en.wikipedia.org/wiki/Test-driven_development"
	);
	you.Should.Try(
		"Behaviour-Driven Development (BDD)",
		"http://en.wikipedia.org/wiki/Behavior_Driven_Development"
	);
	you.Should.Try(
		"Continuous Integration (CI)",
		"http://martinfowler.com/articles/continuousIntegration.html"
	);
	you.Should.Try(
		"Agile software development",
		"http://en.wikipedia.org/wiki/Agile_software_development"
	);
	you.Should.Use(
		"Version Control Systems (VCS, also known as Source Configuration Management (SCM))",
		"http://en.wikipedia.org/wiki/Revision_control"
	);
	you.Should.BeA(
		"Pragmatic Programmer",
		"http://www.codinghorror.com/blog/files/Pragmatic%20Quick%20Reference.htm"
	);
	you.Should.Read(
		"The Pragmatic Programmer: From Journeyman to Master",
		"http://www.pragprog.com/the-pragmatic-programmer"
	);
	you.Should.ReadAndLearn(
		"Regular expressions",
		"http://www.regular-expressions.info/"
	);

	// General Web

	you.Should.EnsureYou(
		"Create accessible websites",
		"http://www.alistapart.com/articles/wiwa/"
	).And(
		"Create cross-browser friendly websites",
		"http://en.wikipedia.org/wiki/Cross-browser"
	);
	you.Should.EnsureYou(
		"Create usable websites",
		"http://en.wikipedia.org/wiki/Web_usability"
	);
	you.Should.EnsureYou(
		"Design sites with good Information Architecture (IA)",
		"http://www.webmonkey.com/2010/02/information_architecture_tutorial/"
	);
	you.Should.EnsureYou(
		"Create valid HTML and CSS",
		"http://validator.w3.org/docs/why.html"
	);
	you.Should.EnsureYou(
		"Create semantic Markup",
		"http://plainoldsemantichtml.org/2007/10/20/semantically-correct-html-benefits/"
	);
	you.Should.Read(
		"A List Apart",
		"http://alistapart.com/"
	);
	you.Should.Read(
		"24 Ways",
		"http://24ways.org/"
	);
	you.Should.Watch(
		"DOCTYPE",
		"http://doctype.tv/"
	);

	// Tools

	you.Should.LookAt(
		"http://www.mozilla.com/en-US/firefox/?from=getfirefox",
		"https://addons.mozilla.org/en-US/firefox/addon/html-validator/",
		"https://addons.mozilla.org/en-US/firefox/addon/total-validator/",
		"https://addons.mozilla.org/en-US/firefox/addon/linkchecker/",
		"https://addons.mozilla.org/en-us/firefox/addon/web-developer/",
		"https://addons.mozilla.org/en-us/firefox/addon/firebug/"
	);

	you.Should.LookAt(
		"http://www.jetbrains.com/"
	);

	you.Should.LookAt(
		"http://en.wikipedia.org/wiki/Git_(software)",
		"http://en.wikipedia.org/wiki/Mercurial"
		"http://en.wikipedia.org/wiki/Apache_Subversion",
	);

	you.Should.LookAt(
		"http://home.snafu.de/tilman/xenulink.html"
	);

	// HTML

	you.Should.ReadAndLearn(
		"Rock Solid HTML Emails",
		"http://24ways.org/2009/rock-solid-html-emails"
	);
	you.Should.ReadAndLearn(
		"Dive Into HTML5",
		"http://diveintohtml5.org/"
	);

	// CSS

	you.Should.Use(
		"Progressive enhancement",
		"http://www.alistapart.com/articles/understandingprogressiveenhancement/"
	);
	you.Should.ReadAndLearn(
		"Invisible content just for screen readers",
		"http://webaim.org/techniques/css/invisiblecontent/"
	);
	you.Should.ReadAndLearn(
		"CSS Image Replacement (Gilder/Levin Method with Shea Enhancement)",
		"http://www.mezzoblue.com/tests/revised-image-replacement/"
	);
	you.Should.ReadAndLearn(
		"CSS Design: Going to Print",
		"http://www.alistapart.com/articles/goingtoprint/"
	);
	you.Should.ReadAndLearn(
		"In Search of the Holy Grail",
		"http://www.alistapart.com/articles/holygrail/"
	);
	you.Should.ReadAndLearn(
		"Prettier Accessible Forms",
		"http://www.alistapart.com/articles/prettyaccessibleforms"
	);
	you.Should.ReadAndLearn(
		"Learning to Love Forms",
		"http://ajaxexperience.techtarget.com/images/Presentations/Gustafson_Aaron_Learning-to-love-forms.pdf"
	);
	you.Should.ReadAndLearn(
		"HTML Forms",
		"http://robdmoore.id.au/blog/2011/01/22/html-forms/"
	);
	you.Should.ReadAndLearn(
		"Previous Posts",
		"http://robdmoore.id.au/blog/2011/01/22/previous-posts/"
	);

	// JavaScript

	you.Should.Use(
		"Unobtrusive JavaScript",
		"http://en.wikipedia.org/wiki/Unobtrusive_JavaScript"
	);
	you.Should.ReadAndLearn(
		"AJAX",
		"http://en.wikipedia.org/wiki/Ajax_%28programming%29"
	);
	you.Should.Read(
		"JavaScript: The Good Parts",
		"http://oreilly.com/catalog/9780596517748"
	);
	you.Should.Try(
		"jQuery",
		"http://jquery.com/"
	);
	you.Should.Try(
		"TinyMCE",
		"http://tinymce.moxiecode.com/"
	).When(
		"Accepting HTML from user"
	);
	you.Should.Try(
		"FlowPlayer",
		"http://flowplayer.org/"
	).When(
		"Displaying video"
	);
	you.Should.Try(
		"jPlayer",
		"http://www.jplayer.org/"
	).When(
		"Playing audio"
	);
	you.Should.Try(
		"swfobject",
		"http://code.google.com/p/swfobject/"
	).When(
		"Embedding Flash"
	);

	// Flash, Silverlight, etc.

	you.Should.ReadAndLearn(
		"Flash vs. Silverlight vs. HTML5",
		"http://www.networkworld.com/community/blog/future-video-unified-communications"
	);
	you.Should.ReadAndLearn(
		"Flash Embedding Cage Match",
		"http://www.alistapart.com/articles/flashembedcagematch/"
	);
	you.Should.ReadAndLearn(
		"swfobject",
		"http://www.alistapart.com/articles/flashsatay"
	);
}
</pre>