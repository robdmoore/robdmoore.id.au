---
layout: post
title: 'ReSharper and .NET: A day of learning'
date: 2011-01-24 16:49:55.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- mocking
- ReSharper
- Visual Studio
author: rob
---


We had a .NET/agile contractor start with us today and in a few hours I learnt quite a number of great tips and tricks. I thought I'd share them:  
<!--more-->


- Keyboard shortcuts (some of these are ReSharper (VS Scheme), some are VS):
  - Ctrl+T: Search for type in solution (using either the full class name or [camel humps](http://blogs.jetbrains.com/dotnet/2008/02/resharper-in-detail-camelhumps/))
  - Ctrl+Shift+T: Search for filename in solution
  - Alt+: Search for symbols (e.g. properties, methods, etc.) in current file.
  - Alt+Shift+L: Show file currently being edited in the Solution Explorer
  - Ctrl+Shift+R: Context sensitive refactor
  - Alt+Ctrl+Shift+↑: Moves the currently selected method above the previous one (same deal for down arrow key moving methods down)
  - Ctrl+D: Duplicate current line
  - Ctrl+I: Incremental search, like Ctrl+F, but it starts searching immediately like / in vim; you can use F3 to get the next match while it's still in incremental mode so you can continue to refine the search.
  - [Cheat Sheet for ReSharper commands](http://www.jetbrains.com/resharper/docs/ReSharper50DefaultKeymap_VS_scheme.pdf)
- [Reflector.NET](http://www.red-gate.com/products/dotnet-development/reflector/): The contractor said that next to ReSharper one of the most useful tools for .NET is something called Reflector, which allows you to see the code of any .NET dll file (including core library). This becomes useful when you start to do more advanced stuff with .NET and want to see how the core code works. It also serves as a useful API lookup tool. You can use it as a Visual Studio plugin or a standalone app.
- [Automapper](https://github.com/automapper/automapper): Allows you to create rules to transform data between classes. If you use their conventions then it can automatically do the transform. Becomes useful if you are doing ViewModels that are transformed from views and other situations where the [DTO](https://en.wikipedia.org/wiki/Data_transfer_object) pattern is used.
- MVC Filters; There seems to be 3 kinds of filters (ignoring the AuthorizationFilter) in ASP.NET MVC (which basically give [AOP](https://en.wikipedia.org/wiki/Aspect-oriented_programming) to MVC). Now that MVC3 has global application of filters this combination gives you a huge amount of power and flexibility:
  - ExceptionFilter: Allows you to execute when an exception is thrown in a controller action
  - ResultFilter: Allows you to execute before and after the Result returned from a controller action (e.g. a View) is executed
  - ActionFilter: Allows you to execute before and after a controller action is called.
- [Extension methods](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods): Wow, just wow. It allows you to extend any class, private, sealed or otherwise. Of interest is that Microsoft have used it for some of the later .NET additions like LINQ methods on lists for instance.
- [Static Constructors](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/static-constructors): Called once the first time a certain class is used. Although, apparently there is a [bit of overhead for this convenience](http://dotnetperls.com/static-constructor).
- [Immediate Window](https://msdn.microsoft.com/en-us/library/f177hahy%28v=VS.100%29.aspx): Kinda like [irb](https://en.wikipedia.org/wiki/Interactive_Ruby_Shell) for .NET, allows you to type in an evaluate any expression you want after you hit a breakpoint and includes code completion while typing - pretty awesome.
- Great blog post [explaining the syntax for the common mocking operations](http://www.richard-banks.org/2010/07/mocking-comparison-part-1-basics.html) you might want to perform with the most common .NET mocking libraries. Good for evaluation which one you want to use and as a general tutorial once you have picked a library.

