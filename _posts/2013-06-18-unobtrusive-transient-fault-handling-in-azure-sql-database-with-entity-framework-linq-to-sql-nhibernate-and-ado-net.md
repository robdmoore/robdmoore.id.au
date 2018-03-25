---
id: 1161
title: Unobtrusive transient fault handling in Azure SQL Database with Entity Framework, Linq To Sql, NHibernate and ADO.NET
date: 2013-06-18T01:17:44+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=1161
permalink: /blog/2013/06/18/unobtrusive-transient-fault-handling-in-azure-sql-database-with-entity-framework-linq-to-sql-nhibernate-and-ado-net/
categories:
  - Technical
tags:
  - 'C#'
  - Entity Framework
  - NHibernate
  - sql
  - unobtrusive coding
  - Windows Azure
---
It&#8217;s fairly well known know that when connecting to an Azure SQL Database you need to protect your application from <a href="http://social.technet.microsoft.com/wiki/contents/articles/1541.windows-azure-sql-database-connection-management.aspx" target="_blank">transient errors that occur when using it</a>.

Luckily, Microsoft <a href="http://msdn.microsoft.com/en-us/library/hh680934(v=pandp.50).aspx" target="_blank">provide a library</a> that takes care of most of the effort of detecting these errors and retrying your operations according to a retry policy.

The problem with this library is that most of the documentation out there tells you to essentially wrap every database call in your system in a retry call using the library. Let&#8217;s be honest &#8211; this is a crappy solution to the problem, particularly for legacy code bases where this might result in a major set of changes to the codebase.

Luckily, there is a way around it:

  * <span style="line-height: 14px;">If you are using Entity Framework 6 then check out the new <a href="http://entityframework.codeplex.com/wikipage?title=Connection%20Resiliency%20Spec" target="_blank">Connection Resiliency</a> functionality, although note that the default implementation doesn&#8217;t retry for timeout errors (see the documentation of the below mentioned libraries to see why you might care about that)</span>
  * If you are using NHibernate then you can use the library I&#8217;ve previously announced/released; <a href="https://github.com/robdmoore/nhibernate.sqlazure" target="_blank">NHibernate.SqlAzure</a>
  * If you are using EntityFramework then the best unobtrusive solutions on the net previously have retries for connection establishment (that have other potential connection management side-effects) and save operations, but not command retries &#8211; I&#8217;d like to announce the release of a library I have created called <a href="https://github.com/robdmoore/ReliableDbProvider" target="_blank">ReliableDbProvider</a> that solves these problems in an unobtrusive way (generally you will only need to change your config and possibly one or two lines of code)
  * If you are using ADO.NET (provided you use the Db Provider functionality for managing connections and commands) or Linq To Sql then the ReliableDbProvider library can be used as well