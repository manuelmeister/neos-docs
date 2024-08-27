url: /guide/manual/content-repository/references-vs-properties
# 9.x: References vs Properties

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

Up until Neos 8, references are basically just properties of type Node (`reference`) or array of Nodes (`references`), meaning that if you call `NodeInterface::getProperty($someReferenceProperty)` , you'd get the referenced node(s).

This comes with one major drawback: reference properties cannot be resolved in inverse direction, i.e. you need additional tooling like Elasticsearch to find out which other nodes reference an given node.

This changes fundamentally with the Content Repository rewrite in Neos 9.

## References as first class citizens

While there were only nodes before, the new Content Repository comes with a new concept: **references**. These are modeled as edges connecting the two nodes in the content graph, allowing traversal in both directions.

References are also represented by their own PHP read model class, consisting of

*   the target node
*   a name (the property name declared in the source node's NodeType)
*   (optional) properties of the reference

## Declaring references

Reference property declaration has changed in only one aspect: It is now possible to really restrict references to certain node types, not just the UI editor:

```
'Acme.Site:DemoNode':
```

This will effectively prevent referencing anything other than nodes of type `Acme.Site:ReferenceableNode`for this property on CR level, not just in the Neos UI.

## Properties on references

Another new feature is that references - now that they are objects themselves - can have their own properties. This comes in really handy if you want to further describe the relation between the two nodes, as in "Node B is related to node A in that...". Properties work on references basically the same way they do on nodes, with the exception that reference properties cannot be of type `reference(s)`themselves. They can be declared in the node type configuration as follows:  
`'Acme.Site:DemoNode':`  
  `properties:`  
    `referencePropertyWithProperties:`  
      `type: reference`  
      `properties:`  
        `text:`  
          `type: string`  
        `postalAddress:`  
          `type: 'Acme\Site\Domain\PostalAddress'`  
    `multipleReferencesPropertyWithProperties:`  
      `type: references`  
      `properties:`  
        `text:`  
          `type: string`  
        `postalAddress:`  
          `type: 'Acme\Site\Domain\PostalAddress'`

> **ℹ️ Limitations in the Neos UI**
> 
> Properties on references can currently only be set using the CR's command API, the Neos UI does not support editing them yet.

## Reading references

## PHP

Since references are no longer properties of a node but describe the relation between two of them, it is no longer possible to call `Node::getProperty` for reference properties. Instead, like all graph query operations, references can be resolved via the subgraph. The corresponding methods are

Reference resolution in PHP:
```php
$subgraph->findReferences(
    $sourceNodeAggregateId,
    FindReferencesFilter::create()
);
$subgraph->findReferencedNodes(
    $sourceNodeAggregateId,
    FindReferencesFilter::create()->with(referenceName: 'someReferenceProperty')
);
```

, which will return a collection of references from the source node to any target matching the filter, and

Referencing resolution in PHP:
```php
$subgraph->findBackReferences(
    $targetNodeAggregateId,
    FindBackReferencesFilter::create()
);
$subgraph->findBackReferences(
    $targetNodeAggregateId,
    FindBackReferencesFilter::create()->with(referenceName: 'someReferenceProperty')
);
```

, which will return a collection of references to the target node from any source matching the filter.

## Fusion

The FlowQuery `property` operation has been adjusted to also work with references, so you can still call

Property operation on a node property of type reference:
```neosfusion
q(node).property('someSingleReferenceProperty')
```

to fetch the referenced node(s).

In addition, there are two new dedicated FlowQuery operations available.

`references` works like `property`, but returns the reference records (including their own properties if available) instead of the resolved nodes:

ReferencingNodes operation:
```neosfusion
q(node).references()
q(node).references('someReferenceProperty')
```

to access properties of the reference, the `referenceProperty` operation can be used:

References operation:
```neosfusion
q(node).references().referenceProperty('referenceProperty')
```

And finally, the `nodes` operation can be used to retrieve the referenced nodes:

Property operation on references:
```neosfusion
q(node).references().nodes()
```

`backReferences` works in the opposite direction as `references` , returning a FlowQuery containing all references _to_ the given node.

Referencing operation:
```neosfusion
q(node).backReferences()
q(node).backReferences('someReferenceProperty')
q(node).backReferences().referenceProperty('somePropertyOnTheReference')
q(node).backReferences().nodes()
```

## Writing references

Simple references without properties can be set like before using the Neos UI. If using the PHP command API, the full feature is already available.

## SetNodeReferences PHP API

With the separation of read and write models in CR version 9+, there is no method in the node class for setting references. This is done via the content repository command API:

Issuing a SetReferences command:
```php
$contentRepository->handle(
    new SetNodeReferences(
        $contentStreamId, // the content stream to write to, e.g. the current one of the live or a user workspace
        $sourceNodeAggregateId, // the ID of the node where the reference is set
        $sourceOriginDimensionSpacePoint, // the origin DSP of the node where the reference is set
        $referenceName, // the reference (property) name to use
        NodeReferencesToWrite::fromReferences([
           new NodeReferenceToWrite(
               $targetNodeAggregateId, // the ID of the node the reference is set *to*
               PropertyValuesToWrite::fromArray(
                   'myString' => 'text',
                   'myUri' => new Uri('https://neos.io')
               ]) // some properties for the reference
           ),
           ... // additional references if required
        ])
    )
)
```

this will result in a reference being created from node`$sourceNodeAggregateId`to node`$targetNodeAggregateId`with name`$referenceName` and properties "myString" of value "text" and "myUri" with value Uri to https://neos.io