# Database

Neos provides an abstraction layer for accessing data from the database.
This level is called the content repository (CR). With the CR, direct database queries become unnecessary.

You can imagine the content repository as a tree, that is organized in a hierarchical and structured way.
Every node is identified by a unique path to the trunk. In Fact, everything you see in the navigation tree in Neos is a node,
that can be nested indefinitely. If you can think of your data as a tree, then you can build it with Neos.

![Content Repository](https://docs.neos.io/_Resources/Persistent/2b70f22b3e3d1526ea8160ca67d03e699d1d6fa0/content.dimensions.svg)

## Content Repository

The Content Repository a conceptual core of Neos. The content in Neos is not stored inside tables of a relational
database, but inside a tree-based structure:
the so-called Neos Content Repository. It can store arbitrary content by managing "nodes" that can have custom
properties and child nodes.

::: danger Is this following Quote actually true?
"The content in Neos is not stored inside tables of a relational
database, but inside a tree-based structure" [> Source](https://docs.neos.io/cms/manual/content-repository#characteristics)
:::

::: info Content
It uses a Content Repository, What is it? How does it work?
:::

## NodeTypes

::: info Content
What are NodeTypes? Basic NodeTypes 
:::

## Content Dimensions (Languages & Multisite)
