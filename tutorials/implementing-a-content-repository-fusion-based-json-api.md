url: /tutorials/implementing-a-content-repository-fusion-based-json-api
# Implementing a Content Repository Fusion based JSON API

A simple approach to expose your Neos content as JSON to the outer world.

There are several possibilities on how you can expose your content in Neos as JSON so that you can integrate it with other systems. In this tutorial we will implement a JSON API which renders the content or let's say the nodes, directly with Fusion objects.

## The Approach / Idea

The idea is that we can request the content as JSON by directly adding the extension ".json" to the end of the url path:

*   `/en/some-page/my-page` -> this will render the default HTML representation of the page
*   `/en/some-page/my-page.json` -> this will render the JSON representation of the page

For this we also define for each prototype (page and content elements)  a separate JSON Fusion prototype, which handles the JSON view rendering. If there is no JSON view provided by the given NodeType we simply render a default json view.

That's the plan :) - so let's try it out...

### Example code

You can find a fully running example on [Github here](https://github.com/Comvation/NeosExampleJsonApi).

Also feel free to create some Pull Request for improvements on the approach.

## 1\. Configure a JSON route

In order to render a JSON output we need to define a new route in Neos which handles "\*.json" requests. Depending on your site setup you need to create a new `Configuration/Routes.yaml` file in your package with the following content ([Github code here](https://github.com/Comvation/NeosExampleJsonApi/blob/main/DistributionPackages/NeosExampleJsonApi.Site/Configuration/Routes.yaml)):

Configuration/Routes.yaml:
```yaml
#
# JSON API routes
#

-
  name:  'JSON View'
  uriPattern: '{node}.json'
  defaults:
    '@package':    'Neos.Neos'
    '@controller': 'Frontend\Node'
    '@action':     'show'
    '@format':     'json'
  routeParts:
    'node':
      handler:     'Neos\Neos\Routing\FrontendNodeRoutePartHandlerInterface'
  appendExceedingArguments: true
```

## 2\. Check your Settings.yaml

Depending on your setup you still need to add your Routes definition to the `Settings.yaml` in your packages _Configuration_ folder so that it will also be evaluated during request processing, or it won't properly handle your \*.json requests.

Here is a sample configuration:

Configuration/Settings.yaml:
```yaml
Neos:
  Flow:
    # other configs...
    mvc:
      routes:
        'NeosExampleJsonApi.Site':
          position: 'before Neos.Neos'
        'Neos.Neos':
          variables:
            # We prefer URLs without the ".html" suffix
            defaultUriSuffix: ''
```

## 3\. Add the 'json' Fusion path and a Fusion Case object

Neos will render by default any request extension/format other than `html` as separate Fusion path. See the [DefaultFusion.fusion file](https://github.com/neos/neos-development-collection/blob/master/Neos.Neos/Resources/Private/Fusion/DefaultFusion.fusion) in the Neos.Neos package here or the [Neos docs here for rendering special formats](/guide/manual/rendering/rendering-special-formats).

As mentioned at the beginning we would like to be able to define separate JSON prototypes in Fusion so that we can selectively add a JSON view for some page type or content element. For this we simply add the suffix ".Json" to the NodeType name in Fusion.

Examples:

The `NeosExampleJsonApi.Site:Content.Text` prototype renders the HTML view where the `NeosExampleJsonApi.Site:Content.Text.Json` will render the JSON view.

The Fusion code looks like that ([see also Github code here](https://github.com/Comvation/NeosExampleJsonApi/blob/main/DistributionPackages/NeosExampleJsonApi.Site/Resources/Private/Fusion/JsonApi/JsonApi.fusion)):

JsonApi.fusion:
```neosfusion
json = Neos.Fusion:Http.Message {
    httpResponseHead {
        headers.Content-Type = 'application/json'
    }

    nodeTypeCase = Neos.Fusion:Renderer {
        type = ${q(node).property('_nodeType.name') + '.Json'}
    }
}
```

This json root Fusion Case will handle the start of the rendering for pages/documents.

How the JSON will look like finally will be implemented in the corresponding JSON Fusion prototype for the page/document node and the JSON Fusion prototypes for the content elements.

## 4\. Add the JSON prototypes for the page types and content elements

Almost finished :) - we now create the required JSON Fusion prototypes so that we can implement the JSON rendering logic.

First we add a JSON Fusion prototype for a page type, in our example we add a JSON Fusion prototype for our `NeosExampleJsonApi.Site:Document.Page` Fusion prototype, which will be named `NeosExampleJsonApi.Site:Document.Page.Json` (remember from the above steps, we add the "\*.Json" suffix for loading the appropriate type).

Also we restrict the JSON rendering to only render the `main` ContentCollection and the `main` ContentCollection elements of the child pages.

Check here the Fusion code for the `NeosExampleJsonApi.Site:Document.Page.Json` Fusion prototype ([Github code here](https://github.com/Comvation/NeosExampleJsonApi/blob/main/DistributionPackages/NeosExampleJsonApi.Site/Resources/Private/Fusion/Document/Page/PageJson.fusion)):

PageJson.fusion:
```neosfusion
prototype(NeosExampleJsonApi.Site:Document.Page.Json) < prototype(Neos.Fusion:Component) {
    renderer = Neos.Fusion:DataStructure {
        nodeId = ${node.identifier}
        nodePath = ${q(node).property('_path')}
        nodeUri = Neos.Neos:NodeUri {
            node = ${documentNode}
        }
        nodeType = ${q(node).property('_nodeType.name')}

        content = Neos.Fusion:Map {
            items = ${q(node).children('main').children()}
            itemName = 'item'
            itemRenderer = Neos.Fusion:Case {
                jsonView {
                    condition = Neos.Fusion:CanRender {
                        type = ${q(item).property('_nodeType.name') + '.Json'}
                    }
                    type = ${q(item).property('_nodeType.name') + '.Json'}
                    @context.node = ${item}
                }
                defaultView {
                    condition = true
                    type = 'NeosExampleJsonApi.Site:DefaultView.Json'
                    @context.node = ${item}
                }
            }
        }

        childPages = Neos.Fusion:Map {
            items = ${q(documentNode).children('[instanceof NeosExampleJsonApi.Site:Document.Page]')}
            itemName = 'item'
            itemRenderer = Neos.Fusion:DataStructure {
                type = ${q(item).property('_nodeType.name')}
                link = Neos.Neos:NodeUri {
                    baseNodeName = 'item'
                }
                path = ${q(item).property('_path')}
                title = ${q(item).property('title')}

                content = Neos.Fusion:Map {
                    items = ${q(item).children('main').children()}
                    itemName = 'item'
                    itemRenderer = Neos.Fusion:Case {
                        jsonView {
                            condition = Neos.Fusion:CanRender {
                                type = ${q(item).property('_nodeType.name') + '.Json'}
                            }
                            type = ${q(item).property('_nodeType.name') + '.Json'}
                            @context.node = ${item}
                        }
                        defaultView {
                            condition = true
                            type = 'NeosExampleJsonApi.Site:DefaultView.Json'
                            @context.node = ${item}
                        }
                    }
                }
            }
        }
    }

    @process.stringify = ${Json.stringify(value)}

    @cache {
        mode = 'uncached'
        context {
            1 = 'node'
            2 = 'documentNode'
        }
    }
}

```

If no JSON Fusion prototype can be found, it will render the `DefaultView.Json` Fusion prototype ([see also Github code here](https://github.com/Comvation/NeosExampleJsonApi/blob/main/DistributionPackages/NeosExampleJsonApi.Site/Resources/Private/Fusion/JsonApi/DefaultViewJson.fusion)).

We could also further consolidate the logic of rendering the `ContentCollection content` property and create some separate ContentCollection JSON representation, e.g.:

ContentCollectionJson.fusion:
```neosfusion
prototype(NeosExampleJsonApi.Site:ContentCollectionJson) < prototype(Neos.Fusion:Map) {

    nodePath = 'to-be-set-by-caller'

    // Neos.Node.nearestContentCollection:
    // Check if the given node is already a collection, find collection by nodePath otherwise,
    // throw exception if no content collection could be found
    @context.node = ${Neos.Node.nearestContentCollection(node, this.nodePath)}

    items = ${q(node).children()}
    itemName = 'node'
    itemRenderer = Neos.Fusion:Case {
        explicitJsonView {
            condition = Neos.Fusion:CanRender {
                type = ${q(node).property('_nodeType.name') + '.Json'}
            }
            type = ${q(node).property('_nodeType.name') + '.Json'}
        }
        defaultJsonView {
            condition = true
            type = 'NeosExampleJsonApi.Site:DefaultView.Json'
        }
    }
}

```

See also [GIthub coder here](https://github.com/Comvation/NeosExampleJsonApi/blob/main/DistributionPackages/NeosExampleJsonApi.Site/Resources/Private/Fusion/JsonApi/ContentCollectionJson.fusion).

Next we will add a JSON Fusion prototype for the Text content element ([Github code here](https://github.com/Comvation/NeosExampleJsonApi/blob/main/DistributionPackages/NeosExampleJsonApi.Site/Resources/Private/Fusion/Content/Text/TextJson.fusion)):

TextJson.fusion:
```neosfusion
prototype(NeosExampleJsonApi.Site:Content.Text.Json) < prototype(Neos.Neos:ContentComponent) {
    renderer = Neos.Fusion:DataStructure {
        nodeType = ${q(node).property('_nodeType.name')}
        text = ${q(node).property('text')}
    }
}

```

> **ℹ️ Remember the "\*.Json" suffix**
> 
> As already mentioned above, we use here also the ".Json" suffix to load the appropriate Fusion type for the JSON rendering. You can of course change this Naming to whatever you like.

## 5\. Test the JSON output

Now you can create a page using the page type for which we have created a separate JSON rendering and add some content elements, for example the Text content element for which we also have created a JSON rendering, publish the content and open your page in your browser, for example: `http://localhost:8081/my-test-page.json` and voilà here is your content as JSON :)!

## Summary

Neos has all you need to expose your content as JSON. In this tutorial we've got an idea on how we can easily render our content nodes as JSON by using Neos's Routing system and it's Fusion Prototypes. Using Neos's Fusion Scripting capabilities allows us already now to easily define which parts of our content we would like to expose to third-party systems or publicly.

Some other notes on the approach:

*   Caching: In the example above we don't cache anything. Depending on your use case you need also to think about your Caching strategy, server-side or also by using appropriate HTTP Cache headers (see also [this article](https://web.dev/http-cache/) for a good intro on this topic).
*   There are also few other undertakings or discussions on providing a "Neos API", check also the following links:
    *   GraphQL package 1: [https://github.com/bwaidelich/Wwwision.Neos.GraphQL](https://github.com/bwaidelich/Wwwision.Neos.GraphQL)
    *   GraphQL package 2: [https://github.com/ttreeagency/Headless](https://github.com/ttreeagency/Headless)
    *   Discussion: [https://discuss.neos.io/t/neos-as-headless-cms/4344/18](https://discuss.neos.io/t/neos-as-headless-cms/4344/18)

_Written by_ **Oliver Burkhalter**