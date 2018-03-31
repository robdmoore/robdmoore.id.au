---
layout: post
title: Nice label names in ASP.NET MVC 3
date: 2012-04-27 00:55:25.000000000 +08:00
type: post
categories:
- Technical
tags:
- ASP.NET MVC
- C#
author: rob
---


By default in ASP.NET MVC the label names when you use the Html.LabelFor() method are simply the property name. This is great for single word properties like Email or Name, but quickly falls apart when you have properties like EmailAddress, and FirstName.



If you have a convention for your label names (at Curtin our forms standard states we need to have Sentence case labels) then you can save yourself a lot of hassle (e.g. having to specify [DisplayName("...")] on most of the properties) by simply defining a custom metadata provider. For example, the one we use is:



```csharp
    public class MetadataProvider : DataAnnotationsModelMetadataProvider
    {
        protected override ModelMetadata CreateMetadata(IEnumerable<Attribute> attributes, Type containerType,
            Func<object> modelAccessor, Type modelType, string propertyName)
        {
            // Default metadata implementations
            var metadata = base.CreateMetadata(attributes, containerType, modelAccessor, modelType, propertyName);
            // Auto-sentence case for display name
            if (metadata.DisplayName == null && metadata.PropertyName != null)
            {
                metadata.DisplayName = metadata.PropertyName.UnCamelCaseify();
            }
            return metadata;
        }
    }
```



Then you simply need the following one-liner in Global.asax.cs in Application\_Start() to hook it up:



```csharp
ModelMetadataProviders.Current = new MetadataProvider();
```



The UnCamelCaseify() extension method simply translates from CamelCase to Sentence case.



Obviously, for complex label names you will simply use the DisplayName attribute, but I find that more than 80% of the time the sentence case conversion works a treat, which is thus a nice time saver and results in less code, which is only a good thing!

