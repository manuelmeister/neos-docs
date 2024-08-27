url: /guide/features/routing
# Routing

The router makes sure that a requested URI finds the correct controller to handle the request. So we can differentiate between two types of routes:

*   Routes that point to a package controller, where you implemented your own PHP. Learn more about this in the [Flow documentation](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Routing.html) and the ["Creating a plugin"](https://docs.neos.io/cms/manual/using-neos-with-php-flow/creating-a-plugin#configure-routes) section.
*   Routes that point to a document node. (see below)

## Understanding document node routing 

Neos saves all content in the Content Repository in a tree structure. To map routes to document nodes, each document has a `uriPathSegment`.

An example, if your document nodes look like this:

 :
```directory
Root node
|-- Page 1 (uriPathSegment: 'page_1')
    |-- Subpage 1 (uriPathSegment: 'subpage_1')
    |-- Subpage 2 (uriPathSegment: 'subpage_2')
|-- Page 2 (uriPathSegment: 'page_2')
    |-- Subpage 1 (uriPathSegment: 'subpage_1')
    |-- Subpage 2 (uriPathSegment: 'subpage_2')
```

The route `/page_1` would be matched to the document "Page 1", which will then be rendered.

The route `/page_1/subpage_2` will be split based on the slashed. The first part matches the document node "Page 1", the second matches "Subpage 2". So Subpage 2 will be rendered.

Since we have a tree structure you can see that two `uriPathSegment: 'subpage_1'`. This is ok, since they have a different parent.

![](/_Resources/Persistent/eebb18be66a9b6a2f9433e56773ff61295b4bf81/uriPathSegment%20inspector.png)

The uriPathSegment can be set in the document node inspector.

If you define content dimensions (e.g. languages) they will be the first part of the route. [Read more about content dimension routing here.](https://docs.neos.io/cms/manual/content-repository/content-dimensions#behind-the-scenes-routing)

> **💡 Background**
> 
> Under the hood Neos provides a class `Neos\Neos\Routing\FrontendNodeRoutePartHandler` which matches all document node URIs and rendered the corresponding document node.  
>   
> So there's actually just one routing mechanism, which you will most likely not need to touch.

## Configurable URI suffix

By default frontend routes have a suffix of ".html". This can be changed with the `defaultUriSuffix` variable of the Neos routes.

For example, in order to remove the suffix, the following lines can be added to the `Settings.yaml` file of a distribution:

Settings.yaml:
```yaml
Neos:
  Flow:
    mvc:
      routes:
        'Neos.Neos':
          variables:
            'defaultUriSuffix': ''
```

## Custom Frontend Routes

To adjust the routing behavior more profoundly, custom routes can be added:

Routes.yaml:
```yaml
-
  name:  'Custom'
  uriPattern: '{node}/custom.html'
  defaults:
    '@package':    'Neos.Neos'
    '@controller': 'Frontend\Node'
    '@action':     'show'
    '@format':     'html'
    custom:         true
  routeParts:
    'node':
      handler: 'Neos\Neos\Routing\FrontendNodeRoutePartHandlerInterface'
```

It's important to configure custom routes so that they are evaluated _before_ the default Neos routes:

Settings.yaml:
```yaml
Neos:
  Flow:
    mvc:
      routes:
        'Some.Package':
          position: 'before Neos.Neos'
```

With the example above, incoming requests with a "custom.html" suffix will set an additional argument `custom` that can be accessed from Fusion to render a custom representation of a node for example:

SomeDocument.fusion:
```neosfusion
prototype(Some.Package:SomeDocument) < prototype(Neos.Fusion:Component) {
    renderer = Neos.Fusion:Case {
        custom {
            condition = ${request.arguments.custom}
            renderer = Some.Package:SomeDocument.Custom
        }
        default {
            condition = true
            renderer = Some.Package:SomeDocument.Default
        }
    }
    @cache {
        mode = 'dynamic'
        entryDiscriminator = ${request.arguments.custom ? 'custom' : 'default'}
        context {
            1 = 'node'
            2 = 'documentNode'
            3 = 'site'
        }
    }
}

prototype(Some.Package:SomeDocument.Custom) < prototype(Neos.Fusion:Component) {
    renderer = afx`
        <p>Custom</p>
        <Neos.Neos:NodeLink>Default</Neos.Neos:NodeLink>
    `
}

prototype(Some.Package:SomeDocument.Default) < prototype(Neos.Fusion:Component) {
    renderer = afx`
        <p>Default</p>
        <Neos.Neos:NodeLink arguments.custom={true}>Custom</Neos.Neos:NodeLink>
    `
}
```

#### Limit custom routes to node types

With Neos 7+ the `nodeType` option can be specified to limit the custom route to nodes of the specified type:

Routes.yaml:
```yaml
-
  name:  'Custom'
  # ...
  routeParts:
    'node':
      handler: 'Neos\Neos\Routing\FrontendNodeRoutePartHandlerInterface'
      options:
        nodeType: 'Some.Package:SomeDocument'
```

## Further reading

*   [More about Content Dimension Routing](https://docs.neos.io/cms/manual/content-repository/content-dimensions#behind-the-scenes-routing) 
*   [Routing in the underlying Flow Framework](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Routing.html)
*   [Schöne Urls mit Neos für Plugins \[DE\] (Stephan Meier)](https://www.stephan-meier.com/schoene-urls-mit-typo3-neos/)
*   [Convert Plugin URL to SEO URL](https://discuss.neos.io/t/solved-convert-plugin-url-to-seo-url/2495)
*   [Changing the Neos backend url \[DE\] (Blog by Kaufmann Digital)](https://www.kaufmann.digital/tech-wissen/neos-cms/neos-backend-url-aendern)