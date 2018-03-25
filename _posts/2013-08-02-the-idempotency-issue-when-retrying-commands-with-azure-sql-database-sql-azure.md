---
id: 1541
title: The Idempotency issue when retrying commands with Azure SQL Database (SQL Azure)
date: 2013-08-02T23:51:39+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=1541
permalink: /blog/2013/08/02/the-idempotency-issue-when-retrying-commands-with-azure-sql-database-sql-azure/
categories:
  - Technical
tags:
  - 'C#'
  - NHibernate
  - sql
  - unobtrusive coding
  - Windows Azure
---
There is a lot of information available about dealing with <a href="http://www.windowsazure.com/en-us/develop/net/best-practices/troubleshooting/#header-1" target="_blank">transient errors that occur when using Azure SQL Database</a>. If you are using it then it&#8217;s really important to take the transient errors into account since it&#8217;s [one of the main differences that Azure SQL has when compared to SQL Server](http://robdmoore.id.au/blog/2013/06/18/simulating-transient-errors-when-using-azure-sql-database/ "Simulating transient errors when using Azure SQL Database").

If you are using .NET then you are in luck because Microsoft have provided an <a href="http://msdn.microsoft.com/en-us/library/hh680934(v=pandp.50).aspx" target="_blank">open source library to detect and retry for these transient errors</a>Â (The Transient Fault Handling Application Block). I have [blogged](http://robdmoore.id.au/blog/2012/08/20/nhibernate-sqlazure-transient-fault-handling-nhibernate-driver-for-use-with-windows-azure-sql-database/ "NHibernate.SqlAzure: Transient fault-handling NHibernate driver for use with Windows Azure SQL Database") [previously](http://robdmoore.id.au/blog/2013/03/09/announcing-nhibernate-sqlazure-version-1-0/ "Announcing NHibernate.SqlAzure version 1.0!") [about](http://robdmoore.id.au/blog/2013/06/18/unobtrusive-transient-fault-handling-in-azure-sql-database-with-entity-framework-linq-to-sql-nhibernate-and-ado-net/ "Unobtrusive transient fault handling in Azure SQL Database with Entity Framework, Linq To Sql, NHibernate and ADO.NET")Â how the guidance that comes with the application block (along with most of the posts, tutorials and forum posts about it) indicate that you need to completely re-architect your system to wrap every single database statement with a retry.

I wasn&#8217;t satisfied with that advice and hence I created <a href="https://github.com/robdmoore/NHibernate.SqlAzure" target="_blank">NHibernate.SqlAzure</a> and more recently <a href="https://github.com/robdmoore/ReliableDbProvider" target="_blank">ReliableDbProvider</a> (works with ADO.NET, EntityFramework, LinqToSql, etc.). These frameworks allow you to drop in a couple of lines of configuration at one place in your application and unobtrusively get transient fault handling in your application.

Easy right? A silver bullet even? Unfortunately, no.

## The Idempotency issue

Today I was made aware of a post made by a Senior Program Manager on the SQL Server team that was posted a few months ago about the <a href="http://blogs.msdn.com/b/adonet/archive/2013/03/11/sql-database-connectivity-and-the-idempotency-issue.aspx" target="_blank">Idempotency issue with Azure SQL Database</a>. Unfortunately, I haven&#8217;t been able to find any more information about it &#8211; if you know anything please leave a comment.

The crux of the problem is that it is possible for a transient error to be experienced by the application when in fact the command that was sent to the server was successfully processed. Obviously, that won&#8217;t have any ill-effect for a SELECT statement, and if the SELECT is retried then there is no problem. When you have write operations (e.g. INSERTs, UPDATEs and DELETEs) then you can start running into trouble unless those commands are repeatable (i.e. idempotent).

This is particularly troubling (although in retrospect not terribly surprising) and the frustrations of one of the commenters from the post sums up the situation fairly well (and in particular calls out how impractical the suggested workaround given in the post is):

> How exactly would this work with higher abstraction ORMs such as Entity Framework? The updates to a whole entity graph are saved as a whole, along with complex relationships between entities. Can entity updates be mapped to stored procedures such as this in EF? I completely appreciate this post from an academic perspective, but it seems like an insane amount of work (and extremely error-prone) to map every single update/delete operation to a stored procedure such as this.

## Approaches

After giving it some consideration and conferring with some of my colleagues, I can see a number of ways to deal with this (you could do something like what was suggested in the post linked to above, but frankly I don&#8217;t think it&#8217;s practical so I&#8217;m not including it). If you have any other ideas then please leave a comment below.

  1. Do nothing: transient faults (if you aren&#8217;t loading the database heavily) are pretty rare and within that the likelihood of coming across the idempotency issue is very low 
      * In this case you would be making a decision that the potential for &#8220;corrupt&#8221; data is of a lower concern than application complexity / overhead / effort to re-architect
      * If you do go down this approach I&#8217;d consider if there is some way you can monitor / check the data to try and detect if any corruption has occurred
      * Unique keys are your friend (e.g. if you had a Member table with an identity primary key and some business logic that said emails must be unique per member then you can use a unique key on Member.Email to protect duplicate entries)
  2. Architect your system so that all work to the database is abstracted behind some sort of unit of work pattern and that the central code that executes your unit of work contains your retry logic 
      * For instance if using NHibernate you could throw away the session on a transient error, get another one and retry the unit of work
      * While this ensures the integrity of your transactions it does have the potential side-effect of making everything a lot slower since any transient errors will cause the whole unit of work to retry (which could potentially be slow)
  3. Ensure all of your commands are idempotent 
      * While on the surface this doesn&#8217;t sound much better than having to wrap all commands with transient retry logic it can be quite straightforward depending on the application because most update and delete commands are probably idempotent already
      * Instead of using database-generated identities for new records use application generated identities (for instance generate a GUID and assign it to the id before inserting an entity) and then your insert statements will also be idempotent (assuming the database has a primary key on the id column)
      * NHibernate has automatic GUID generation capabilities for you and you can use the <a href="http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy/" target="_blank">Comb GUID algorithm to avoid index fragmentation issues</a> within the database storage
      * Alternatively, you can use strategies to generate unique integers like <a href="http://nhforge.org/blogs/nhibernate/archive/2009/03/20/nhibernate-poid-generators-revealed.aspx" target="_blank">HiLo</a> in NHibernate or <a href="http://blog.tatham.oddie.com.au/2011/07/14/released-snowmaker-a-unique-id-generator-for-azure-or-any-other-cloud-hosting-environment/" target="_blank">SnowMaker</a>
      * If you are doing delete or update statements then you simply need to ensure that they can be executed multiple times with the same result &#8211; e.g. if you are updating a column based on it&#8217;s current value (e.g. UPDATE [table] SET [column] = [column] + 1 WHERE Id = [Id]) then that could be a problem if it executed twice
  4. Retry for connections only, but not commands
  5. Retry for select statements only, but not others (e.g. INSERT, UPDATE, DELETE)
  6. Don&#8217;t use Azure SQL, but instead use SQL Server on an Azure Virtual Machine

## Recommendations

With all that in mind, here are my recommendations:

  * <span style="line-height: 14px;">Don&#8217;t shy away from protecting against transient errors &#8211; it&#8217;s still important and the transient errors are far more likely to happen than this problem</span>
  * Use application-generated ids for table identifiers
  * Consider what approach you will take to deal with the idempotency issue (as per above list)