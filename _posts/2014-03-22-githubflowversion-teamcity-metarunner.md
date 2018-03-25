---
id: 3041
title: GitHubFlowVersion TeamCity MetaRunner
date: 2014-03-22T18:22:05+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3041
permalink: /blog/2014/03/22/githubflowversion-teamcity-metarunner/
categories:
  - Technical
tags:
  - TeamCity
---
The other day I created a <a href="http://blog.jetbrains.com/teamcity/2013/07/the-power-of-meta-runner-custom-runners-with-ease/" target="_blank">TeamCity Meta Runner</a> that allows you to run GitHubFlowVersion against an MSBuild file. I thought I&#8217;d share it because it&#8217;s cool and demonstrates how powerful this new TeamCity feature is.

If you want to see more Meta Runners check out the <a href="https://github.com/JetBrains/meta-runner-power-pack" target="_blank">GitHub repository</a> that Jetbrains has created.

Disclaimer: this runner doesn&#8217;t expose all of the options of GitHubFlowVersion.

<pre class="brush: xml; title: ; notranslate" title="">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;meta-runner name="Run Solution using GitHubVersion"&gt;
  &lt;description&gt;Run Solution using GitHubVersion&lt;/description&gt;
  &lt;settings&gt;
    &lt;parameters&gt;
      &lt;param name="mr.GitHubFlowVersion.SolutionFile" value="" spec="text description='The .sln file relative to the working directory (or any MSBuild file).' display='normal' label='Solution (.sln):' validationMode='notempty'" /&gt;
    &lt;/parameters&gt;
    &lt;build-runners&gt;
      &lt;runner id="RUNNER_14" name="" type="Ant"&gt;
        &lt;parameters&gt;
          &lt;param name="build-file"&gt;
          &lt;![CDATA[
            &lt;project name="MetaRunner"&gt;
              &lt;property name="mr.GitHubFlowVersion.Version" value="1.3.2" /&gt;
              &lt;target name="downloadGitHubFlowVersion"&gt;
                &lt;echo&gt;Downloading and extracting latest GitHubFlowVersion.exe...&lt;/echo&gt;
                &lt;exec executable="%teamcity.tool.NuGet.CommandLine.DEFAULT.nupkg%\tools\NuGet.exe" dir="${teamcity.build.tempDir}" failonerror="true"&gt;
                  &lt;arg line="install GitHubFlowVersion -Version ${mr.GitHubFlowVersion.Version} -OutputDirectory &quot;${teamcity.build.tempDir}\packages&quot;"/&gt;
                &lt;/exec&gt;
                &lt;echo&gt;Downloaded and extracted latest GitHubFlowVersion.exe.&lt;/echo&gt;
              &lt;/target&gt;
              &lt;target name="run" depends="downloadGitHubFlowVersion"&gt;
                &lt;echo&gt;Running GitHubFlowVersion.exe...&lt;/echo&gt;
                &lt;exec executable="${teamcity.build.tempDir}\packages\GitHubFlowVersion.${mr.GitHubFlowVersion.Version}\tools\GitHubFlowVersion.exe" dir="${teamcity.build.workingDir}" failonerror="true"&gt;
			&lt;arg line="/WorkingDirectory &quot;${teamcity.build.workingDir}&quot; /UpdateAssemblyInfo /ProjectFile=&quot;${mr.GitHubFlowVersion.SolutionFile}&quot;"/&gt;
                &lt;/exec&gt;
                &lt;echo&gt;Finished running GitHubFlowVersion.exe.&lt;/echo&gt;
              &lt;/target&gt;
            &lt;/project&gt;
          ]]&gt;
          &lt;/param&gt;
          &lt;param name="build-file-path" value="build.xml" /&gt;
          &lt;param name="target" value="run" /&gt;
          &lt;param name="teamcity.coverage.emma.include.source" value="true" /&gt;
          &lt;param name="teamcity.coverage.emma.instr.parameters" value="-ix -*Test*" /&gt;
          &lt;param name="teamcity.coverage.idea.includePatterns" value="*" /&gt;
          &lt;param name="teamcity.step.mode" value="default" /&gt;
          &lt;param name="use-custom-build-file" value="true" /&gt;
        &lt;/parameters&gt;
      &lt;/runner&gt;
    &lt;/build-runners&gt;
    &lt;requirements /&gt;
  &lt;/settings&gt;
&lt;/meta-runner&gt;
</pre>