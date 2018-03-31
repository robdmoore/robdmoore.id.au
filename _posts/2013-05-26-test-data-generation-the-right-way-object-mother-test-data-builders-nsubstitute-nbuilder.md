---
layout: post
title: 'Test Data Generation the right way: Object Mother + Test Data Builders + NSubstitute
  + NBuilder'
date: 2013-05-26 00:01:21.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- consistency
- mocking
- NSubstitute
- Software Engineering
- testing
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


Generating test data for automated testing is an area that I have noticed can get very, very tedious when your application gets more and more complex. More importantly, it's an area that I have noticed results in hard-to-maintain test logic. If you are a proponent of treating test code with the same importance of production code like I am, then you will want to refactor your test logic to make it more simple, maintainable and DRY.



In my last two projects I have been working with my team to come up with a good solution for this problem and I'm pretty stoked with what we've got so far. While I certainly had my hand in the end result, I certainly can't claim all of the credit - far from it! Big props to my team mates [Matt Kocaj](https://twitter.com/mattkocaj) and [Poya Manouchehri](https://twitter.com/GamesForSoul) for significant contributions to this.


# Newing up objects everywhere


If you organically grow your automated test suite without thinking about how you are generating your test data then it's likely you will end up with a lot of tests that have arrange sections full of object instantiation, and these sections are likely to get more and more complex as your object model gets complex (what if you need to have a customer that has 3 orders, each with 3 products?).



If you are diligent with refactoring your tests then you will likely start pulling out common instantiations to private methods (or similar), but even then you are likely to notice the following patterns start to emerge:


