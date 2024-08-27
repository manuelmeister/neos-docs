url: /guide/manual/content-repository/nodetype-presets
# NodeType Presets

Presets allow to configure property and childNode configurations in settings that can later be applied to NodeTypes. 

Other than mixins this allows to ensure consistent configurations across differently named properties and childNodes to ensure a consistent editor experience.

## Property and ChildNodes Presets

The presets can be applied by defining the `options.preset` for childNodes or properties.

Settings.yaml:
```none
Neos:
  Neos:
    nodeTypes:
      presets:
        childNodes:
          'vendor':
            defaultConstraints:
              constraints:
                'Neos.Neos:Content': true
                'Neos.NodeTypes.BaseMixins:TitleMixin': true

        properties:
          'vendor':
            'textBlock':
              type: string
              defaultValue: ''
              ui:
                inlineEditable: true
                inline:
                  editorOptions:
                    placeholder: 'Vendor.Site:NodeTypes.Generic:text.placeholder'
                    autoparagraph: true
                    formatting:
                      strong: true
                      em: true
                      underline: false


```

Presets can then be applied to NodeTypes via:

NodeTypes.yaml:
```none
'Vendor.Package:NodeTypeName':
  childNodes:
    column1:
      options:
        preset: 'vendor.defaultConstraints'    
    column2:
      options:
        preset: 'vendor.defaultConstraints'    
  properties:
    description:
      options:
        preset: 'vendor.textBlock'

```