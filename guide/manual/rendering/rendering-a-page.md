url: /guide/manual/rendering/rendering-a-page
# Rendering a Page

Learning about the background

So by default a node will always be rendered by a Fusion prototype matching the NodeType (since Neos 4). This is a very handy default solution.

So when you define a NodeType like this:

```yaml
'Vendor.Example.HomePage':
  superTypes:
    'Neos.Neos:Document': true
  ...
```

It will be rendered by a Fusion Prototype defined like this:

```neosfusion
prototype(Vendor.Example.HomePage) < prototype(Neos.Neos:Page) {
    ...
}

```

This works both for content and document nodes.

If you want to learn HOW this works, and how you might adjust it, you are at the right place:

## Intro

This section explains how pages are rendered in Neos. More precisely, we show how to render a node of type `Neos.Neos:Document`. The default page type in Neos (`Neos.NodeTypes:Page`) inherits from this type. If you create custom document node types, they need to be a subtype of `Neos.Neos:Document` as well. This section also explains how to implement custom rendering for your own document node types.

![](/_Resources/Persistent/18c215d45e9f187dea8227c4eeb7c59e6f750631/Rendering%20a%20page.png)

1.  An URL is requested from Neos through an HTTP request.
2.  The requested URL is resolved to a node. This works via the Frontend `NodeController` and the `NodeConverter` of the Neos CR by translating the URL path to a node path, and then finding the node with this path. The document node resolution is completely done in the Neos core - usually, site integrators do not need to modify it.
3.  The document node is passed to Fusion, which is the Neos rendering engine. Rendering always starts at the Fusion path `root`. This rendering process is explained in detail below.
4.  Fusion can render Fluid templates, which in turn can call Fusion again to render parts of themselves. This can go back and forth multiple times, even recursively.
5.  Once Fusion has traversed the rendering tree fully, rendering is done and the rendered output (usually HTML, but Fusion can render arbitrary text formats) is sent back to the requester.

## The root path

You may already have seen a `Root.fusion` that contain a path `page` which is filled with an object of type `Neos.Neos:Page`. Here, the `Neos.Neos:Page` Fusion object is assigned to the path `page`, telling the system that the Fusion object `Page` is responsible for further rendering:

```neosfusion
page = Neos.Neos:Page {
  head {
    [...]
  }
  body {
    [...]
  }
}
```

Let’s investigate how this rendering process happens. Fusion always starts rendering at the fusion path `root`. You can verify this by simply replacing the code in your `Root.fusion` file with this snippet:

```neosfusion
root = "Hello World!"
```

All page rendering will disappear and only the words “Hello World” will be rendered by Neos.

Using the `page` path is not the recommended way to render your document node types anymore. We encourage you to define a prototype named after your document node type extending `Neos.Neos:Page`. 

## The root Neos.Fusion:Case object

The `root` path contains, by default, a `Neos.Fusion:Case` object. Here is a section from this object - to see the full implementation, check out the file `DefaultFusion.fusion` in the package `Neos.Neos`, path `Resources\Private\Fusion`.

```neosfusion
root = Neos.Fusion:Case {

  [...more matchers before...]

  documentType {
    condition = Neos.Fusion:CanRender {
      type = ${q(documentNode).property('_nodeType.name')}
    }
    type = ${q(documentNode).property('_nodeType.name')}
  }

  default {
    condition = TRUE
    renderPath = '/page'
  }
}
```

