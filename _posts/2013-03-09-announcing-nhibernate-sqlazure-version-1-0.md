---
layout: post
title: Announcing NHibernate.SqlAzure version 1.0!
date: 2013-03-09 21:02:58.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- NHibernate
- sql
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


I'm proud to be able to announce the release of version 1.0 of NHibernate.SqlAzure!



This library takes care of retrying when the transient errors that SQL Azure throws at you occur while using the NHibernate ORM. It's been in Beta for the last few months and has been successfully used on a number of production websites.


## Changes from 0.9 to 1.0

- Bug fix when using Schema validation (thanks to [@hmvs](https://github.com/hmvs))
- There is now a transient error detection strategy and associated NHibernate driver ([SqlAzureClientDriverWithTimeoutRetries](https://github.com/robdmoore/NHibernate.SqlAzure#advanced-usage-extending-the-provider-add-logging-for-failed-attempts-or-apply-different-retry-strategies--transient-error-detection-strategies); say that 10 times fast!!) that retries for timeout exceptions (see the [Github page](https://github.com/robdmoore/NHibernate.SqlAzure) for details and also thanks to @hmvs for a contribution towards this)
- Some instances where exceptions were wrapped in NHibernate exceptions (batching, transactions) are now picked up as transient exceptions when before they were ignored
- You can now easily log connection and command exceptions separately (see the CommandRetry and ConnectionRetry virtual methods on the driver class you use)
- The documentation is a bit more comprehensive now
- I finished writing all the automated tests I wanted to
- Been road-tested on a number of sites over the last few months in production



This project is a collaborative effort along with my partner in code crime - [Matt Davies](http://blog.mdavies.net/) - all code was either pair programmed together or reviewed by the other party.



Go and grab it from NuGet today and let me know how you go! Installation / usage instructions are on the [Github page](https://github.com/robdmoore/NHibernate.SqlAzure).

