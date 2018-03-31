---
layout: post
title: Announcing 1.0.0 of ReliableDbProvider library
date: 2014-07-20 16:32:28.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- unobtrusive coding
- Windows Azure
author: rob
---


I'd like to announce that today I've released v1.0.0 of the ReliableDbProvider library. It's been kicking around for a while, has a reasonable number of downloads on NuGet and has just received a number of bug fixes from the community so I feel it's ready for the 1.0.0 badge :).



[ReliableDbProvider is a library that allows you to unobtrusively handle transient errors when connecting to Azure SQL Database](/blog/2013/06/18/unobtrusive-transient-fault-handling-in-azure-sql-database-with-entity-framework-linq-to-sql-nhibernate-and-ado-net/ "Unobtrusive transient fault handling in Azure SQL Database with Entity Framework, Linq To Sql, NHibernate and ADO.NET") when using ADO.NET, Linq 2 Sql, EntityFramework < 6 (EF6 has similar functionality in-built) or any library that uses ADO.NET (e.g. Massive).



Check it out on [GitHub](https://github.com/MRCollective/ReliableDbProvider).

