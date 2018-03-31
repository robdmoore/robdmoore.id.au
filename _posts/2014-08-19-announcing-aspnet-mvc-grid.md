---
layout: post
title: Announcing AspNet.Mvc.Grid
date: 2014-08-19 20:04:31.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- razor
author: rob
---


Whenever I need to display tables of data in an ASP.NET MVC application I end up pulling in the [MVCContrib](http://mvccontrib.codeplex.com/) library to use its [Grid Helper](http://mvccontrib.codeplex.com/wikipage?title=Grid).



The Grid helper is really cool, it allows you to take a class like:



```csharp
public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
}
```



And create a Razor view like the following (including appending some [Bootstrap](http://getbootstrap.com/) classes):



```csharp
@model IEnumerable<Person>
<h1>Person List</h1>
@Html.Grid(Model).Columns(cb =>
{
    cb.For(p => Html.ActionLink(p.Name, "Detail", "People", new {p.Id}, null)).Named("Name");
    cb.For(p => p.Email);
    cb.For(p => p.DateOfBirth);
}).Attributes(@class => "table table-striped table-hover table-condensed").HeaderRowAttributes(new Dictionary<string, object> { { "class", "active" } })
```



This will then output HTML like the following:



```html
<h1>Person List</h1>
<table class="table table-striped table-hover table-condensed">
   <thead>
      <tr class="active">
         <th>Name</th>
         <th>Email</th>
         <th>Date Of Birth</th>
      </tr>
   </thead>
   <tbody>
      <tr class="gridrow">
         <td><a href="/People/Detail/1">Name1</a></td>
         <td>Email1</td>
         <td>19/08/2014 12:00:00 AM</td>
      </tr>
      <tr class="gridrow_alternate">
         <td><a href="/People/Detail/2">Name2</a></td>
         <td>Email2</td>
         <td>20/08/2014 12:00:00 AM</td>
      </tr>
      <tr class="gridrow">
         <td><a href="/People/Detail/3">Name3</a></td>
         <td>Email3</td>
         <td>21/08/2014 12:00:00 AM</td>
      </tr>
   </tbody>
</table>
```



This means you don't have to render out the nasty, tedious table HTML, it takes care of creating the `thead` and `tbody` for you, it's type safe (thanks Razor!) and there are some sensible defaults that save you time (like inferring the `th` title from the property name).


## The problem with MvcContrib


There is however a few big problems with MvcContrib - it's not really kept very maintained and it contains A LOT of bloat in there for stuff you will never need (and frankly shouldn't use).



To be honest, out of everything in there the Grid is the only thing I would touch.



It does actually have an MVC5 package, but it contains a reference to Mvc4Futures and this can actually have a really bad impact if you are using MVC5 due to one of the breaking changes in MVC5. If you have code that is assembly scanning the current AppDomain for instance then you will soon come across this error:



> Inheritance security rules violated while overriding member: 'Microsoft.Web.Mvc.CreditCardAttribute.GetClientValidationRules(System.Web.Mvc.ModelMetadata, System.Web.Mvc.ControllerContext)'. Security accessibility of the overriding method must match the security accessibility of the method being overriden.


## Creating AspNet.Mvc.Grid


Given that roadblock on a current project, and given I don't really want to pull in all the bloat of MvcContrib I decided to pull out the Grid code from MvcContrib and put it into it's own library that targets .NET 4.5 and MVC 5. This is allowed under the Apache 2.0 license the MvcContrib code is licensed for.



Hence, I'd like to announce the [AspNet.Mvc.Grid](https://github.com/MRCollective/AspNet.Mvc.Grid) library! It has been published to [NuGet](https://www.nuget.org/packages/aspnet.mvc.grid) as per usual.



The only difference you will notice between it and MvcContrib is that the namespaces are different. This was a conscious decision to make the library less confusing for completely new users.



Enjoy!

