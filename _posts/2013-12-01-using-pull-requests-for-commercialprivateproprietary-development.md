---
layout: post
title: Using Pull Requests for commercial/private/proprietary development
date: 2013-12-01 13:23:25.000000000 +08:00
type: post
categories:
- Technical
tags:
- continuous delivery
- Git
- Pair Programming
- Software Engineering
- tech evangelism
author: rob
---


Developers who are familiar with open source will likely be aware of [pull requests](https://help.github.com/articles/using-pull-requests), which were [created](https://github.com/blog/3-oh-yeah-there-s-pull-requests-now) and popularised by [GitHub](http://github.com) as a way of providing some automation, visibility and social interaction around merging software changes. It replaces the old school notion of emailing patch files to each other as well as providing more visibility and interaction over pushing to the same branch (aka mainline development).



This is a post I've been meaning to write for a while. As a Senior Consultant for [Readify](http://readify.net) I find myself spending a lot of time mentoring teams and as a part of that I'm constantly paying attention to trends I notice and picking up / experimenting with techniques and processes that I can introduce to teams to get positive outcomes (improved efficiency, quality, maintainability, collaboration etc.). In my experiences so far I've found that **the single most effective change I have introduced to a software team that has improved the quality of software output** **is to introduce pull requests**. It also has a positive effect on other things like improved collaboration and [collective code ownership](http://agileinaflash.blogspot.com.au/2009/02/collective-code-ownership.html).



I can't claim to have invented this idea - I got the idea from listening to the experiences that my fellow consultants [Graeme Foster](http://gograemefoster.blogspot.com.au/) and [Jake Ginnivan](http://jake.ginnivan.net/) had and there are certainly [examples](http://blog.codeship.io/2013/08/22/the-codeship-workflow-part-2-pull-requests-and-code-review.html) [of](http://codeinthehole.com/writing/pull-requests-and-other-good-practices-for-teams-using-github/) companies using it, not the least of which is [GitHub](https://github.com/blog/1124-how-we-use-pull-requests-to-build-github) itself.


## What are pull requests?


Essentially, a pull request allows a developer to make some commits, push those commits to a branch that they have access to and create a request to a repository that they don't necessarily have access (but also could) to have their commit(s) merged in. Depending on the software that you are using, a pull request will generally be represented as a diff, a list of the commits and a dialogue of comments both against the pull request itself and against individual lines of code in the diff.


## Why are pull requests useful for open source?


Pull Requests are awesome for open source because they allow random third parties to submit code changes easily and effectively to projects that they don't usually have commit access to and for project maintainers to have a conversation with the contributor to get the changes in a state where they can be merged.



This lowers the barrier of entry to both maintainers and contributors, thus making it easier for everyone involved :).


## Why are pull requests useful for commercial development?


On first thought you might think that commercial development is significantly different from open source since the people submitting code changes are on the same team and there will be existing code review processes in place to deal with code quality.



Based on my experiences and other people I know there are definitely a range of advantages to using pull requests for commercial development (in no particular order):


- If you have enough developers and a big enough project/product then you might actually have a similar setup to an open source project in that the product might have a "core team" that look after the product and maintaining standards and consistency and other developers in the company can then submit pull requests to be reviewed by the core team
- Pull requests give a level playing field to the whole team - it encourages more junior or shy developers to "safely" review and comment on commits by more senior developers since it takes away the intimidation of doing it in person
- It provides a platform for new developers to get up-skilled quicker by providing:
  - Easy to digest, focussed examples of how to implement certain features that they can browse easily without having to ask how to find them
  - Confidence to raise pull requests without the stress of needing to know if the code is OK
  - Line-by-line comments to help them identify what they need to change to get their code "up to scratch"
  - This has a positive effect on the new developer themselves as well as the team since the learning is founded in practical application (which in my view is always the most efficient way to learn) and the person potentially needs less time from the team to get up to speed (thus having a smaller "burden")
