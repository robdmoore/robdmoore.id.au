---
layout: post
title: Testing AngularJS directives using Approval Tests
date: 2015-04-22 23:00:37.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- AngularJS
- JavaScript
- testing
meta:
  _oembed_a1048b7a0c455aa7c8dc1de973ae8cc2: "{{unknown}}"
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---

I recently had an application I was developing using AngularJS that contained a fair number of directives that were somewhat complex in that the logic that backed them was contained in services that called HTTP APIs. The intent was to provide a single JavaScript file that designers at the company I was working at could include and then build product pages using just HTML (via the directives). I needed to provide some confidence when making changes to the directives and pin down the behaviour.



As explained below, I ended up doing this via approval tests and I've published [how I did it on GitHub](https://github.com/robdmoore/angular-directive-approval-tests).


## Why I wanted to use Approval Tests


In order to test these directives I didn't want to have to perform tedious DOM inspection code to determine if the directives did what I wanted. Most AngularJS directive testing examples you will find on the Internet tell you to do this though, including the [official documentation](https://docs.angularjs.org/guide/unit-testing#testing-directives).



> Side note: in my research I stumbled across [the ng-directive-testing library](https://github.com/vojtajina/ng-directive-testing), which I feel is an improvement over most example code out there and if you do want to inspect the DOM as part of your testing I recommend you check it out.



This style of testing works fine for small, simple directives, but I felt would be tedious to write and fragile for my use case. Instead, I had an idea that I wanted to apply the [approval tests](http://approvaltests.com/) technique.



I use this technique when I have a blob of JSON, XML, HTML, text etc. that I want to verify is what I expect and pin it down without having to write tedious assertions against every aspect of it - hence this technique fitted in perfectly with what I wanted to achieve with testing the directives.


## How I did it


Given that directives need the DOM it was necessary to run the tests in a web browser. In this case I decided to do it via [Karma](https://github.com/karma-runner/karma) since I was already using Node JS to [uglify](https://github.com/mishoo/UglifyJS2) the JavaScript.



ApprovalTests requires access to the filesystem in order to write the approval files and then access to open processes on the computer to pop open a diff viewer if there is a difference in the output. This is not possible from the web browser. Thus, even though there is a [JavaScript port of ApprovalTests](https://github.com/approvals/Approvals.NodeJS) (for NodeJS) I wasn't able to use it directly in my tests.



While contemplating my options, it occured to me I could spin up a NodeJS server to run the approvals code and simply call it from the browser - it's not much different to how Karma gets test results. After that realisation I stumbled across [approvals-server](https://github.com/kristofferahl/approvals-server) - someone had already implemented it! Brilliant!



From there it was simply a matter of stitching up the code to all work together - in my case using Grunt as the Task Runner.


## Example code


To that end, I have [published a repository](https://github.com/robdmoore/angular-directive-approval-tests) with a contrived example that demonstrates how to test a directive using Approval Tests.



The main bits to look at are:


- `gruntfile.js` - contains the grunt configuration I used including my Grunt tasks for the approval server, which probably should be split into a separate file or published to npm (feel free to send me a PR)
- `app/spec/displayproducts.directive.spec.js` - contains the example test in all it's glory
- `app/test-helpers/approvals/myapp-display-products-should-output-product-information.approved.txt` - the approval file for the example test
- `app/test-helpers/approvals.js` - the code to get name of currently executing Jasmine 2 test and the code to send an approval to the approval server
- `app/test-helpers/heredoc.js` - a [heredoc](http://www.tuxradar.com/practicalphp/2/6/3) function to allow for easy specification of multi-line markup
- `app/test-helpers/directives.js` - the test code that compiles the directive, cleans it up for a nice diff and passes it to be verified


## Notable bits

### Style guide


If you are curious about why I wrote my Angular code the way I have it's because I'm following [John Papa's AngularJS style guide](https://github.com/johnpapa/angular-styleguide), which I think is very good and greatly improves maintainability of the resulting code.


### Taming karma


I managed to get the following working for Karma:


- Watch build that runs tests whenever a file changes - see the `karma:watch` and `dev` tasks
- Default build including tests - see the `karma:myApp` and `default` tasks
- A build that pops up a Chrome window to allow for debugging - see the `karma:debug` and `debugtests` takss


### Simultaneous approval server runs


I managed to allow for the `dev` task to be running while running `default` by including the `isPortTaken` code to determine if the approvals server port is already taken.



> Side note: if you are using this code across multiple projects consecutively then be careful because the approval server might be running from the other project. A way to avoid this would be to change the port per project (in both `gruntfile.js` and `approvals.js`.


### Improved approval performance on Windows


I found that the performance of the approvals library was [very slow on Windows](https://github.com/approvals/Approvals.NodeJS/issues/20), but with some assistance from the maintainers I worked out what the cause was and submitted a [pull request](https://github.com/approvals/Approvals.NodeJS/pull/27). The version in npm has been updated, but there are [currently no updates to approvals-server to use it](https://github.com/kristofferahl/approvals-server/issues/1). To overcome this I have used the `npm-shrinkwrap.json` file to [override](http://blog.nodejs.org/2012/02/27/managing-node-js-dependencies-with-shrinkwrap/) the version of the approvals library.


### Get currently running test name in Jasmine 2


I wanted the approval test output file to be automatically derived from the currently-running test name (similar to what happens on .NET). It turns out that is a lot harder to arhieve in Jasmine 2, but with some Googling/StackOverflowing I managed to get it working as per the code in the `approvals.js` file.


### Cleaning up the output markup for a good diff


AngularJS leaves a bunch of stuff in the resulting markup such as HTML comments, superfluous attributes and class names, etc. In order to remove all of this so the approved file is clean and in order to ensure the whitespace in the output is both easy to read and the same no matter what browser is being used I apply some modifications to the markup as seen in `directives.js`.


### Easily specifying multi-line test markup


I pulled in a heredoc function I found on StackOverflow as seen in `heredoc.js` and used in the example test, e.g.:


```javascript
    DirectiveFixture.verify(heredoc(function () {/*    
        <myapp-display-products category="car" product="car">
            <div>{{car.name}}</div>
        </myapp-display-products
    */}));
```


This is much nicer than having to concatenate one stirng per line or append a `\` character at the end of each line, both of which aren't handled nicely by the IDE I'm using.




