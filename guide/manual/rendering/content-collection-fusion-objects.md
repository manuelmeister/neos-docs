url: /guide/manual/rendering/content-collection-fusion-objects
# Content Collection Fusion Objects

Neos.Neos:ContentCollection explained

On this page, we show Fusion prototypes relevant for **rendering content nodes** in Neos. This is useful in two scenarios:

*   Inside your page template (`Neos.Neos:Page`), to render the main content of a page
*   Inside a `Neos.Neos:ContentComponent`, where you render nested content nodes (e.g. in a Multi-Column element).

The automatically generated API documentation for all Node Types can be found [in the reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html). There, all properties are specified, wherehas here, we try to focus on common use cases.

[Open the Fusion Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html)

### Neos.Neos:ContentCollection

`Neos.Neos:ContentCollection` renders child nodes of a given node. This is relevant in the following cases:

*   You want to render e.g. the _main_ content of a page (which is a Node with NodeType Neos.Neos:ContentCollection, containing different child node types)
*   You want to render a child node of NodeType Neos.Neos:ContentCollection, e.g. in a multi-column element.

`Neos.Neos:ContentCollection` always renders a wrapping <div> element, which is enriched with additional attributes needed for the Neos inline editing to work.

Basically. it works like this (in Pseudocode):

```php
// Pseudocode, simplified
$collectionNode = $node->getNode("main"); // configurable path
$output = '';
foreach ($collectionNode->getChildren() as $childNode) {
    $nodeTypeName = $childNode->getNodeTypeName();
    $output .= renderFusion($nodeTypeName, /* context */ ['node' => $childNode]);
}
return $output;
```

As input, you can configure a node name to be used as the collection node. This node name is always searched relative to the current _context node_ (i.e. the one you can access as `${node}` in Fusion).

Then, `Neos.Neos:ContentCollection` iterates over all child nodes of the collection node. For each child node, it tries to render the fusion object with the same name as the node type. Additionally, it changes the context `node` to the child node while rendering it.

##### Practical Usage inside Pages

`Neos.Neos:ContentCollection` is most often used inside the rendering of a page.

For this example, we assume that the page node has a _main_ child node (which is usually configured as auto-created inside `NodeTypes.yaml`) with the Node Type `Neos.Neos:ContentCollection` (or a subtype).

A practical example can look like this:

```neosfusion
prototype(MyVendor.AwesomeNeosProject:Document.AbstractPage) < prototype(Neos.Neos:Page) {
    body = MyVendor.AwesomeNeosProject:Layout.Default {
        content = Neos.Neos:ContentCollection {
            nodePath = 'main'
        }
    }
}

prototype(MyVendor.AwesomeNeosProject:Layout.Default) < prototype(Neos.Fusion:Component) {
    // API
    content = ''
    menu = ''
    // Implementation
    renderer = afx`
        <section>
            Some very long markup here for the page template
            <nav>{props.menu}</nav>
            <article>{props.content}</article>
        </section>
    `
}
```

> **💡 ContentCollection should only be used inside Neos.Neos:Page or Neos.Neos:ContentComponent.**
> 
> It is discouraged to use `ContentCollection` inside `Neos.Fusion:Component`, as this breaks the conceptual layering of the Fusion objects. This is the same rule as with `Neos.Neos:Editable`.

##### Practical Usage inside ContentComponents

`Neos.Neos:ContentCollection` is also used inside the rendering of a content node with child nodes.

For this example, we assume that our Node _TwoColumn_ has two auto-created child nodes of node type _Neos.Neos:ContentCollection_, named _column1_ and _column2:_

```neosfusion
prototype(MyVendor.AwesomeNeosProject:Content.TwoColumn) < prototype(Neos.Neos:ContentComponent) {
    column1 = Neos.Neos:ContentCollection {
        nodePath = 'column1'
    }
    column2 = Neos.Neos:ContentCollection {
        nodePath = 'column2'
    }
    renderer = afx`
        <div>{props.column1}</div>
        <div>{props.column2}</div>
    `
}
```

##### Practical Usage inside ContentComponents, if they are Neos.Neos:ContentCollections themselves

For instance when building Slider node types, it is often useful to make the _Slider_ node type directly extend from node type _Neos.Neos:ContentCollection_, as this greatly reduces the number of node types involved.

