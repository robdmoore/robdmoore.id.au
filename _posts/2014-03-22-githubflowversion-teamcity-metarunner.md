---
layout: post
title: GitHubFlowVersion TeamCity MetaRunner
date: 2014-03-22 18:22:05.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- TeamCity
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


The other day I created a [TeamCity Meta Runner](http://blog.jetbrains.com/teamcity/2013/07/the-power-of-meta-runner-custom-runners-with-ease/) that allows you to run GitHubFlowVersion against an MSBuild file. I thought I'd share it because it's cool and demonstrates how powerful this new TeamCity feature is.



If you want to see more Meta Runners check out the [GitHub repository](https://github.com/JetBrains/meta-runner-power-pack) that Jetbrains has created.



Disclaimer: this runner doesn't expose all of the options of GitHubFlowVersion.



```xml
<?xml version="1.0" encoding="UTF-8"?>
<meta-runner name="Run Solution using GitHubVersion">
  <description>Run Solution using GitHubVersion</description>
  <settings>
    <parameters>
      <param name="mr.GitHubFlowVersion.SolutionFile" value="" spec="text description='The .sln file relative to the working directory (or any MSBuild file).' display='normal' label='Solution (.sln):' validationMode='notempty'" />
    </parameters>
    <build-runners>
      <runner id="RUNNER_14" name="" type="Ant">
        <parameters>
          <param name="build-file">
          <![CDATA[
            <project name="MetaRunner">
              <property name="mr.GitHubFlowVersion.Version" value="1.3.2" />
              <target name="downloadGitHubFlowVersion">
                <echo>Downloading and extracting latest GitHubFlowVersion.exe...</echo>
                <exec executable="%teamcity.tool.NuGet.CommandLine.DEFAULT.nupkg%\tools\NuGet.exe" dir="${teamcity.build.tempDir}" failonerror="true">
                  <arg line="install GitHubFlowVersion -Version ${mr.GitHubFlowVersion.Version} -OutputDirectory &quot;${teamcity.build.tempDir}\packages&quot;"/>
                </exec>
                <echo>Downloaded and extracted latest GitHubFlowVersion.exe.</echo>
              </target>
              <target name="run" depends="downloadGitHubFlowVersion">
                <echo>Running GitHubFlowVersion.exe...</echo>
                <exec executable="${teamcity.build.tempDir}\packages\GitHubFlowVersion.${mr.GitHubFlowVersion.Version}\tools\GitHubFlowVersion.exe" dir="${teamcity.build.workingDir}" failonerror="true">
			<arg line="/WorkingDirectory &quot;${teamcity.build.workingDir}&quot; /UpdateAssemblyInfo /ProjectFile=&quot;${mr.GitHubFlowVersion.SolutionFile}&quot;"/>
                </exec>
                <echo>Finished running GitHubFlowVersion.exe.</echo>
              </target>
            </project>
          ]]>
          </param>
          <param name="build-file-path" value="build.xml" />
          <param name="target" value="run" />
          <param name="teamcity.coverage.emma.include.source" value="true" />
          <param name="teamcity.coverage.emma.instr.parameters" value="-ix -*Test*" />
          <param name="teamcity.coverage.idea.includePatterns" value="*" />
          <param name="teamcity.step.mode" value="default" />
          <param name="use-custom-build-file" value="true" />
        </parameters>
      </runner>
    </build-runners>
    <requirements />
  </settings>
</meta-runner>
```

