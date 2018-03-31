---
layout: post
title: Making Intent Clear / Derived Values [Automated Testing Series]
date: 2014-02-23 21:58:12.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- TDD
- testing
author: rob
---


This is part of my ongoing Automated Testing blog series:


- [Test Naming](/blog/2014/01/23/test-naming-automated-testing-series/)
- [General Test Structure](/blog/2014/01/27/general-test-structure-automated-testing-series/)
- [Acceptance Tests Structure](/blog/2014/01/27/acceptance-tests-structure-automated-testing-series/)
- [Making Intent Clear](/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
  - [Derived Values](/blog/2014/02/23/making-intent-clear-derived-values-automated-testing-series/)
  - Anonymous Variables
  - Equivalence Classes and Constrained Non-Determinism
- Unit Testing
  - What should a unit be / what level should we be testing at?
  - What role should mocking have in unit testing?
- UI Testing
  - What should be your goal with UI Testing?
  - What are the best practices for keeping UI tests robust?


## Making Intent Clear


I think one of the most important things when writing tests (apart from [consistency](/blog/2012/09/01/consistency-maintainability/ "Consistency == Maintainability")) is that they are clear in intent. If you buy into the notion that tests form part of the documentation of your system then it's really important, like all good documentation, that the tests are both readable and understandable.



I think there are a number of techniques that can help with this in various situations and there are three in particular that I will be covering in this sub-section of the blog series. I have already covered [test naming](/blog/2014/01/23/test-naming-automated-testing-series/) and I think that has a big impact on clarity of intent.


## Derived Values


There are a number of excellent blog posts by Mark Seemann ([@ploeh](http://www.twitter.com/ploeh)) in his [zero-friction TDD series](http://blog.ploeh.dk/2009/01/28/Zero-FrictionTDD/) that I have found useful in my ongoing research and one in particular that really resonated with me was the concept of [derived values](http://blog.ploeh.dk/2009/03/03/DerivedValuesEnsureExecutableSpecification/).



Consider the following code:



```csharp
public static class StringExtensions
{
    public static string ReverseString(this string str)
    {
        return string.Join("", str.Reverse().ToArray());
    }
}
public class NaiveTest
{
    [Test]
    public void GivenAString_WhenInverting_ThenReversedStringWillBeReturned()
    {
        const string str = "a string";
        var result = str.ReverseString();
        Assert.That(result, Is.EqualTo("gnirts a"));
    }
}
public class DerivedValueTest
{
    [Test]
    public void GivenAString_WhenInverting_ThenReversedStringWillBeReturned()
    {
        const string str = "a string";
        var expectedResult = str.Reverse().ToArray();
        var result = str.ReverseString();
        Assert.That(result, Is.EqualTo(expectedResult));
    }
}
public class DataDrivenTest
{
    [Test]
    [TestCase("", "")]
    [TestCase("a", "a")]
    [TestCase("ab", "ba")]
    [TestCase("longer", "regnol")]
    [TestCase("a string with space", "ecaps htiw gnirts a")]
    [TestCase("num3rics&punctua10n!@$", "$@!n01autcnup&scir3mun")]
    public void GivenAString_WhenInverting_ThenReversedStringWillBeReturned(string input, string expectedResult)
    {
        var result = input.ReverseString();
        Assert.That(result, Is.EqualTo(expectedResult));
    }
}
```



This is a fairly contrived example, but it helps illustrate a few things:


- The `NaiveTest` is hard to infer understanding at a glance - you can eventually reason an understanding about the relationship between the input and the output because of the name of the test in combination with common sense, but it's not easy and thus I think it's not a **great** test (it's still clear AAA so it's certainly not awful).
- The `DerivedValueTest` is what Mark was describing - this is much better because the relationship between the input and result is very clear in the first two lines of the test and you immediately know a) what is being tested and b) how it should work.
  - Of note is that the implementation is the same as the real implementation - this could be a problem if the developer decides to simply copy the implementation into the test or vice versa
    - Interestingly, by writing the test using proper TDD it wouldn't matter as much that the implementation was similar to the implementation because in writing the test you would see it fail in the "Red" step and at that time verify that the string being asserted in the test output was in fact the correct reverse string
    - The fact you are then relying on the developer verifying that the result being asserted was correct at the time of writing the test reminds me somewhat of the notion of [approval tests](http://blog.approvaltests.com/2008/10/approve-is-new-assert.html) (which I find myself using a fair bit to perform complex assertions that can't easily be expressed in code, but can be easily reasoned "by eye")
    - It occurs to me that if you were only testing a subset of some complex functionality that you would only need to include a subset of the implementation for the test
    - If you have a team that isn't disciplined in writing their tests in a TDD fashion (or at least verifying the test is definitely correct) then this approach *might* make it easier to introduce incorrect tests that are a copy of the implementation and don't actually test anything (hopefully code review would pick this up though)
  - Where possible you could try and include an alternate implementation of the code under test in your test (with a focus on the implementation being readable and understandable), but even in this case I still think the "Red" step mentioned above is important to make sure you didn't have an error in your alternative implementation
- The `DataDrivenTest` in my opinion is the better test *in this case*, not just because it provides better code coverage by trying multiple values (since this could *easily* have been done for the derived value test as well), but also because:
  - The relationship between input and output is made clear by their proximity and the fact that there are simple examples as well as more complex ones (the simple ones help the viewer immediately grok the relationship)
    - I feel that the "proximity" part is the most important bit here (assuming that you can grok the relationship)
    - I think the proximity in the `DerivedValueTest` is an important factor as well to help with immediate understanding
  - I suspect the edge cases in the above example could go into their own test so that the test name can more clearly reflect the edge case being tested
  - This approach won't work for all situations - sometimes the logic being tested is complex enough that having the input and expected result side-by-side still won't allow the reader to glean understanding about the relationship and it's important to how show the expected result is derived
  - Be pragmatic - use the right approach in the right situation - derived values is sometimes useful and sometimes showing a series of {input -> expected result} is clearer - I'd say the main thing to be **wary of is tests that simply have a value in the final assert and it's not clear how that value was derived**



There is a slight variation to the `DataDrivenTest` above that I sometimes come across that is also worth mentioning - complex example generation. It's a strategy to avoid the situation described above where showing the derived value involves duplicating the implementation logic in situations where it's really complex to work out that logic, but easy(ier) to come up with an example of the logic in action. I often find myself this technique for date logic - writing the date logic as part of the test never gives me a lot of confidence since it's so darn complex to figure out (I [hate](http://noda-time.blogspot.com.au/2011/08/what-wrong-with-datetime-anyway.html) [programming](http://noda-time.blogspot.com.au/2010/11/joys-of-datetime-arithmetic.html) dates/time logic). In these situations I like to pull up a calendar and pick some candidate examples for the logic I'm trying to implement.



A couple of examples are shown below, pulled from a codebase I work on (with some tweaks to generalise the second test so it's non-identifying):



```csharp
    // From http://www.timestampgenerator.com/1352031606/#result
    [TestCase("2012-11-04 12:20:06", 1352031606)]
    [TestCase("2012-11-03 23:59:59", 1351987199)]
    [TestCase("2012-02-29 13:00:01", 1330520401)]
    public void GivenDate_WhenConvertingToUnixTimestamp_ItShouldBeCorrect(string inputDate, int expectedTimestamp)
    {
        var date = DateTime.Parse(inputDate);
        var timestamp = date.ToUnixTimestamp();
        Assert.That(timestamp, Is.EqualTo(expectedTimestamp));
    }
    /* unix $ cal 8 2004
     *      August 2004
       Su Mo Tu We Th Fr Sa
        1  2  3  4  5  6  7
        8  9 10 11 12 13 14
       15 16 17 18 19 20 21
       22 23 24 25 26 27 28
       29 30 31
     */
    [Test]
    // Day before date during weekend
    [TestCase("2004-08-09", "2004-08-06", true)]
    // Day before date during week
    [TestCase("2004-08-10", "2004-08-09", true)]
    // Consecutive business days
    [TestCase("2004-08-09", "2004-08-09", true)]
    [TestCase("2004-08-09", "2004-08-10", true)]
    [TestCase("2004-08-09", "2004-08-11", false)]
    [TestCase("2004-08-09", "2004-08-12", false)]
    // Include Weekend
    [TestCase("2004-08-12", "2004-08-13", true)]
    [TestCase("2004-08-12", "2004-08-14", true)]
    [TestCase("2004-08-12", "2004-08-15", true)]
    [TestCase("2004-08-12", "2004-08-16", false)]
    // Start on Weekend
    [TestCase("2004-08-13", "2004-08-16", true)]
    [TestCase("2004-08-13", "2004-08-17", false)]
    public void WhenValidatingConnectionDate_ThenThereShouldBeAnErrorOnlyIfTheDateIsLessThan2BusinessDaysAway(string now, string date, bool expectError)
    {
        _model.ConnectionDate = DateTime.Parse(date);
        var dateTimeProvider = DateTimeProviderFactory.Create(DateTime.Parse(now));
        var modelState = new ModelStateDictionary();
        _model.Validate(modelState, dateTimeProvider);
        if (expectError)
            Assert.That(modelState[modelStateKey].Errors, Has.Count.GreaterThan(0));
        else
            Assert.That(modelState.ContainsKey(modelStateKey), Is.False);
    }
```



Props to my colleague [Toby Moore](https://twitter.com/tobycmoore) for coming up with the idea of using the Unix [cal](https://en.wikipedia.org/wiki/Cal_(Unix)) command to generate calendars for pasting in comments above the examples).



In these examples, there is a cognitive load to figure out the relationship between input and expected result, but I don't think there is a silver bullet in these cases - the test name, multiple examples and the comments above the tests (I think) help anyone maintaining the tests to figure out what is going on. Either way there would be a cognitive load to get your head around the logic since it's really complex and in this case it's about trying to minimise that load.

