---
id: 3961
title: Announcing AspNet.Mvc.Grid
date: 2014-08-19T20:04:31+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=3961
permalink: /blog/2014/08/19/announcing-aspnet-mvc-grid/
categories:
  - Technical
tags:
  - ASP.NET MVC
  - 'C#'
  - razor
---
Whenever I need to display tables of data in an ASP.NET MVC application I end up pulling in the <a href="http://mvccontrib.codeplex.com/" target="_blank">MVCContrib</a> library to use its <a href="http://mvccontrib.codeplex.com/wikipage?title=Grid" target="_blank">Grid Helper</a>.

The Grid helper is really cool, it allows you to take a class like:

<pre class="brush: csharp; title: ; notranslate" title="">public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
}
</pre>

And create a Razor view like the following (including appending some <a href="http://getbootstrap.com/" target="_blank">Bootstrap</a> classes):

<pre class="brush: csharp; title: ; notranslate" title="">@model IEnumerable&lt;Person&gt;

&lt;h1&gt;Person List&lt;/h1&gt;

@Html.Grid(Model).Columns(cb =&gt;
{
    cb.For(p =&gt; Html.ActionLink(p.Name, "Detail", "People", new {p.Id}, null)).Named("Name");
    cb.For(p =&gt; p.Email);
    cb.For(p =&gt; p.DateOfBirth);

}).Attributes(@class =&gt; "table table-striped table-hover table-condensed").HeaderRowAttributes(new Dictionary&lt;string, object&gt; { { "class", "active" } })
</pre>

This will then output HTML like the following:

<pre class="brush: xml; title: ; notranslate" title="">&lt;h1&gt;Person List&lt;/h1&gt;
&lt;table class="table table-striped table-hover table-condensed"&gt;
   &lt;thead&gt;
      &lt;tr class="active"&gt;
         &lt;th&gt;Name&lt;/th&gt;
         &lt;th&gt;Email&lt;/th&gt;
         &lt;th&gt;Date Of Birth&lt;/th&gt;
      &lt;/tr&gt;
   &lt;/thead&gt;
   &lt;tbody&gt;
      &lt;tr class="gridrow"&gt;
         &lt;td&gt;&lt;a href="/People/Detail/1"&gt;Name1&lt;/a&gt;&lt;/td&gt;
         &lt;td&gt;Email1&lt;/td&gt;
         &lt;td&gt;19/08/2014 12:00:00 AM&lt;/td&gt;
      &lt;/tr&gt;
      &lt;tr class="gridrow_alternate"&gt;
         &lt;td&gt;&lt;a href="/People/Detail/2"&gt;Name2&lt;/a&gt;&lt;/td&gt;
         &lt;td&gt;Email2&lt;/td&gt;
         &lt;td&gt;20/08/2014 12:00:00 AM&lt;/td&gt;
      &lt;/tr&gt;
      &lt;tr class="gridrow"&gt;
         &lt;td&gt;&lt;a href="/People/Detail/3"&gt;Name3&lt;/a&gt;&lt;/td&gt;
         &lt;td&gt;Email3&lt;/td&gt;
         &lt;td&gt;21/08/2014 12:00:00 AM&lt;/td&gt;
      &lt;/tr&gt;
   &lt;/tbody&gt;
&lt;/table&gt;
</pre>

This means you don&#8217;t have to render out the nasty, tedious table HTML, it takes care of creating the `thead` and `tbody` for you, it&#8217;s type safe (thanks Razor!) and there are some sensible defaults that save you time (like inferring the `th` title from the property name).

## The problem with MvcContrib

There is however a few big problems with MvcContrib &#8211; it&#8217;s not really kept very maintainedÂ and it contains A LOT of bloat in there for stuff you will never need (andÂ frankly shouldn&#8217;t use).

To be honest, out of everything in there the Grid is the only thing I would touch.

It does actually have an MVC5 package, but it contains a reference to Mvc4Futures and this can actually have a really bad impact if you are using MVC5 due to one of the breaking changes in MVC5. If you have code that is assembly scanning the current AppDomain for instance then you will soon come across this error:

> Inheritance security rules violated while overriding member: &#8216;Microsoft.Web.Mvc.CreditCardAttribute.GetClientValidationRules(System.Web.Mvc.ModelMetadata, System.Web.Mvc.ControllerContext)&#8217;. Security accessibility of the overriding method must match the security accessibility of the method being overriden.

## Creating AspNet.Mvc.Grid

Given that roadblock on a currentÂ project, and given I don&#8217;t really want to pull in all the bloat of MvcContrib I decided toÂ pull out the Grid code from MvcContrib and put it into it&#8217;s own library that targets .NET 4.5 and MVC 5. This is allowed under the Apache 2.0 license the MvcContrib code is licensed for.

Hence, I&#8217;d like to announce the <a href="https://github.com/MRCollective/AspNet.Mvc.Grid" target="_blank">AspNet.Mvc.Grid</a> library! It has been published to <a href="https://www.nuget.org/packages/aspnet.mvc.grid" target="_blank">NuGet</a> as per usual.

The only difference you will notice between it and MvcContrib is that the namespaces are different. This was a conscious decision to make the library less confusing for completely new users.

Enjoy!