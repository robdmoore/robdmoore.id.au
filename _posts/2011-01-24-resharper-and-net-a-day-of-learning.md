---
id: 22
title: 'ReSharper and .NET: A day of learning'
date: 2011-01-24T16:49:55+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=22
permalink: /blog/2011/01/24/resharper-and-net-a-day-of-learning/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - mocking
  - ReSharper
  - Visual Studio
---
We had a .NET/agile contractor start with us today and in a few hours I learnt quite a number of great tips and tricks. I thought I&#8217;d share them:
  
<!--more-->

  * Keyboard shortcuts (some of these are ReSharper (VS Scheme), some are VS): 
      * Ctrl+T: Search for type in solution (using either the full class name or <a href="http://blogs.jetbrains.com/dotnet/2008/02/resharper-in-detail-camelhumps/" target="_blank">camel humps</a>)
      * Ctrl+Shift+T: Search for filename in solution
      * Alt+: Search for symbols (e.g. properties, methods, etc.) in current file.
      * Alt+Shift+L: Show file currently being edited in the Solution Explorer
      * Ctrl+Shift+R: Context sensitive refactor
      * Alt+Ctrl+Shift+↑: Moves the currently selected method above the previous one (same deal for down arrow key moving methods down)
      * Ctrl+D: Duplicate current line
      * Ctrl+I: Incremental search, like Ctrl+F, but it starts searching immediately like / in vim; you can use F3 to get the next match while it&#8217;s still in incremental mode so you can continue to refine the search.
      * <a href="http://www.jetbrains.com/resharper/docs/ReSharper50DefaultKeymap_VS_scheme.pdf" target="_blank">Cheat Sheet for ReSharper commands</a>
  * <a href="http://www.red-gate.com/products/dotnet-development/reflector/" target="_blank">Reflector.NET</a>: The contractor said that next to ReSharper one of the most useful tools for .NET is something called Reflector, which allows you to see the code of any .NET dll file (including core library). This becomes useful when you start to do more advanced stuff with .NET and want to see how the core code works. It also serves as a useful API lookup tool. You can use it as a Visual Studio plugin or a standalone app.
  * <a href="http://automapper.codeplex.com/" target="_blank">Automapper</a>: Allows you to create rules to transform data between classes. If you use their conventions then it can automatically do the transform. Becomes useful if you are doing ViewModels that are transformed from views and other situations where the <a href="http://en.wikipedia.org/wiki/Data_transfer_object" target="_blank">DTO</a> pattern is used.
  * MVC Filters; There seems to be 3 kinds of filters (ignoring the AuthorizationFilter) in ASP.NET MVC (which basically give <a href="http://www.google.com.au/url?sa=t&source=web&cd=1&sqi=2&ved=0CCsQFjAA&url=http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAspect-oriented_programming&rct=j&q=aspect%20oriented%20programming&ei=O609TcfvIIXEvgO2nuSuCg&usg=AFQjCNF-xkiz6hlVk9vPN6mx16a5DdsOow&cad=rja" target="_blank">AOP</a> to MVC). Now that MVC3 has global application of filters this combination gives you a huge amount of power and flexibility: 
      * ExceptionFilter: Allows you to execute when an exception is thrown in a controller action
      * ResultFilter: Allows you to execute before and after the Result returned from a controller action (e.g. a View) is executed
      * ActionFilter: Allows you to execute before and after a controller action is called.
      * <a href="http://blogs.charteris.com/blogs/gopalk/archive/2009/02.aspx" target="_blank">Further reading</a>
  * <a href="http://weblogs.asp.net/andrewrea/archive/2008/05/25/extension-methods-inside-net-3-5.aspx" target="_blank">Extension methods</a>: Wow, just wow. It allows you to extend any class, private, sealed or otherwise. Of interest is that Microsoft have used it for some of the later .NET additions like LINQ methods on lists for instance.
  * <a href="http://www.c-sharpcorner.com/uploadfile/cupadhyay/staticconstructors11092005061428am/staticconstructors.aspx" target="_blank">Static Constructors</a>: Called once the first time a certain class is used. Although, apparently there is a <a href="http://dotnetperls.com/static-constructor" target="_blank">bit of overhead for this convenience</a>.
  * <a href="http://msdn.microsoft.com/en-us/library/f177hahy%28v=VS.100%29.aspx" target="_blank">Immediate Window</a>: Kinda like <a href="http://en.wikipedia.org/wiki/Interactive_Ruby_Shell" target="_blank">irb</a> for .NET, allows you to type in an evaluate any expression you want after you hit a breakpoint and includes code completion while typing &#8211; pretty awesome.
  * Great blog post <a href="http://www.richard-banks.org/2010/07/mocking-comparison-part-1-basics.html" target="_blank">explaining the syntax for the common mocking operations</a> you might want to perform with the most common .NET mocking libraries. Good for evaluation which one you want to use and as a general tutorial once you have picked a library.