---
layout: post
title: AutofacContrib.NSubstitute v3 release
date: 2012-06-12 00:30:34.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- Autofac
- C#
- mocking
- NSubstitute
- TDD
- testing
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


I'd like to announce a new release for the [AutofacContrib.NSubstitute](http://nuget.org/packages/AutofacContrib.NSubstitute) library. The library was in need of a bit of love because it forced you to use a really old NSubstitute version.



I've made the following changes:


- Deprecated the AutoMock class in favour of AutoSubstitute (in keeping with the theme of the NSubstitute library).
- Added a new constructor that allows you to make modifications to the ContainerBuilder before the IContainer is built.
- Dependency on the latest version of NSubstitute and removed the hard restriction on the NSubstitute and Autofac version numbers so the package is compatible with the latest versions of those libraries.
- [Moved the source to Github](https://github.com/robdmoore/AutofacContrib.NSubstitute)
- Added [some documentation](https://github.com/robdmoore/AutofacContrib.NSubstitute) and an example class showing some usage examples



Enjoy!

