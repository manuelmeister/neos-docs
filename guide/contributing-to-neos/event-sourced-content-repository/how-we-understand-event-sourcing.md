url: /guide/contributing-to-neos/event-sourced-content-repository/how-we-understand-event-sourcing
# Event Sourcing: Our understanding

This article gives crucial background on how we apply Event Sourcing and CQRS.

Normally in web applications, people use relational databases to store their application state. Many frameworks apply patterns such as [Active Record](http://www.martinfowler.com/eaaCatalog/activeRecord.html) or [Domain Model](http://martinfowler.com/eaaCatalog/domainModel.html) to make state accessible and to modify it. No matter what pattern is used, usually an object (which proxies a database) is responsible for both reading from the state as well as updating it. This is different when using CQRS and Event Sourcing.

This allows you to separate the read from the write side; allowing to use different representations for state modification and for reading – and it allows **multiple read models** to be used (more on that later)!

![](/_Resources/Persistent/7a4b9b35134d3298acae6b543f7b727baa99f1ca/diagram.svg)

#### Events vs. classical modelling

Normally, you store state in your database. You have tables which contain e.g. the users in your system, or the contents displayed currently on your website, or your currently available products. When this state is modified, this happens rather implicitely (e.g. through some method calls resulting in database queries). **We'll now think of this state modification as an event.**

The core idea behind **Event Sourcing** is different from the conventional approach: We won't store the current state, but rather **all the events that led to it**. These events will be stored in an **event store**, which is conceptually just a long, ordered, append-only list of all events which have ever happened in the system.

This way, we can build up the current state by taking a "blank" state, then applying all events which have ever happened, and then we have the current state. Of course this would be horribly inefficient (more on this later, we're currently on the conceptual level). We call this functionality **replay**.

More than that, we're able to travel forth and back in time: We can also compute all previous states as they existed in the system.

Having access to all previous states which happened in the system is an extremely powerful paradigm: You can, for example, see, how often your data was modified. By whom. What the old value was. So you have an audit log.

Additionally (and that's for me the core benefit), you are able to take all old events in your system and use them to build up additional state for answering different questions than originally anticipated. We'll cover this in a bit.

#### Let's focus on state transitions (events)

Event Sourcing shifts the main focus from the (current) state of the system to the state transitions, which are called events. The core idea is that we store every change to the system explicitly as an event in an append-only log structure (e.g. a database table which is only ever appended to).

Events are written in past tense, as they have already happened - e.g. the event emitted when creating a node is called [**NodeAggregateWithNodeWasCreated**](https://github.com/neos/contentrepository-development-collection/blob/master/Neos.EventSourcedContentRepository/Classes/Domain/Context/NodeAggregate/Event/NodeAggregateWithNodeWasCreated.php).

We use simple, immutable data classes to encapsulate each event. These classes usually live in the [**Event**](https://github.com/neos/contentrepository-development-collection/tree/master/Neos.EventSourcedContentRepository/Classes/Domain/Context/NodeAggregate/Event) folder of a context.

#### Basic Terminology

Some terminology, following how a change is stored in the system:

*   the user creates a **Command**, which is the intention of the user. Commands are allowed to fail. The command has to be sent to the corresponding command handler by the user. Commands are written in present tense.
*   The **command handler** checks soft constraints  and additional logic as needed to create a set of **events** for the command.
*   These events are persisted in the **event store**. This is the synchronization point - so that is the indication that a state mutation has happened.
*   some time after that, the framework invokes the **projectors** to catch up on the projections
*   the projectors update the **projections** accordingly

**To again focus: This means that a command can fail, whereas an event which is persisted in the event store is never allowed to fail.**

#### Introducing Projections and the Projector 

While storing all events is giving you the full history, this is not helpful in itself for most use-cases; as you still need a way to ask questions about the current state of the system.

This is what projections are for. **A projection is some data structure (often a set of database tables) which is updated in response to an event.**

In practice this means that when moving from a non event sourced to an event sourced world, you could start off by moving your current model to a big projection; and you “just” record the changes to this model explicitly as events.

A projection for us consists of the following three parts:

*   a **data model**, which is in most cases a set of database tables
*   a **projector**, which is responsible for updating the data model in response to events
*   a **read side for querying the projection**, which is usually a Finder and associated models; but naming might sometimes be different. As an example, the _Subgraph_ of the CR is also the read side of the Graph projection, despite being named differently.

#### The projector: responsible for updating projections

Let's focus a bit on the projector - the component which is responsible for **updating** the projection.

We always think of the projector as a **pure function** (deterministic in its inputs, and side effect free), I.e. the updated data model is the result of applying the projector function with an event and the current data model as input.

Because it is a pure function, it follows that a projection can be **replayed** (completely emptied, and all events re-applied), deterministically.

To ensure this replace is always possible, you need to take care of the following things:

*   We all must ensure that the projector never consumes information not included in events - specifically you are not allowed to directly read Flow Settings or NodeType configuration; and you are also not allowed to read other projections.
*   A projector is not allowed to trigger external actions like sending mails.
*   The projector is not allowed to fail, e.g. with an uncaught exception. If it does it is always a program error.

The Neos.EventSourcing package also guarantees some important invariants, namely:

*   the EventSourcing package ensures that a projector runs at most once concurrently (by using database locks).
*   for DB based projections the EventSourcing package ensures exactly-once processing of events by creating a single DB transaction to reserve the event, call the projector with the same transaction, update the seen-state and finally commit the transaction

#### Asynchronous Projections

The projections run asynchronously, I. e. a little later after the events were persisted to the event store. This in itself is a very big shift in thinking, as it makes the whole system eventually consistent:

*   You can not rely on the fact that directly after you triggered a change, this change is visible in the projections already. We have a mechanism to enforce this (block until projections are up to date), should you need it.
*   As we query the projection from the command handler to do soft constraints checks (see below), you cannot rely on the fact that these constraints are always enforced - however they will be enforced most of the time. Thus the projector needs to deal with incorrect events in a graceful manner. _NOTE we do not do this correctly yet!!_  
    

> **ℹ️ Open Topic: Exception Handling in the Projector**
> 
> We did not implement proper exception handling in the projector yet.

Because of the focus shift to events and the determinism of projections, it is recommended to create different projections for different use cases - effectively de-normalizing the data without the normal drawbacks. In many cases (like in the event sourced CR) though, a single projection is the main one.