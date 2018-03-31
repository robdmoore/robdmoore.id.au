---
layout: post
title: Wordpress 2014 Theme Full Width
date: 2014-03-02 01:18:37.000000000 +08:00
type: post
categories:
- Technical
tags:
- CSS
- Wordpress
author: rob
---


I recently decided to upgrade my theme from Wordpress' 2011 Theme to the new 2014 one. I think the typography of the 2014 one is absolutely beautiful. The problem I had with the built-in theme though is that it restricts the content to a 474px width, which might be fine for text-only posts, but when you have a lot of images and in particular source code snippets then it's simply too squishy.



What I ended up doing to fix the problem was installing the Simple Custom CSS plugin and then adding the following CSS:



```css
.site-content .entry-header,
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
```

