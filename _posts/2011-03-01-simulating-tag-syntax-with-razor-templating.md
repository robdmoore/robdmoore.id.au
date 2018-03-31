---
layout: post
title: Simulating Tag Syntax with Razor Templating
date: 2011-03-01 01:14:56.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- ColdFusion
- razor
author: rob
---


When using a templating language to output HTML it's often quite useful and natural to have the concept of a "tag" syntax e.g. (using some random custom ColdFusion tags as an example):


- **Self-closing:** `<cf_form_field label="Some Label" value="The value" />`
- **Nested:** `<cf_form_section heading="Some heading"> ... </cf_form_section>`



The tags would implicitly output to the page and can be side-by-side with HTML code without needing start and end code delimiters (such as <% ... %> or <? ... ?>, etc.).  
<!--more-->  
The self-closing tags are usually fairly painless when using a non tag-based templating language, particularly when there is a short-hand for code delimiters that output the result, e.g.:


```
    <%= FormField("Some Label", "The value") %>;
    // or, in Razor (so much cleaner!)
    @FormField("Some Label", "The value")
```


The syntax for the equivalent of the nested tags is a lot less nice however, and is simply clunky:


```
    <%= BeginFormSection("Some heading") %>
    ...
    <%= EndFormSection() %>
```


Apart from the fact it's less readable and more verbose, it also requires the programmer to remember they need to call the relevant ending function, whereas the tag syntax implicitly requires this since you have to close the tag otherwise so you will get an error.



