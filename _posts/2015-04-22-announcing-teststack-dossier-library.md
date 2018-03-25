---
id: 4991
title: Announcing TestStack.Dossier library
date: 2015-04-22T16:18:34+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=4991
permalink: /blog/2015/04/22/announcing-teststack-dossier-library/
categories:
  - Technical
tags:
  - 'C#'
  - TDD
  - testing
---
I&#8217;m pleased to announce the addition of a (somewhat) new library to the <a href="https://github.com/teststack" target="_blank">TestStack family</a> called TestStack.Dossier. I say somewhat new because it&#8217;s a version 2 of an existing library that I published called <a href="https://robdmoore.id.au/blog/2013/05/26/announcing-ntestdatabuilder-library/" target="_blank">NTestDataBuilder</a>. If you hadn&#8217;t already heard about that library here is the one liner (which has only changed slightly with the rename):

> TestStack.Dossier provides you with the code infrastructure to easily and quickly generate test fixture data for your automated tests in a terse, readable and maintainable way using the Test Data Builder, anonymous value and equivalence class patterns.

The release of TestStack.Dossier culminates a few months of (off and on) work by myself and fellow TestStacker <a href="http://www.michael-whelan.net/" target="_blank">Michael Whelan</a> to bring a range of enhancements. The library itself is very similar to NTestDataBuilder, but there <a href="https://github.com/TestStack/TestStack.Dossier/blob/master/BREAKING_CHANGES.md" target="_blank">are some minor breaking changes</a>. I decided to reduce confusion by keeping the version number consistent between libraries so TestStack.Dossier starts at version 2.0.

## So why should I upgrade to v2 anyway?

There is more to TestStack.Dossier v2 than just a name change, a lot more. I&#8217;ve taken my learnings (and frustrations) from a couple of years of usage of the library into account to add in a bunch of improvements and new features that I&#8217;m really excited about!

> Side note: <a href="https://robdmoore.id.au/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/" target="_blank">my original post on combining the test data builder pattern with the object mother pattern</a> and <a href="https://github.com/robdmoore/TestWestTestDataSustainabilityPresentation" target="_blank">follow-up presentation</a> still holds very true &#8211; this combination of patterns has been invaluable and has led to terser, more readable tests that are easier to maintain. I still highly recommend this approach (I use <s>NTestDataBuilder</s> TestStack.Dossier for the test data builder part).

### Anonymous value support

