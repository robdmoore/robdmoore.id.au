---
id: 721
title: Announcing NHibernate.SqlAzure version 1.0!
date: 2013-03-09T21:02:58+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=721
permalink: /blog/2013/03/09/announcing-nhibernate-sqlazure-version-1-0/
categories:
  - Technical
tags:
  - 'C#'
  - NHibernate
  - sql
  - Windows Azure
---
I&#8217;m proud to be able to announce the release of version 1.0 of NHibernate.SqlAzure!

This library takes care of retrying when the transient errors that SQL Azure throws at you occur while using the NHibernate ORM. It&#8217;s been in Beta for the last few months and has been successfully used on a number of production websites.

## Changes from 0.9 to 1.0

  * <span style="line-height: 14px;">Bug fix when using Schema validation (thanks to <a href="https://github.com/hmvs">@hmvs</a>)</span>
  * There is now a transient error detection strategy and associated NHibernate driver (<a href="https://github.com/robdmoore/NHibernate.SqlAzure#advanced-usage-extending-the-provider-add-logging-for-failed-attempts-or-apply-different-retry-strategies--transient-error-detection-strategies" target="_blank">SqlAzureClientDriverWithTimeoutRetries</a>; say that 10 times fast!!) that retries for timeout exceptions (see the <a href="https://github.com/robdmoore/NHibernate.SqlAzure" target="_blank">Github page</a> for details and also thanks to @hmvs for a contribution towards this)
  * Some instances where exceptions were wrapped in NHibernate exceptions (batching, transactions) are now picked up as transient exceptions when before they were ignored
  * You can now easily log connection and command exceptions separately (see the CommandRetry and ConnectionRetry virtual methods on the driver class you use)
  * The documentation is a bit more comprehensive now
  * I finished writing all the automated tests I wanted to
  * Been road-tested on a number of sites over the last few months in production

This project is a collaborative effort along with my partner in code crime &#8211;Â <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a> &#8211; all code was either pair programmed together or reviewed by the other party.

Go and grab it from NuGet today and let me know how you go! Installation / usage instructions are on the <a href="https://github.com/robdmoore/NHibernate.SqlAzure" target="_blank">Github page</a>.