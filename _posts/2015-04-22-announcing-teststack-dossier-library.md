---
layout: post
title: Announcing TestStack.Dossier library
date: 2015-04-22 16:18:34.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- TDD
- testing
author: rob
---


I'm pleased to announce the addition of a (somewhat) new library to the [TestStack family](https://github.com/teststack) called TestStack.Dossier. I say somewhat new because it's a version 2 of an existing library that I published called [NTestDataBuilder](/blog/2013/05/26/announcing-ntestdatabuilder-library/). If you hadn't already heard about that library here is the one liner (which has only changed slightly with the rename):



> TestStack.Dossier provides you with the code infrastructure to easily and quickly generate test fixture data for your automated tests in a terse, readable and maintainable way using the Test Data Builder, anonymous value and equivalence class patterns.



The release of TestStack.Dossier culminates a few months of (off and on) work by myself and fellow TestStacker [Michael Whelan](http://www.michael-whelan.net/) to bring a range of enhancements. The library itself is very similar to NTestDataBuilder, but there [are some minor breaking changes](https://github.com/TestStack/TestStack.Dossier/blob/master/BREAKING_CHANGES.md). I decided to reduce confusion by keeping the version number consistent between libraries so TestStack.Dossier starts at version 2.0.


## So why should I upgrade to v2 anyway?


There is more to TestStack.Dossier v2 than just a name change, a lot more. I've taken my learnings (and frustrations) from a couple of years of usage of the library into account to add in a bunch of improvements and new features that I'm really excited about!



> Side note: [my original post on combining the test data builder pattern with the object mother pattern](/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/) and [follow-up presentation](https://github.com/robdmoore/TestWestTestDataSustainabilityPresentation) still holds very true - this combination of patterns has been invaluable and has led to terser, more readable tests that are easier to maintain. I still highly recommend this approach (I use <s>NTestDataBuilder</s> TestStack.Dossier for the test data builder part).


### Anonymous value support


As explained in my anonymous variables post (TBW(ritten) - future proofing this post, or setting myself up for disappointment :P) in my [automated testing series](/blog/2014/01/23/test-naming-automated-testing-series/), the use of the [anonymous variable pattern](http://blogs.msdn.com/b/ploeh/archive/2008/11/17/anonymous-variables.aspx) is a good pattern to use when you want to use values in your tests whose exact value isn't significant. By including a specific value you are making it look like that value is important in some way - stealing cognitive load from the test reader while they figure out the value in fact doesn't not matter.



This is relevant when defining a test data builder because of the initial values that you set the different parameters to by default. For instance, the example code for NTestDataBuilder on the readme had something like this:



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
    ...
}
```



In that case the values `"Rob"`, `"Moore"` and `2013` look significant on initial inspection. In reality it doesn't matter what they are; any test where those values matter should specify them to [make the intent clear](/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/).



One of the changes we have made for v2 is to automatically generate an anonymous value for each requested value (using `Get`) if none has been specified for it (using `Set`). This not only allows you to get rid of those insignificant values, but it allows you to trim down the constructor of your builder - making the builders terser and quicker to write.



Given we aren't talking about variables but rather values I have thus named the pattern anonymous values rather than anonymous variables.



There are a number of default conventions that are followed to determine what value to use via the new [Anonymous Value Fixture](https://github.com/TestStack/TestStack.Dossier/blob/master/TestStack.Dossier/AnonymousValueFixture.cs) class. This works through the application of anonymous value suppliers - which are processed in order to determine if a value can be provided and if so a value is retrieved. At the time of writing the default suppliers are the following (applied in this order):


- `DefaultEmailValueSupplier` - Supplies an email address for all string properties with a property name containing `email`
- `DefaultFirstNameValueSupplier` - Supplies a first name for all string properties with a property name containing `firstname` (case insensitive)
- `DefaultLastNameValueSupplier` - Supplies a last name for all string properties with a property name containing `lastname` or `surname` (case insensitive)
- `DefaultStringValueSupplier` - Supplies the property name followed by a random GUID for all string properties
- `DefaultValueTypeValueSupplier` - Supplies an [AutoFixture generated value](http://blog.ploeh.dk/2009/04/03/CreatingNumbersWithAutoFixture/) for any value types (e.g. int, double, etc.)
- `DefaultValueSupplier` - Supplies default(T)



This gets you started for the most basic of cases, but from there you have a lot of flexibility to apply your own suppliers on both a global basis (via`AnonymousValueFixture.GlobalValueSuppliers`) and a local basis for each fixture instance (via `fixture.LocalValueSuppliers`) - you just need to implement `IAnonymousValueSupplier`. See the [tests for examples](https://github.com/TestStack/TestStack.Dossier/blob/master/TestStack.Dossier.Tests/GetAnonymousTests.cs).


### Equivalence classes support


As explained in my equivalence classes and constrained non-determinism post (TBW) in my [automated testing series](/blog/2014/01/23/test-naming-automated-testing-series/) the principle of [constrained non-determinism](http://blog.ploeh.dk/2009/03/05/ConstrainedNon-Determinism/) frees you from having to worry about the fact that anonymous values can be random as long as they fall within the [equivalence class](http://xunitpatterns.com/equivalence%20class.html) of the value that is required for your test.



I think the same concept can and should be applied to test data builders. More than that, I think it enhances the ability for the test data builders to [act as documentation](/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/). Having a constructor that reads like this for instance tells you something interesting about the `Year` property:



```csharp
class CustomerBuilder : TestDataBuilder<Customer, CustomerBuilder>
{
    public CustomerBuilder()
    {
        WhoJoinedIn(Any.YearAfter2001());
    }
    ...
}
```



You may well use value objects that protect and describe the integrity of the data (which is great), but you can still create an equivalence class for the creation of the value object so I still think it's relevant beyond primitives.



We have some built-in equivalence classes that you can use to get started quickly for common scenarios. At the time of writing the following are available (as extension methods of the `AnonymousValueFixture` class that is defined in a property called `Any` on the test data builder base class):


- `Any.String()`
- `Any.StringMatching(string regexPattern)`
- `Any.StringStartingWith(string prefix)`
- `Any.StringEndingWith(string suffix)`
- `Any.StringOfLength(int length)`
- `Any.PositiveInteger()`
- `Any.NegativeInteger()`
- `Any.IntegerExcept(int[] exceptFor)`
- `Any.Of&lt;TEnum&gt;()`
- `Any.Except&lt;TEnum&gt;(TEnum[] except)`
- `Any.EmailAddress()`
- `Any.UniqueEmailAddress()`
- `Any.Language()`
- `Any.FemaleFirstName()`
- `Any.MaleFirstName()`
- `Any.FirstName()`
- `Any.LastName()`
- `Any.Suffix()`
- `Any.Title()`
- `Any.Continent()`
- `Any.Country()`
- `Any.CountryCode()`
- `Any.Latitude()`
- `Any.Longitude()`



There is nothing stopping you using the anonymous value fixture outside of the test data builders - you can create a property called `Any` that is an instance of the `AnonymousValueFixture` class in any test class.



Also, you can easily create your own extension methods for the values and data that makes sense for your application. See the [source code for examples to copy](https://github.com/TestStack/TestStack.Dossier/tree/master/TestStack.Dossier/EquivalenceClasses). A couple of notes: you have the ability to stash information in the fixture by using the `dynamic Bag` property and you also have an [AutoFixture](https://github.com/AutoFixture/AutoFixture) instance available to use via `Fixture`.



> Side note: I feel that Dossier does some things that are [not easy to do in AutoFixture](https://twitter.com/robdmoore/status/566533835869782016), hence why I don't "just use AutoFixture" - I see Dossier as complimentary to AutoFixture because they are trying to achieve different (albeit related) things.



A final note: I got the idea for the `Any.Whatever()` syntax from the [TDD Toolkit by Grzegorz Gałęzowski](https://github.com/grzesiek-galezowski/tdd-toolkit). I really like it and I highly recommend his [TDD e-book](https://github.com/grzesiek-galezowski/tdd-ebook).


### Return Set rather than this


This is a small, but important optimisation that allows test data builders to be that little bit terser and easier to read/write. The `Set` method now returns the builder instance so you can change your basic builder modification methods like in this example:



```csharp
// Before
public CustomerBuilder WithLastName(string lastName)
{
    Set(x => x.LastName, lastName);
    return this;
}
// After
public CustomerBuilder WithLastName(string lastName)
{
    return Set(x => x.LastName, lastName);
}
```


### Amazingly terse list of object generation


This is by far the part that I am most proud of. I've long been frustrated (relatively speaking, I thought what I had in the first version was very cool and useful) with the need for writing the lambda expressions when building a list of objects, e.g.:



```csharp
var customers = CustomerBuilder.CreateListOfSize(3)
    .TheFirst(1).With(b => b.WithFirstName("Robert").WithLastName("Moore))
    .TheLast(1).With(b => b.WithEmail("matt@domain.tld"))
    .BuildList();
```



I always found tha the need to have the `With` made it a bit more verbose than I wanted (since it was basically noise) and I found that needing to write the lambda expression slowed me down. I dreamed of having a syntax that looked like this:



```csharp
var customers = CustomerBuilder.CreateListOfSize(3)
    .TheFirst(1).WithFirstName("Robert").WithLastName("Moore")
    .TheLast(1).WithEmail("matt@domain.tld")
    .BuildList();
```



Well, one day I had a brainwave on how that may be possible and I went and [implemented it](https://twitter.com/robdmoore/status/511021144384610304). I won't go into the details apart from saying that I used Castle Dynamic Proxy to do the magic (and let's be honest it's magic) and you can [check out the code if interested](https://github.com/TestStack/TestStack.Dossier/blob/master/TestStack.Dossier/Lists/ListBuilder.cs). I'm hoping this won't come back to bite me, because I'll freely admit that this adds complexity to the code for creating lists; you can have an instance of a builder that isn't an instance of a real builder, but rather a proxy object that will apply the call to part of a list of builders (see what I mean about complex)? My hope is that the simplicity and niceness of using the API outweighs the confusion / complexity and that you don't really have to understand what's going on under the hood if it "just works"<sup>TM</sup>.



If you don't want to risk it that's fine, there is still a `With` method that takes a lambda expression so you can freely avoid the magic.



The nice thing about this is I was able to remove NBuilder as a dependency and you no longer need to create an extension method for each builder to have a `BuildList` method that doesn't require you to specify the generic types.


## Why did you move to TestStack and why is it now called Dossier?


I moved the library to TestStack because it's a logical fit - the goal that we have at TestStack is to make it easier to perform automated testing in the .NET ecosystem - that's through and through what this library is all about.



As to why I changed the name to Dossier - most of the libraries that we have in TestStack have cool/quirky names that are relevant to what they do (e.g.[Seleno](https://github.com/TestStack/TestStack.Seleno), [Bddfy](https://github.com/TestStack/TestStack.Bddfy)). NTestDataBuilder is really boring so with a bit of a push from my colleagues I set about to find a better name. I found Dossier by Googling for synonyms of data and out of all the words dossier stood out as the most interesting. I then [asked Google what the definition was](https://www.google.com/search?q=define%3A+dossier) to see if it made sense and low and behold, the definition is strangely appropriate (person, event, subject being examples of the sorts of objects I tend to build with the library):



> a collection of documents about a particular person, event, or subject


## Mundane stuff


The GitHub repository has been moved to [https://github.com/TestStack/TestStack.Dossier/](https://github.com/TestStack/TestStack.Dossier/) and the previous URL will automatically redirect to that address. I have released an [empty v2.0 NTestDataBuilder release to NuGet](http://www.nuget.org/packages/NTestDataBuilder) that simply includes TestStack.Dossier as a dependency so you can do an`Update-Package` on it if you want (but will then need to address the breaking changes).



If you have an existing project that you don't want to have to change for the breaking changes then feel free to continue using NTestDataBuilder v1 - for the featureset that was in it I consider that library to be complete and there weren't any known bugs in it. I will not be adding any changes to that library going forward though.



As usual you can grab this library from [NuGet](https://www.nuget.org/packages/TestStack.Dossier).

