---
layout: post
title: Type-inferenced constants in abstract, generic base classes
date: 2012-05-04 20:15:57.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- Windows Azure
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
excerpt: Two techniques for constants that are accessed in an abstract, generic base
  class that are dependent on the generic implementation type.
---


Today I was creating a set of worker threads that periodically pull a whole heap of data from an on-premise database and upload it to Azure for processing. One of the things that these threads needed was the table name for the on-premise database table. This was obviously different for each thread implementation.



I had a base, abstract class that took the <abbr title="Data Transfer Object">DTO</abbr> class that was being abstracted as a generic type and performed all the logic within the thread (given it was the same for each implementation bar a couple of minor details).



The first way that we implemented the constant for the on-premise table name was via a protected, abstract property. This is nice, because it forces you to implement it for each implementation meaning you can't forget it:



```csharp
    public abstract class BaseBulkLoader : IBulkLoader where T : IBulkLoadedEntity
    {
        protected abstract string TableName { get; }
        ...
    }
```



This is a nice way of doing it, but then I had a situation where I had a second type of bulk processor for each entity type (I needed another one that periodically send the identifier for all current records so that a comparison could be made to delete any old records). At this point a magic string would either reside in both implementations (ugh) given the table name is the same, or the better solution would be to have a constants class (or config file) that contained the table name in a single place.



Even still, it seemed really messy to me to have to reference a constant class twice, given the base class already had the entity type and thus should be able to find the table name using that type somehow. Thus, my type-inferenced constants implementation was subsequently born:



```csharp
    public static class BulkProcessorConstants
    {
        public static readonly List<Tuple<Type, string>> TableNames = new List<Tuple<Type, string>>
        {
            TableName<Entity1>("ENTITY_1_TABLE"),
            TableName<Entity2>("ENTITY_2_TABLE"),
        };
        #region Helper
        private static Tuple<Type, string> TableName<TEntity>(string s) where TEntity : IBulkLoadedEntity
        {
            return new Tuple<Type, string>(typeof(TEntity), s);
        }
        #endregion
    }
    public static class BulkProcessorConstants<T> where T: IBulkLoadedEntity
    {
        public static string Table {
            get
            {
                return BulkProcessorConstants.TableNames.Single(t => t.Item1 == typeof(T)).Item2;
            }
        }
    }
```



I could have simply done a set of if statements or a switch on the type name in the BulkProcessorConstants<T> class, but I wanted to make it really easy to read and modify the code so it was more maintainable.



With this implementation, all that is needed to get the table name in the base class is: BulkProcessorConstants<T>.Table!



Another nice side-effect of this strategy is that it groups all the magic strings together in a constants class rather than having them lying around in all the different implementations. If the table names change depending on deployment environment it would make sense to move them out to a config file.

