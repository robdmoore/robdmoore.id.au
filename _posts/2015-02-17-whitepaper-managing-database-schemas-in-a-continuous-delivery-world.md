---
id: 4941
title: 'Whitepaper: Managing Database Schemas in a Continuous Delivery World'
date: 2015-02-17T11:40:42+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=4941
permalink: /blog/2015/02/17/whitepaper-managing-database-schemas-in-a-continuous-delivery-world/
categories:
  - Technical
tags:
  - continuous delivery
  - sql
  - tech evangelism
---
A whitepaper I wrote for my employer, <a href="http://readify.net" target="_blank">Readify</a>, just got <a href="http://readify.net/insights/whitepapers/managing-database-schemas-in-a-continuous-delivery-world/" target="_blank">published</a>. Feel free to check it out. I&#8217;ve included the abstract below.

One of the trickier technical problems to address when moving to a continuous delivery development model is managing database schema changes. It&#8217;s much harder to to roll back or roll forward database changes compared to software changes since by definition it has state. Typically, organisations address this problem by having database administrators (DBAs) manually apply changes so they can manually correct any problems, but this has the downside of providing a bottleneck to deploying changes to production and also introduces human error as a factor.

A large part of continuous delivery involves the setup of a largely automated deployment pipeline that increases confidence and reduces risk by ensuring that software changes are deployed consistently to each environment (e.g. dev, test, prod).

To fit in with that model it&#8217;s important to automate database changes so that they are applied automatically and consistently to each environment thus increasing the likelihood of problems being found early and reducing the risk associated with database changes.

This report outlines an approach to managing database schema changes that is compatible with a continuous delivery development model, the reasons why the approach is important and some of the considerations that need to be made when taking this approach.

The approaches discussed in this document aren&#8217;t specific to continuous delivery and in fact should be considered regardless of your development model.