- If you need to change the constructor of one of your classes there will be many, many instantiations using that constructor across your test project and so that refactor becomes a pain (and you are likely to do hacks like add default values that you wouldn't otherwise when adding new parameters to make it easier).
- There is likely to be a lot of repetition across different test classes in the objects that are created.
- Building lists is really verbose and will likely feature a lot of repetition / hard-to-read code.
  - You can bring in libraries like [NBuilder](http://nbuilder.org/) to make this easier and more readable.
  - You can't use the best parts of NBuilder if you are not using public property setters so you can enforce domain invariants.
- Your approach to generating data will be largely inconsistent across test classes - some will have private methods, some will do it inline, some might delegate to factories or helper classes etc. - this makes the code [hard to understand and maintain](http://robdmoore.id.au/blog/2012/09/01/consistency-maintainability/ "Consistency == Maintainability").
- It's not immediately clear which of the parameters you are passing into the constructor are there to meet the requirements of the call and which are there because the test dictates it - this means the intent of your test is somewhat obscured


# Object Mother


A good approach to start to address the problem is to implement the [Object Mother pattern](http://martinfowler.com/bliki/ObjectMother.html). This allows you to quickly and tersely create pre-canned objects and give them a descriptive name. Now instead of having complex chains of object instantiations you have one line of code (e.g. `ObjectMother.CustomerWith3FilledOrders`), which is a lot more descriptive and your tests become simpler as a result. This also helps ensure that your approach for data generation is consistent, and thus more maintainable.



If you just use Object Mother though, you will likely observe the following problems:


- While your constructor calls are likely to be in one file now, there is still potentially a lot of calls so it's still tricky to make constructor changes.
- As soon as you have a small tweak needed for the data returned there is a tendency to simply create a new Object Mother property.
- Because of this, the Object Mother class can quickly get unwieldy and a nightmare to maintain and understand - it becomes a god object of sorts.


# Test Data Builder


An approach that seems to have stemmed from the Object Mother pattern is the application of the [builder pattern](http://rwhansen.blogspot.com.au/2007/07/theres-builder-pattern-that-joshua.html) to result in the [Test Data Builder pattern](http://nat.truemesh.com/archives/000714.html). This involves creating a builder class responsible for creating a particular type of object via a fluent interface that keeps track of the desired state of the object being built before being asked to actually build the object.



This provides a number of advantages:


- Your constructor calls will be in your test project once only making them easy to change.
- You have a readable, discoverable, fluent interface to generate your objects making your tests easy to read/write/maintain.
- You are consistent in how you generate your test data.
- It works with objects that you don't have public property setters for since there is an explicit build action, which can invoke the constructor with the parameters you have set.
- It's flexible enough to give you the ability to express and perform actions to your object after it's constructed - e.g. specify that an order is paid (which might be a `Pay()` method rather than a constructor parameter; you wouldn't expect to be able to create an order in the paid state!).
- Because of this your builder objects provide a blueprint / documentation for how to interact with your domain objects.
- The test data builder can contain sensible defaults for your object instantiation and thus your test only needs to specify the values that need to be arranged thus making the intent of your test very clear
- We have added a method to our builders (`.AsProxy()`) that allows the object returned to be an [NSubstitute](http://nsubstitute.github.io/) substitute (a proxy / mock object if you aren't familiar with that library) rather than a real object (with the public properties set to automatically return the values specified in the builder). See below for a code snippet.
  - This means that when we need substitutes to check whether certain methods are called or to ensure that certain method calls return predetermined values we can generate those substitutes consistently with how we generate the real objects.
  - This is very powerful and improves understandability and maintainability of the tests.
  - In general we try and avoid using substitutes because it means that it's possible to get objects that violate domain invariants, however, on occasion it's very useful to properly unit test a domain action when it interacts with other domain objects



Here is a (somewhat contrived) example of the `.AsProxy()` method described above.



```csharp
public void Given10YearMembership_WhenCalculatingDiscount_ThenApply15PercentLongMembershipDiscount() {
    var member = MemberBuilder.AsProxy().Build();
    member.GetYearsOfMembership(Arg.Any()).Returns(10);
    var discount = _discountCalculator.CalculateDiscountFor(member, new DateTimeProvider());
    Assert.That(discount, Is.EqualTo(0.15));
}
```


# Combining NBuilder and the Test Data Builders


Another cool thing we have done is to combine our test data builders with NBuilder to allow for terse, expressive generation of lists of objects while still supporting objects that don't have public property setters. We do this by generating a list of builders with NBuilder and then iterating that list to build each builder and get the actual object. Here is an example:



```csharp
var members = Builder.CreateListOfSize(4)
    .TheFirst(1).With(b => b.WithFirstName("Rob"))
    .TheNext(2).With(b => b.WithFirstName("Poya"))
    .TheNext(1).With(b => b.WithFirstName("Matt"))
    .Build()
    .Select(b => b.Build());
```



We have made the above code even terser, by adding some extension methods to allow for this:



```csharp
var members = MemberBuilder.CreateList(4)
    .TheFirst(1).With(b => b.WithFirstName("Rob"))
    .TheNext(2).With(b => b.WithFirstName("Poya"))
    .TheNext(1).With(b => b.WithFirstName("Matt"))
    .BuildList();
```


# Adding back Object Mother


One of the really nice things about the Object Mother pattern is that you reduce a lot of repetition on your tests by re-using pre-canned objects. It also means the tests are a lot terser since you just specify the name of the pre-canned object that you want and assuming that name describes the pre-canned object well then your test is very readable.



What we have done is combined the maintainability and flexibility that is afforded by the Test Data Builder pattern with the terseness afforded by the Object Mother by using Object Mothers that return Test Data Builders. This overcomes all of the disadvantages noted above with the Object Mother pattern.



In order to make it easy to find objects we also use a static partial class for the Object Mother - this is one of the few really nice uses I've seen for partial classes. Basically, we have an ObjectMother folder / namespace in our test project that contains a file for every entity we are generating that includes a static nested class within the root `ObjectMother` class. This ensures that all test data is gotten by first typing "`ObjectMother.`" - this makes it really consistent and easily accessible, while not having an unmaintainable mess of a god object.



For instance we might have (simple example):



```csharp
// Helpers\ObjectMother\Customers.cs
using MyProject.Tests.Helpers.Builders;
namespace MyProject.Tests.Helpers.ObjectMother
{
    public static partial class ObjectMother
    {
        public static class Customers
        {
            public static CustomerBuilder Robert
            {
                get { return new CustomerBuilder().WithFirstName("Robert"); }
            }
            public static CustomerBuilder Matt
            {
                get { return new CustomerBuilder().WithFirstName("Matt"); }
            }
        }
    }
}
```



If our test requires any small tweaks to the predefined object then you don't need to necessarily add another property to your object mother - you can use the methods on the builder, e.g. `ObjectMother.Customers.Robert.WithLastName("Moore").Build()`;



We generally stick to using properties rather than methods in the object mothers since the builders mean that it's not necessary to pass any parameters to get your pre-canned object out, but occasionally we do have some that have methods when there is something meaningful to configure that makes sense in the object mother e.g. `ObjectMother.Members.MemberWithXProducts(int numProducts)`.


# Making the Test Data Builders terse


One argument against this approach, particularly when you first start out your test project (or indeed if you decide to refactor it to use this technique after the fact) is that you are writing a lot of code to get it all up and running. We decided to avoid that by using a number of techniques:


- We set any reasonable defaults in our builder constructor so `new CustomerBuilder().Build()` will give a reasonable object (unless for that particular type of object there are any properties that make sense to always have to specify, in which case we don't add a default for that property).
- We have created a base class that allows us to set/get the property values into a dictionary using a lambda expression that identifies the property whose value is being set/retrieved - this reduces the code in the builder by eliminating the need for most (sometimes there is still a need to keep state in the builder where you are storing something not expressed by one of the properties) of the private variables in the builder.
- We only add fluent methods for the properties we are actually using in our tests that point in time - this means we don't have dead methods lying around in the builders and initially they are very terse.
- We have a base class that defines a lot of the common infrastructure behind defining a builder (including the ability to return a proxy object and the ability to create a list of builders using NBuilder - I've open sourced the code as [NTestDataBuilder](http://robdmoore.id.au/blog/2013/05/26/announcing-ntestdatabuilder-library/ "Announcing NTestDataBuilder library")).



This generally means that we can be up and running with an object mother and builder for a new entity within a minute and it's well worth doing it from the start with all our objects to keep consistency in the codebase and ensure all tests are maintainable, terse and readable from the start.



Here is an example of what I mean from the [NTestDataBuilder](http://robdmoore.id.au/blog/2013/05/26/announcing-ntestdatabuilder-library/ "Announcing NTestDataBuilder library") library I have released:



```csharp
class CustomerBuilder : TestDataBuilder<Customer, CustomerBuilder>
{
    public CustomerBuilder()
    {
        WithFirstName("Rob");
        WithLastName("Moore");
        WhoJoinedIn(2013);
    }
    public CustomerBuilder WithFirstName(string firstName)
    {
        Set(x => x.FirstName, firstName);
        return this;
    }
    public CustomerBuilder WithLastName(string lastName)
    {
        Set(x => x.LastName, lastName);
        return this;
    }
    public CustomerBuilder WhoJoinedIn(int yearJoined)
    {
        Set(x => x.YearJoined, yearJoined);
        return this;
    }
    protected override Customer BuildObject()
    {
        return new Customer(
            Get(x => x.FirstName),
            Get(x => x.LastName),
            Get(x => x.YearJoined)
        );
    }
}
```

