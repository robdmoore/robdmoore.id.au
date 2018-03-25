---
id: 313
title: AutofacContrib.NSubstitute v3 release
date: 2012-06-12T00:30:34+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=313
permalink: /blog/2012/06/12/autofaccontrib-nsubstitute-v3-release/
categories:
  - Technical
tags:
  - Autofac
  - 'C#'
  - mocking
  - NSubstitute
  - TDD
  - testing
---
I&#8217;d like to announce a new release for the <a href="http://nuget.org/packages/AutofacContrib.NSubstitute" target="_blank">AutofacContrib.NSubstitute</a> library. The library was in need of a bit of love because it forced you to use a really old NSubstitute version.

I&#8217;ve made the following changes:

  * Deprecated the AutoMock class in favour of AutoSubstitute (in keeping with the theme of the NSubstitute library).
  * Added a new constructor that allows you to make modifications to the ContainerBuilder before the IContainer is built.
  * Dependency on the latest version of NSubstitute and removed the hard restriction on the NSubstitute and Autofac version numbers so the package is compatible with the latest versions of those libraries.
  * <a href="https://github.com/robdmoore/AutofacContrib.NSubstitute" target="_blank">Moved the source to Github</a>
  * Added <a href="https://github.com/robdmoore/AutofacContrib.NSubstitute" target="_blank">some documentation</a> and an example class showing some usage examples

Enjoy!