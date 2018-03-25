---
id: 2971
title: WordPress 2014 Theme Full Width
date: 2014-03-02T01:18:37+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=2971
permalink: /blog/2014/03/02/wordpress-2014-theme-full-width/
categories:
  - Technical
tags:
  - CSS
  - Wordpress
---
I recently decided to upgrade my theme from WordPress&#8217; 2011 Theme to the new 2014 one. I think the typography of the 2014 one is absolutely beautiful. The problem I had with the built-in theme though is that it restricts the content to a 474px width, which might be fine for text-only posts, but when you have a lot of images and in particular source code snippets then it&#8217;s simply too squishy.

What I ended up doing to fix the problem was installing the Simple Custom CSS plugin and then adding the following CSS:

<pre class="brush: css; title: ; notranslate" title="">.site-content .entry-header,
.site-content .entry-content,
.site-content .entry-summary,
.site-content .entry-meta,
.page-content,
.post-navigation,
.image-navigation,
.comments-area {
	max-width: 900px!important;
}

.site-header,
.site {
    max-width: none!important;
}
</pre>