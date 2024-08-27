url: /guide/manual/rendering/page-fusion-objects
# Page Fusion Objects

Neos.Neos:Page: The basis for rendering full HTML pages.

On this page, we show Fusion prototypes relevant for building **Pages in Neos**.

The automatically generated API documentation for all Node Types can be found [in the reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html). There, all properties are specified, wherehas here, we try to focus on common use cases.

[Open the Fusion Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html)

### Neos.Neos:Page

`Neos.Neos:Page` is the main prototype for rendering pages, responsible for the **full markup** of a page. This is also the place where CSS and HTML is added to the head of the page.

It is necessary to use Neos.Neos:Page to have the Neos editing work correctly.

**By default, for a Document node with a given name, the Fusion prototype with the same name is used for rendering - and it is expected that this one inherits from Neos.Neos:Page.**

A simple (but not yet useful) example looks like this:

```neosfusion
# if you have a Document Node type of the name "MyVendor.AwesomeNeosProject:Document.MyPage",
# then automatically, the Fusion prototype of the same name
# is used for rendering the page by default.
prototype(MyVendor.AwesomeNeosProject:Document.MyPage) < prototype(Neos.Neos:Page) {
    body = Neos.Fusion:Component {
        renderer = afx`
            <h1> Hello World</h1>
        `
    }
}

```

##### Adding CSS and JS

CSS can be registered via `head.stylesheets`, and JavaScript via `head.javascripts`. Both are an array (`Neos.Fusion:Join`). A common practice is using AFX and the `StaticResource` Eel Helper as follows:

```neosfusion
prototype(MyVendor.AwesomeNeosProject:Document.MyPage) < prototype(Neos.Neos:Page) {
    head {
        stylesheets.site = afx`
              <link rel="stylesheet" href={StaticResource.uri('MyVendor.AwesomeNeosProject', 'Public/Styles/Main.css')} media="all" />
        `
        javascripts.site = afx`
              <script src={StaticResource.uri('MyVendor.AwesomeNeosProject', 'Public/Styles/Main.js')}></script>
        `

    }

    // ...
}
```

> **💡 Using Neos.Fusion:Component for header content**
> 
> Instead of using `` afx`...` `` above, you can also use a separate `Neos.Fusion:Component` for the header assets, to improve reusability.

##### The Page Body Template

We suggest using a separate Neos.Fusion:Component as the page body template- which we often call **layout** (naming-wise).

A full example can then work like this:

```neosfusion
prototype(MyVendor.AwesomeNeosProject:Document.AbstractPage) < prototype(Neos.Neos:Page) {
    head {
        javascripts.site = MyVendor.AwesomeNeosProject:Resources.HeaderAssets
    }

    body = MyVendor.AwesomeNeosProject:Layout.Default {
        content = Neos.Neos:ContentCollection {
            nodePath = 'main'
        }
    }
}

																						prototype(MyVendor.AwesomeNeosProject:Resources.HeaderAssets) < prototype(Neos.Fusion:Component) {
    renderer = afx`
      <link rel="stylesheet" href={StaticResource.uri('MyVendor.AwesomeNeosProject', 'Public/Styles/Main.css')} media="all" />
    `
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

##### Internal Behavior

`Neos.Neos:Page` is basically a big array for the different parts of a page, inheriting from `Neos.Fusion:Join`. It consists of the following sections:

*   `doctype: <!DOCTYPE html>`
*   `htmlTag: <html>`
*   `headTag: <head>`
*   `head: Neos.Fusion:Join`
    *   `stylesheets: Neos.Fusion:Join`
        *   _This is what you write yourself._
    *   `javascripts: Neos.Fusion:Join`
        *   _This is what you write yourself._
    *   _You can add extra sections to the_ `_<head>_` _here yourself._
*   `closingHeadTag: </head>`
*   `bodyTag: <body>`
*   `body:`
    *   _This is what you write yourself._
*   `closingBodyTag: </body>`
*   `closingHtmlTag: </html>`

> **⚠️ Pitfall**
> 
> Make sure to not directly write to `Page` instead of `Page.body`, as otherwise your output might appear f.e. before the `<body>` tag.

### Rendering Menus and Content

Content nodes on a page are usually rendered via `Neos.Neos:PrimaryContent` and `Neos.Neos:ContentCollection`. This is explained in the [next chapter](/guide/manual/rendering/content-collection-fusion-objects).

Menus are explained [on a separate page](/guide/manual/rendering/menu-fusion-objects) as well.

### Different Page Templates

Remember that by default, for a Document node with a given name, the Fusion prototype with the same name is used for rendering. This can be used to easily implement different page templates.

It is common practice to define a project-specific `AbstractPage`, and use this as the base for every individual page.

### Legacy Prototypes

##### Neos.Neos:Document

`Neos.Neos:Document` **should not be used anymore. It does not have any legitimate use-cases.**