For those of you that have dabbled with ASP.NET MVC, you will know like I do that a certain construct called the [using statement](http://msdn.microsoft.com/en-us/library/yh598w02.aspx) can be used to get the same implicit closing effect (whoever at Microsoft came up with this particular usage of using is brilliant!).



When creating forms with ASP.NET MVC you may create code [like](http://msdn.microsoft.com/en-us/library/dd410596.aspx):


```
    <% using(Html.BeginForm("HandleForm", "Home")) { %>
        <!-- Form content goes here -->
    <% } %>
```


So, how does that work and how can I replicate that? From here on in I'll use Razor since it's so much nicer and it's what I've been using to do this.



Now, whilst it's a trivial example and one that you would never, ever do in real life (because it's more verbose than simply writing out the HTML) I'll use the (easy to understand) example of creating an unordered list to demonstrate the idea.



Basically, the syntax we are after is:


```
    @using (var l = Html.BeginList(new { id = "listId" })) {
        @l.Item("Item 1")
        @l.Item("Item 2")
        @l.Item("Item 3")
    }
```


As I said, more verbose than the straight HTML:


```
    <ul id="listId"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
```


However, if you extend this idea to more complex things that require start and end HTML then it becomes useful.



Some notes about this syntax:


- The List method doesn't need to be a part of the Html object, but by having it there the syntax is consistent with other things like Html.BeginForm. There is actually another, better reason why I've done this that you will see below.
- I deliberately made the method name BeginList, again for consistency with Html.BeginForm.
- In this case I have made the variable returned by BeginList an object with a context sensitive method (List), giving you really nice intellisense (an advantage over tag syntax where, depending on your IDE, it's harder to get intellisense for nesting of custom tags).
- Because the l.List calls are made with a @ at the front they are directly output then and there so we need to ensure that the BeginList method outputs straight away as well, otherwise the HTML becomes out of order.



Now, onto the code. Here is a possible implementation:



```csharp
using System;  
using System.ComponentModel;  
using System.Text;  
using System.Web;  
using System.Web.Mvc;



namespace MvcApplication1.Helpers  
{  
    public class HtmlList<TModel> : IDisposable  
    {  
	    private readonly HtmlHelper<TModel> \_helper;

        public HtmlList(HtmlHelper<TModel> helper, object htmlAttributes = null)  
    	{  
    		_helper = helper;  
    		var attrs = new StringBuilder();
    
            if (htmlAttributes != null)  
    		{  
    			foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(htmlAttributes))  
    			{  
    				attrs.Append(string.Format(" {0}="{1}"", property.Name, property.GetValue(htmlAttributes)));  
    			}  
    		}
    
            _helper.ViewContext.Writer.Write(string.Format("<ul{0}>rn", attrs));  
    	}
    
    
    
        public IHtmlString Item(string item)  
    	{  
    		return new HtmlString(string.Format("t<li>{0}</li>rn", item));  
    	}
    
    
    
        public void Dispose()  
    	{  
    		_helper.ViewContext.Writer.Write("</ul>rn");  
    	}  
    }
    
    public static class HtmlHelperExtensions  
    {  
    	public static HtmlList<TModel> BeginList<TModel>(this HtmlHelper<TModel> helper, object htmlAttributes = null)  
    	{  
    		return new HtmlList<TModel>(helper, htmlAttributes);  
    	}  
    }  
}  
```



A couple of notes:


- By extending HtmlHelper an added bonus is that the HtmlHelper object can be passed into the object that is returned from BeginList. This means we are able to write to the view context directly within the constructor of that object, and then in the Dispose() method that is automatically called for us at the end of the using block. This is unit testable since we are not using something like Response.Write, we are using the writer within the view context of the HtmlHelper the BeginList method is called from.
- The <TModel> isn't necessary in this case, but I deliberately included it to demonstrate how things like Html.FieldFor can be implemented in your custom helpers. See below for a code example.
- Building HTML string is ugly and nasty and takes away from the advantages of the nice clean code in the view. Fortunately, thanks to the wonders of Visual Studio extensions, it's possible to [compile Razor helpers into a class library](http://www.chrisvandesteeg.nl/2010/11/22/embedding-pre-compiled-razor-views-in-your-dll/#axzz1FGuO40YQ).
- I haven't taken HTML encoding into consideration with the HTML attributes, but I probably should have. A convention I think I want to follow is I pass in a string if it should be encoded (be it implicitly after passing into a pre-compiled Razor view that outputs it with a @, or explicitly in my code) and an IHtmlString if it's HTML that shouldn't be encoded.
- If you have something that could be called with or without a using block (i.e. sometimes it has HTML nested within it, sometimes it doesn't) then I have been having two extension methods for HtmlHelper of the same name (except the using block one has "Begin" at the start for the aforementioned reason) and the class that is returned from the method is passed a flag into the constructor so it knows whether to output the closing HTML in the constructor or within the Dispose() method. If you do this then you should override ToString() so that prefixing the non using version with a @ doesn't output the class name to the page.



One of the magic things about the Html object inside MVC views is it already knows about your model class if you have a strongly typed view. This is because Html is of type HtmlHelper<TModel> where TModel is your model type (if the view isn't strongly typed I believe it uses dynamic as the type instead). Thus you can have code like the following with code completion and no need to specify the model type:



    Html.FieldFor(m => m.SomeFieldInYourModel)



You can do the same things if you pass the <TModel> through everywhere like I had above. An example of a method implementation that you might have that does something similar to FieldFor is:  
````csharp  
	public IHtmlString ItemFor<TProperty>(Expression<Func<TModel, TProperty>> expression)  
	{  
		var metadata = ModelMetadata.FromLambdaExpression(expression, \_helper.ViewData);  
		return new HtmlString(string.Format("t<li><strong>{0}:</strong> {1}</li>rn", metadata.PropertyName, expression.Compile()((TModel)\_helper.ViewContext.ViewData.Model)));  
	}  
```

This is pretty powerful stuff and means you can write really terse views that have implicit knowledge about the model it is encapsulating and provide great intellisense along the way making the views a lot easier to write.


I've [included a zip file](http://media.robdmoore.id.au/uploads/2011/03/SimulateTagSyntaxWithRazorTemplating.zip) of a sample project created in Visual Studio 2010.

