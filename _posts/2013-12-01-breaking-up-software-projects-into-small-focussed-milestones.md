---
layout: post
title: Breaking up software projects into small, focussed milestones
date: 2013-12-01 00:03:59.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- "#noestimates"
- Agile
- continuous delivery
- lean
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


This post highlights a particular learning I've had over the last year about setting milestones for organising high-level goals for software projects.


## Background


When I am first involved in a project there is undoubtedly a huge list of things that the product owner / client wants and it's generally the case that there isn't enough time or money for it all to be all completed. Let's ignore for a moment the fact that there will be reasons why it's not sensible to complete it all anyway since the low priority things will be much less important than high priority work on other projects or emergent requirements / user feedback for the current project.



Often, the person/people in question don't really have a good understanding about what is realistic within a given time period (how could they when it's hard enough for the development team?) and certainly the traditional way that software development has been executed exacerbates the issue by promising that a requirements specification will be delivered by a certain time. Despite the fact this almost never works people still sometimes expect software to be able to be delivered in this way. Thankfully, Agile software development becoming more mainstream means that I see this mentality occurring less and less.



An approach I've often taken in the past to combat this is to begin by getting product owners to prioritise high-level requirements with the [MoSCoW](http://en.wikipedia.org/wiki/MoSCoW_Method) system and then take the must-have's and possibly the should-have's and labelled that as phase 1 and continued to flesh out those requirements into user stories. This then leaves the less important requirements at the bottom of the backlog giving a clear expectation that any estimations and grooming effort will be expended on the most important features and won't include "everything" that the person initially had in their vision (since that's unrealistic).



This is a common-sense approach that most people seem to understand and allows for a open and transparent approach to providing a realistic estimate that can't be misconstrued as being for everything. Note: I also use other techniques that help set clear expectations like [user story mapping](http://winnipegagilist.blogspot.com.au/2012/03/how-to-create-user-story-map.html) and [inception decks](http://agilewarrior.wordpress.com/2010/11/06/the-agile-inception-deck/).


## The problem


These "phase 1" milestones have a number of issues:


- They are arbitrary in make up and length, which results in a lack of focus and makes it easier for "scope creep" to occur
  - While scope-creep isn't necessarily a problem if it's being driven by prioritisation from a product owner it does tend to increase feedback cycles for user feedback and makes planning harder
  - Small variations to direction and scope tend to get hidden since they are comparatively small, however the small changes add up over time and can have a very large impact (positive and negative) on the project direction that isn't intended
- They tend to still be fairly long (3+ months)
  - This increases the size of estimation errors and the number and size of unknowns
  - I've noticed this also reduces the urgency/pace of everyone involved


## A different approach


I've since learnt that a much better approach is to create really small, focused milestones that are named according to the goal they are trying to meet e.g. Allow all non-commercial customers who only have product X to use the new system (if you are doing a rewrite) or Let customers use feature Y (new feature to a system).



More specifically, having focused milestones:


- Helps with team morale (everyone can see the end goal within their grasp and can rally around it)
- Helps frame conversations with the product owner around prioritising stories to keep focus and not constantly increasing the backlog size (and by association how far away the end goal is)
- Helps create more of a sense of urgency with everyone (dev team, ops, management etc.)
- Helps encourage more frequent releases and thinking earlier about release strategies to real end users
- Provides a nice check and balance against the sprint goal - is the sprint goal this sprint something that contributes towards our current milestone and in-turn are all the stories in the sprint backlog contributing to the sprint goal?


## The end goal (probably not "end"; there is always room for improvement)


I don't think that the approach I describe above is necessarily the best way of doing things. Instead I think it is a stepping stone for a number of things that are worth striving for:


- [#noestimates](http://neilkillick.com/2013/01/31/noestimates-part-1-doing-scrum-without-estimates/)
- Approaching everything in terms of strict [minimum viable products](http://theleanstartup.com/principles) and using that to drive decisions based on how real users interact with those minimum viable products
- [Driving everything from strategic direction](http://robdmoore.id.au/blog/2013/11/30/presentation-moving-from-technical-agility-to-strategic-agility/)

