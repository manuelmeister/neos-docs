url: /guide/contributing-to-neos/event-sourced-content-repository/enabled-and-disabled-nodes
# Enabled and Disabled Nodes

In the old CR, this was called “hidden”, but we felt that _**enabled**_ and _**disabled**_ captured the intent better.

If a node is disabled, the system should behave as if this node would not exist. This means:

*   you are not able to query for this node
*   you are not able to query for any child node: If you removed the node, all children would be removed as well.
*   these rules must only apply in frontend, when viewing the site. In backend, you should still see the disabled nodes, so that you can e.g. enable them again.

> **ℹ️ Cross-Cutting Concerns**
> 
> Because all API methods on the read side need to implement proper handling of enabled/disabled behavior, we call this a cross-cutting concern. The complexity of the CR appears to be that there are quite some distinct concerns which somehow all interleave with each other; making it hard to build a classical layered architecture which hides some of this complexity.

#### Event Structure

Modelling events for enabling/disabling of nodes is rather easy, as you only say “node X should be disabled now”; but the projection has to recursively mark all nodes below as disabled as well.

## Projector Logic

**Our basic assumption is that we want to build the transitive closure (of the start node and all sub nodes), and create a “disabling node X leads to node Y being unavailable” relationship.**

To implement that, we implemented a new database table called TODO; which says “because node X was explicitly disabled, we disable node Y”.

We fill this database table by directly walking the tree structure in SQL (via a recursive Common Table Expression); so that way we can avoid numerous roundtrips from PHP to SQL and back again.

Then, at query time, we join the nodes with this TODO table; to filter out disabled nodes if we are in the frontend.

> **ℹ️ Disabling a node is more complex than O(1)**
> 
> You might notice that disabling a node is the first operation we explained which is not having O(1) complexity - but we believe this is OK because often, the number of subnodes affected by a hide should be relatively minor compared to all the nodes in the system.

> currently we build up this table for all content streams; we could theoretically only build it for the live content stream.