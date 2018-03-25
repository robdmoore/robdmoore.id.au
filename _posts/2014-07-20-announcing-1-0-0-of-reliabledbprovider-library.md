---
id: 3461
title: Announcing 1.0.0 of ReliableDbProvider library
date: 2014-07-20T16:32:28+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3461
permalink: /blog/2014/07/20/announcing-1-0-0-of-reliabledbprovider-library/
categories:
  - Technical
tags:
  - 'C#'
  - unobtrusive coding
  - Windows Azure
---
I&#8217;d like to announce that today I&#8217;ve released v1.0.0 of the ReliableDbProvider library. It&#8217;s been kicking around for a while, has a reasonable number of downloads on NuGet and has just received a number of bug fixes from the community so I feel it&#8217;s ready for the 1.0.0 badge :).

[ReliableDbProvider is a library that allows you to unobtrusively handle transient errors when connecting to Azure SQL Database](http://robdmoore.id.au/blog/2013/06/18/unobtrusive-transient-fault-handling-in-azure-sql-database-with-entity-framework-linq-to-sql-nhibernate-and-ado-net/ "Unobtrusive transient fault handling in Azure SQL Database with Entity Framework, Linq To Sql, NHibernate and ADO.NET") when using ADO.NET, Linq 2 Sql, EntityFramework < 6 (EF6 has similar functionality in-built) or any library that uses ADO.NET (e.g. Massive).

Check it out on <a href="https://github.com/MRCollective/ReliableDbProvider" target="_blank">GitHub</a>.