url: /guide/manual/content-repository/node-creation-dialog
# Node Creation Dialog Confi­gura­tion

When creating new nodes, you have the possibility to ask for additional data during node creation. This data will be passed to _nodeCreationHandlers_.

The creation dialog supports most of the inspector editors, except of those that require to show a secondary inspector view. See [Property Editor Reference](https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html#property-editor-reference) for more details about configuring inspector editors.

For example, this functionality can be used to ask users for some data before creating an instance of the corresponding node:

SomeNodeType.yaml:
```yaml
'Some.Package:SomeNodeType':
  ui:
    group: 'general'
    creationDialog:
      elements:
        'someElement':
          type: string
          ui:
            label: 'Some Label'
            editor: 'Neos.Neos/Inspector/Editors/TextFieldEditor'
          validation:
            'Neos.Neos/Validation/NotEmptyValidator': []
  options:
    nodeCreationHandlers:
      documentTitle:
        nodeCreationHandler: 'Some\Package\NodeCreationHandler\SomeNodeCreationHandler'
```

You may register multiple nodeCreationHandlers per NodeType. Each nodeCreationHandler must implement _NodeCreationHandlerInterface_. It gets the newly created _$node_ and the _$data_ coming from the creation dialog.  
See _Neos\\Neos\\Ui\\NodeCreationHandler\\DocumentTitleNodeCreationHandler_ for example that is used to set the Document node's _title_ and _uriPathSegment_ as soon as the node is created.

> **ℹ️ Note**
> 
> The elements of the creation dialog define an arbitrary set of data that will be passed to a nodeCreationHandler. Those elements will not automatically set node properties in any way. To take action based on that data you would need to write a custom node creation handler or use the "showInCreationDialog" feature described below.

## Add node properties to the Node Creation Dialog

Since **Neos 5.1** it has become very easy to add elements to the Node Creation Dialog that represent properties of the corresponding node:

SomeNodeType.yaml:
```yaml
'Some.Package:SomeNodeType':
  # ...
  properties:
    'someProperty':
      type: string
      label: 'Some Label'
      ui:
        showInCreationDialog: true
```

When using the _showInCreationDialog_ feature, the editor options of the corresponding _ui.inspector_ configuration is applied. If needed, the configuration can be overridden for the Node Creation Dialog like described above:

SomeNodeType.yaml:
```yaml
'Some.Package:SomeNodeType':
  # ...
  ui:
    creationDialog:
      elements:
        'someProperty':
          ui:
            label: 'Overridden label'
            editorOptions:
              placeholder: 'Some placeholder only visible in the Node Creation Dialog'
  properties:
    'someProperty':
      type: string
      label: 'Some Label'
      ui:
        showInCreationDialog: true
```

> **ℹ️ Note**
> 
> This feature was added with Neos 5.1. For older versions you can use the 3rd party [Wwwision.Neos.CreationDialogProperties](https://github.com/bwaidelich/Wwwision.Neos.CreationDialogProperties) package for a similar functionality.

#### Using Images in the Node Creation Dialog

Most property editors just work out of the box when being used in the Node Creation Dialog. The following editors are an exception because they require a secondary view that is currently not supported by the Creation Dialog (see corresponding [Bug ticket](https://github.com/neos/neos-ui/issues/1034)):

*   `Neos.Neos/Inspector/Editors/ImageEditor`
*   `Neos.Neos/Inspector/Editors/AssetEditor`
*   `Neos.Neos/Inspector/Editors/RichTextEditor`
*   `Neos.Neos/Inspector/Editors/CodeEditor`

So when used in conjunction with the showInCreationDialog flag, these editors are disabled by default.

You can, however, override that behavior if you want to allow images to be uploaded (all features that require a secondary editor won't work and should be disabled):

SomeNodeType.yaml:
```yaml
'Some.Package:SomeNodeType':
  # ...
  ui:
    creationDialog:
      elements:
        'someImageProperty':
          ui:
            editorOptions:
              disabled: false
              features:
                crop: false
                resize: false
                mediaBrowser: false
  properties:
    'someImageProperty':
      type: 'Neos\Media\Domain\Model\ImageInterface'
      label: 'Some Label'
      ui:
        showInCreationDialog: true
```

  
There are community packages which can help to define the node creation in Fusion only:

*   [Flowpack.NodeTemplates (recommended)](https://github.com/Flowpack/Flowpack.NodeTemplates)