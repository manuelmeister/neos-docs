url: /guide/contributing-to-neos/event-sourced-content-repository/workspaces-and-content-streams
# Workspaces and Content Streams

Let's do a deep-dive on the concepts surrounding Workspaces.

Here, we'll explain the concepts of a Workspace and a Content Stream in detail, including the main operations, such as forking, rebasing, and publishing.

## What is a Workspace?

If you are used to Neos, your intuitive understanding of a Workspace is absolutely correct. Here, we try to formalize it some more.

A Workspace can be seen like a **git branch** of your content. It represents a certain, named "version" of content - though a workspace _can change over time_ as the user edits things.

**Workspaces are layered**, i.e. based upon each other. There is just one **root workspace**, which (in Neos) is called _live_. All other workspaces are based upon this live workspace (directly or indirectly).

The **content of the root workspace is always used in the frontend** of the website, so that's what the end-user currently sees. When logging into the Neos backend, you always end up in your **user workspace**, which is a personal workspace just for you. All changes you do are automatically saved in this workspace, and then, on **publishing**, pushed to the base workspace (i.e. live). This means the user workspace is the only workspace you directly edit through the Neos UI.

You can create intermediate **Review Workspaces** which sit between your user workspace and the live workspace, in order to collaborate on changes before the they go live.

> **ℹ️ In the Content Repository, there are only root and non-root workspaces**
> 
> Concepts like _live_, _user_, or _review_ workspaces are implemented in Neos; and not in the underlying Content Repository.  
> There, we only distinguish between the root workspace and nested workspaces.

## A Metaphor for Workspaces

You can think about workspaces as **git branches**, which is technically quite correct. However, to the end-user, we often employ the metaphor of multiple **layers of content** on top upon each other, as depicted in the following diagram:

![](/_Resources/Persistent/4830a19c79c489f5d1d60a5e18c7fa61a308e29e/diagram.svg)

The layering metaphor (as known from image editing tools such as Photoshop) means the following to us:

*   When you create your user workspace, it is still _empty_, meaning that the content of the live workspace **shines through** completely.
*   You are now able to modify content in your personal workspace, effectively creating an _overlay,_ hiding certain parts of the original workspace; and adding other details.
*   When you publish your workspace, you effectively merge your changes to the live workspace. This is like "flattening" two layers into one.

An important consequence of the layering metaphor is the following: **Everything you did not touch** _**shines through**_ **from the base workspace. In case the base workspace is updated, these updates should be visible in your workspace as well.**

## Publishing and Discarding Workspaces

Now, for your user workspace, there are two main actions you can do:

*   You can **publish your changes:** They are **pushed down** to the base workspace.
*   You can **discard your changes**: You do not want to publish them anymore.

This means, for our mental model, we can assume that **changes in a workspace are a temporary thing** (albeit they might exist for multiple weeks or months). Furthermore, most changes created by users will end up in the live workspace eventually (as you want to make them visible to end-users).

##### Partial Publishing

It must be also possible to publish only some of the changed nodes instead of all of them. This is an important requirement for end-users – read on how this is implemented.

## Implementing Workspace Layering using Eventual Consistency

> **ℹ️ Old Content Repository: Shine-Through at Read Time**
> 
> In the non-event-sourced Content Repository (before the rewrite), we've solved the layering/shine though **at read time** when accessing the CR. This made the read side quite complex, as we needed to solve all kinds of edge-cases there.

In the Event-Sourced Content Repository, we decided to implement workspace layering **at write time** instead of read time, embracing **eventual consistency:**

![](/_Resources/Persistent/198b3529392d0d378dbe473ed53a3a15c1294baf/diagram.svg)

This means that in practice, it can take some time until a change from the live workspace is **propagated upwards** to its depending workspaces, so that the user sees this change in the user workspace.

**Why do we accept this eventual consistency here?**

*   A point where we can allow eventual consistency is a great **point for scaling out**. This will allow us to scale to more users and changes, when we allow for some slack time until a change is visible to everybody.
*   After having tried to solve the layering problem at read time (in the old CR), we feel that moving it to the write time allows us to encapsulate it in a better way, with less side-effects to other code-parts.
*   It makes the publishing process (e.g. changing something in the live workspace) independent of the number of dependent workspaces.
*   For the end-user, the system still feels very consistent, because the user is interacting with the system through the personal workspace.

> **ℹ️ It's hard to explain...**
> 
> It is hard to explain succinctly why we are using eventual consistency here; and why we solve the layering problem exactly in this way - there are different ways to solve this; and with this way, we felt we could balance our different goals (keeping complexity manageable, high performance, predictability) best.

## Propagating base workspace changes through rebase

Now, if the base workspace changes, how can we push these changes upwards to the dependant workspaces? We wanted to find a technique which aligns well with out overall event-sourced ideas – and we got inspired by **Git rebase**.

The core idea is the following: **We will "re-do" all the changes the user did (in a very fast manner), based on the new state of the base workspace.** You can imagine this like doing all typing, deleting, insertion, etc. in a very fast manner.

How is this implemented in practice? In a nutshell, like the following:

1.  **We record all commands which have been part of the original user workspace.**  
    This is done by adding the serialized commands to the event metadata of the first event which resulted from this command.
2.  **We fork again** from the base workspace's current state - pretty much like doing a clean git branch.
3.  **We re-apply all commands** one by one.

