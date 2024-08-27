url: /guide/manual/content-repository/property-scopes
# 9.x: Property Scopes to keep properties in sync across dimensions

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

From the Content Repository's version 9 on, properties can be scoped in regard of content dimensions, meaning they can be set per variant, be kept in sync across all variants or across specializations.

This is basically integrating the idea behind the [PunktDe.NodeReplicator](https://github.com/punktDe/nodereplicator) package into the core CR API.

Scopes can be declared on property level:

Property scope declaration:
```yaml
'Acme.Site:DemoNode':
  properties:
    unscopedProperty:
      type: string
    nodeScopedProperty:
      type: string
      scope: node
    specializationsScopedProperty:
      type: string
      scope: specializations
    nodeAggregateScopedProperty:
      type: string
      scope: nodeAggregate
```

For our examples, we'll consider the following variation graph:

This means that any content in language "de" (German) will - by default until translated - be also available in Luxembourgish ("ltz") but not in French ("fr"). Vice versa, content in "ltz" will **not** be available in "de". We call "ltz" a _specialization_ of "de", "de" a _generalization_ of "ltz" and "fr" a _peer variant_ of the others (and vice versa).  
Another term for this behavior is _**fallback**_: "ltz" falls back to "de" if no translation is available.

## Property scope "node"

**This is the default behavior.** If set to `node` (or not set at all since node is the default), the property scope ignores the other node variants when a property is set to a value.

In our example, if we set property `myString` in any language, this only affects the language variant of that node, regardless of variation mechanism.

**This is the behavior you'll want for most properties** - and it is the only way supported in the core up to Neos 8.x

In our PHP code example, running

SetNodeProperties with scope node:
```php
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'ltz']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text1'
	    ])
    )
);
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'de']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text2'
	    ])
    )
);
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'fr']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text3'
	    ])
    )
);
```

will lead to

*   value "Text1" in language "ltz"
*   value "Text2" in language "de"
*   value "Text3" in language "fr

## Property scope "specializations"

If set to `specializations`, **the property scope will affect all specialization variants** when a property is set to a value. This is particularly helpful for keeping specializations in sync, e.g. offer prices across languages but not across markets. 

In our example, if we set property `myString` in "de", this will also affect "ltz", but not "fr", because "ltz" is a specialization of "de". Changes in "ltz" or "fr" will not affect any other variants as they don't have specializations.

In our PHP code example, running

SetNodeProperties with scope node:
```php
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'ltz']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text1'
	    ])
    )
);
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'de']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text2'
	    ])
    )
);
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'fr']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text3'
	    ])
    )
);
```

will lead to

*   value "Text2" in language "ltz" (command 2 will override the value set in command 1)
*   value "Text2" in language "de"
*   value "Text3" in language "fr

## Property scope "nodeAggregate"

If set to `nodeAggregate`, **the property scope will affect all variants**. This is particularly useful for properties that must be kept in sync, e.g. an event date across languages.

In our example, if we set property "myString" in any language, it will also be set to that value in all the other languages.

In our PHP code example, running

SetNodeProperties with scope node:
```php
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'ltz']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text1'
	    ])
    )
);
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'de']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text2'
	    ])
    )
);
$contentRepository->handle(
    new SetNodeProperties(
        $contentStreamId,
        $myNodeAggregateId,
        OriginDimensionSpacePoint::fromArray(['language' => 'fr']),
	    PropertyValuesToWrite::fromArray([
		    'myString' => 'Text3'
	    ])
    )
);
```

will lead to

*   value "Text3" in all languages (command 3 is the last to be executed)