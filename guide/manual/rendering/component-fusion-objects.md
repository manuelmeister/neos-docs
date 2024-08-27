url: /guide/manual/rendering/component-fusion-objects
# Component Fusion Objects

Neos.Fusion:Component, Neos.Neos:ContentComponent and Neos.Neos:Editable explained

On this page, we show the most important Fusion prototypes shipped with Neos and Flow: Neos.Fusion:Component and Neos.Neos:ContentComponent.

The automatically generated API documentation for all Node Types can be found [in the reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html). There, all properties are specified, wherehas here, we try to focus on common use cases.

[Open the Fusion Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html)

**Components** are the main building blocks of Fusion which contain markup and templates. They provide encapsulation and reusability.

In case your Fusion component **should render a Content Node**, make sure it extends from `Neos.Neos:ContentComponent.`

In case your Fusion component is a plain "atom" which has no connection and knowledge of a Node, extend from `Neos.Fusion:Component`.

### Neos.Fusion:Component

`Neos.Fusion:Component` is the base component prototype. It takes its **properties** and exposes them on the `renderer` as `props`. This leads to well-encapsulated components with a defined API, looking roughly like this:

```neosfusion
prototype(My.Package:MyComponent) < prototype(Neos.Fusion:Component) {
  # public API
  title = ''
  description = ''

  # implementation
  renderer = afx`
    <section class="my-component">
      <h2>{props.title}</h2>
      <div>{props.description}</div>
    </section>
  `
}
```

> **💡 Neos.Fusion:Component allows arbitrary markup**
> 
> With Neos.Fusion:Component, you can create arbitrary markup which is not modified in any way.

### Neos.Neos:ContentComponent

Additionally, there is  `Neos.Neos:ContentComponent` , which provides integration into the Neos UI. 

**It inherits from Neos.Fusion:Component and adds the Content Element Wrapping.** The content element wrapping is responsible for ensuring a Node (represented by a Fusion object) is properly usable **inside the Neos Backend**. In detail, it does the following:

*   Ensure that a single wrapping tag exists inside the component. If not, a wrapping `<div>` is added.
*   The wrapping `<div>` gets additional CSS classes and data attributes if rendered in the backend, needed for the Neos User Interface - containing f.e. the currently rendered node's identifier, the currently rendered Fusion path, and the Node's properties as JSON.
*   For this to work, the current `node` is read from the Fusion context by `Neos.Neos:ContentElementWrapping`.

##### What features does the Content Element Wrapping enable?

Content element wrapping is the basis for the following features:

*   the possibility to select a Node in the Neos backend, directly on a page.
*   the blue border around a selected node, and the floating toolbar attached to it.
*   If a new child node is added, refresh only the single node, and not the whole page.
*   If the node is removed, remove the node without refreshing the whole page.
*   If a property is changed in the Inspector (and it is marked with `reloadIfChanged: true` in `NodeTypes.yaml`), reload only the single Node and not the whole page.

##### How should Neos.Neos:ContentComponent be used?

A common pattern is to define the markup inside a plain `Neos.Fusion:Component`, and then reuse that inside a `Neos.Neos:ContentComponent`, like in the following example:

```neosfusion
prototype(My.Package:Content.Section) < prototype(Neos.Neos:ContentComponent) {
  # Edited in inspector
  title = ${q(node).property('title')}
  # Inline Edited
  description = Neos.Neos:Editable {
    property = "description"
  }

  # delegate the implementation to the plain component
  renderer = My.Package:Atoms.Section {
    title = ${props.title}
    description = ${props.description}
  }
}

prototype(My.Package:Atoms.Section) < prototype(Neos.Fusion:Component) {
  # public API
  title = ''
  description = ''

  # implementation
  renderer = afx`
    <section class="my-component">
      <h2>{props.title}</h2>
      <div>{props.description}</div>
    </section>
  `
}
```

##### Internal Implementation

Sometimes it is useful to check out the internal implementation of a Fusion prototype, as this can help to understand how the various Fusion objects work together.

So, let's have a look into the internal implementation of `Neos.Neos:ContentComponent`:

Neos.Neos/Resources/Private/Fusion/Prototypes/ContentComponent.fusion:
```neosfusion
# internal implementation, slightly shortened
prototype(Neos.Neos:ContentComponent) < prototype(Neos.Fusion:Component) {
  @process.contentElementWrapping {
    expression = Neos.Neos:ContentElementWrapping
    @position = 'end 999999999'
  }
}

```

So, you see there is not much magic going on here:

*   We extend from `Neos.Fusion:Component`
*   Via `@process`, we take the full output and apply the content element wrapping (which does what is explained above).

### Neos.Neos:Editable

For making a property inline-editable using the Rich Text Editor, `Neos.Neos:Editable` is used - usually inside a `Neos.Neos:ContentComponent`. This looks usually like this:

```neosfusion
prototype(My.Package:Content.Section) < prototype(Neos.Neos:ContentComponent) {
  description = Neos.Neos:Editable {
    property = "description"
  }

  renderer = afx`
    <section class="my-component">
      <div>{props.description}</div>
    </section>
  `
}

```

It is recommended to delegate the markup rendering to a `Neos.Fusion:Component`, like in the example above ("How should Neos.Neos:ContentComponent be used?"). In this case, we recommend to keep the `Neos.Neos:Editable` inside the `Neos.Neos:ContentComponent`. 

It is bad practice to use a `Neos.Neos:Editable` inside a plain `Neos.Fusion:Component`, as it breaks the logical layering and might lead to inconsistencies in the Neos UI.

### Legacy Prototypes

##### Neos.Fusion:Template

`Neos.Fusion:Template` is a Fluid-backed component. For new projects, you should not use Fluid anymore to define the frontend rendering of your output. **Instead, use** `**Neos.Fusion:Component**` **and AFX.**

##### Neos.Neos:Content

`Neos.Fusion:Content` is a Fluid-backed content component. For new projects, you should not use Fluid anymore to define the frontend rendering of your output. **Instead, use** `**Neos.Neos:ContentComponent**` **and AFX.**