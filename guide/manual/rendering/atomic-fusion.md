url: /guide/manual/rendering/atomic-fusion
# Atomic.Fusion

Advanced Fusion Principles 

## The Foundations of Atomic Fusion

[![Atomic.Fusion and a living style guide for Neos](/_Resources/Persistent/de8136381b92439f4e092df988a7ff8eb4b8951d/Youtube-lIY0epkqwxg-maxresdefault.jpg)](https://www.youtube.com/watch?v=lIY0epkqwxg)

Atomic fusion is a set of principles and derived patterns that help creating Neos projects that are flexible and maintainable over time. Those patterns may look like an overhead at first and probably are if you are creating very small one-off sites, but once the projects get bigger and changes have to be made the Atomic.Fusion principles really pay off. Experience tells that developers once familiar to Atomic.Fusion will stick to it for all project sizes.  
  
Atomic.Fusion largely relies on four concepts:

1.  **Separation**: Rendering is strictly separated from data acquisition and transformation. While the rendering is done with so-called presentational components, handling the data happens solely on the integration side.
2.  **Isolation**: The presentational components depend exclusively on the props they are handed which allows for rendering without side-effects. They encapsulate all that is needed for displaying the api-data.
3.  **Aggregation**: Simple presentational components are aggregated into complex components. Props are passed down within these aggregates.
4.  **Colocation**: All components are structured into a form where all related CSS and Javascript code is within the same component directory.

## Separation

The first core principle of Atomic Fusion is to strictly separate the presentation (rendering) from the integration (fetching and transforming data) of the project. Both aspects are strictly separated into different folders and fusion namespaces. While this may look like a bit of an overhead at the beginning it creates a high internal reusability and flexibility and will pay off over time.

Private/Fusion/Presentation/Components/Header.fusion:
```neosfusion
prototype(Vendor.Package:Components.Header) < prototype(Neos.Fusion:Component) {
    headline = null
    subheadline = null
    isMain = false														  
        
    renderer = afx `
        <hgroup class={props.isMain ? 'main' : null}>
            <h1>{props.headline}</h1>
            <h2>{props.subheadline}</h2>
        </hgroup>
    `
}
```

Notice that on the presentation side no code exists that fetches data from nodes or the deals with inline editing. The presentational component only renders props to html without non-trivial transformations.

Private/Fusion/Integration/Content/Header.fusion:
```neosfusion
prototype(Vendor.Package:Content.Header) < prototype(Neos.Fusion:Component) {
    isMain = ${q(node).property('isMain')}
	headline = Neos.Neos:Editable {
        property = 'headline'
    }
    subheadline = Neos.Neos:Editable {
        property = 'subheadline'
    }

    renderer = Vendor.Package:Components.Header {
        @apply.props = ${props}
    }
}
```

The integration side is responsible to fetch data from the nodes or APIs and pass it over tho the presentational side. Inline Editable fields are also defined at this stage and are passed to the presentation as normal props.

## Isolation

A presentational component encapsulates all rendering aspects like markup, styles and scripts behind its fusion API.

Markup, styles and scripts are a secret of the respective component and are not to be used without it. This allows to makes changes to the rendering non breaking as long as the component API stays the same.

Isolation also means that while presentational components are used in other presentational components they are not allowed to extend each. Inheritence between presentational components would make the secrets of one component secrets of another one and would make changing them hard. 

An important aspect of Isolation is that presentational prototypes should also be tested in isolation. The neos core does not offer such functionality yet but you may use party packages like [Sitegeist.Monocle](https://www.neos.io/download-and-extend/packages/sitegeist/sitegeist-monocle.html) for that. This even allows to have a separate step of approval before the nodetypes and the fusion integration are defined.

## Aggregation

Larger presentational components are usually built by aggregating smaller components and passing down props.

```neosfusion
prototype(Vendor.Package:Components.Section) < prototype(Neos.Fusion:Component) {
    headline = null
    text = null
        
    renderer = afx `
        <section>
            <Vendor.Package:Components.Headline>{props.headline}</Vendor.Package:Components.Headline>
            <Vendor.Package:Components.Text>{props.text}</Vendor.Package:Components.Text>
        </section>
    `
}
```

It is strongly recommended to structure the namespace of the presentational components according to the design system you are implementing. A good example for a component structure but not the only one possible is defined by [Atomic Design](http://atomicdesign.bradfrost.com/) which structures the presentational components into atoms, molecules, organisms and templates.

## Colocation

A presentational component should be colocated with all Styles and Scripts in a single folder. This makes editing of components much easier and also allows to copy components with all styles and scripts between projects. Another benefit is that components that are not used anymore can be removed together with all resources very easy.

## Hungry for More?

Learn more about real life usage:

[![Tasty Atomic Fusion recipes for your website](/_Resources/Persistent/7482cbefb2929589f6eb251eface437a6194446c/Youtube-_8fv1D0zVLo-maxresdefault.jpg)](https://www.youtube.com/watch?v=_8fv1D0zVLo)

[![Neos Con 2019 | Sebastian Flor: Atomic Fusion for Large Projects](/_Resources/Persistent/457ea4af2b94bf9b8ccf66c9a5af01b01343f552/Youtube-lBy5YKMrVZA-maxresdefault.jpg)](https://www.youtube.com/watch?v=lBy5YKMrVZA)

#### Even more?

*   [Living Styleguides with Monocle](https://github.com/sitegeist/Sitegeist.Monocle/blob/master/README.md#a-living-styleguide-for-neos)

There is distinct channel #project-atomic-fusion in the Neos slack where atomic fusion and related topics are discussed. Please join and share your experiences and ask questions.