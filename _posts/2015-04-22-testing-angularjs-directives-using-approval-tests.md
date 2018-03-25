---
id: 5051
title: Testing AngularJS directives using Approval Tests
date: 2015-04-22T23:00:37+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=5051
permalink: /blog/2015/04/22/testing-angularjs-directives-using-approval-tests/
categories:
  - Technical
tags:
  - AngularJS
  - JavaScript
  - testing
---
<div>
  <p>
    I recently had an application I was developing using AngularJS that contained a fair number of directives that were somewhat complex in that the logic that backed them was contained in services that called HTTP APIs. The intent was to provide a single JavaScript file that designers at the company I was working at could include and then build product pages using just HTML (via the directives). I needed to provide some confidence when making changes to the directives and pin down the behaviour.
  </p>
  
  <p>
    As explained below, I ended up doing this via approval tests and I&#8217;ve published <a href="https://github.com/robdmoore/angular-directive-approval-tests" target="_blank">how I did it on GitHub</a>.
  </p>
  
  <h2>
    Why I wanted to use Approval Tests
  </h2>
  
  <p>
    In order to test these directives I didn&#8217;t want to have to perform tedious DOM inspection code to determine if the directives did what I wanted. Most AngularJS directive testing examples you will find on the Internet tell you to do this though, including the <a href="https://docs.angularjs.org/guide/unit-testing#testing-directives" target="_blank">official documentation</a>.
  </p>
  
  <blockquote>
    <p>
      Side note: in my research I stumbled acrossÂ <a href="https://github.com/vojtajina/ng-directive-testing" target="_blank">the ng-directive-testing library</a>, which I feel is an improvement over most example code out there and if you do want to inspect the DOM as part of your testing I recommend you check it out.
    </p>
  </blockquote>
  
  <p>
    This style of testing works fine for small, simple directives, but I felt would be tedious to write and fragile for my use case. Instead, I had an idea that I wanted to apply the <a href="http://approvaltests.com/" target="_blank">approval tests</a> technique.
  </p>
  
  <p>
    I use this technique when I have a blob of JSON, XML, HTML, text etc. that I want to verify is what I expect and pin it down without having to write tedious assertions against every aspect of it &#8211; hence this techniqueÂ fitted in perfectly with what I wanted to achieve with testing the directives.
  </p>
  
  <h2>
    How I did it
  </h2>
  
  <p>
    Given that directives need the DOM it was necessary to run the tests in a web browser. In this case I decided to do it via <a href="https://github.com/karma-runner/karma" target="_blank">Karma</a> since I was already using Node JS to <a href="https://github.com/mishoo/UglifyJS2" target="_blank">uglify</a> the JavaScript.
  </p>
  
  <p>
    ApprovalTests requires access to the filesystem in order to write the approval files and then access to open processes on the computer to pop open a diff viewer if there is a difference in the output. This is not possible from the web browser. Thus, even though there is a <a href="https://github.com/approvals/Approvals.NodeJS" target="_blank">JavaScript port of ApprovalTests</a> (for NodeJS) I wasn&#8217;t able to use it directly in my tests.
  </p>
  
  <p>
    While contemplating my options, it occured to me I could spin up a NodeJS server to run the approvals code and simply call it from the browser &#8211; it&#8217;s not much different to how Karma gets test results. After that realisation I stumbled across <a href="https://github.com/kristofferahl/approvals-server" target="_blank">approvals-server</a> &#8211; someone had already implemented it! Brilliant!
  </p>
  
  <p>
    From there it was simply a matter of stitching up the code to all work together &#8211; in my case using Grunt as the Task Runner.
  </p>
  
  <h2>
    Example code
  </h2>
  
  <p>
    To that end, I have <a href="https://github.com/robdmoore/angular-directive-approval-tests" target="_blank">published a repository</a> with a contrived example that demonstrates how to test a directive using Approval Tests.
  </p>
  
  <p>
    The main bits to look at are:
  </p>
  
  <ul>
    <li>
      <code>gruntfile.js</code> &#8211; contains the grunt configuration I used including my Grunt tasks for the approval server, which probably should be split into a separate file or published to npm (feel free to send me a PR)
    </li>
    <li>
      <code>app/spec/displayproducts.directive.spec.js</code> &#8211; contains the example test in all it&#8217;s glory
    </li>
    <li>
      <code>app/test-helpers/approvals/myapp-display-products-should-output-product-information.approved.txt</code> &#8211; the approval file for the example test
    </li>
    <li>
      <code>app/test-helpers/approvals.js</code> &#8211; the code to get name of currently executing Jasmine 2 test and the code to send an approval to the approval server
    </li>
    <li>
      <code>app/test-helpers/heredoc.js</code> &#8211; a <a href="http://www.tuxradar.com/practicalphp/2/6/3" target="_blank">heredoc</a> function to allow for easy specification of multi-line markup
    </li>
    <li>
      <code>app/test-helpers/directives.js</code> &#8211; the test code that compiles the directive, cleans it up for a nice diff and passes it to be verified
    </li>
  </ul>
  
  <h2>
    Notable bits
  </h2>
  
  <h3>
    Style guide
  </h3>
  
  <p>
    If you are curious about why I wrote my Angular code the way I have it&#8217;s because I&#8217;m following <a href="https://github.com/johnpapa/angular-styleguide" target="_blank">John Papa&#8217;s AngularJS style guide</a>, which I think is very good and greatly improves maintainability of the resulting code.
  </p>
  
  <h3>
    Taming karma
  </h3>
  
  <p>
    I managed to get the following working for Karma:
  </p>
  
  <ul>
    <li>
      Watch build that runs tests whenever a file changes &#8211; see the <code>karma:watch</code> and <code>dev</code> tasks
    </li>
    <li>
      DefaultÂ build including tests &#8211; see the <code>karma:myApp</code> and <code>default</code> tasks
    </li>
    <li>
      A build that pops up a Chrome window to allow for debugging &#8211; see the <code>karma:debug</code> and <code>debugtests</code> takss
    </li>
  </ul>
  
  <h3>
    Simultaneous approval server runs
  </h3>
  
  <p>
    I managed to allow for the <code>dev</code> task to be running while running <code>default</code> by including the <code>isPortTaken</code> code to determine if the approvals server port is already taken.
  </p>
  
  <blockquote>
    <p>
      Side note: if you are using this code across multiple projects consecutively then be careful because the approval server might be running from the other project. A way to avoid this would be to change the port per project (in both <code>gruntfile.js</code> and <code>approvals.js</code>.
    </p>
  </blockquote>
  
  <h3>
    Improved approval performance on Windows
  </h3>
  
  <p>
    I found that the performance of the approvals library was <a href="https://github.com/approvals/Approvals.NodeJS/issues/20" target="_blank">very slow on Windows</a>, but with some assistance from the maintainers I worked out what the cause was and submitted a <a href="https://github.com/approvals/Approvals.NodeJS/pull/27" target="_blank">pull request</a>. The version in npm has been updated, but there are <a href="https://github.com/kristofferahl/approvals-server/issues/1" target="_blank">currently no updates to approvals-server to use it</a>. To overcome this I have used the <code>npm-shrinkwrap.json</code> file to <a href="http://blog.nodejs.org/2012/02/27/managing-node-js-dependencies-with-shrinkwrap/" target="_blank">override</a> the version of the approvals library.
  </p>
  
  <h3>
    Get currently running test name in Jasmine 2
  </h3>
  
  <p>
    I wanted the approval test output file to be automatically derived from the currently-running test name (similar to what happens on .NET). It turns out that is a lot harder to arhieve in Jasmine 2, but with some Googling/StackOverflowing I managed to get it working as per the code in the <code>approvals.js</code> file.
  </p>
  
  <h3>
    Cleaning up the output markup for a good diff
  </h3>
  
  <p>
    AngularJS leaves a bunch of stuff in the resulting markup such as HTML comments, superfluous attributes and class names, etc. In order to remove all of this so the approved file is clean and in order to ensure the whitespace in the output is both easy to read and the same no matter what browserÂ is being used I apply someÂ modifications to the markup as seen in <code>directives.js</code>.
  </p>
  
  <h3>
    Easily specifying multi-line test markup
  </h3>
  
  <p>
    I pulled in a heredoc function I found on StackOverflow as seen in <code>heredoc.js</code> and used in the example test, e.g.:
  </p>
  
  <pre><code>DirectiveFixture.verify(heredoc(function () {/*    
    &lt;myapp-display-products category="car" product="car"&gt;
        &lt;div&gt;{{car.name}}&lt;/div&gt;
    &lt;/myapp-display-products&gt;
*/}));
</code></pre>
  
  <p>
    This is much nicer than having to concatenate one stirng per line or append a <code>\</code> character at the end of each line, both of which aren&#8217;t handled nicely by the IDE I&#8217;m using.
  </p>
</div>

&nbsp;