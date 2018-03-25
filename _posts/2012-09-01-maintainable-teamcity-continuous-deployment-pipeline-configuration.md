---
id: 349
title: 'TeamCity deployment pipeline (part 1: structure)'
date: 2012-09-01T23:32:30+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=349
permalink: /blog/2012/09/01/maintainable-teamcity-continuous-deployment-pipeline-configuration/
categories:
  - Technical
tags:
  - Agile
  - continuous delivery
  - convention
  - dev ops
  - Software Engineering
  - TeamCity
  - Windows Azure
---
<span style="font-size: 1rem; line-height: 1.714285714;">TeamCity (in particular version 7 onwards) makes the creation of continuous delivery pipelines fairly easy. There are a number of different approaches that can be used though and there isn&#8217;t much documentation on how to do it.</span>

This post outlines the set up that I have used for continuous delivery and also the techniques I have used to make it quick and easy to get up and running with new applications and to maintain the <a href="http://confluence.jetbrains.net/display/TCD7/Build+Configuration" target="_blank">build configurations</a> over multiple applications.

While this post is .NET focussed, the concepts here apply to any type of deployment pipeline.

## Maintainable, large-scale continuous delivery with TeamCity series

This post is part of a blog series jointly written by myself andÂ <a href="http://blog.mdavies.net/" target="_blank">Matt Davies</a> calledÂ Maintainable, large-scale continuous delivery with TeamCity:

  1. [Intro](http://robdmoore.id.au/blog/2012/08/12/maintainable-large-scale-continuous-delivery-with-teamcity/)
  2. TeamCity deployment pipeline 
      * [TeamCity deployment pipeline (part 1: structure)](http://robdmoore.id.au/blog/2012/09/01/maintainable-teamcity-continuous-deployment-pipeline-configuration/)
      * [TeamCity deployment pipeline (part 2: TeamCity 8, build once and UI tests)](http://blog.mdavies.net/2014/04/21/teamcity-deployment-pipeline-part-2-teamcity-8-build-once-and-ui-tests/)
      * [TeamCity deployment pipeline (part 3: using OctopusDeploy for deployments)](http://robdmoore.id.au/blog/2014/04/21/teamcity-deployment-pipeline-part-3-using-octopusdeploy-for-deployments/)
  3. Deploying Web Applications 
      * MsDeploy (onprem and Azure Web Sites)
      * OctopusDeploy (nuget)
      * Git push (Windows Azure Web Sites)
  4. Deploying Windows Services 
      * MsDeploy
      * OctopusDeploy
      * Git push (Windows Azure Web Sites Web Jobs)
  5. Deploying Windows Azure Cloud Services 
      * OctopusDeploy
      * PowerShell
  6. How to choose your deployment technology 
      * <a href="http://blog.mdavies.net/2012/08/12/microsofts-hidden-gem-msdeploy/" target="_blank">Microsoft&#8217;s hidden gem: MSDeploy</a>

## Designing the pipeline

When designing the pipeline we used at Curtin we wanted the following flow for a standard web application:

  1. The CI server automatically pulls every source code push
  2. When there is a new push the solution is compiled
  3. If the solution compiles then all automated tests (unit or integration &#8211; we didn&#8217;t have a need to distinguish between them for any of our projects as none of them took more than a few minutes to run) will be run (including code coverage analysis)
  4. If all the tests pass then the web application will be automatically deployed to a development web farm (on-premise)
  5. A button can be clicked to deploy the last successful development deployment to a UAT web farm (either on-premise or in Azure)
  6. A UAT deployment can be marked as tested and a change record number or other relevant note attached to that deployment to indicate approval to go to production
  7. A button can be clicked to deploy the latest UAT deployment that was marked as tested to production and this button is available to a different subset of people that can trigger UAT deployments

Two other requirements were that there is a way to visualise the deployment pipeline for a particular set of changes and also that there was an ability to revert a production deployment by deploying the last successful deployment if something went wrong with the current one. Ideally, each of the deployments should take no more than a minute.

## The final product

The following screenshot illustrates the final result for one of the projects I was working on:

[<img class="aligncenter size-large wp-image-373" title="Continuous delivery pipeline in TeamCity dashboard" alt="Continuous delivery pipeline in TeamCity dashboard" src="http://media.robdmoore.id.au/uploads/2012/08/dashboard-1024x317.gif" width="640" height="198" />](http://media.robdmoore.id.au/uploads/2012/08/dashboard.gif)

Some things to notice are:

  * The continuous integration step ensures the solution compiles and that any tests run; it also checks code coverage while running the tests &#8211; see below for the options I use
  * I use separate build configurations for each logical step in the pipeline so that I can create dependencies between them and use templates (see below for more information) 
      * This means you will probably need to either buy an <a href="http://www.jetbrains.com/teamcity/buy/index.jsp" target="_blank">enterprise TeamCity license</a> if you are putting more than two or three projects on your CI server (or spin up new servers for each two or three projects!)
  * I prefix each build configuration name with a number that illustrates what step it is relative the the other build configurations so they are ordered correctly 
      * You can visualise the pipeline as a graph by going to the <a href="http://confluence.jetbrains.net/display/TCD7/Build+Chain" target="_blank">Build Chains</a> page, but this allows you to make some sense of what is going on at a glance on the dashboard
      * <a href="http://youtrack.jetbrains.com/issue/TW-14067" target="_blank">Hopefully, Jetbrains will make the dashboard representation more intuitive</a> (and the general continuous delivery picture better in general)
  * I postfix each build configuration with an annotation that indicates whether it&#8217;s a step that will be automatically triggered or that needs to be manually triggered for it to run (by clicking the corresponding &#8220;Run&#8230;&#8221; button) 
      * I wouldn&#8217;t have bothered with this if TeamCity had a way to <a href="http://stackoverflow.com/questions/5434095/how-to-lock-run-button-in-teamcity" target="_blank">hide Run buttons</a> for various build steps.
      * You will note that the production deployments have some additional instructions as explained below. This keeps consistency that the postfix between the &#8220;[&#8221; and &#8220;]&#8221;are user instructions
      * In retrospect, for consistency I should have made the production deployment say &#8220;[Manual; Last pinned prod package]&#8221;
  * The production deployment is in a separate project altogether 
      * As stated above &#8211; one of my requirements that a different set of users were to have access to perform production deployments
      * At this stage TeamCity <a href="http://youtrack.jetbrains.com/issue/TW-5884" target="_blank">doesn&#8217;t have the ability to give different permissions on a build configuration level</a> &#8211; only on a project level, which effectively forced me to have a separate project to support this
      * This was a bit of a pain and complicates things, so if you don&#8217;t have that requirement then I&#8217;d say keep it all in one project
  * I have split up the package step to be separate from the deployment step 
      * In this case I am talking about MSDeploy packages and deployment, but a similar concept might apply for other build and deployment scenarios
      * The main reason for this is for consistency with the production package, which had to be separated from the deployment for the reasons explained below under &#8220;Production deployments&#8221;
  * In this instance the pipeline also had a NuGet publish, which is completely optional, but in this case was needed because part of the project (business layer entities) was shared with a separate project and using NuGet allowed us to share the latest version of the common classes with ease

## Convention over Configuration

One of the main concepts that I employ to ensure that the TeamCity setup is as maintainable as possible for a large number of projects is <a href="http://en.wikipedia.org/wiki/Convention_over_configuration" target="_blank">convention over configuration</a>. This requires consistency between projects in order for them to work and as <a title="Consistency == Maintainability" href="http://robdmoore.id.au/blog/2012/09/01/consistency-maintainability/" target="_blank">I have said previously</a>, I think this is really important for all projects to have anyway.

These conventions allowed me to make assumptions in my build configuration templates (explained below) and thus make them generically apply to all projects with little or no effort.

The main conventions I used are:

  * The name of the project in TeamCity is {projectname} 
      * This drives most of the other conventions
  * The name of the source code repository is ssh://git@server/{projectname}.git 
      * This allowed me to use the same VCS root for all projects
  * The code is in the master branch (we were using Git) 
      * As above
  * The solution file is at /{projectname}.sln 
      * This allowed me to have the same Continuous Integration build configuration template for all projects
  * The main (usually web) project is at /{projectname}/{projectname}.csproj 
      * This allowed me to use the same Web Deploy package build configuration template for all projects
  * The IIS Site name of the web application will be {projectname} for all environments 
      * As above
  * The main project assembly name is {basenamespace}.{projectname} 
      * In our case {basenamespace} was Curtin
      * This allowed me to automatically include that assembly for code coverage statistics in the shared Continuous Integration build configuration template
  * Any test projects end in .Tests and built a dll ending in .Tests in the binRelease folder of the test project after compilation 
      * This allowed me to automatically find and run all test assemblies in the shared Continuous Integration build configuration template

Where necessary, I provided ways to configure differences in these conventions for exceptional circumstances, but for consistency and simplicity it&#8217;s obviously best to stick to just the conventions wherever possible. For instance theÂ project name for the production project wasn&#8217;t {projectname} because I had to use a different project and project names are unique in TeamCity.Â This meant I needed a way to specify a different project name, but keep the project name as the default. I explain how I did this in the Build Parameters section below.

## Build Configuration templates

TeamCity gives you the ability to specify a majority of a build configuration via a shared <a href="http://confluence.jetbrains.net/display/TCD7/Build+Configuration+Template" target="_blank">build configuration template</a>. That way you can inherit that template from multiple build configurations and make changes to the template that will propagate through to all inherited configurations. This is the key way in which I was able to make the TeamCity setup maintainable. The screenshot below shows the build configuration templates that we used.

[<img class="aligncenter size-medium wp-image-385" title="Build Configuration Templates" alt="Build Configuration Templates" src="http://media.robdmoore.id.au/uploads/2012/09/build_config_templates-300x132.png" width="300" height="132" />](http://media.robdmoore.id.au/uploads/2012/09/build_config_templates.png)

Unfortunately, at this stage there is no way to define triggers or dependencies within the templates so some of the configuration needs to be set up each time as explained below in the transition sections.

The configuration steps for each of the templates will be explained in the subsequent posts in this series apart from the Continuous Integration template, which is explained below.Â One of the things that is shared by the build configuration template is the VCS root so I needed to define a common Git root (as I mentioned above). The configuration steps for that are outlined below.

## Build Parameters

One of the truly excellent things about TeamCity build configuration templates are how they handle <a href="http://confluence.jetbrains.net/display/TCD7/Configuring+Build+Parameters" target="_blank">build parameters</a>.

Build parameters in combination with build configuration templates are really powerful because:

  * You can use build parameters in pretty much any text entry field through the configuration; including the VCS root! 
      * This is what allows for the convention over configuration approach I explained above (the project name, along with a whole heap of other values, is available as build parameters)
  * You can define build parameters as part of the template that have no value and thus require you to specify a value before a build configuration instance can be run 
      * This allows you to create required parameters that must be specified, but don&#8217;t have a sensible default
      * When there are parameters that aren&#8217;t required and don&#8217;t have a sensible default I set their value in the build configuration template to an empty string
  * You can define build parameters as part of the template that have a default value
  * You can overwrite any default value from a template within a build configuration
  * You can delete any overwritten value in a build configuration to get back the default value from the template
  * You can set a build configuration value as being a password, which means that you can&#8217;t see what the value is after it&#8217;s been entered (instead it will say %secure:teamcity.password.{parametername}%)
  * Whenever a password parameter is referenced from within a build log or similar it will display as \***** i.e. the password is stored securely and is never disclosed 
      * This is really handy for automated deployments e.g. where service account credentials need to be specified, but you don&#8217;t want developers to know the credentials
  * You can reference another parameter as the value for a parameter 
      * This allows you to define a common set of values in the template that can be selected from in the actual build configuration without having to re-specify the actual value. This is really important from a maintainability point of view because things like server names and usernames can easily change
      * When referencing a parameter that is a password it is still obscured when included in logs ðŸ™‚
  * You can reference another parameter in the middle of a string or even reference multiple other parameter values within a single parameter 
      * This allows you to specify a parameter in the template that references a parameter that won&#8217;t be specified until an actual build configuration is created, which in turn can reference a parameter from the template.
      * When the web deploy post in this series is released you will be able to see an example of what I mean.
  * This is how I managed to achieve the flexible project name with a default of the TeamCity project name as mentioned above 
      * In the template there is a variable called env.ProjectName that is then used everywhere else and the default value in the build configuration template is %system.teamcity.projectName%
      * Thus the default is the project name, but you have the flexibility to override that value in specific build configurations
      * Annoyingly, I had to specify this in all of the build configuration templates because there is no way to have a hierarchy of templates at this time
  * There are three types of build parameters: system properties, environment variables and configuration parameters 
      * System properties are defined by TeamCity as well as some environment variables
      * You can specify both configuration parameters and environment variables in the build parameters page
      * I created a convention that configuration parameters would only be used to specify common values in the templates and I would only reference environment variables in the build configuration
      * That way I was able to create a consistency around the fact that only build parameters that were edited within an actual build configuration were environment variables (which in turn may or may not reference a configuration parameter specified in the template)
      * I think this makes it easier and less confusing to consistently edit and create the build configurations

## Snapshot Dependencies

I make extensive use of <a href="http://confluence.jetbrains.net/display/TCD7/Snapshot+Dependencies" target="_blank">snapshot dependencies</a> on every build configuration. While not all of the configurations need the source code (since some of them use <a href="http://confluence.jetbrains.net/display/TCD7/Artifact+Dependencies" target="_blank">artifact dependencies</a> instead) using snapshot dependencies ensures that the build chain is respected correctly and also provides a list of pending commits that haven&#8217;t been run for that configuration (which is really handy to let you know what state everything is in at a glance).

The downside of using snapshot dependencies though is that when you trigger a particular build configuration it will automatically trigger every preceding configuration in the chain as well. That means that if you run, say, the UAT deployment and a new source code push was just made then that will get included in the UAT deployment even if you weren&#8217;t ready to test it. In practice, I found this rarely if ever happened, but I can imagine that for a large and / or distributed team it could do so watch out for it.

What would be great to combat this was if TeamCity had an option for snapshot dependencies similar to artifact dependencies where you can choose the last successful build without triggering a new build.

## Shared VCS root

The configuration for the shared Git root we used is detailed in the below screenshots. We literally used this for every build configuration as it was flexible enough to meet our needs for every project.

[<img class="aligncenter size-medium wp-image-391" title="Git VCS Root Configuration" alt="Git VCS Root Configuration" src="http://media.robdmoore.id.au/uploads/2012/09/ci_2_generic_git-300x270.gif" width="300" height="270" />
  
](http://media.robdmoore.id.au/uploads/2012/09/ci_2_generic_git.gif) [<img class="aligncenter size-medium wp-image-392" title="Git VCS Root Configuration 2" alt="Git VCS Root Configuration 2" src="http://media.robdmoore.id.au/uploads/2012/09/ci_2_generic_git2-300x203.gif" width="300" height="203" />](http://media.robdmoore.id.au/uploads/2012/09/ci_2_generic_git2.gif)

You will note that the branch name is specified as a build parameter. I used the technique I described above to give this a default value of master, but allow it to be overwritten for specific build configurations where necessary (sometimes we spun up experimental build configurations against branches).

## Continuous Integration step configuration

A lot of what I do here is covered by the posts I referenced in the [first post of the series](http://robdmoore.id.au/blog/2012/08/12/maintainable-large-scale-continuous-delivery-with-teamcity/ "Maintainable, large-scale continuous delivery with TeamCity Blog Series") apart from using the relevant environment variables as defined in the build configuration parameters. Consequently, I&#8217;ve simply included a few basic screenshots below that cover the bulk of it:

[<img class="aligncenter size-medium wp-image-393" title="Continuous Integration Build Configuration Template 1" alt="Continuous Integration Build Configuration Template 1" src="http://media.robdmoore.id.au/uploads/2012/09/ci_1-300x201.gif" width="300" height="201" />](http://media.robdmoore.id.au/uploads/2012/09/ci_1.gif) [<img class="aligncenter size-medium wp-image-394" title="Continuous Integration Build Configuration Template 2" alt="Continuous Integration Build Configuration Template 2" src="http://media.robdmoore.id.au/uploads/2012/09/ci_3-300x172.gif" width="300" height="172" />](http://media.robdmoore.id.au/uploads/2012/09/ci_3.gif) [<img class="aligncenter size-medium wp-image-396" title="Continuous Integration Build Configuration Template - Build Step 1" alt="Continuous Integration Build Configuration Template - Build Step 1" src="http://media.robdmoore.id.au/uploads/2012/09/ci_3_1-300x267.gif" width="300" height="267" />](http://media.robdmoore.id.au/uploads/2012/09/ci_3_1.gif) [<img class="aligncenter size-medium wp-image-397" title="Continuous Integration Build Configuration Template - Build Step 2" alt="Continuous Integration Build Configuration Template - Build Step 2" src="http://media.robdmoore.id.au/uploads/2012/09/ci_3_2-300x289.gif" width="300" height="289" />](http://media.robdmoore.id.au/uploads/2012/09/ci_3_2.gif) [<img class="aligncenter size-medium wp-image-398" title="Continuous Integration Build Configuration Template - Build Step 2 (part 2)" alt="Continuous Integration Build Configuration Template - Build Step 2 (part 2)" src="http://media.robdmoore.id.au/uploads/2012/09/ci_3_22-300x252.gif" width="300" height="252" />](http://media.robdmoore.id.au/uploads/2012/09/ci_3_22.gif) [<img class="aligncenter size-medium wp-image-399" title="Continuous Integration Build Configuration Template - Build Triggering" alt="Continuous Integration Build Configuration Template - Build Triggering" src="http://media.robdmoore.id.au/uploads/2012/09/ci_5-300x72.gif" width="300" height="72" />](http://media.robdmoore.id.au/uploads/2012/09/ci_5.gif) [<img class="aligncenter size-medium wp-image-400" title="Continuous Integration Build Configuration Template - Build Parameters" alt="Continuous Integration Build Configuration Template - Build Parameters" src="http://media.robdmoore.id.au/uploads/2012/09/ci_7-300x133.gif" width="300" height="133" />](http://media.robdmoore.id.au/uploads/2012/09/ci_7.gif)

Some notes:

  * If I want to build a releasable dll e.g. for a NuGet package then I have previously used a build number of %env.MajorVersion%.%env.MinorVersion%.{0} in combination with the assembly patcher and then exposed the dlls as build artifacts (to be consumed by another build step that packages a nuget package using an artifact dependency) 
      * Then whenever I want to increment the major or minor version I adjust those values in the build parameters section and the build counter value appropriately
      * With TeamCity 7 you have the ability to include a NuGet Package step, which eliminates the need to do it using artifact dependencies
      * In this case that wasn&#8217;t necessary so the build number is a lot simpler and I didn&#8217;t necessarily need to include the assembly patcher (because the dlls get rebuilt when the web deployment package is built)
  * I set MvcBuildViews to false because the MSBuild runner for compiling views runs as x86 when using &#8220;Visual Studio (sln)&#8221; in TeamCity and we couldn&#8217;t find an easy way around it and thus view compilation fails if you reference 64-bit dlls 
      * We set MvcBuildViews to true when building the deployment package so any view problems do get picked up quickly
  * Be careful using such an inclusive test dll wildcard specification; if you make the mistake of referencing a test project from within another test project then it will pick up the referenced project twice and try and run all the tests from it twice
  * The coverage environment variable allows projects that have more than one assembly that needs code coverage to have those extra dependencies specified 
      * If you have a single project then you don&#8217;t need to do anything because the default configuration picks up the main assembly (as specified in the conventions section above)
      * Obviously, you need to change &#8220;BaseNamespace&#8221; to whatever is appropriate for you
      * I&#8217;ve left it without a default value so you are prompted to add something to it (to ensure you don&#8217;t forget when first setting up the build configuration)
  * The screens that weren&#8217;t included were left as their default, apart from Version Control Settings, which had the shared VCS root attached

## Build configuration triggering and dependencies

The following triggers and dependencies are set up on the pipeline to set up transitions between configurations. Unfortunately, this is the most tedious part of the pipeline to set up because there isn&#8217;t a way to specify the triggers as part of a build configuration template. This means you have to manually set these up every time you create a new pipeline (and remember to set them up correctly).

  * Step 1.1: Continuous Integration 
      * VCS Trigger &#8211; ensures the pipeline is triggered every time there is a new source code push; I always use the default options and don&#8217;t tweak it.
  * Step 2.1: Dev package 
      * The package step has a build trigger on the last successful build of Step 1 so that dev deployments automatically happen after a source code push (if the solution built and the tests passed)
      * There is a snapshot dependency on the last successful build of Step 1 as well
  * Step 2.2: Dev deployment 
      * In order to link the deployment with the package there is a build trigger on the last successful build of the package
      * There is also a snapshot dependency with the package step
      * They also have an artifact dependency from the same chain so the web deployment package that was generated is copied across for deployment; there will be more details about this in the web deploy post of the series
  * Step 3.1: UAT package 
      * There is no trigger for this since UAT deployments are manual
      * There is a snapshot dependency on the last successful dev deployment so triggering a UAT deployment will also trigger a dev deployment if there are new changes that haven&#8217;t already been deployed
  * Step 3.2: UAT deploy 
      * This step is marked as [Manual] so the user is expected to click the Run button for this build to do a UAT deployment
      * It has a snapshot on the UAT package so it will trigger a package to be built if the user triggers this build
      * There is an artifact dependency similar to the dev deployment too
      * There is also a trigger on successful build of the UAT package just in case the user decides to click on the Run button of the package step instead of the deployment step; this ensures that these two steps are always in sync and are effectively the same step
  * Step 4.1: Production package 
      * See below section on Production deployments
  * Step 5: Production deployment 
      * See below section on Production deployments

## Production deployments

I didn&#8217;t want a production build to accidentally deploy a &#8220;just pushed&#8221; changeset so in order to have a separation between the production deployment and the other deployments I didn&#8217;t use a snapshot dependency on the production deployment step.

This actually has a few disadvantages:

  * It means you can&#8217;t see an accurate list of pending changesets waiting for production 
      * I do have the VCS root attached so it shows a pending list, which will mostly be accurate, but will be cleared when you make a production deployment so if there were changes that weren&#8217;t being deployed at that point then they won&#8217;t show up in the pending list of the next deployment
  * It&#8217;s the reason I had to split up the package and deployment steps into separate build configurations 
      * This in turn added a lot of complexity to the deployment pipeline because of the extra steps as well as the extra dependency and trigger configuration that was required (as detailed above)
  * The production deployment doesn&#8217;t appear in the build chain explicitly so it&#8217;s difficult to see what build numbers a deployment corresponds too and to visualise the full chain

Consequently, if you have good visibility and control over what source control pushes occur it might be feasible to consider using a snapshot dependency for the production deployment and having the understanding that this will push all current changes to all environments at the same time. In our case this was unsuitable, hence the slightly more complex pipeline. If the ability to specify a snapshot dependency without triggering all previous configurations in the chain was present (as mentioned above) this would be the best of both worlds.

Building the production package still needs a snapshot dependency because it requires the source code to run the build. For this reason, I linked the production package to the UAT deployment via a snapshot dependency and a build trigger. This makes some semantic sense because it means that any UAT deployment that you manually trigger then becomes a release candidate.

The last piece of the puzzle is the bit that I really like. One of the options that you have when choosing an artifact dependency is to use the last <a href="http://confluence.jetbrains.net/display/TCD7/Pinned+Build" target="_blank">pinned build</a>. When you pin a build it is a manual step and it asks you to enter a comment. This is convenient in multiple ways:

  * It allows us to mark a given potential release candidate (e.g. a built production package) as an actual release candidate
  * This means we can actually deploy the next set of changes to UAT and start testing it without being forced to do a production deployment yet
  * This gives the product owner the flexibility to <a href="http://continuousdelivery.com/2010/08/continuous-delivery-vs-continuous-deployment/" target="_blank">deploy whenever they want</a>
  * It also allows us to make the manual testing that occurs on the UAT environment an explicit step in the pipeline rather than an implicit one
  * Furthermore, it allows us to meet the original requirement specified above that there could be a change record number or any other relevant notes about the production release candidate
  * It also provides a level of auditing and assurance that increases the confidence in the pipeline and the ability to &#8220;sell&#8221; the pipeline in environments where you deal with <a href="http://continuousdelivery.com/2010/11/continuous-delivery-and-itil-change-management/" target="_blank">traditional enterprise change management</a>
  * It means we can always press the Run button against production deployment confident in the knowledge that the only thing that could ever be deployed is a release candidate that was signed off in the UAT environment

## Archived template project

I explained above that the most tedious part of setting up the pipeline is creating the dependencies and triggers between the different steps in the pipeline. There is a technique that I have used to ease the pain of this.

One thing that TeamCity allows you to do is to make a copy of a project. I make use of this in combination with the ability to archive projects to create one or more archived projects that form a &#8220;project template&#8221; of sorts that strings together a set of build configuration templates including the relevant dependencies and triggers.

At the very least I will have one for a project with the Continuous Integration and Dev package and deployment steps already set up. But, you might also have a few more for other common configurations e.g. full pipeline for an Azure website as well as full pipeline for an on-premise website.

Furthermore, I actually store all the build configuration templates against the base archived project for consistency so I know where to find them and they all appear in one place.

[<img class="aligncenter size-medium wp-image-410" title="Archived Project Template with Build Configuration Templates" alt="Archived Project Template with Build Configuration Templates" src="http://media.robdmoore.id.au/uploads/2012/09/archived_admin-241x300.gif" width="241" height="300" />](http://media.robdmoore.id.au/uploads/2012/09/archived_admin.gif)

## Web server configuration

Another aspect of the convention over configuration approach that increases consistency and maintainability is the configuration of the IIS servers in the different environments. By configuring the IIS site names, website URLs and server configurations the same it made everything so much easier.

In the non-production environments we also made use of wildcard domain names to ensure that we didn&#8217;t need to generate new DNS records or SSL certificates to get up and running in development or UAT. This meant all we had to do was literally create a new pipeline in TeamCity and we were already up and running in both those environments.

## MSBuild import files

Similarly, there are certain settings and targets that were required in the .csproj files of the applications to ensure that the various MSBuild commands that were being used ran successfully. We didn&#8217;t want to have to respecify these every time we created a new project so we created a set of .targets files in a pre-specified location (c:msbuild_curtin in our case -we would check this folder out from source control so it could easily be updated; you could also use a shared network location to make it easier to keep up to date everywhere) that contained the configurations. That way we simply needed to create a single import directive in the .csproj (or .ccproj) that included the relevant .targets file and we were off and running.

The contents of these files will be outlined in the rest of the posts in this blog series.

## Build numbers

One of the things that is slightly annoying by having separate build configurations is that by default they all use different build numbers so it&#8217;s difficult to see at a glance what version of the software is deployed to each environment without looking at the build chains view. As it turns out, there are a <a href="http://confluence.jetbrains.net/display/TW/Autoincrementer" target="_blank">number</a> <a href="http://gorankvarv.blogspot.com.au/2011/11/continuous-delivery-with-psake-and_30.html" target="_blank">of</a> <a href="http://gorankvarv.blogspot.com.au/2012/02/continuous-delivery-with-psake-and.html" target="_blank">possible</a> ways to copy the build number from the first build configuration to the other configurations. I never got a chance to investigate this and figure out the best approach though.

## Harddrive space

One thing to keep in mind is that if you are including the deployment packages as artifacts on your builds (not to mention the build logs themselves!) the amount of harddrive space used by TeamCity can quickly add up. One of the cool things in TeamCity is that if you are logged in as an admin it will actually pop up a warning to tell you when the harddrive space is getting low. Regardless, there are options in the TeamCity admin to set up <a href="http://confluence.jetbrains.net/display/TCD7/Clean-Up" target="_blank">clean-up rules</a> that will automatically clean up artifacts and build history according to a specification of your choosing.

## Production database

One thing that isn&#8217;t immediately clear when using TeamCity is that by default it ships with a file-based database that isn&#8217;t recommended for production use. TeamCity can be configured to support any one of a [number of the most common database engines](http://confluence.jetbrains.net/display/TCD7/Setting+up+an+External+Database) though. I recommend that if you are using TeamCity seriously that you investigate that.

## Update 7 September 2012: Rollbacks

I realised that there was one thing I forgot to address in this post, which is the requirement I mentioned above about being able to rollback a production deployment to a previous one. It&#8217;s actually quite simple to do &#8211; all you need to do is go to your production deployment build configuration, click on the <a href="http://confluence.jetbrains.net/display/TCD7/Build+Chain" target="_blank">Build Chains</a> tab and inspect the chains to see which deployment was the last successful one. At that point you simply expand the chain and then click on the [<img class="alignnone size-full wp-image-423" title="TeamCity trigger previous build as custom build button" alt="TeamCity trigger previous build as custom build button" src="http://media.robdmoore.id.au/uploads/2012/09/custom_build1.png" width="14" height="14" />](http://media.robdmoore.id.au/uploads/2012/09/custom_build1.png) button to open the custom build dialog and then run it.