##### Re-Applying Commands can fail!

As commands contain (soft) constraint checks to ensure their prerequisites are true, the commands might not execute successfully, if something on the base has changed. As an example, if you modify content in a node; and in the new base workspace, the node (or one of its parents) has been removed, the modification cannot be applied.

Because commands can fail, we needed a new abstraction between the nodes and the workspaces: **Content Streams.**

> **ℹ️ Command Handlers must be deterministic**
> 
> Because we re-apply commands, the command handlers (which take the command and create events from them) must be deterministic: The command must encapsulate all information to ensure the same events are generated from it.  
>   
> As an example, when creating new nodes with auto-created child nodes, the nested node aggregate identifiers must be part of the command. In case the end-user did not supply them, [we generate them and store them in the command before persisting it](https://github.com/neos/contentrepository-development-collection/blob/master/Neos.EventSourcedContentRepository/Classes/Domain/Context/NodeAggregate/Feature/NodeCreation.php#L165-L167).

## Defining Content Streams

A Content Stream is the "technical location" in the database where nodes actually live – it's the thing which gets forked when a new workspace is created. Every Workspace has one assigned Content Stream, which is the one used for writing and reading.

During rebase, a new Content Stream is created, then the commands are re-applied, and if this all worked out successfully, the _current Content Stream_ of the workspace is atomically switched to the new Content Stream.

A content stream which is not in use by a workspace is some kind of _scratchpad where we can experiment and try out things_. When our experiment is completed, we can switch the current content stream of the workspace to make our changes visible to the end-user.

**Content Streams are Append-Only**: It is never possible to remove things from a content stream. In case you want to "remove" some commands from a content stream, you need to create a new content stream, add the remaining commands, and when everything worked out, you switch the current content stream.

Workspaces are the stable entry-points to the content, while the content streams are often more temporary while they are rebased or partially published.

When talking about content streams, we often say things like "the live content stream", which means "the current content stream of the live workspace". Technically, a content stream has no knowledge of workspaces pointing to it, but for the mental model, it is often valuable to connect workspaces and content streams.

## Publishing a Workspace

Now, let's discuss in detail what happens when publishing a workspace. We need to ensure that the modifications from our workspace end up in the base workspace. Technically speaking: The events from our content stream must end up in the base content stream. Furthermore, the changes should be committed atomically – either _all_ or _no_ changes should be visible in the live workspace.

In the most simple case, things happen as follows:

![](/_Resources/Persistent/a3451ee58936cf191c1f661af082e21b8ff59f32/diagram.svg)

*   The first few Events (1-3) happened on the base ("live") Content Stream before forking.
*   Then, we created our user workspace, and as part of this, also forked from the base content stream.
*   Now, we did some modifications (4 + 5) on our user workspace.
*   Then, we want to publish the whole workspace.
*   **Because nothing has happened in the base content stream in the meantime, we can simply copy the events 4 and 5 to the Base Content Stream.** _**We know that the events will apply cleanly, as projections must be fully deterministic (only depending on previous events).**_

The above case is, unfortunately, only the easy case. Let's discuss a separate case, **when something happens in the base content stream during our editing:**

![](/_Resources/Persistent/191970079e55da52c016b193cfacd295024ac6f4/diagram.svg)

**If there are changes to the base content stream in the meantime, the following happens:**

*   We rebase our content stream, by re-applying the attached commands to a fresh content stream. _**As any other rebase, this can fail due to soft constraint errors.**_
*   After the rebase is successful, we can publish the newly created content stream (same as with the simple case above)
*   Then, we again fork an empty content stream (same as with the case above), so we can start editing anew.

## Partial Publishing

Now we have enough context to discuss how to publish only certain changes of our Content Stream.

_**Important:**_ As an end-user, you do not want to specify the set of commands you want to apply; but instead you want to specify the set of **nodes** which you want to publish.

The general idea is as follows: **We want to order all commands in a way that the to-be-published commands come first – then we only publish this part to the base workspace.**

*   We split the commands from our content stream into two lists – the ones which are relevant to the nodes which we want to publish, and the remainder.  
    Each command from the _NodeAggregate_ Bounded Context needs to implement the [`MatchableWithNodeAddressInterface`](https://github.com/neos/contentrepository-development-collection/blob/master/Neos.EventSourcedContentRepository/Classes/Domain/Context/NodeAggregate/MatchableWithNodeAddressInterface.php), [so we can ask the command whether it interacts with a given node](https://github.com/neos/contentrepository-development-collection/blob/master/Neos.EventSourcedContentRepository/Classes/Domain/Context/Workspace/WorkspaceCommandHandler.php#L718).
*   Then, we start a new, empty content stream, and apply **only the to-be-published commands**. As usual, this might fail (in case of soft constraint errors).
*   We fork this "to-be-published" Content Stream again; and then apply **the** _**not**_**\-to-be-published commands.** As usual, this might fail (in case of soft constraint errors).
*   When this has all worked out, we can simply publish the first content stream (as explained above; by copying the events over to the base content stream); and keep the 2nd content stream with our remaining modifications.

## A Unified Mental Model for Workspaces and Content Streams 

![](/_Resources/Persistent/4fc0e02a81144d20ed335ebbd73c00d9ff3e85bb/diagram.svg)