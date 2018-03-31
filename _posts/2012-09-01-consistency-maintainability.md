---
layout: post
title: Consistency == Maintainability
date: 2012-09-01 18:02:14.000000000 +08:00
type: post
categories:
- Technical
tags:
- Agile
- consistency
- maintainability
- Software Engineering
author: rob
---


I think I can categorically say that the most important thing I've learnt about software engineering is that consistency is the most important thing in software engineering that leads to something being maintainable. It's something I feel very strongly about.



If you have awful code or non-standard concepts in your code then as long as you apply the awful code or concepts consistently across your application then as soon as anyone that needs to maintain that code gets their head around what's going on they can maintain the code effectively. It comes down to readability and comprehension. The quicker and easier it is for someone to read a code snippet and understand what is going on (no matter how badly it makes their eyes bleed) the easier it is for them to identify problems and introduce a fix.



I'm not saying that writing best practice code and using principles like [DI](https://en.wikipedia.org/wiki/Dependency_injection), [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself) and [YAGNI](https://en.wikipedia.org/wiki/You_ain't_gonna_need_it) aren't going to make something maintainable because they do and they are critically important when you are developing software! What I am saying though is they don't have as big an impact on maintainability as consistency. Furthermore, from a pragmatic perspective, sometimes you inherit code that wasn't written with best practice approaches and you need to maintain it; yes you could spend a whole heap of time rewriting it, but at the end of the day as long as it's consistent then it's maintainable and there may well be more [valuable uses of your time](http://www.allaboutagile.com/value-driven-delivery/).



It does raise an interesting question though about refactoring. If you do have a crappy codebase you have inherited and you decide it will deliver value to do a major refactor then it's important to ensure that you refactor in a way that leaves the codebase in a consistent state!

