---
layout: post
title: Unobtrusive transient fault handling in Azure SQL Database with Entity Framework,
  Linq To Sql, NHibernate and ADO.NET
date: 2013-06-18 01:17:44.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- Entity Framework
- NHibernate
- sql
- unobtrusive coding
- Windows Azure
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


It's fairly well known know that when connecting to an Azure SQL Database you need to protect your application from [transient errors that occur when using it](http://social.technet.microsoft.com/wiki/contents/articles/1541.windows-azure-sql-database-connection-management.aspx).



Luckily, Microsoft [provide a library](http://msdn.microsoft.com/en-us/library/hh680934(v=pandp.50).aspx) that takes care of most of the effort of detecting these errors and retrying your operations according to a retry policy.



The problem with this library is that most of the documentation out there tells you to essentially wrap every database call in your system in a retry call using the library. Let's be honest - this is a crappy solution to the problem, particularly for legacy code bases where this might result in a major set of changes to the codebase.



Luckily, there is a way around it:


- If you are using Entity Framework 6 then check out the new [Connection Resiliency](http://entityframework.codeplex.com/wikipage?title=Connection%20Resiliency%20Spec) functionality, although note that the default implementation doesn't retry for timeout errors (see the documentation of the below mentioned libraries to see why you might care about that)
- If you are using NHibernate then you can use the library I've previously announced/released; [NHibernate.SqlAzure](https://github.com/robdmoore/nhibernate.sqlazure)
- If you are using EntityFramework then the best unobtrusive solutions on the net previously have retries for connection establishment (that have other potential connection management side-effects) and save operations, but not command retries - I'd like to announce the release of a library I have created called [ReliableDbProvider](https://github.com/robdmoore/ReliableDbProvider) that solves these problems in an unobtrusive way (generally you will only need to change your config and possibly one or two lines of code)
- If you are using ADO.NET (provided you use the Db Provider functionality for managing connections and commands) or Linq To Sql then the ReliableDbProvider library can be used as well

