url: /guide/contributing-to-neos/event-sourced-content-repository/blocking-until-a-command-is-executed
# Blocking until a command is executed

There are a few use cases where we need to ensure that a command has been successfully executed - and additionally, the projection has updated. More specifically: the events which have resulted from the command are persisted, and the projections which listen to these events are at least at that position. This is needed in the following scenarios:

*   For some Neos UI REST API calls, we need to change some state, and then read some projection to compute the response.
*   when we re-execute commands during the rebase of a content stream, we must ensure the projection is up to date after every command, to ensure the soft constraint checks for the following command work correctly. If we would violate this condition, it would be extremely likely that all commands executed rapidly one after the other, while the projection is way behind - this would effectively disable the soft constraints during rebase.

To implement this behavior, commands return a `CommandResult` object, which just has a single method `blockUntilProjectionsAreUpToDate()`.

#### Internal Implementation

Internally, the `CommandResult` stores the event identifiers of the resulting events - because of that, the command handlers have to always use the `EventWithIdentifier` wrapper to have the identifier generated there (and not just during persistence, which would be too late to have it abailable in the CommandResult).

Then, when a projector works through its events one after the other, it stores the event identifiers it has recently seen in a list. Currently, we simply use a Flow cache for this with a short TTL.

Then, when we need to block until the projection is up to date, we simply ask the projection if all events are already in this list.

This implementation does deliberately not rely on a global ordering of all events with something like a global sequence counter; as not all event stores later on might have this functionality.

You might wonder how we ensure the recently seen event list does not grow unbounded? We arbitrarily cap it after a certain TTL: A projection does not need to answer whether it has ever seen a certain event, but instead whether it **has recently seen** a certain event.

The only point where we need this blocking behavior is inside a single request; and not during really long running work. If the user felt that he had to wait too long, he simply triggers a new request which is answered based on the current projection state.

##### Filtering Event Types

We are only allowed to ask a projection whether it has consumed an event if the projection actually handles this event type - as otherwise, it will never see this event and thus the event won’t be included in the “recently seen” list.

##### Beware of Race Conditions

We need to make sure that the _recently-seen-events-list_ is only updated after the projection is updated **and the changes are visible for everybody** - this means the database transaction updating the projection tables must have been committed.

For our projections, the `afterInvoke()` handler in the projector is too early to record the event as _seen_, because a Database Transaction is already opened [in the `EventListenerInvoker`](https://github.com/neos/Neos.EventSourcing/blob/master/Classes/EventListener/EventListenerInvoker.php#L64), method `$appliedEventsStorage->reserveHighestAppliedEventSequenceNumber()`, before calling our projector. Thus, the database transaction lives longer than our single projector invocation.

To remedy this, the [](https://github.com/neos/contentrepository-development-collection/blob/master/Neos.EventSourcedContentRepository/Classes/Infrastructure/Projection/AbstractProcessedEventsAwareProjector.php)only records the event IDs in `afterInvoke()`, and then, when [`releaseHighestAppliedSequenceNumber()`](https://github.com/neos/contentrepository-development-collection/blob/master/Neos.EventSourcedContentRepository/Classes/Infrastructure/Projection/AbstractProcessedEventsAwareProjector.php#L121) is called, we publish the event IDs to the _recently-seen-events-list_. This is basically a **deferred side-effect**, taking place only after the projection is updated and **committed**.

> **ℹ️ Implementation might change**
> 
> later on, we might further change the internal implementation; however as the public API is so minimal, it is unlikely that it will change further.