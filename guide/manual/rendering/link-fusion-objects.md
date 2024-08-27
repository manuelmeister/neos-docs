url: /guide/manual/rendering/link-fusion-objects
# Link Fusion Objects

On this page, we show Fusion prototypes relevant for **rendering Links** in Neos. This is useful inside all kinds of Fusion objects.

The automatically generated API documentation for all Node Types can be found [in the reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html). There, all properties are specified, wherehas here, we try to focus on common use cases.

[Open the Fusion Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html)

### Neos.Neos:NodeUri

For rendering an URI for linking to a Node, `Neos.Neos:NodeUri` should be used.

The most simple usage is passing in a `NodeInterface` object, and getting an URI string back:

```neosfusion
prototype(YourVendor:HomepageLink) < prototype(Neos.Fusion:Component) {
    linkToSite = Neos.Neos:NodeUri {
        node = ${site}
    }
 
    renderer = afx`
		<a href={props.linkToSite}>Go to Homepage</a>
    `
}
```

`Neos.Neos:NodeUri` has basically all the configuration options of the UriBuilder (which is used internally). The following are the most common options:

*   `node` (required, must be a `NodeInterface`): the Node which you want to generate the URL for.  
     
*   `arguments / additionalParams` (optional, array / `Neos.Fusion:DataStructure`): additional arguments to append to the URL (explained below).  
      
    NOTE: `arguments` and `additionalParams` are merged together in `NodeUriImplementation`; and `arguments` will override `additionalParams`. We suggest to just use `arguments`.  
     
*   `addQueryString` (optional, bool): if `true`, the current URL parameters are kept when rendering links (explained below).  
     
*   `argumentsToBeExcludedFromQueryString` (optional, array / `Neos.Fusion:DataStructure`): Only relevant if `addQueryString = true`: These parameters are _not_ preserved on generated URLs. This is useful **for resetting already-set arguments**.  
     
*   `absolute` (optional, bool): if `true`, renders an absolute URL.  
     
*   `section` (optional, string): if set, will append this anchor to the URL (`#something`)  
     
*   `format` (optional, string): the URL format to use. By default, the request's format is used (usually `html`).

`Neos.Neos:NodeUri` also has a feature for resolving relative URLs relative to a so-called `baseNodeName`, but that's a bit esoteric use case we would not recommend using.

##### Working with arguments, addQueryString and argumentsToBeExcludedFromQueryString

For implementing features like pagination in pure Fusion, you will use `arguments` for rendering the page-links. This can look like this:

```neosfusion
// generates "/path/to/current/documentnode?page=2"
paginationUri = Neos.Neos:NodeUri {
	node = ${documentNode}
	// arguments is a Neos.Fusion:DataStructure, so you
	// can also use Eel helpers or other Fusion objects here which
	// generate the argument's value.
	arguments.page = 2
}
```

Now, if you have multiple features which should live "next" to each other, like faceting or pagination, it is useful to say: "I want to set the current page, but I do not want to change any other parameter."

This can be done via the `addQueryString` parameter:

```neosfusion
// - if the current URL is "/path/to/current/documentnode",
//   this generates "/path/to/current/documentnode?page=2" (like above).
// - if the current URL is "/path/to/current/documentnode?category_facet=foo",
//   this generates "/path/to/current/documentnode?category_facet=foo&page=2".
paginationUri = Neos.Neos:NodeUri {
	node = ${documentNode}
	// arguments is a Neos.Fusion:DataStructure, so you
	// can also use Eel helpers or other Fusion objects here which
	// generate the argument's value.
	arguments.page = 2

	addQueryString = true
}
```

Last but not least, if you want to **remove an already set query parameter** (e.g. to reset the `page` parameter or reset a selected facet), this can be done via `argumentsToBeExcludedFromQueryString`:

```neosfusion
// - if the current URL is "/path/to/current/documentnode",
//   this generates "/path/to/current/documentnode" (no modification)
// - if the current URL is "/path/to/current/documentnode?page=2",
//   this generates "/path/to/current/documentnode" (removes the page)
// - if the current URL is "/path/to/current/documentnode?page=2&category_facet=foo",
//   this generates "/path/to/current/documentnode?category_facet=foo" (removes the page)

paginationUri = Neos.Neos:NodeUri {
	node = ${documentNode}

	addQueryString = true
	argumentsToBeExcludedFromQueryString = ${["page"]}
}
```

##### Accessing Request arguments via Fusion

The URL parameters of the current page can be accessed in Fusion via `request.arguments.*`, so to access the `page` URL parameter, you can use `request.arguments.page`.

However, you need to configure Caching correctly, as otherwise, only the first rendering will be uncached, and all remaining calls will render the cached segment. See the docs on [caching](/guide/manual/rendering/caching) for detailed instructions, but in a nutshell, you have the following options:

```neosfusion
// Dynamic Cache mode (recommended)
myComponent = Neos.Fusion:Component {
    page = ${request.arguments.page}
    renderer = afx`
        {props.page}
    `
    @cache {
        mode = 'dynamic'
        entryIdentifier {
            node = ${node}
        }
        entryDiscriminator = ${request.arguments.page}
        context {
            1 = 'node'
            2 = 'documentNode'
        }
        entryTags {
            1 = ${Neos.Caching.nodeTag(node)}
        }
    }
}


// Completely uncached (not recommended)
myComponent = Neos.Fusion:Component {
    page = ${request.arguments.page}
    renderer = afx`
        {props.page}
    `
    @cache {
        mode = 'uncached'
        context {
            1 = 'node'
            2 = 'documentNode'
        }
    }
}

// cached mode will not work easily, as you would need
// to add the page argument to ALL cache entry identifiers
// (not just in your component). While this is possible via
// Neos.Fusion:GlobalCacheIdentifiers, it will greatly expand the
// space needed for caching - so that's why this is not recommended.
```