In this case, the context node itself _is the ContentCollection_, so we do not need to go one level down.

This can be implemented by _not specifying the nodePath_ while rendering, as in the following example:

```neosfusion
// we assume the NodeType "Slider" is of type ContentCollection
prototype(MyVendor.AwesomeNeosProject:Content.Slider) < prototype(Neos.Neos:ContentComponent) {
    slides = Neos.Neos:ContentCollection
    renderer = afx`
        {props.slides}
    `
}
```

This idea is fully explained by core team member Sebastian Helzle in his blog:

[Blog Post: Preventing Deep Content Nesting in Neos CMS](https://mind-the-seb.de/blog/preventing-deep-content-nesting-in-neos-cms)

##### Setting additional attributes on the wrapping <div>

As stated above, `Neos.Neos:ContentCollection` always renders a wrapping `<div>`. When working with certain JavaScript libraries like sliders, these sometimes assume an exact markup structure, where no nested tags are allowed.

For this case, it is useful to know that `Neos.Neos:ContentCollection` inherits from `Neos.Fusion:Tag`, and thus, you can directly set arbitrary HTML attributes on the wrapping `<div>` by using `attributes.*` as follows:

```neosfusion
// we assume the NodeType "Slider" is of type ContentCollection
prototype(MyVendor.AwesomeNeosProject:Content.Slider) < prototype(Neos.Neos:ContentComponent) {
    slides = Neos.Neos:ContentCollection {
      attributes.class = "my-extra-css-class"
    }
    renderer = afx`
        {props.slides}
    `
}
```

##### Internal Behavior

`Neos.Neos:ContentCollection` is inheriting from `Neos.Fusion:Tag` for rendering the wrapping `<div>`, and the relevant Neos backend attributes.

Internally, it uses `Neos.Neos:ContentCollectionRenderer` for looping over its child nodes.

`Neos.Neos:ContentCollectionRenderer` extends from `Neos.Fusion:Loop` for doing the iteration of the child nodes. Every child node, in turn, is rendered then by `Neos.Neos:ContentCase`.

`Neos.Neos:ContentCase` implements the lookup how to find a Fusion prototype to use, given a Node - and by default, it says "use the node type name as fusion prototype name":

Neos.Neos/Resources/Private/Fusion/Prototypes/ContentCase.fusion:
```neosfusion
# Neos.Neos:ContentCase inherits Neos.Fusion:Case and overrides the default case
# with a catch-all condition for the default case, setting the type variable to
# the name of the current nodes' node type
#
prototype(Neos.Neos:ContentCase) < prototype(Neos.Fusion:Case) {
  default {
    @position = 'end'
    condition = true
    type = ${q(node).property('_nodeType.name')}
  }
}

```

### Neos.Neos:PrimaryContent

`Neos.Neos:PrimaryContent` wraps Neos.ContentCollection with an additional extension point, so that others can override the primary rendering of a page based on some conditions.

**In practice, this scenario is way less likely than we originally envisioned it to be - so feel free to** _**not**_ **use** `**Neos.Neos:PrimaryContent**` _**at all**_ **in your projects, and instead simply use** `**Neos.Neos:ContentCollection**` **directly.**

If you want to use `Neos.Neos:PrimaryContent`, the following rules apply:

*   There should be only one usage of `Neos.Neos:PrimaryContent` on any given page.
*   This means: only use `Neos.Neos:PrimaryContent` inside `Neos.Neos:Page`. Never use `Neos.Neos:PrimaryContent` inside `Neos.Neos:ContentComponent`.

##### Internal Behavior

`Neos.Neos:PrimaryContent` extends from Neos.Fusion:Case, and, by default, delegates rendering to Neos.Neos:ContentCollection. This can be nicely seen in the default implementation:

Neos.Neos/Resources/Private/Fusion/Prototypes/PrimaryContent.fusion:
```neosfusion
# Primary content should be used to render the main content of a site and
# provides an extension point for other packages
#
prototype(Neos.Neos:PrimaryContent) < prototype(Neos.Fusion:Case) {
  nodePath = 'to-be-defined-by-user'

  @context.nodePath = ${this.nodePath}
  @ignoreProperties = ${['nodePath']}

  default {
    condition = true
    renderer = Neos.Neos:ContentCollection {
      nodePath = ${nodePath}
    }
    @position = 'end'
  }
}

```