url: /guide/contributing-to-neos/event-sourced-content-repository/the-graph-projection
# The Graph Projection

The graph projection of the CR is the main projection being used. It answers all questions regarding the hierarchy and the content of nodes. It is carefully balanced for good read performance, while at the same time making most write operations quick as well. Next to the overal event sourced CR architecture, the graph projection is basically the second big focus area we are revamping.

#### Content Graph vs Content Tree

You might wonder why we speak of the content graph and not the content tree, although all content in Neos is tree structured. If you look at an individual content stream and dimension space point (say the live website in language english), you will always see a tree of nodes. However, the content graph needs to remember all content streams and dimensions simultaneously, and the result of this is a (directed, acyclic) graph.

The content graph is a singleton you can always inject - and then you will ask for the appropriate subgraph by passing a content stream identifier and a dimension space point. The subgraph could also be called “content tree”, but because we support multiple root nodes, naming it subraph is still more correct.

The subgraph then has all the usual tree traversal methods you can expect.

#### The basic database stucture

Basically, there exists a nodes table for storing the actual node data, and a hierarchy edge table for storing the hierarchical structure between the nodes. At the end of the chapter, you will hopefully have a good understanding about the tradeoffs; but for now let’s just start with the **properties of the node table**:

*   node aggregate identifier
*   origin dimension space point
*   properties
*   relation anchor point

the **hierarchy edge table** contains:

*   content stream identifier
*   dimension space point
*   node name
*   parent relation anchor point
*   child relation anchor point  
    

First, you see that the identity of a node (node aggregate identifier, dimension space point, content stream identifier) is split across both tables - which looks weird at first. To understand this, we need to take a step back and discuss the core idea of the graph projection:

#### The Core Idea

**We want to make all reads fast by always explicitely traversing edges** (no matter which content stream or dimension space point we are in).

Furthermore, we want to **make most operations fast** (e.g. set node property, move node, ...), no matter where in the tree they are executed. This comes with one exception: We allow the forking of a cotent stream to be a little slower.

> **ℹ️ Tradeoffs in old CR**
> 
> in the old CR, the tradeoff is fundamentally different: Creating a new workspace is a no-operation, but e.g. moving a node becomes more and more expensive depending on the number of sub nodes existing, and reading nested workspaces becomes more and more difficult because the overlays are calculated at runtime.

Thus, we ensure there is a materialized edge for every content stream and dimension space point where this node is visible; but at the same time we do not want to copy the nodes themselves around, as they might carry a lot of data. This means in practice:

*   When we create a new node which is visible in american english and shines through in british english, we create two incoming edges (one for american english, one for british)
*   when we fork a content stream, we copy all edges from the original content stream (no matter what their dimension space points are) to the new content stream.

To make especially the second case somehow fast, the copying is done directly in SQL; and that is why the content stream and dimension space points are stored in different fields at the hierarchy edge.

#### Traversing node and edge structure

This means a node exists in a given dimension space point and content stream only if it has an incoming edge labelled with exactly these attributes.

Thus, in order to traverse from a node to let’s say its parent, we have to join the child node to the hierarchy edge, ensure this edge is in the selected dimension space point and content stream (as imposed by the subgraph), then join the parent node and AGAIN join with its incoming edge (filtered by dimension space point and subgraph) to ensure there is an incoming edge in the correct dimension space point and content stream - ergo that the parent node exists in that subgraph and has not been deleted.

By using this database structure, most common operations are implemented with constant work (O(1)):

*   setting a node property might involve creating a new node to break aprt structural sharing (see below), but then the property can be directly set.
*   creating a node or a new translation just involves creating the new node and setting the incoming edges
*   moving a node is simply done by re-pointing the corresponding hierarchy edges
*   removing nodes is more expensive, as child nodes need to be removed recursively as well - so that is O(n) in the number of child nodes.
*   disabling nodes is also more expensive - again O(n) in the number of child nodes.  
    

#### Structural sharing of nodes - copy on write

Let’s focus on the fork operation for a bit: When we copy all edges from the source content stream to the new content stream, every node will suddenly have two incoming edges instead of one. Thus, if we would modify the node directly (let’s say we want to update a property value), we would AUTOMATICALLY also change the node in the different content stream.

However, this would be a clear violation of the content stream concept, which says the content streams must be independent.

> **ℹ️ No Auto-Shine Through**
> 
> At first sight, it may look tempting if a property change “shined through” automatically. However, this would also mean that a change on the child content stream (e.g. your user workspace) would directly be visible on the parent content stream (e.g. the live workspace) - and this would clearly violate the encapsulation and transaction assumptions about the content streams.

Thus, we need to ensure that, if a node is structurally shared (as the result of a copy on write operation) by different content streams, these streams can rvolve independently. Thus, we create a local copy of the node before modification, if it is used by two different content streams simultaneously.

#### Relation Anchor Points

To be able to distinguish two nodes with the same node aggregate identifier, we need a new, internal identifier, which we can use to do our joins: The relation anchor point.

The relation anchor point is a purely graph-projection internal functionality to be able to implement this copy on write:

*   when we create a new node, we automatically generate a new relation anchor point in the projector
*   we use this relation anchor point as identifier in the hierarchy edge table to join the hierarchy edge table with the node table
*   the relation anchor point MUST NEVER be read from the database as part of a select statement, so the PHP code is not able to return it back to userland.
*   the relation anchor point must only be used for joining node and hierarchy edge tables together.

TODO explain origin DSP

At this point, you should now understand all about the SQL structure of the node and hierarchy edge table.