We recommend to use the `dynamic` cache mode. The full page is cached, but at runtime, the `entryDiscriminator` is evaluated to find the actual cache entry. You need to specify the `context` variables which you need inside your component, such that they can be serialized into the cache context properly.

##### Handling arguments during routing

In case you want to generate nicer URLs, you can create a custom `Routes.yaml` as in the following example, and load that via `Settings.yaml`, as also shown below.

Note that it is not possible to use `/` as delimiter between the node and further arguments, because that is already the nested-page delimiter.

Routes.yaml:
```yaml
-
  name:  'Custom Page'
  uriPattern: '{node}~{page}'
  defaults:
    '@package':    'Neos.Neos'
    '@controller': 'Frontend\Node'
    '@action':     'show'
    '@format':     'html'
  routeParts:
    'node':
      handler: 'Neos\Neos\Routing\FrontendNodeRoutePartHandlerInterface'

```

Settings.yaml:
```yaml
Neos:
  Flow:
    mvc:
      routes:
        'Neos.DocsNeosIo':
          position: before Neos.Neos
```

### Neos.Neos:NodeLink

`Neos.Neos:NodeLink` is a `Neos.Fusion:Tag` (`<a>`) which uses `Neos.Neos:NodeUri` for rendering the URL.

The API is exactly the same as stated above. Additionally, you can specify further HTML `attributes`, as shown in the following example. In case you use a self-closing tag, the node's label is displayed as link text:

```neosfusion
prototype(YourVendor:HomepageLink) < prototype(Neos.Fusion:Component) {
    renderer = afx`
		<Neos.Neos:NodeLink node={site} attributes.class="extra-css-class">My Link</Neos.Neos:NodeLink>

        The following link renders the Node's label as link text:
		<Neos.Neos:NodeLink node={site} attributes.class="extra-css-class" />

    `
}
```

### Neos.Neos:ConvertUris

`Neos.Neos:ConvertUris` can adjust URLs of the following form, also inside inline text. **It is usually used as a processor:**

*   `asset://[asset-uuid]` for linking to assets
*   `node://[node-uuid]` for linking to other nodes

It is used for broadly the following two use-cases:

*   For links inside inline-editable content. Inline-editable content is rendered usually via `Neos.Neos:Editable` - and there, in the default implementation, the inline URLs are converted by passing the output through `Neos.Neos.ConvertUris`. You do not need to adjust anything here, as this is the default Neos behavior.
*   If you use a `LinkEditor` (`Neos.Neos/Inspector/Editors/LinkEditor`) in the inspector, it supports selecting assets, absolute URLs and Node URLs. Depending on the chosen link, an `asset://...` or `node://...` URL is generated. Thus, you need to pass the value through `Neos.Neos:ConvertUris` to convert it to a fully-rendered link, as shown in the following example:

```neosfusion
prototype(YourVendor:HomepageLink) < prototype(Neos.Fusion:Component) {
    link = ${q(node).property('aLinkProperty')}
    link.@process = Neos.Neos:ConvertUris
    # in < Neos 7.3, you need to write the long processor form (which is also supported in newer versions)
    link.@process.convertUris = Neos.Neos:ConvertUris

    renderer = afx`
		<a href={props.link}>Go</a>
    `
}
```

### Neos.Fusion:UriBuilder

Neos.Fusion:UriBuilder wraps the UriBuilder from Flow MVC and exposes this in Fusion. You can use this to render links to arbitrary controllers. This is most useful inside Backend modules with Fusion.

*   [Docs: Creating AFX-based Applications](/guide/manual/extending-neos-with-php-flow/creating-afx-based-applications-backend-modules)
*   [Docs: Creating a Backend Module with Fusion](/tutorials/creating-a-backend-module-with-fusion-and-fusion-form)

All URI Builder attributes are supported, namely:

*   `package` (optional, string): The package key of the controller action to be linked to  
     
*   `subpackage` (optional, string): The subpackage key of the controller action to be linked to. This is the part after the package, but before the Controller part of the namespace. For example, if the controller class is `My\Package\Some\Nested\Controller\FooController,` this means:  
    `package: My.Package`  
    `subpackage: Some\Nested`  
    `controller: Foo`  
     
*   `controller` (optional, string): The unqualified controller name, without the `Controller` class name suffix.  
     
*   `action` (optional, string): The action name to link to (without the `Action` suffix)  
     
*   `arguments` (optional, array): URL parameters to add.  
     
*   `additionalParams` (optional, array): Additional query parameters that won't be prefixed like `arguments`  
     
*   `addQueryString` (optional, bool): if `true`, the current URL parameters are kept when rendering links (explained below).  
     
*   `argumentsToBeExcludedFromQueryString` (optional, array / `Neos.Fusion:DataStructure`): Only relevant if `addQueryString = true`: These parameters are _not_ preserved on generated URLs. This is useful **for resetting already-set arguments**.  
     
*   `absolute` (optional, bool): if `true`, renders an absolute URL.  
     
*   `section` (optional, string): if set, will append this anchor to the URL (`#something`)  
     
*   `format` (optional, string): the URL format to use. By default, the request's format is used (usually `html`).

### Legacy Prototypes

##### Neos.Neos:ConvertNodeUris

`Neos.Neos:ConvertNodeUris` is deprecated. **Instead, use** `**Neos.Neos:ConvertUris**` **- it has the same API.**