url: /guide/manual/rendering/rendering-special-formats
# Rendering special formats

> **⚠️ Some parts might be outdated.**
> 
> Please be careful, some parts might be outdated and do not apply anymore.

Rendering an RSS feed as XML or a document in a different format than HTML is possible by configuring a new route and adding a Fusion path that renders the format.

Let’s have a look at an example that introduce a `vcard` format to render an imaginary `Person` document node type.

## Routing

First register a new route to nodes with the `vcard` format. URIs with that format will get an `.vcf` extension.

Configuration/Routes.yaml:
```yaml
-
  name: 'Neos :: Frontend :: Document node with vCard format'
  uriPattern: '{node}.vcf'
  defaults:
    '@package': Neos.Neos
    '@controller': Frontend\Node
    '@action': show
    '@format': vcard
  routeParts:
    node:
      handler: Neos\Neos\Routing\FrontendNodeRoutePartHandlerInterface
  appendExceedingArguments: true
```

**latest Neos**

#### Registering the route

Add the following snippet to your YAML configuration in your Package.

Configuration/Settings.yaml:
```yaml
Neos:
  Flow:
    mvc:
      routes:
        'My.Package':
          position: 'before Neos.Neos'

```

**Neos 2 and 3**

#### Registering the route (for Neos 2.x and 3.x)

This will add the new route from the site package **before** the Neos subroutes.

## Fusion

The `root` case in the default Fusion will render every format that is different from `html` by rendering a path with the format value.

See the default root path: [neos/DefaultFusion.fusion at master · neos/neos (github.com)](https://github.com/neos/neos/blob/master/Resources/Private/Fusion/DefaultFusion.fusion#L52)

The root matcher used to start rendering in Neos  
The default is to use a render path of “page”, unless the requested format is not “html”  
in which case the format string will be used as the render path (with dots replaced by slashes)

**AFX**

```neosfusion
# Define a path for rendering the vcard format
vcard = Neos.Fusion:Case {
        person {
                condition = ${q(node).is('[instanceof My.Package:Person]')}
                type = 'My.Package:Person.Vcard'
        }
}

# Define a prototype to render a Person document as a vcard
prototype(My.Package:Person.Vcard) < prototype(Neos.Fusion:Http.Message) {
        # Set the Content-Type header
        httpResponseHead {
                headers.Content-Type = 'text/x-vcard;charset=utf-8'
        }
        content = My.Package:Person {
                # Set additional props for the renderer
        }
}

																		
# Atomic Fusion rendering component
prototype(My.Package:Person) < prototype(Neos.Fusion:Component) {
	# api = ''

	renderer = afx`
		...
	`
}
```

**Fluid**

```neosfusion
# Define a path for rendering the vcard format
vcard = Neos.Fusion:Case {
        person {
                condition = ${q(node).is('[instanceof My.Package:Person]')}
                type = 'My.Package:Person.Vcard'
        }
}

# Define a prototype to render a Person document as a vcard
prototype(My.Package:Person.Vcard) < prototype(Neos.Fusion:Http.Message) {
        # Set the Content-Type header
        httpResponseHead {
                headers.Content-Type = 'text/x-vcard;charset=utf-8'
        }
        content = My.Package:Person {
                templatePath = 'resource://My.Package/Private/Templates/NodeTypes/Person.Vcard.html'
                # Set additional variables for the template
        }
}
```