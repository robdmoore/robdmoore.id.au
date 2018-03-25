---
id: 167
title: Agile Software Development
date: 2011-04-27T16:31:14+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=167
permalink: /blog/2011/04/27/agile-software-development/
categories:
  - Technical
tags:
  - Agile
  - Pair Programming
  - Software Engineering
  - TDD
  - tech evangelism
  - testing
---
I&#8217;ve been giving a number of presentations on Agile Software Development of late and I thought it might be useful to publish my take on Agile and how I present it. I have been using variations of [this slide deck](http://media.robdmoore.id.au/uploads/2011/04/AgileSoftwareDevelopment.pptx) for my presentations.
  
<!--more-->

Disclaimer: The following summarises my current thoughts about Agile software development. I keep refining my thoughts constantly so this may well become redundant over time. While I have written this article off the top of my head without any references, my thoughts are inspired from all the reading and research I have done so parts of it will likely bare resemblance to the writings of people like [Martin Fowler](http://martinfowler.com/), [Alistair Cockburn](http://alistair.cockburn.us/), [James Shore](http://jamesshore.com/) and [Shane Warden](http://jamesshore.com/Agile-Book/).

## What is Agile?

The definitive Agile would have to be the [Manifesto for Agile Software Development](http://agilemanifesto.org/), a document that was published in 2001 by 17 key individuals within the software industry. The Agile Manifesto outlines 4 _values_ that Agile stands for:

> **Individuals and interactions** over processes and tools
  
> **Working software** over comprehensive documentation
  
> **Customer collaboration** over contract negotiation
  
> **Responding to change** over following a plan

They made the point that while the things on the right can be valuable (e.g. documentation), they value the things on the left more.

I interpret these four values to mean that Agile is:

> **People-oriented**
  
> **Value-driven**
  
> **Client collaborative**
  
> **Adaptive and flexible**

Before I explain what I think these four statements mean in the context of Agile, let&#8217;s take a step back and apply some context to Agile.

## Traditional Software Engineering<figure id="attachment_172" style="width: 300px" class="wp-caption alignright">

[<img class="size-medium wp-image-172 " title="The vicious cycle of traditional Software Engineering" src="http://media.robdmoore.id.au/uploads/2011/04/traditional_software_engineering-300x153.gif" alt="The vicious cycle of traditional Software Engineering" width="300" height="153" />](http://media.robdmoore.id.au/uploads/2011/04/traditional_software_engineering.gif)<figcaption class="wp-caption-text">The vicious cycle of traditional Software Engineering; Figure 1 from http://www.renaissancesoftware.net/files/articles/ESC-349Paper_Grenning-v1r2.pdf</figcaption></figure> 

I&#8217;m of the opinion that traditional Software Engineering is fundamentally flawed.

I think that applying traditional engineering methodologies to software doesn’t work because software development is fundamentally different from traditional engineering in two major ways:

  1. Having an upfront requirements phase and corresponding requirements document doesn’t work because the client either doesn&#8217;t know what they want until they see the system evolving, or they think they know what they want, but what they really want is something different, or they know what they want, but that will change over time.
  
    > **Stable software requirements is an oxymoron.**

  2. Traditional engineering involves a relatively short engineering design phase followed by a longer construction phase where the design is implemented by following a repeatable process. With software the implementation of code is actually a design phase rather than a construction phase and requires engineering design skills throughout. The construction phase is essentially non-existent. The traditional notion of a design phase in software is mostly useless (good software developers will be able to write the code or at least the tests well without needing to write a SDD) or at least should happen right before writing the code (for complex business logic it can help to visualise the process in a diagram before writing the code &#8211; this is where UML becomes useful).
  
    > **Software development requires engineering skills throughout the whole development cycle to get a good result.**

I think that the four Agile values I just mentioned are a reflection of the fact that traditional software engineering doesn&#8217;t work and tries to address these two fundamental differences.

## People-oriented

I think that Agile is people-oriented because it recognises that **software development is an inherently people-oriented process** in two major ways:

  1. Because requirements are not fixed you need to _interact continually_ with the client to elicit requirements. This interaction is (or at least should be!) a core part of the software development cycle.
  2. Because implementation requires engineering skills you need _skilled professionals_ with the right support and environment to get a good result.

## Value-driven

At the end of the day we are working for our client and **any work we do that doesn&#8217;t have value to the client is wasted effort**.

In terms of software development, at the end of the day the client gets the most value out of working software. Anything that doesn&#8217;t contribute towards working software, such as producing documentation to tick boxes (e.g. requirements specifications) isn&#8217;t delivering value to the client.

In Agile projects this is taken a step further by literally getting the client to prioritise all tasks on a regular and continual basis so that at any point in time the team is working on tasks that produce the _maximum_ value to the client at that point in time.

By working on these top priority tasks to completion the end result is that you almost constantly have production ready code. **This gives the client the flexibility to be able to deploy whenever they like, however often they like with _confidence_.** This isn&#8217;t easily possible with traditional software engineering and clearly delivers a lot of value to the client.

## Client-collaborative

In my opinion this is the most important of the four values and the big differentiator and driver of Agile development. **Agile software teams have continual, face-to-face contact with the client throughout the project**; they _collaborate_ closely with the client to develop the software.

Agile project management fosters a better relationship between the development team and the client they are working for. It leads to the client being more engaged and excited in the whole process and communicating better with the development team – I have seen this with every client we have worked for so far, they get so engaged and excited that they voice their excitement out loud.

It also results in the client being able to _trust and follow_ the advice of the development team. An interesting side-effect of this is that projects that will not be successful are able to be more readily identified and culled before much effort is wasted – something I like to call **successful failure**.

One the other side of the coin, it means the development team better understand the client&#8217;s goals and where they are coming from and that helps them deliver better _value_ for the client and be more _engaged_ with the project.

**You will (or should!) never hear words like “scope-creep” or “we can’t do that because it wasn’t in the requirements document” in an Agile project**. Agile is about avoiding those kinds of us versus them relationships because they lead to a _lack of trust_ and less than ideal outcomes.

## Adaptive and Flexible

**Agile projects involve the client re-prioritising and changing requirements on a regular basis**. Agile project management methods ensure that this happens in a controlled way and the development team is flexible enough to cope well. This flexibility empowers the client to be able to respond quickly to _changing market trends_ and, interestingly, take advantage of situations that yield a _competitive advantage_. Again, this isn&#8217;t easily possible with traditional software engineering.

## Common Misconceptions

### No documentation

If the client prioritises documentation as being important and delivering value then the team will work on it. Also, **there will always be documentation that teams will produce** because it&#8217;s important or necessary (e.g. handover documentation). The point is that a minimum amount of time is wasted on documentation that doesn&#8217;t deliver value, such as traditional requirements specifications. This can be done in a few ways:

  * Documentation is evaluated for usefulness / value before being produced, if there is no value in producing the documentation then it shouldn&#8217;t be produced.
  * Documentation is created in a succinct manner to get the core information across as easily and quickly as possible
  * Documentation can be created in an automated manner.

Obviously, adherence to standards and managerial demands will often make the first two points hard/impossible, so techniques like the third point can be investigated to try and ensure the least amount of time is &#8220;wasted&#8221; as possible.

I&#8217;ll make one last point; there is a lot of focus in Agile on technical excellence and testing. This means that the code quality should be very high. The tests allow you to refactor code with confidence, which makes it easier to keep the code of a high quality even as the design of the system evolves. Because of this, the code itself serves as the ultimate documentation of the system in combination with the tests. **In essence, the code and tests become an executable specification.**

### Lack of process / cowboy coding

In actual fact, I&#8217;ve found the opposite to be the case. **In order to follow Agile properly, the team needs to be very disciplined** (daily stand-ups, retrospectives, pair programming and test-driven development are examples where the team needs to stay focused). Agile actually introduces more of a rigid structure to the development team.

With regards to &#8220;cowboy coding&#8221;, this certainly should **not** occur in an Agile team (if it is you are doing things wrong). Thought should be given to the architectural design of the software prior to development, preferably tests should be written prior to development and all production code should be peer-reviewed. All of these techniques (and others) are common sense and aren&#8217;t exclusive to Agile &#8211; they have been around for some time.

### Agile is simple, thus it must be easy!

The thing that strikes me about Agile is that all of the values, principles, techniques and concepts behind it are very simple. They are essentially a combination of a lot of great ideas that have been applied to software for a long time.

Because of this, some people might think that Agile is easy. Certainly, as Agile becomes more widespread you start to see a lot of teams say they are &#8220;Agile&#8221; when in fact they simply picked up a few techniques related to Agile such as TDD and pair programming. **In actual fact &#8220;going&#8221; Agile is a very hard process; it&#8217;s not easy at all!**

As I already mentioned &#8211; doing Agile properly (by properly, I mean following everything in the methodology you choose; over time as the team becomes more experienced though they can use the retrospective process to change their process over time to suit their environment) takes a lot of self discipline. Agile is a big change from the more traditional ways of doing software development and as such it&#8217;s hard.

> **Agile is a change. Change is hard.**

A couple more notes about this:

  * The team won&#8217;t become immediately more productive when first &#8220;going&#8221; Agile; the opposite will probably be true as they get used to the change.
  * Agile isn&#8217;t a silver bullet; you need to work hard to get it to work (i.e. you have to do it properly), but the end result will be that you will be successful.

### It makes Software _Engineering_ redundant

Some people will say that because Agile is such a change from traditional software engineering that it makes Software Engineering redundant and that Software _Engineering_ has no meaning anymore. I would strongly argue the opposite; **I think it makes Software Engineering more relevant**:

> The development team need to use the whole range of engineering skills from requirements elicitation, through to design, implementation and testing every week and every day in an Agile project.

This is a departure from the traditional scenarios where you might see design engineers and requirements engineers etc. **With Agile you need better engineers that can utilise their full engineering skill set all the time.** I think this is something that scares some traditional engineers and makes them reluctant to consider the Agile way of doing things.

## Agile Methodologies

The Agile Manifesto outlines 4 Agile values and 12 principles that you should follow in order to realise the 4 values. In practice, you will become Agile by adopting an Agile methodology, which will outline a set of processes and / or techniques that take the Agile values and practices into account.

The two most common methodologies are eXtreme Programming (XP) and Scrum. XP has a solid foundation of technical practices that are good to consider adopting (e.g. pair programming, TDD, etc.) and some project management processes to follow in order to deliver projects in an Agile way. Scrum leaves you to decide what technical processes you want to adopt and focuses on a more rigid project management structure. My team started with XP and moved towards Scrum as we sorted out what technical processes we wanted to follow and when and wanted a more rigid structure to manage our projects. This worked well for us, so it&#8217;s something I can recommend.

## Agile Project Management

Depending on which Agile methodology you choose, there will be a number of project management processes you will be expected to follow, following is a list of the most common (and in my opinion most important) ones.

### Self-organising teams

Project managers don&#8217;t need to micro-manage Agile teams since you can trust that they are professionals and can manage themselves. This frees up the PMs to deliver value to the team (another way in which Agile is value-driven) by being able to focus on clearing roadblocks and liaising with external stakeholders rather than wasting everyone&#8217;s time with long, weekly meetings to try and understand what everyone is doing and why they aren&#8217;t following a (somewhat) arbitrarily designed Gantt chart that is weeks behind to the letter.

Yes, I am somewhat cynical about traditional PM applied to software, but that&#8217;s because I&#8217;ve seen it go wrong so many times. Yes, if you have a really good PM then it can work, but really good PMs are rare and it still takes a lot of effort and time (i.e. overhead).

### Daily progress communication

This is an amazingly powerful tool &#8211; short 5 minute meetings every day where the core development team talk about what they did between the last meeting, what they plan on doing between now and the next meeting and any roadblocks they face. Any stakeholder (e.g. client, PM, managers, etc.) is invited to observe the meeting whenever they want and allows them to quickly get up to speed on the progress of the team (**everyone is on the same page**) and **roadblocks are readily identified**.

### Continual process improvement

This is usually accomplished by a tool called the retrospective &#8211; a meeting (~1 hour long) where the team and potentially other stakeholders like the client attend and talk about what they think went right, what they think went wrong and any ideas for improvement based on what happened since the last retrospective (or variations of that theme).

The team will then collate the items identified into related groups and everyone will get a number of votes to vote on the items they think are most important to them to improve on. The top one or two items will then have a root cause analysis and the team will talk about how to address the root cause and also how any improvements can be measured.

By focussing on only one or two things it&#8217;s more likely that a permanent change will result rather than thrashing between the improvement of a large number of tasks. By ensuring there is a metric for improvement, this can be analysed at the next retrospective to see if the changes were effective and should be kept or dropped. By having the retrospective often you get **continual process improvement**.

The two key things to get right in an Agile project are the daily progress meetings (also called daily stand-ups in XP and daily scrums in Scrum) and retrospectives. If everything else the team is doing is wrong then you can still succeed since everyone is on the same page and you can fix the things that are wrong over time.

### Regular review, planning and estimation

Enough said. Obviously, **the client is heavily involved with this**.

### Very accurate and lightweight project estimation and tracking

Agile provides techniques that attempt to **waste as little time as possible with project management overhead**, while still being able to **accurately deliver tracking and estimation of of tasks**. This is through techniques like the storyboard, planning poker, burn down charts etc.

In particular, the estimation techniques in Agile really struck a chord with me because I feel that they lead to far more superior and accurate time estimates than what you usually see with more traditional techniques, even with the continually evolving requirements that you see in Agile projects. I could write a whole blog post about Agile estimation in it&#8217;s own right, so for conciseness I&#8217;ve simply included a [PDF of my current notes about Estimation](http://media.robdmoore.id.au/uploads/2011/04/AgileEstimation.pdf) (largely collated after a very useful [Agile user group session](http://www.meetup.com/Agile-Perth/events/14144188/) last year).

### Face-to-face communication

All Agile methodologies focus on using **face-to-face communication over other forms of communication wherever possible because it&#8217;s more efficient**; this is summed up nicely by one of the 12 Agile principles:

> The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.

## Technical Processes

The following are some of the most important technical processes that often accompany Agile:

  * Test-Driven Development (TDD), Acceptance Test-Driven Development (ATDD) and Behavioural-Driven Development (BDD)
  * Continuous Integration (CI)
  * Focus on code quality and maintainability (largely via continual code refactoring and use of good design practices and patterns)
  * Pair programming
  * Peer-reviewed production code

## Who is doing Agile?

Agile is becoming more commonplace over time. Some of the [big International companies](http://www.technical-insight.com/my_samples/Agile_Managers_Roadmap.pdf) (e.g. Siemens, Lockheed Martin, Motorola, Microsoft, Yahoo, [Google](http://www.infoq.com/presentations/Agile-Management-Google-Jeff-Sutherland), General Electric, Cisco Systems) and [big Australian Companies](http://www.cio.com.au/article/370942/time_get_agile/) (e.g. BankWest, Suncorp, Sensis, Telstra) are using Agile.

## Barriers to adoption

Above all, I think that the principles of Agile are common sense. If it’s common sense why isn&#8217;t everyone doing Agile? I think there are two reasons, and I think these two reasons are also the main barriers to adoption of Agile:

  1. There is an endemic culture within University courses (and by association graduating software engineers) and within most software organisations of the traditional way of doing things. In order for Agile to be successful, you need the clients on board, management on board and the development team on board. To get each of these groups of people on board you need to break down their existing ways of thinking about software development. **Changing culture is hard.**
  2. Agile is a big change and as such there will be resistance to that change. **There is always resistance to change**. In order to successfully transition to Agile you need to _embrace change_.

## Agile isn&#8217;t relevant to just Software

I think that the core values behind Agile can be relevant for non-software IT projects &#8211; if you are focused on delivering client value, working closer with the client, being adaptive and flexible and looking after your employees then that will surely result in better success.

I think that some of the Agile Project Management techniques should be investigated for application to non-software projects and teams because if they can be successfully applied then you will have less project management overhead and better communication between everyone.

I have read that some companies have implemented Agile values and techniques in non-IT areas such as HR and Finance, which is interesting. Also, one of the Agile methodologies, Lean, is actually based on techniques and processes that came out of the manufacturing industry (via the Toyota Production System).

Lean is well suited for operational work, so it&#8217;s not just about project work; operational software and IT teams can utilise some of these techniques.

There is a related concept to Lean called Systems Thinking that has wider applicability than software, I was recently linked to an [interesting video](http://leanandkanban.wordpress.com/2011/02/01/dr-w-edwards-demings-famous-red-bead-experiment/) that illustrates the basics behind it.

## The future

I&#8217;m of the opinion (hopefully not naively!) that within the next 5 years Agile won&#8217;t exist anymore because everyone will be doing it; kind of like what happened to Object Orientation.

I think that the last software companies to change to Agile will be Defence companies because they are the most heavily document-driven.