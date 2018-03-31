---
layout: post
title: Unobtrusive Validation in ASP.NET MVC 3 and 4
date: 2012-04-27 14:41:53.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
- convention
- model binding
- testing
- unobtrusive coding
- validation
author: rob
---


Most things that can be done to reduce the amount of code that you need to write to get the same outcome (keeping in mind that you still need code to be easily readable/understandable for maintainability reasons) is great. The less code you have the less change of a bug, the less code to maintain, the less code that needs to be modified to add a new feature and the easier (hopefully) the overall solution is to understand.



In particular, if plumbing code that doesn't actually serve any purpose other than to join the useful bits of code can be negated then that will usually significantly increase readability and maintainability of code. It's also this sort of boring, monotonous code that often contains little errors that get missed because of the blight of [CPDD](http://ryanrinaldi.com/blog/programming-by-coincidence/) (copy-paste-driven-development) where you copy a few lines of code, plonk them somewhere else and then change a couple of the class names or magic strings around. Inevitably you will miss one of two of the references and this is often combined with the fact that this type of code is likely not tested (depending on how strict your testing regime is).



Thus, one of the things that my team and I have put energy into over the last year and a half while we progress on our ASP.NET MVC journey is how to reduce this type of code. The first technique that springs to mind to combat this type of plumbing code is convention over configuration and to that end we have come up with unobtrusive techniques for model binding and validation that make heavy use of our dependency injection framework (Autofac). While the techniques I'll demonstrate make use of Autofac, I imagine similar techniques can be used for the other frameworks.


## Example code


This post is accompanied by some [example code](https://github.com/robdmoore/UnobtrusiveMVCTechniques).


## Data type validation


The DefaultModelBinder class that comes with MVC is pretty magical; it managed to parse the various values from the various scopes submitted with a request e.g. get and post values, etc. by name to your (potentially nested)  view model by name and pops any validation errors that it encounters in the Model State for you. Then a simple call to ModelState.IsValid in your controller will tell you if the view model was ok! This includes things like putting your data type as int and checking the input the user submitted was an integer and the same for any primitive types or enumerations! Furthermore, any custom types you define can have validation logic associated with them that will get automatically triggered ([see my blog post for an example](http://robdmoore.id.au/blog/2012/04/27/data-type-validation-in-asp-net-mvc-3/ "Data type validation in ASP.NET MVC 3"); look at the code for the custom type).



Thus, if you are taking user input in a controller action you will likely want code like this:



```csharp
        public ActionResult SomeAction(SomeViewModel vm)
        {
            if (!ModelState.IsValid)
                return View(vm);
            // todo: Perform the action
        }
```


## System.ComponentModel.DataAnnotations


By default in MVC you are given a number of unobtrusive validation options from the System.ComponentModel.DataAnnotations namespace, you can see the list of classes included [on MSDN](http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx), but here is a quick rundown of the notable ones:


- [DataType(DataType.*Something*)] - by default doesn't actually perform any (server-side) validation, although you can use this to perform [custom validation](http://robdmoore.id.au/blog/2012/04/27/data-type-validation-in-asp-net-mvc-3/ "Data type validation in ASP.NET MVC 3"). It's mostly used to provide metadata for UI controls to affect the display of the data. This is one of the confusing things about the DataAnnotations namespace - you would reasonably expect that this attribute would perform validation on first inspection!
- [Display("Label text")] - Override the label text, although if you use this for every field because the default display of the field name when there is multiple words in camel case is ugly then you might want to [define a custom metadata provider instead](http://robdmoore.id.au/blog/2012/04/27/nice-label-names-in-asp-net-mvc-3/ "Nice label names in ASP.NET MVC 3").
- [Range(*min*, *max*)] - Specify a numerical range
- [RegularExpression(*regex*)] - Specify a regex the data has to conform to
- [Required] - enough said, although one thing to note is that non-nullable types like int, double etc. are implicitly required so the omission (or inclusion) of this attribute will have no effect. If you want to have an int that isn't required make the type int? (or Nullable<int> if you like typing).
- [StringLength(MinimumLength = *minLength*, MaximumLength = *maxLength*)] - Specify a min and/or max character length for a string



It should be noted that you are given the option of overriding the default error message for any of these attributes.


## Data Annotations Extensions


The default set of unobtrusive data validation annotations can be extended with a much more useful set of validations via the [Data Annotations Extensions project](http://dataannotationsextensions.org/), which includes server- and client-side validation for:


- Credit cards
- Dates
- Digits
- Emails
- Cross-property equality
- File extensions
- Digits and other numerical validations
- Urls
- Years



It's pretty easy to get up and running with them too via NuGet:



`Install-Package DataAnnotationsExtensions.MVC3`


## Custom Validation


Sometimes simply validating that the data type and format of your view model properties just isn't enough, what if you want to validate that a URL returns a 200 OK, or that the username the user provided isn't already in your database?



In this instance we need to turn to performing custom validation. There are a number of ways this could be done:


1. Put custom validation code directly in your controller after checking ModelState.IsValid
  - Tedious and awful separation of concerns, plus we will still need to use model state (if you want errors to propagate to the UI via Html.ValidationMessageFor(...) or similar) and thus have a second call to check ModelState.IsValid
2. Wrap the custom validation code into a helper or extension method and calling it from the controller after checking ModelState
  - More reusable if you use the view model multiple times and makes the controller action easier to test and understand, still tedious though
3. Use one of the [custom validation approaches](http://robdmoore.id.au/blog/2012/04/27/data-type-validation-in-asp-net-mvc-3/ "Data type validation in ASP.NET MVC 3") to call the validation code
  - Even better separation of concerns since the model errors will now appear in model state when the controller action is called, but still reasonably tedious
4. Use a validation library to take away the tedium (my favourite is [Fluent Validation](http://fluentvalidation.codeplex.com/))
  - Getting there, but the amount of code to write increased :(...
5. Use an MVC ModelValidatorProvider and reflection to unobtrusively apply the validation using the default model binder without having to implement IValidatableObject for every view model
  - Almost there, we still have to statically call DependencyResolver.Current to get any database repositories or similar, which is painful to test
  - In my case I'm using the MVC integration that the FluentValidation library provides to automatically pick up the correct validator, but you could obviously write your own ModelValidatorProvider, for this to work it simply requires that you add the [Validator(typeof(*ValidatorClass*)] attribute on your view models
6. Integrate with your DI framework to inject dependencies to the unobtrusively called validator
  - Perfect!
  - Props to my Senior Developer [Matthew Davies](http://twitter.com/mdaviesnet) for coming up with this technique



I've ordered the list above in pretty much the order of approaches that we went through to get to where we are now. I've included a comparison of the different approaches in the [Github repo for this blog post](https://github.com/robdmoore/UnobtrusiveMVCTechniques). Note that I've bundled all the code for each approach into a region when in reality the validation classes should be separated, but it makes it easier to compare the different approaches this way.



I should note that there is another approach I neglected to mention, which is to create a custom model binder for the view model and to perform the validation and setting of model state in there rather than the controller. While this is a better separation of concerns than putting the code in the controller, it still leaves a lot to be desired and can be quite tedious. On occasion, when you actually need to use custom model binding (e.g. not just for validation) it can become important to put errors in the model state though.


## Conclusions


Now, the example code I've written doesn't really give a good indication of the advantages of the final solution (that I recommend). This is mainly because I was only performing a single view model validation on a single property of that validation - the more custom validation you have the more the unobtrusive solution shines. It's also worth noting that your test code will become significantly less complex for each example I gave though as well. Another consideration is that the unobtrusive code, while it means you have to write less code all up does hide away a lot of what is happening in "magic". For someone new to the solution this could pose a problem and make the solution hard to understand and for this reason if you are using this approach I recommend it forms a part of the (brief) documentation of your solution that supplements the code and tests.



At the end of the day, you should take a pragmatic approach, if all you need is one or two really simple validations then you probably don't need to put in the code for the unobtrusive validation and at that point the unobtrusive validation will probably complicate rather than simplify your solution. If you are lucky enough to have some sort of base libraries that you use across projects and you have a consistent team that are familiar with it's use then it makes sense to abstract away the unobtrusive validation code so that you can simply be up and running with it straight away for all projects.