- In much the same way as it helps with up-skilling it helps with learning for more junior developers
- It improves the safety of making changes to the codebase by ensuring that changes are looked at by at least one person before being merged into mainline
- It improves the consistency/[maintainability](/blog/2012/09/01/consistency-maintainability/ "Consistency == Maintainability") and quality of the codebase by ensuring all changes are reviewed by at least one person
- It makes it more likely that changes that would normally pass code review because they were minor enough that it didn't warrant rejecting a code review / going back and fixing what was already there are more likely to get fixed before being merged in
- There is tooling out there (e.g. [TeamCity's pull request integration](http://blog.jetbrains.com/teamcity/2013/02/automatically-building-pull-requests-from-github-with-teamcity/)) that can integrate with pull requests to provide assurances that the pull request is OK to merge (and potentially [automatically merge it for you](https://confluence.atlassian.com/display/BAMBOO/Using+plan+branches#Usingplanbranches-Usingautomaticmerging))
- The ability to have threaded comments on individual lines of code makes it really easy to have a contextual conversation about parts of the code and arrive at better designs because of it
- Despite what code review processes you might have in place I suspect that most of the time it's more likely code will get reviewed using pull requests because in my experience code reviews don't always happen regardless of what development processes exist, whereas a pull request would always be reviewed before merging
- Pull requests are pull-based rather than push-based i.e. the reviewer can review the code when they are not in the middle of something so there is less context-switching overhead (note: important/blocking pull requests might be a reason to interrupt someone still, but in my experience those pull requests are not the majority)
- If you are working with developers across multiple timezones then the above point means that code reviews are easier to perform since they are pull-based
- You can use pull requests to raise work-in-progress for early feedback (reducing feedback cycles :)) or for putting up the result of spikes for team comment
- If approached in the right way then it helps teams with collective code ownership because there is a lot of back-and-forth collaboration over the code and everyone in the team is free to review any pull request they are interested in



As you can see - it's a pretty convincing list of points and this summarises pretty well why pull requests are the most effective change I've made to a development team that has affected code quality.


## So, nothings perfect; what are the downsides/gotchas?


There are only a few I've noticed so far:


- If there is a lot of churn on the codebase from a lot of disparate teams/developers with potentially conflicting, high-priority tasks and there is no "core team" looking after the project then there is a tendency for developers to:
  - Work with other developers in their team to quickly merge the pull request without much inspection
  - Worse still - developers might just merge their own pull requests or bypass them completely and push directly to the branch
  - Acknowledge the review comments, but claim that their work is too high priority to not merge straight away and never get around to making the changes
- If there is someone in the team that is particularly picky then it's possible that team members might try and avoid that person reviewing their pull requests by asking someone else to review it
- If there are a lot of changes to be made based on review comments it can sometimes get tricky to keep track of which ones have and haven't been applied and/or the pull request could drag on for a long time while the developer completes the changes - there is a balance here between merging in the potentially important work in the pull request and spending time fixing potentially minor problems
- If pull requests are too big they are harder to review and there will be less review comments as a result and things might get missed (this would be a problem without pull requests, but pull requests simply highlight the problem)
- The diff UI on GitHub and Bitbucket frankly suck compared to local diffing tools. Stash's pull request diff UI is actually really good though; this does make it a bit more difficult for bigger PRs (but then it's still easy to pull and review the changes locally so you can get around this limitation)
- Comments on controversial code changes (or sometimes not so controversial changes) can sometimes get a bit out of hand with more comments than lines of code changed in the PR - at this point it's clear that the back-and-forth commenting has taken the place of what should be an in-person (or if you are remote video) conversation next to a whiteboard
- You end up with a lot of local and remote branches that clutter things up, but there [are techniques](http://devblog.springest.com/a-script-to-remove-old-git-branches/) to deal with it



These behaviours are generally unhealthy and are likely to be a problem if you don't have pull requests anyway (and in fact, pull requests simply serve to visualise the problems!) and should be addressed as part of the general continuous improvement that your team should be undergoing (e.g. raise the problems in retrospectives or to management if serious enough). Hopefully, you are in a situation with a self-organising team that will generally do the right things and get on board with the change :).


## Pull requests and continuous delivery


I'm extremelly passionate about [Continuous Delivery](http://martinfowler.com/books/continuousDelivery.html) and as such I have been in favour of a [mainline development approach over feature branches](http://continuousdelivery.com/2011/07/on-dvcs-continuous-integration-and-feature-branches/) for quite a while. Thus, on first hearing about using pull requests I was initially wary because I mistakenly thought it was a manifestation of feature branches. What I've since learnt is it definitely doesn't have to be, and in my opinion shouldn't be, about creating feature branches.



Instead, the same mindset that you bring to mainline development should be taken to pull requests and the same techniques to enable merging of partially complete features in a way that keeps the code both constantly production-ready and continuously integrated should be used. The way I see it developers need to have a mindset of looking at a pull request as being "a set of changes I want to merge to master" rather than "a complete feature ready to be integrated". This helps keep pull requests small, easy to review and ensures all developers are regularly integrating all changes against the mainline.



Introducing pull requests to the deployment pipeline adds another step that increases the confidence in your production deployments (the whole point of a deployment pipeline) as well as helping make sure that code in the mainline is always production-ready since the reviewer can (and should) review the changeset for it's likely effect on production as well as the usual things you would review.



Side note: [I love this git branching model](https://gist.github.com/jbenet/ee6c9ac48068889b0912) description.


## Tips

- Keep PRs small (I think I've explained why above well enough)
- Keep PRs focussed - a PR should contain one logical set of changes - it makes it easier to review and means if there is a problem with one set of changes that it doesn't block the other set of changes
- Delete a remote branch after it has been merged (if using Stash/Bitbucket then always tick the "close this branch after PR is merged" box)
- [Keep commits clean](http://blog.ericbmerritt.com/2011/09/21/commit-hygiene-and-git.html) - having a PR isn't an excuse to be lazy about your commits; use good commit messages, keep related logical changes together in a single commit, squash them together where relevant, use rebasing rather than merge commits and think about the history after the PR is merged - don't make it harder for yourself or your team in the future
- Don't let PRs get stagnant - if you are finished with a task take a look at the PRs and merge a couple before moving on; if everyone does this then there will be a constant flow of merges/integration - if a PR is open for more than a day there is a problem
- Where possible have one PR/branch per-person - you should be able to clean up your commits and force push to your pull request branch and it encourages the PR to be smaller
  - Be incredibly careful when doing a force push that you are not pushing to master
  - If you can turn off the ability to force push to master (e.g. Bitbucket allows this) then do it - better safe than sorry
- For those situations where you do need to work closely with someone else and feel like you need a PR across multiple people there are two techniques you can use:
  - Identify and pair together on at least the blocking "integration" work, put up a PR, get it merged and then work in individual PRs after that
  - If necessary then put up a pull request and contribute to the branch of that pull request by individual pull requests (i.e. create a featurex branch with a pull request to master and then create separate featurex-subfeaturea, featurex-subfeatureb branches with pull requests to featurex) - try and avoid this because it increases the size and length of time of the integrated pull request - also, consider rebasing the integrated pull request just before it's pulled in
  - If you plan on submitting a pull request against someone else's pull request branch then make sure you tell them so they don't rebase the commits on you (can you see why I try and avoid this? :P)
- Make sure that PR merges are done with actual merge commits (the merge button in all of the PR tools I've used do this for you) that reference the PR number - it makes it easier to trace them later and provides some extra information about the commits that you can look up (this is the only thing you should use merge commits for in my opinion)
- If your PR is not urgent then leave it there for someone to merge at their leisure and move on, if it's urgent/blocking then ask the team if someone can review/merge it straight away (from what I've seen this is not the common case - e.g. one or two a day out of 10-15 PRs)
- Tag your PR title with [WIP] to mark a work-in-progress PR that you are putting up for feedback to make sure you are on the right track and to reduce feedback cycles - [WIP] indicates that it's open for people to review, but NOT to merge
- In those rare circumstances when a PR is ready to be merged, but isn't production-ready (maybe it's a code clean-up waiting for a successful production release to occur first to render the code being deleted redundant for instance) then tag the PR title with [DO NOT MERGE]
- Unless you know what you are doing with Git never work off master locally; when starting new work switch to master, pull from origin/master, and create and switch to a new branch to describe your impending PR - it makes things a lot easier
  - I almost never do this - I generally just work on master unless editing a previously submitted PR because I find it quicker, but it does require me to constant be very careful about what branches I'm pushing and pulling from!
- Call out the good things in the code when reviewing - reviews shouldn't devolve into just pointing out things you think are wrong otherwise they develop negative connotations - if the PR creator did a good job on a bit of complex code then give them a pat on the back!
- Similarly, avoid emotive phrases like "ugly", "gross" etc. when describing code; when I'm reviewing code a technique I use to try and not sound condescending is to ask a question, e.g. "Do you think this should be named XX to make it clearer?" - make the pull request into a two-way conversation; work out the best solution collaboratively as a team
- If you aren't sure about something don't be afraid to ask a question; quite often this will highlight something that the author missed or at the very least help you to learn something
- Have fun! Use [funny gifs](https://github.com/MRCollective/ChameleonForms/pull/62), use [funny branch names](https://github.com/MRCollective/ChameleonForms/pull/13) - just because we are developing serious software doesn't mean we can't enjoy our jobs!


## Getting started


I've found that the following helps immensely when first getting a team started (but after a while the team is able to sustain itself easily):


- Having at least one person experienced with Git is really helpful as inevitably people will get themselves confused when first using branches and in particular with rebasing
- Have at least one person that knows what they are doing ensure that in the first week all PRs are reviewed and merged quickly - this will alleviate the team from needing to worry about keeping on top of merging PRs and instead will concentrate on the semantics of creating pull requests, responding to review comments and updating PRs. Once they get the hang of it then stop reviewing/merging all, but the most important PRs and the team will start to notice there is an increase in PRs and will hopefully self-organise to get them merged and get into the habit of doing that
  - It's possible this technique might not always work, but it has when I've tried it and it assists the team to slowly get the hang of using pull requests rather than dropping a huge change on them all at once
  - If the team doesn't self-organise then bring up the fact PRs aren't getting merged in retrospectives and suggest a possible solution of reviewing open PRs directly after standup and team members volunteer to review/merge each of the open ones
- Developers will naturally approach pull requests like feature branches even if told up front to treat it the same as what you would originally push to mainline with mainline development because of the natural human desire to get things "right" / finished
  - This will lead to enormous PRs that are constantly conflicted and a real pain in the ass for the developer
  - Let this happen and when the PR is finally merged sit down with them and ask them how they think it could be avoided in the future
  - Hopefully they will come to the realisation the PR was too big themselves and because they have made that realisation based on experience they are more likely to keep PRs small


## Tools


There are various tools that can help you use pull requests. The ones I have experience with or knowledge of are:


- [GitHub](http://github.com/)
- [GitHub Enterprise](https://enterprise.github.com/)
- [Bitbucket](http://bitbucket.org)
- [Stash](https://www.atlassian.com/en/software/stash/overview) (as mentioned above, this has by far the best diff UI for PRs)
- [GitLab](http://gitlab.org/)



If you are interested in semver and you want to use pull requests (or you don't and you are using mainline development) then I encourage you to check out the [GitHubFlowVersion](https://github.com/JakeGinnivan/GitHubFlowVersion) project by my friend [Jake Ginnivan](http://jake.ginnivan.net/).

