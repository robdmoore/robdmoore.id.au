---
layout: post
title: Deployment and Development using PhoneGap Build for a Cordova/PhoneGap app
date: 2014-07-28 22:47:14.000000000 +08:00
type: post
categories:
- Technical
tags:
- JavaScript
- NuGet
- PhoneGap
- powershell
author: rob
---


I recently worked on a project to build a mobile app in iOS and Android. The team decided to use [Cordova](http://cordova.apache.org/) and [Ionic Framework](http://ionicframework.com/) to build it. I highly recommend Ionic - it's an amazingly productive and feature-rich framework with a really responsive development team! It enabled us to use AngularJS (and the application structure and maintenance advantages that affords) and really sped up the development time in a number of ways. We were also able to get an almost-native performance experience for the application using features like [collection repeat](http://ionicframework.com/docs/api/directive/collectionRepeat/) (virtualised list) as well as the in-built performance tuning the Ionic team have performed.



When it was time to set up an automated build pipeline we settled on using [PhoneGap Build](https://build.phonegap.com/) and its [API](http://docs.build.phonegap.com/en_US/developer_api_api.md.html) which we then called from [OctopusDeploy](https://octopusdeploy.com/) as part of a NuGet package we created.



[PhoneGap Build](https://build.phonegap.com/) is Adobe's cloud build service that can build iOS, Android, Windows Phone etc. apps for you based on a zip file with your [Cordova](http://cordova.apache.org/)/[PhoneGap](http://phonegap.com/) files.



We decided on PhoneGap Build because:


- It has been around a while (i.e. it's relatively mature)
- It's backed by a big name (Adobe)
- It has a decent API
- It meant we didn't have to set up a Mac server, which would have been a pain
- It's free for a single project :)



This post covers how we set up our automated deployment pipeline for our native apps using OctopusDeploy and PhoneGap Build. I have also published a [companion post that covers everything you need to know about PhoneGap Build](https://msgooroo.com/GoorooTHINK/Article/16193/Creating-and-deploying-hybrid-mobile-apps-using-PhoneGap-Build) (read: what I wish I knew before I started using PhoneGap Build because it's darn confusing!).


## Deployment pipeline


This is the deployment pipeline we ended up with:


1. Developer commits a change, submits a pull request and that pull request gets merged
2. Our TeamCity continuous integration server compiles the server-side code, runs server-side code tests and runs client-side (app) tests
3. If all is well then a NuGet package is created for the server-side code and a NuGet package is created for the app - both are pushed to OctopusDeploy and the server-side code is deployed to a staging environment (including a web server version of the app)
  - Native functionality wouldn't work, but you could access and use the bulk of the app to test it out
  - To test native functionality developers could easily manually provision a staging version of the app if they plugged a phone into their computer via a USB cable and executed a particular script
4. The product owner logs into OctopusDeploy and promotes the app to production from staging whereupon OctopusDeploy would:
  - Deploy the server-side code to the production environment
  - Use the PhoneGap Build API to build an iOS version with an [over-the-air compatible provisioning profile](http://aaronparecki.com/articles/2011/01/21/1/how-to-distribute-your-ios-apps-over-the-air)
  - Download the over-the-air `.ipa`
    - Upload this `.ipa` to Azure blob storage
    - Beta testers could then download the latest version by visiting a html page linking to the package (see below for details)
  - Build the production Android and iOS versions of the app using the PhoneGap Build API
5. The product owner then logs on to the PhoneGap Build site, downloads the `.ipa` / `.apk` files and uploads them to the respective app stores


### End result


I personally wasn't completely satisfied with this because I didn't like the manual step at the end, however, apparently app store deployments are stuck in the 90s so unless you want to screen-scrape the respective app stores you have to manually log in and upload the deployment file. Regardless, the end result was good:


- Production deployments were the same binaries/content that were tested on the CI server and that had been successfully deployed and manually tested in the staging environment
- We could go from developer commit to production in a few minutes (ignoring app store approval/roll-out times; remember - stuck in the 90s)
- The product owner had complete control to deploy any version of the app he wanted to and it was easy for him to do so


### How we did it


I have published the NodeJS script we used to automate the PhoneGap Build API to a [Gist](https://gist.github.com/robdmoore/c09cb5f8aa7682f195c1). It contains a very reusable wrapper around a PhoneGap Build API NodeJS library that makes it dead easy to write your own workflow in a very succinct manner.



To generate the zip file the NodeJS script used we simply grabbed the `www` directory (including `config.xml`) from our repository and zipped it up. That zip file and the NodeJS scripts went into the NuGet package that OctopusDeploy deployed when the app was promoted to production (we made this happen on a Tentacle residing on the OctopusDeploy server). I have published how we generated that NuGet package to a [Gist](https://gist.github.com/robdmoore/32a34852cef6607850c2) as well (including how to set up over-the-air).


### Further notes


Some notes about our approach:


- Because we were able to make our backend apis deploy to production at the same time as generating our production app packages we were assured that the correct version of the backend was always available when the apps were deployed to the respective app stores.
- It was important for us to make sure that our backend api didn't have any breaking changes otherwise existing app deployments (and any lingering ones where people haven't updated) would break - usual API management/versioning practices apply.
- Whenever we wanted to add new Beta testers the provisioning profile for over-the-air needed to be re-uploaded to PhoneGap Build
  - Unfortunately, PhoneGap Build requires you upload this alongside the private key - thus requiring someone with access to PhoneGap Build, the private key and the iOS developer account - it's actually quite a convoluted process so I've also published the instructions we provided to the person responsible for managing the Beta testing group to a [Gist](https://gist.github.com/robdmoore/3b260de9aa066f332537) to illustrate
- We stored the passwords for the Android Keystore and iOS private keys as [sensitive variables in OctopusDeploy](http://docs.octopusdeploy.com/display/OD/Variables#Variables-Sensitivevariables) so nobody needed to ever see them after they had been generated and stored in a password safe
  - This meant the only secret that was ever exposed on a regular basis was the password-protected over-the-air private key whenever a Beta tester was added


### TestFlight


While we didn't use it, it's worth pointing out [TestFlight](https://www.testflightapp.com/). It's a free service that gives you the [ability](http://help.testflightapp.com/customer/portal/articles/1352859-getting-started-as-a-developer) to more easily keep track of a list of testers, their UUIDs, informing them of updates and automatically creating and hosting the necessary files for over-the-air. It contains an API that allows you to upload your `.ipa` to and it should be simple enough to take the scripts I published above and upload a `.ipa` to TestFlight rather than Azure Blob Storage if you are interested in doing that.


## Final Thoughts


PhoneGap Build is a useful and powerful service. As outlined in my companion post, it's very different to Cordova/PhoneGap locally and this, combined with confusing documentation, resulted in me growing a strong dislike of PhoneGap Build while using it.



In writing my companion post however, I've been forced to understand it a lot more and I now think that as long as you have weighed up the pros and cons and still feel it's the right fit then it's a useful service and shouldn't be discounted outright.

