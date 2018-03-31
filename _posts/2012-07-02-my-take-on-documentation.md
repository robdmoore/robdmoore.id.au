---
layout: post
title: My take on documentation
date: 2012-07-02 23:12:28.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- Agile
- dev ops
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


I usually like to keep documentation for a project within OneNote due to the fact it's really simple and easy to use (especially for dragging in attachments and images!), has first class integration with the Office suite and can be easily synced between team members by hosting the OneNote file in SharePoint or Windows Live. Second to that, I like to store relevant documentation alongside the code in source control so it is versioned and it encourages you to keep it up to date because it is "in your face"; this would normally consist of text-based documentation such as Markdown files. Wikis are also a reasonable option.



One of the things I think is often misunderstood about Agile is a perception that if you are doing Agile then you don't need documentation. My take on it is that you should at any point in time focus on activities that deliver the maximum value. That means that if you are spending time writing superfluous documentation that won't provide any value then it's a waste of time. That doesn't mean that all documentation doesn't provide value though; on the contrary, documentation is really important. If there is insufficient documentation for an application then how can a support team be expected to support that application? Similarly, a lack of documentation is a problem if someone is completely new to an application and don't know where to start looking or know any of the important background information behind it. Documentation plays an important role in the maintainability of any solution.



I see documentation of a system as a combination of:


- The code itself - thus making it important that code is written in such a way that it is as readable as possible and the intent of the code clear, it also means sections of the code that are hard to read / complex / non-standard should be annotated with comments and in the interest of keeping the code as terse and quick to read as possible leaving comments out of the self-explanatory parts of the code. As an extension of this, I only see it as necessary to add xml-doc comments to interfaces that are used across an application and any public classes in a shared library.
- The tests - the tests should be an expression of your intent on the design of the system and thus should be able to form a part of the documentation of a system.
- Other *appropriate* documentation - by appropriate I mean that the format the documentation is in is the most optimal format for the "thing" being documented. For instance, the documentation to specify a report that needs to be created should probably be a sample Excel file of the report (which is going to be a lot easier, more expressive and more understandable than a chunk of text to describe the report).



I also think it's important to tailor documentation to the audience; the documentation doesn't provide value unless it's accessible and understandable to the people that need to read it.





