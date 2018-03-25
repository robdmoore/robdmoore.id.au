---
id: 355
title: 'NHibernate.SqlAzure: Transient fault-handling NHibernate driver for use with Windows Azure SQL Database'
date: 2012-08-20T07:48:45+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=355
permalink: /blog/2012/08/20/nhibernate-sqlazure-transient-fault-handling-nhibernate-driver-for-use-with-windows-azure-sql-database/
categories:
  - Technical
tags:
  - 'C#'
  - NHibernate
  - sql
  - Windows Azure
---
I would like to announce the release of a software library I have written in conjunction with <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a> as open source viaÂ <a href="https://nuget.org/packages/NHibernate.SqlAzure" target="_blank">NuGet</a> /Â <a href="https://github.com/robdmoore/NHibernate.SqlAzure" target="_blank">Github</a>: NHibernate.SqlAzure.

When using Windows Azure SQL Database (as it&#8217;s now known: what a mouthful! :P) one of the things that you need to account for is <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336245.aspx#cc" target="_blank">transient errors that come up as part of the fact you are using a high availability database</a>.

This essentially involves looking at the error code returned from the database and if it&#8217;s one of a set of numbers then retrying the communication (be it a SQL command or a connection establishment) again with some sort of retry pattern. Obviously, you don&#8217;t want to just retry every query because the error that comes back might be a legitimate error.

Microsoft have helpfully released a library as part of Enterprise Library called theÂ <a href="http://msdn.microsoft.com/en-us/library/hh680934(v=PandP.50).aspx" target="_blank">Transient Fault HandlingÂ Application Block</a> that handles these transient errors as well as various retry patterns via the ReliableSqlConnection class.

While there are lots of articles out there about integrating this library with Entity Framework and Linq to SQL there isn&#8217;t really any guidance for NHibernate; only a few stack overflow posts and similar.

I&#8217;ve been working with Matt over the last few months to develop an NHibernate driver that will automatically make use of the transient connection and command retry logic within the Transient Fault Handling Application Block in an unobtrusive manner. This means that you can add one line of code to your existing applications (be it Fluent NHibernate or XML configuration) to make use of this feature. The library works fine for local connections (since none of the error codes it is looking for will usually get thrown by a non SQL Azure database (and frankly if they did then there is no harm in retrying!).

The other cool thing about this integration is that you can make use of it for other retry situations by specifying a different transient error detection strategy and extending the ReliableSql2008ClientDriver class with a custom implementation. See the <a href="https://github.com/robdmoore/NHibernate.SqlAzure" target="_blank">Github</a> site for more information about that.

This library was actually fairly tricky to write because of a whole heap of explicit type-casts inside ADO.NET and NHibernate so I&#8217;m pretty proud of being able to release this!

One last note &#8211; I&#8217;ve been able to prove with automated tests that the library does actually handle transient errors by continuously pausing and restarting the SQL Express service while the test is running and it works beautifully!! ðŸ™‚

Enjoy!