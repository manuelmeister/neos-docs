url: /guide/contributing-to-neos/event-sourced-content-repository/event-sourcing-in-the-cr
# Event Sourcing in the CR

We are interpreting Event Sourcing in a specific way for the content repository:

*   In the CR, we use event sourcing for storing and updating the node structure, including workspaces.
*   We do **not** use it for figuring out which content dimensions exist, or how node types are configured. These two are different bounded contexts which are not solved by event sourcing.
*   Our commands and events are mostly structured around the concept of a Node Aggregate. The node aggregate is not an aggregate for enforcing hard constraints TODO NAME?; but is instead the group of nodes in different dimensions which represent the same concept (e.g. the same page).
*   Most events are only relevant to a single **content stream**, which can be thought of like a git branch.
*   The central projection is the **Graph projection**, which is used to answer most questions about the content structure.
*   We only use DBAL, no ORM.
*   We only use soft constraints and no hard constraints, thus we have no event sourced aggregates in place.  
    

#### Core CR concepts

*   **Workspace**: logical name of a “content branch”; points to a content stream. The live workspace is the one visible in the Frontend.
*   **Content Stream**: like a git branch with the restriction of only going forward (so there is no rebase); a content stream generally has a base content stream and version (except the live/root content stream, which does not have a base) where this content stream was forked from the base.
*   **Node Aggregate**: (concept of a specific content stream) one or many nodes from different dimensions all representing the same concept (like the same page). In a Node aggregate, for each Dimension Space Point, there is at most one node.
*   **Node**: (concept of a specific content stream) a tree element in a specific dimension space point, for example in language English.
*   **Dimension Space Point**: TODO  
    

The events dealing with a single node usually have a **three-part identifier**:

1.  the Content Stream identifier where this event happened
2.  the node aggregate identifier for which the event happened
3.  the origin dimension space point to discriminate the different nodes belonging to the aggregate.

Some events also contain the affected or visible dimension space points, if an operation needs this explicit information in the projection.

#### Workspace and Dimension Shine Through

On the workspace / content stream level, we solve the old **workspace shine through** behavior, by rebasing commands to newer base content streams.

On the Node Aggregate level inside a content stream, we solve the the **dimension shine through behavior** (by making the shine throughs explicit in the command handler).

> **ℹ️ Comparison to the old CR**
> 
> In the old CR, workspace shine through and dimension fallbacks were mostly the same concept and mechanism; however when starting with the event sourced CR it quickly turned out that the two concepts differ: the workspace shine through can be done eventually consistent (as you work in a single workspace anyways); while the dimension fallback must work immediately. Furthermore, on the workspace level we need to integrate the work of different editors who work concurrently; while the dimension fallbacks are merely a mechanism to reduce the amount of content an editor has to maintain manually.

#### Content Streams and Content Publishing

So let’s focus some more on the content stream behavior: when a content stream is forked, we will record the stream version of the base stream, and the projections basically have to create a “snapshot” of their current state. Technically, the graph projection does this by copying edges and doing copy on write on the nodes (read the graph projection chapter for more details).

Then, events which modify the nodes can be added to the content stream. This content stream is like a temporary branch - after some time, it should either be discarded or its modifications should be applied to the “live” content stream. To apply changes to the base content stream, we can simply “copy” the events from our temporary content stream to the live content stream. (Technically, the copied events are new events with just a different content stream identifier.)

For this event copying to end up in a consistent state (either all or no events applied), we need to ensure that these copied events never fail, and lead to the exact same outcome as the temporary content stream. We exploit the fact that all projections need to behave like pure functions with only their events as input  - so when the temporary and the live content stream have the same sequence of events, they are guaranteed to be the same (in terms of projection state) as well.

However - this only works if the base content stream (e.g. live) has not accepted any new events in the meantime. Thus, this event copying (which we call “publishing the content stream”) will only work when the base content stream has not changed in the meantime.

So what do we now do if the base content stream changed in the meantime? We rebase the content stream by re-applying its commands on  a new content stream.

I always think of the idea of “we rapidly re-so everything the user has done, based on the new state”. You might wonder why we re-execute commands, and not events? The reason is that we need to do conflict detection at this point (because the base content stream and our content stream might have mutually conflicting changes) - and we figured out that we could re-use the soft constraints checks we already have in place. Thus, we need to re-execute all commands and after every command, we need to block until the projection is up to date (so that the soft constraints check will actually return a correct result).

This idea basically gives us lots of conflict detection almost for free, without having to think through many of the interaction cases explicitly.

> **ℹ️ Conflict Resolution**
> 
> if a conflict happens, we do not have a good strategy implemented on how to solve it yet - though there are some ideas floating around.

#### Partial Publishing

Based on the above idea, we can also partially publish a content stream, when we want to publish only a single page for instance. To implement this, we fork a new content stream, then only try to apply the commands relevant to this page; then we fork again based on the new Content stream; and then we try to apply the remaining commands.

This way, all commands related to the content we want to publish come first, and then the remaining commands appear.

When this is all successful, we can directly publish the first content stream (containing the events for the selected nodes).