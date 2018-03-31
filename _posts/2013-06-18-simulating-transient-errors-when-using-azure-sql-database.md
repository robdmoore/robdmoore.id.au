---
layout: post
title: Simulating transient errors when using Azure SQL Database
date: 2013-06-18 00:58:56.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- NHibernate
- sql
- Windows Azure
author: rob
---


I recently gave a presentation on the ins and outs of using Azure SQL for the Perth Ms Cloud User Group on Azure SQL Database. If you are curious feel free to check out the presentation file at: [https://github.com/robdmoore/SQLAzurePresentation](https://github.com/robdmoore/SQLAzurePresentation)



One of the things I did for the presentation was come up with a demo that illustrated the need for, and impact of, having transient error protection when talking to an Azure SQL Database. I have taken this code and cleaned it up a bit and released it on Github at: [https://github.com/robdmoore/SQLAzureTransientDemo](https://github.com/robdmoore/SQLAzureTransientDemo)



This code is quite unique since I have managed to find a way to reliably elicit the transient exceptions (something I haven't seen anywhere else on the net). If you need to test some code that needs these exceptions to happen to run and you want to be really sure the code works then feel free to check out the code.