If you do not know what a `Case` object does, you might want to have a look at the [Fusion Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html#neos-fusion-reference). All paths in the `Case` object (so-called _matchers_) check a certain condition - the `condition` path in the matcher. Matchers are evaluated one after another, until one condition evaluates to `TRUE`. If it does, matcher’s `type`, `renderer` or `renderPath` path (whichever exists) will be evaluated. If no other condition matches, the `default` matcher is evaluated and points Fusion to the path `page`. Rendering then continues with the `page` path, which is by default generated in your site package’s `Root.fusion` file. This is why, if you don’t do anything else, rendering begins at your `page` path.

The current best practice is to use the `documentType` matcher by defining your own Fusion prototypes for each document type. This approach will be covered further below.

## The page path and Neos.Neos:Page object

The minimally needed Fusion for rendering a page looks as follows:

```neosfusion
page = Page {
  body {
    templatePath = 'resource://My.Package/Private/Templates/PageTemplate.html'
  }
}
```

`Page` expects one parameter to be set: The path of the Fluid template which is rendered inside the `<body>` of the resulting HTML page.

If the template above is an empty file, the output shows how minimal Neos impacts the generated markup:

```markup
<!DOCTYPE html>
<html>
  <!--
      This website is powered by Neos, the Open Source Content Application Platform licensed under the GNU/GPL.
      Neos is based on Flow, a powerful PHP application framework licensed under the MIT license.

      More information and contribution opportunities at https://www.neos.io
  -->
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <script src="/_Resources/Static/Packages/Neos.Neos/JavaScript/LastVisitedNode.js" data-neos-node="a319a653-ef38-448d-9d19-0894299068aa"></script>
  </body>
</html>
```

It becomes clear that Neos gives as much control over the markup as possible to the integrator: No body markup, no styles, only little Javascript to record the last visited page to redirect back to it after logging in. Except for the charset meta tag nothing related to the content is output by default.

If the template file is filled with the following content:

```markup
<h1>{title}</h1>
```

the body would contain a heading to output the title of the current page:

```markup
<body>
  <h1>My first page</h1>
</body>

```

Again, no added CSS classes, no wraps. Why `{title}` outputs the page title is covered in detail below.

## Adding pre-rendered output to the page template

Of course the current template is still quite boring; it does not show any content or any menu. In order to change that, the Fluid template is adjusted as follows:

```markup
{namespace fusion=Neos\Fusion\ViewHelpers}
{parts.menu -> f:format.raw()}
<h1>{title}</h1>
{content.main -> f:format.raw()}
```

Placeholders for the menu and the content have been added. Because the `parts.menu` and `content.main` refer to a rendered Fusion path, the output needs to be passed through the `f:format.raw()` ViewHelper. The Fusion needs to be adjusted as well:

```neosfusion
page = Neos.Neos:Page {
  body {
    templatePath = 'resource://My.Package/Private/Templates/PageTemplate.html'

    parts {
      menu = Neos.Neos:Menu
    }

    content {
      main = Neos.Neos:PrimaryContent {
        nodePath = 'main'
      }
    }
  }
}
```

In the above Fusion, a Fusion object at `page.body.parts.menu` is defined to be of type `Neos.Neos:Menu`. It is exactly this Fusion object which is rendered, by specifying its relative path inside `{parts.menu -> f:format.raw()}`.

Furthermore, the `Neos.Neos:PrimaryContent` Fusion object is used to render a Neos ContentRepository `ContentCollection` node. Through the `nodePath` property, the name of the Neos ContentRepository `ContentCollection` node to render is specified. As a result, the web page now contains a menu and the contents of the main content collection.

The use of `content` and `parts` here is **just a convention**, the names can be chosen freely. In the example `content` is used for the section where content is later placed, and `parts` is for anything that is not _content_ in the sense that it will directly be edited in the content module of Neos.

## The Neos.Neos:Page object in more detail

To understand what the `Neos.Neos:Page` object actually does, it makes sense to look at its definition. We can find the `Page` prototype in the file `Page.fusion` in the path `Resources\Private\Fusion` inside the `Neos.Neos` package. Here is a snippet taken from this object’s definition:

```neosfusion
prototype(Neos.Neos:Page) < prototype(Neos.Fusion:Http.Message) {

  # The content of the head tag, integrators can add their own head content in this array.
  head = Neos.Fusion:Array {
    # Link tags for stylesheets in the head should go here
    stylesheets = Neos.Fusion:Array

    # Script includes in the head should go here
    javascripts = Neos.Fusion:Array {
      @position = 'after stylesheets'
    }
  }

  # Content of the body tag. To be defined by the integrator.
  body = Neos.Fusion:Template {
    node = ${node}
    site = ${site}

    # Script includes before the closing body tag should go here
    javascripts = Neos.Fusion:Array

    # This processor appends the rendered javascripts Array to the rendered template
    @process.appendJavaScripts = ${value + this.javascripts}
  }
}
```

By looking at this definition, we understand a bit more about how page rendering actually works. `Neos.Neos:Page` inherits from `Neos.Fusion:Http.Message`, which in turn inherits from `Neos.Fusion:Array`. `Array` fusion objects just render their keys one after another, so the Page object just outputs whatever is in it. The `Neos.Neos:Page` object renders the HTML framework, such as doctype, head and body tags, and also defines the default integration points for site integrators - `head` and `body` as well as their inner objects. It is not by coincidence that these exact paths are pre-filled with sensible defaults in site package’s generated default `Root.fusion` files.

We can also see that the `body` object is a `Neos.Fusion:Template`, which is why we have to set the template path to a Fluid template which will be rendered as the body.

## Rendering custom document types

There are two basic approaches to render different document types. We currently recommend to create a Fusion prototype per custom page type, which is since Neos 4.0 automatically picked up by Neos (see below). The “old” way involves adding one root matcher per document type, explicitly checking for the node type in the condition, and redirecting Fusion to another render path. It is documented here for completeness’ sake, but we do not recommend to use it anymore.

### Prototype-based rendering

Since Neos 4.0, the root `Case` object ships with a `documentType` matcher, which will automatically pick up and render Fusion prototypes with the same name as the corresponding document node type, if they exist. This snippet of Fusion in the root `Case` is responsible for it:

```neosfusion
root = Neos.Fusion:Case {

  [...]

  documentType {
    condition = Neos.Fusion:CanRender {
      type = ${q(documentNode).property('_nodeType.name')}
    }
    type = ${q(documentNode).property('_nodeType.name')}
  }

  [...]
}

```

This means that if you have a custom page type `Your.Site:CustomPage`, you simply have to create a Fusion prototype with a matching name to get different rendering for it. 

### Explicit path rendering (discouraged)

Before document-based rendering, you had to add your own matchers to the root object to get different rendering:

```neosfusion
root.customPageType1 {
  condition = ${q(node).is('[instanceof Your.Site:CustomPage]')}
  renderPath = '/custom1'
}

custom1 < page
custom1 {
  # output modified here...
}
```

There are a number of disadvantages of doing this, which is why we recommend to stick to prototype-based rendering:

*   We are polluting the `root` namespace, adding to the danger of path collision
*   We need to copy and modify the `page` object for each new document type, which becomes messy
*   The order of path copying is important, therefore introducing possibly unwanted side effects

## Further Reading

Details on how Fusion works and can be used can be found in the section [Fusion](/guide/manual/rendering/fusion).

*   [The Neos Fusion Rendering Layer (Screencast)](https://youtu.be/wpjEIP41048)