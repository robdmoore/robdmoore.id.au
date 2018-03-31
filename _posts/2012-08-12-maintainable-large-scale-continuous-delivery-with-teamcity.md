---
layout: post
title: Maintainable, large-scale continuous delivery with TeamCity Blog Series
date: 2012-08-12 00:13:06.000000000 +08:00
type: post
categories:
- Technical
tags:
- Agile
- continuous delivery
- dev ops
- MSDeploy
- powershell
- TeamCity
author: rob
---


I've been a ardent supporter of [continuous delivery](http://continuousdelivery.com/) since I first learnt about it from a [presentation by Martin Fowler and Jez Humble](http://yow.eventer.com/events/1004/talks/1062). At the time I loved how it encouraged less risky deployments and changed the decision of when/what to deploy from being a technical decision to being a business decision.



I personally think that embracing continuous delivery is an important intermediate step on the journey towards [moving from technical agility to strategic agility](http://robdmoore.id.au/blog/2013/11/30/presentation-moving-from-technical-agility-to-strategic-agility/ "Presentation: Moving from Technical Agility to Strategic Agility").



This post was first written in August 2012, but has since been largely rewritten in February 2014 to keep it up to date.



This post forms the introduction to a blog series that is jointly written by myself and [Matt Davies](http://blog.mdavies.net/).


1. [Intro](http://robdmoore.id.au/blog/2012/08/12/maintainable-large-scale-continuous-delivery-with-teamcity/)
2. TeamCity deployment pipeline
  - [TeamCity deployment pipeline (part 1: structure)](http://robdmoore.id.au/blog/2012/09/01/maintainable-teamcity-continuous-deployment-pipeline-configuration/)
  - [TeamCity deployment pipeline (part 2: TeamCity 8, build once and UI tests)](http://blog.mdavies.net/2014/04/21/teamcity-deployment-pipeline-part-2-teamcity-8-build-once-and-ui-tests/)
  - [TeamCity deployment pipeline (part 3: using OctopusDeploy for deployments)](http://robdmoore.id.au/blog/2014/04/21/teamcity-deployment-pipeline-part-3-using-octopusdeploy-for-deployments/)
3. Deploying Web Applications
  - MsDeploy (onprem and Azure Web Sites)
  - OctopusDeploy (nuget)
  - Git push (Windows Azure Web Sites)
4. Deploying Windows Services
  - MsDeploy
  - OctopusDeploy
  - Git push (Windows Azure Web Sites Web Jobs)
5. Deploying Windows Azure Cloud Services
  - OctopusDeploy
  - PowerShell
6. How to choose your deployment technology
  - [Microsoft's hidden gem: MSDeploy](http://blog.mdavies.net/2012/08/12/microsofts-hidden-gem-msdeploy/)


## Continuous Delivery with TeamCity


One of the key concepts in continuous delivery is the creation of a clear deployment pipeline that provides a clear set of sequential steps or stages to move software from a developer's commits to being deployed in production.



We have been using TeamCity to develop deployment pipelines that facilitate continuous delivery for the last few years. While TeamCity is principally a continuous integration tool, it is more than adequate for creating a deployment pipeline and comes with the advantage that you are then using a single tool for build and deployment.



We have also tried combining TeamCity with other tools that are more dedicated to deployments, such as [OctopusDeploy](http://octopusdeploy.com/). Those tools provide better deployment focussed features such as visualisation of the versions of your application deployed to each environment. This approach does create the disadvantage of needing to rely on configuring and using two separate tools rather than just one, but can still be useful depending on your situation.



There are a number of articles that you will quickly come across in this space that give some really great advice on how to set up a continuous delivery pipeline with TeamCity and complement our blog series:


- [Continuous Integration & Delivery For GitHub With TeamCity](http://www.mehdi-khalili.com/continuous-integration-delivery-github-teamcity)
- [Continuous Delivery to Windows Azure Not Only Microsoft Style with TeamCity](http://magnusmartensson.com/continuous-delivery-windowsazure-nomirosoft-teamcity)
- [Continuous Delivery with TeamCity](http://blogs.lessthandot.com/index.php/enterprisedev/application-lifecycle-management/continuous-delivery-with-teamcity/)
- [You're deploying it wrong! TeamCity, Subversion & Web Deploy part 1: Config transforms](http://www.troyhunt.com/2010/11/you-deploying-it-wrong-teamcity.html)
- [Continuous Delivery with psake and TeamCity](http://gorankvarv.blogspot.com.au/search/label/Continuous%20Delivery)
- [TeamCity Build Dependencies](http://blogs.jetbrains.com/teamcity/2012/04/24/teamcity-build-dependencies-2/)
- [Continuous Delivery to Windows Azure Web Sites (or IIS)](http://confluence.jetbrains.com/display/TCD8/Continuous+Delivery+to+Windows+Azure+Web+Sites+(or+IIS))


## Purpose of this blog series


The purpose of this series is three-fold:


- Document any findings that myself and Matt Davies have found from implementing continuous delivery pipelines using TeamCity that differ from the articles above;
- Outline the techniques we have developed to specifically set up the TeamCity installation in a way that is maintainable for a large number of projects;
- Cover the deployment of Windows Services and Azure Roles as well as IIS websites.



Our intention is to build of the work of our predecessors rather than provide a stand-alone series on how to set up continuous delivery pipelines with TeamCity.


## Other options


TeamCity is by no means the only choice when it comes to creating a deployment pipeline. Feel free to explore some of the other options:


- [Thoughtworks Go!](http://www.thoughtworks.com/products/go-continuous-delivery)
- [Jenkins](http://www.webdevbros.net/2013/05/26/how-to-do-a-deployment-pipeline-in-jenkins/)
- [Bamboo](https://confluence.atlassian.com/display/BAMBOO/Deployment+projects)
- [RedGate Deployment Manager](http://www.red-gate.com/delivery/deployment-manager/)