As explained in my anonymous variables post (TBW(ritten) &#8211; future proofing this post, or setting myself up for disappointment :P) in my <a href="http://robdmoore.id.au/blog/2014/01/23/test-naming-automated-testing-series/" target="_blank">automated testing series</a>, the use of the <a href="http://blogs.msdn.com/b/ploeh/archive/2008/11/17/anonymous-variables.aspx" target="_blank">anonymous variable pattern</a> is a good pattern to use when you want to use values in your tests whose exact value isn&#8217;t significant. By including a specific value you are making it look like that value is important in some way &#8211; stealing cognitive load from the test reader while they figure out the value in fact doesn&#8217;t not matter.

This is relevant when defining a test data builder because of the initial values that you set the different parameters to by default. For instance, the example code for NTestDataBuilder on the readme had something like this:

<pre class="brush: csharp; title: ; notranslate" title="">class CustomerBuilder : TestDataBuilder&lt;Customer, CustomerBuilder&gt;
{
    public CustomerBuilder()
    {
        WithFirstName("Rob");
        WithLastName("Moore");
        WhoJoinedIn(2013);
    }

    public CustomerBuilder WithFirstName(string firstName)
    {
        Set(x =&gt; x.FirstName, firstName);
        return this;
    }

    ...
}
</pre>

In that case the values `"Rob"`, `"Moore"` and `2013` look significant on initial inspection. In reality it doesn&#8217;t matter what they are; any test where those values matter should specify them to <a href="http://robdmoore.id.au/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/" target="_blank">make the intent clear</a>.

One of the changes we have made for v2 is to automatically generate an anonymous value for each requested value (using `Get`) if none has been specified for it (using `Set`). This not only allows you to get rid of those insignificant values, but it allows you to trim down the constructor of your builder &#8211; making the builders terser and quicker to write.

Given we aren&#8217;t talking about variables but rather values I have thus named the pattern anonymous values rather than anonymous variables.

There are a number of default conventions that are followed to determine what value to use via the new <a href="https://github.com/TestStack/TestStack.Dossier/blob/master/TestStack.Dossier/AnonymousValueFixture.cs" target="_blank">Anonymous Value Fixture</a> class. This works through the application of anonymous value suppliers &#8211; which are processed in order to determine if a value can be provided and if so a value is retrieved. At the time of writing the default suppliers are the following (applied in this order):

  * `DefaultEmailValueSupplier` &#8211; Supplies an email address for all string properties with a property name containing `email`
  * `DefaultFirstNameValueSupplier` &#8211; Supplies a first name for all string properties with a property name containing `firstname` (case insensitive)
  * `DefaultLastNameValueSupplier` &#8211; Supplies a last name for all string properties with a property name containing `lastname` or `surname` (case insensitive)
  * `DefaultStringValueSupplier` &#8211; Supplies the property name followed by a random GUID for all string properties
  * `DefaultValueTypeValueSupplier` &#8211; Supplies an <a href="http://blog.ploeh.dk/2009/04/03/CreatingNumbersWithAutoFixture/" target="_blank">AutoFixture generated value</a> for any value types (e.g. int, double, etc.)
  * `DefaultValueSupplier` &#8211; Supplies default(T)

This gets you started for the most basic of cases, but from there you have a lot of flexibility to apply your own suppliers on both a global basis (via`AnonymousValueFixture.GlobalValueSuppliers`) and a local basis for each fixture instance (via `fixture.LocalValueSuppliers`) &#8211; you just need to implement `IAnonymousValueSupplier`. See the <a href="https://github.com/TestStack/TestStack.Dossier/blob/master/TestStack.Dossier.Tests/GetAnonymousTests.cs" target="_blank">tests for examples</a>.

### Equivalence classes support

As explained in my equivalence classes and constrained non-determinism post (TBW) in my <a href="http://robdmoore.id.au/blog/2014/01/23/test-naming-automated-testing-series/" target="_blank">automated testing series</a> the principle of <a href="http://blog.ploeh.dk/2009/03/05/ConstrainedNon-Determinism/" target="_blank">constrained non-determinism</a> frees you from having to worry about the fact that anonymous values can be random as long as they fall within the <a href="http://xunitpatterns.com/equivalence%20class.html" target="_blank">equivalence class</a> of the value that is required for your test.

I think the same concept can and should be applied to test data builders. More than that, I think it enhances the ability for the test data builders to <a href="http://robdmoore.id.au/blog/2013/05/26/test-data-generation-the-right-way-object-mother-test-data-builders-nsubstitute-nbuilder/" target="_blank">act as documentation</a>. Having a constructor that reads like this for instance tells you something interesting about the `Year` property:

<pre class="brush: csharp; title: ; notranslate" title="">class CustomerBuilder : TestDataBuilder&lt;Customer, CustomerBuilder&gt;
{
    public CustomerBuilder()
    {
        WhoJoinedIn(Any.YearAfter2001());
    }

    ...
}
</pre>

You may well use value objects that protect and describe the integrity of the data (which is great), but you can still create an equivalence class for the creation of the value object so I still think it&#8217;s relevant beyond primitives.

We have some built-in equivalence classes that you can use to get started quickly for common scenarios. At the time of writing the following are available (as extension methods of the `AnonymousValueFixture` class that is defined in a property called `Any` on the test data builder base class):

  * `Any.String()`
  * `Any.StringMatching(string regexPattern)`
  * `Any.StringStartingWith(string prefix)`
  * `Any.StringEndingWith(string suffix)`
  * `Any.StringOfLength(int length)`
  * `Any.PositiveInteger()`
  * `Any.NegativeInteger()`
  * `Any.IntegerExcept(int[] exceptFor)`
  * `Any.Of<TEnum>()`
  * `Any.Except<TEnum>(TEnum[] except)`
  * `Any.EmailAddress()`
  * `Any.UniqueEmailAddress()`
  * `Any.Language()`
  * `Any.FemaleFirstName()`
  * `Any.MaleFirstName()`
  * `Any.FirstName()`
  * `Any.LastName()`
  * `Any.Suffix()`
  * `Any.Title()`
  * `Any.Continent()`
  * `Any.Country()`
  * `Any.CountryCode()`
  * `Any.Latitude()`
  * `Any.Longitude()`

There is nothing stopping you using the anonymous value fixture outside of the test data builders &#8211; you can create a property called `Any` that is an instance of the `AnonymousValueFixture` class in any test class.

Also, you can easily create your own extension methods for the values and data that makes sense for your application. See the <a href="https://github.com/TestStack/TestStack.Dossier/tree/master/TestStack.Dossier/EquivalenceClasses" target="_blank">source code for examples to copy</a>. A couple of notes: you have the ability to stash information in the fixture by using the `dynamic Bag` property and you also have an <a href="https://github.com/AutoFixture/AutoFixture" target="_blank">AutoFixture</a> instance available to use via `Fixture`.

> Side note: I feel that Dossier does some things that are <a href="https://twitter.com/robdmoore/status/566533835869782016" target="_blank">not easy to do in AutoFixture</a>, hence why I don&#8217;t &#8220;just use AutoFixture&#8221; &#8211; I see Dossier as complimentary to AutoFixture because they are trying to achieve different (albeit related) things.

A final note: I got the idea for the `Any.Whatever()` syntax from the <a href="https://github.com/grzesiek-galezowski/tdd-toolkit" target="_blank">TDD Toolkit by Grzegorz Gałęzowski</a>. I really like it and I highly recommend his <a href="https://github.com/grzesiek-galezowski/tdd-ebook" target="_blank">TDD e-book</a>.

### Return Set rather than this

This is a small, but important optimisation that allows test data builders to be that little bit terser and easier to read/write. The `Set` method now returns the builder instance so you can change your basic builder modification methods like in this example:

<pre class="brush: csharp; title: ; notranslate" title="">// Before
public CustomerBuilder WithLastName(string lastName)
{
    Set(x =&gt; x.LastName, lastName);
    return this;
}

// After
public CustomerBuilder WithLastName(string lastName)
{
    return Set(x =&gt; x.LastName, lastName);
}
</pre>

### Amazingly terse list of object generation

This is by far the part that I am most proud of. I&#8217;ve long been frustrated (relatively speaking, I thought what I had in the first version was very cool and useful) with the need for writing the lambda expressions when building a list of objects, e.g.:

<pre class="brush: csharp; title: ; notranslate" title="">var customers = CustomerBuilder.CreateListOfSize(3)
    .TheFirst(1).With(b =&gt; b.WithFirstName("Robert").WithLastName("Moore))
    .TheLast(1).With(b =&gt; b.WithEmail("matt@domain.tld"))
    .BuildList();
</pre>

I always found tha the need to have the `With` made it a bit more verbose than I wanted (since it was basically noise) and I found that needing to write the lambda expression slowed me down. I dreamed of having a syntax that looked like this:

<pre class="brush: csharp; title: ; notranslate" title="">var customers = CustomerBuilder.CreateListOfSize(3)
    .TheFirst(1).WithFirstName("Robert").WithLastName("Moore")
    .TheLast(1).WithEmail("matt@domain.tld")
    .BuildList();
</pre>

Well, one day I had a brainwave on how that may be possible and I went and <a href="https://twitter.com/robdmoore/status/511021144384610304" target="_blank">implemented it</a>. I won&#8217;t go into the details apart from saying that I used Castle Dynamic Proxy to do the magic (and let&#8217;s be honest it&#8217;s magic) and you can <a href="https://github.com/TestStack/TestStack.Dossier/blob/master/TestStack.Dossier/Lists/ListBuilder.cs" target="_blank">check out the code if interested</a>. I&#8217;m hoping this won&#8217;t come back to bite me, because I&#8217;ll freely admit that this adds complexity to the code for creating lists; you can have an instance of a builder that isn&#8217;t an instance of a real builder, but rather a proxy object that will apply the call to part of a list of builders (see what I mean about complex)? My hope is that the simplicity and niceness of using the API outweighs the confusion / complexity and that you don&#8217;t really have to understand what&#8217;s going on under the hood if it &#8220;just works&#8221;<sup>TM</sup>.

If you don&#8217;t want to risk it that&#8217;s fine, there is still a `With` method that takes a lambda expression so you can freely avoid the magic.

The nice thing about this is I was able to remove NBuilder as a dependency and you no longer need to create an extension method for each builder to have a `BuildList` method that doesn&#8217;t require you to specify the generic types.

## Why did you move to TestStack and why is it now called Dossier?

I moved the library to TestStack because it&#8217;s a logical fit &#8211; the goal that we have at TestStack is to make it easier to perform automated testing in the .NET ecosystem &#8211; that&#8217;s through and through what this library is all about.

As to why I changed the name to Dossier &#8211; most of the libraries that we have in TestStack have cool/quirky names that are relevant to what they do (e.g.<a href="https://github.com/TestStack/TestStack.Seleno" target="_blank">Seleno</a>, <a href="https://github.com/TestStack/TestStack.Bddfy" target="_blank">Bddfy</a>). NTestDataBuilder is really boring so with a bit of a push from my colleagues I set about to find a better name. I found Dossier by Googling for synonyms of data and out of all the words dossier stood out as the most interesting. I then <a href="https://www.google.com/search?q=define%3A+dossier" target="_blank">asked Google what the definition was</a> to see if it made sense and low and behold, the definition is strangely appropriate (person, event, subject being examples of the sorts of objects I tend to build with the library):

> a collection of documents about a particular person, event, or subject

## Mundane stuff

The GitHub repository has been moved to <a href="https://github.com/TestStack/TestStack.Dossier/" target="_blank">https://github.com/TestStack/TestStack.Dossier/</a> and the previous URL will automatically redirect to that address. I have released an <a href="http://www.nuget.org/packages/NTestDataBuilder" target="_blank">empty v2.0 NTestDataBuilder release to NuGet</a> that simply includes TestStack.Dossier as a dependency so you can do an`Update-Package` on it if you want (but will then need to address the breaking changes).

If you have an existing project that you don&#8217;t want to have to change for the breaking changes then feel free to continue using NTestDataBuilder v1 &#8211; for the featureset that was in it I consider that library to be complete and there weren&#8217;t any known bugs in it. I will not be adding any changes to that library going forward though.

As usual you can grab this library from [NuGet](https://www.nuget.org/packages/TestStack.Dossier).