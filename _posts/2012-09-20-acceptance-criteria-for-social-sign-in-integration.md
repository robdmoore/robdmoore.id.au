---
id: 443
title: Acceptance Criteria for Social sign-in integration
date: 2012-09-20T23:46:08+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=443
permalink: /blog/2012/09/20/acceptance-criteria-for-social-sign-in-integration/
categories:
  - Technical
tags:
  - acceptance criteria
  - BDD
  - TDD
---
Earlier in the year I was developing some business logic to integrate social (in this case Facebook) sign-in with a website&#8217;s existing &#8220;local account&#8221;. At the time I created a set of acceptance criteria in conjunction with the product owner in order to work through the rather complex logic that results (as you will see there are quite a few permutations and it gets quite complex to express this understandably).

I recently started working on specifying some work that involves social sign-in integration and it occurred to me that the previous work I had done is probably quite relevant and reusable in other situations. To that end I&#8217;ve included the acceptance criteria below in case it&#8217;s helpful for anyone.

Note: Don&#8217;t hesitate to adjust it according to your needs; some of it is specific to the implementation that I did earlier in the year. I would say it&#8217;s worth using it as a base to consider some of the possibilities when linking your website&#8217;s login with social sign-in.

<pre>GIVEN a user is not logged in
AND doesn't have a "local account"
WHEN the user authenticates their facebook account
THEN a new "local account" will be created for them linked to their facebook account
AND the user will be logged into the new "local account"
 
 
GIVEN a user is logged in
AND has not linked a facebook account
WHEN the user authenticates their facebook account
THEN the user will be prompted for their password to link their facebook account
 
 
GIVEN a user is logged in
AND has linked their facebook account
WHEN the user authenticates their facebook account
THEN they will be redirected to the Home page
 
 
GIVEN a user is not logged in
AND has linked a facebook account
WHEN the user authenticates their facebook account
THEN the user is logged into their "local account"
 
 
GIVEN a user has linked a facebook account
AND a second user is logged in
WHEN the second user tries to authenticate that facebook account
THEN the second user will be displayed a message indicating that facebook account is linked to another account
 
 
GIVEN a user is logged in
AND has a facebook email that matches the email of a non-Facebook-linked "local account"
WHEN the user authenticates their facebook account
THEN the user will be displayed a message indicating that email address is used by another user
 
 
GIVEN a user is not logged in
AND has a facebook email that matches the email of a non-Facebook-linked "local account"
WHEN the user authenticates their facebook account
THEN the user will be prompted for their password to link their facebook account and log in
 
 
GIVEN a user is logged in
AND has not linked a facebook account
AND they have authenticated their facebook account
WHEN the user submits their password
THEN the user's facebook account will be linked to their "local account"
 
 
GIVEN a user is not logged in
AND has a facebook email that matches the email of a non-Facebook-linked "local account"
AND they have authenticated their facebook account
WHEN the user submits their password
THEN the user's facebook account will be linked to their "local account"
AND they will be logged in
</pre>