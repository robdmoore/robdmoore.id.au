---
layout: post
title: IDDD Course notes
date: 2014-02-19 09:26:52.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- Domain Driven Design
- Software Engineering
meta:
  _edit_last: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


Last month I completed [Vaughn Vernon](https://vaughnvernon.co/)‘s 3-day advanced IDDD Workshop. Here are some notes I've since written up about the main points I got out of it after re-reviewing the course material. Some [notes from a colleague who attended the same course](http://gurustop.net/blog/2014/01/19/my-notes-from-vaughn-vernon-s-iddd-workshop-ddd-saasovation-agile-pm/) have also been published.


## Getting started with DDD

- DDD is the formation of a ubiquitous language explicitly bound by a “bounded context” - the context is important because the same word can have different meanings
- Hexagonal architecture / ports and adapters can be used with DDD - there are adapters from the domain to a port (either input or output - could be datasources or other systems)
- DDD should be used in situations for complex/unknown applications and problem domains that provide a competitive advantage - it is a technique to help uncover these complexities over time in a sustainable way
  - If CRUD is more appropriate - use CRUD
  - Keep in mind that investing in the code generally pays off over the long term
- DDD can be used with legacy code, but you need to abstract and encapsulate the parts of the legacy code you aren’t modelling
- DDD is about bridging the gap between technical people and subject matter experts so finding the subject matter experts (they aren’t necessarily your product owner and there might be multiple ones) is important - where possible interact with them directly for best effect
- A ubiquitous language should include the terms as well as scenarios that describe the context of those “things”
- Good general rule: Tell, don’t ask (tell objects what you want to do, don’t ask them for data)


## Domains, subdomains, bounded contexts

- Subdomains - identify the pieces of information you need for your project to be successful
  - Where possible have a one to one mapping with a bounded context unless there is a small shared kernel
- Bounded context contains: interfaces (service or UI), app services, database schema, domain itself
- Example: pull out user and identity into separate domain, then you can model more explicit things that might be mapped from that context e.g. Author, Collaborator (these could even just be a value object with an id that links to the other context)
- For each domain look at what domains it (core) is linked to and identify them as: supporting or generic


## Context maps / relationships between subdomains

- It can help to draw context maps to illustrate where the subdomains, contexts and the relationships between them are
- Ways of joining two separate (sub)domains:
  - Partnership
  - Shared kernel
  - Customer-supplier
  - Conformist
- When communicating with another domain (via OHS, web service, messaging):
  - ACL
  - Published language
  - Event subscription


## Architecture

- Ports and adapters, {infra -> UI -> application -> domain}, CQRS/ES, event-driven are some of the architectural options
  - Ports don’t have to model the domain e.g. UserInRole REST service even though there is no UserInRole domain object)
  - Adapters can map to/from domain representation e.g. UserInRoleAdapter
  - Ports and adapters allow you to focus on the domain, delay infrastructure concerns and do separate testing
- Domain services shouldn’t control security (where it’s a cross-cutting concern as opposed to something being modelled) or transactions


## Entities / Value objects

- Use entities to model things that you care about individuality
  - Equality via id
  - Avoid just doing sets - if you have two sets in a row then you are probably missing a behaviour - ask yourself if you missed a set would you be in an inconsistent state?
  - Ensure consistency by using invariants and non-default constructors
- Use value objects where possible to model things that describe, measure, qualify or quantify the ubiquitous language - should model a conceptual whole
  - Generally immutable, set state via ctor - makes it easy to test and maintain
    - Modification methods should return a new instance
  - Equality by comparing properties
  - Discardable, replaceable and interchangeable
  - If you want you can use value objects to represent the id of a particular entity (e.g. wrap guid)
- Generating identities
  - User provides
  - Application generates
  - Persistence store generates
  - Anther bounded context provides


## Aggregates

- Main purpose: determine transactional boundaries for consistency
- Balance between having a large aggregate graph that gives navigational convenience, but can result in higher likelihood of transactional errors that don’t affect consistency / negative size and performance impacts vs small aggregates that might mean a lot of messing about in application code to wrangle multiple aggregates
- Keep in mind eventual consistency - do multiple aggregates have to be kept consistent?
  - event processing / batch processing etc. - get business to specify the max time to be consistent
- Where possible reference between aggregates by id - less memory, faster to load, better garbage collection
- Can use double dispatch from an application service to pass instances between aggregates to perform actions
- Domain events are non-async
  - This means you can respond to a domain event within the same transaction
  - You can have a listener that then publishes the events to a bus (and from there they can be handled async)
  - Who job is it to make the data consistent?
    - If the end user then use transaction consistency if another user or the system then eventual consistency should be fine


## Domain Services

- A domain service is a part of the domain model that is a non-transactional, lightweight stateless operation that doesn’t have a natural home in an entity
  - If you find yourself using static methods in your domain entities then it’s a good indicator that you need a domain service
  - They can be passed into models and used via double dispatch or the model can be passed into them


## Domain Events

- Domain events inform subscribers of the facts about past happenings in a bounded context
- When domain experts use triggering works then it’s a good sign you might need a domain event:
  - When
  - If that happens
  - Inform me if
  - Notify me if
  - An occurrence of
- You can persist events along with state (or just the events if using event sourcing)
- Events can be published outside of the bounded context or processed asynchronously by forwarding them to a message exchange
  - Bus
  - Decoupled publishing e.g. atom feed
- Event-driven modelling exercise - Trello is a good example
  - Good example to do with a domain expert as a first step to fleshing out a domain
  - Leads to a good model if you plan on using event sourcing
  - 1. Model the events in time order (verb, past tense)
  - 2. Model the commands that would create the events (imperative exhortation)
  - 3. Model the aggregates that would participate in the command/event (noun)


## Modules (namespaces)

- Name the modules as per the ubiquitous language (e.g. aggregates or concepts to group an aggregate)
- Can have child namespaces e.g. concept -> aggregate
- Don’t create modules based on type of component (e.g. include services with the entities)
- Try not to couple between modules and where there are dependencies try and use acyclic graphs


## Factories

- Where possible construct objects inside of domain services and entities so the ubiquitous language is expressed
- If you have all the parameters and the construction is simple it’s ok to new up an object in an app service

