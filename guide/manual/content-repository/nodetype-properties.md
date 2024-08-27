url: /guide/manual/content-repository/nodetype-properties
# NodeType Properties

For each NodeType you can define which properties it has and how they can be edited. Let's start with a simple example of a Button.

Configuration/NodeTypes.Content.Button.yaml:
```yaml
'Vendor.Site:Content.Button':
  superTypes:
    'Neos.Neos:Content': true
  ui:
    label: 'Button'
    icon: icon-link
    position: 200
    inspector:
      groups:
        settings:
          label: 'Settings'
  properties:
    title:
      type: string
      defaultValue: ''
      ui:
        inlineEditable: true
        inline:
          editorOptions:
            placeholder: 'Enter title here...'
            autoparagraph: false
    link:
      type: string
      ui:
        label: Link
        inspector:
          group: settings
          editor: Neos.Neos/Inspector/Editors/LinkEditor
```

This example already shows a lot of the power of Neos. It defines a NodeType Button with two properties: title and link.

Title is of type string and in the backend ui inline editable. In general, everything that is defined inside a _ui_ block configured the Neos administration for editors. In title.ui.inline.editorOptions we define a placeholder when the button is empty and also that the inline editor should not allow any styles (default) and should not use paragraphs (_autoparagraph: false_).

The link shows how content can be changed in the inspector (the right panel inside the Neos administration area). Here we define a new group called _Settings_ and inside that we want to edit the link with the Neos LinkEditor. 

## Inline editable properties

_Edit content in the reflected frontend context_

Inline editing is a basic feature of this CMS to facilitate text editing for most users. As the graphical site context is fully available during editing action, it makes live easy for editors in their daily work.

Especially small editorial tasks like adjustments and corrections are mostly much easier to perform in contextual view.

![](/_Resources/Persistent/6d9db9f8de1a4e206ef5dbee5178b96df836315a/InlineEditing.gif)

As we have seen above, inline editing can be enabled with _inlineEditable: true_. If a Node has no inlineEditable properties it will be rendered with a gray overlay preventing any interaction with the node.

#### Allowed HTML Elements

In the properties `ui.inline.editorOptions` you can define what HTML elements and styles are allowed.

When enabled, the toolbar of the text editing mode gives editors tools to make various changes such as highlighting, heading types, or links.

![](/_Resources/Persistent/aaafcbeba0779bc97a944da3505f7c36a61a9173/Text-Werkzeuge-1022x69.png)

```yaml
inline:
  editorOptions:
    placeholder: i18n
    autoparagraph: true
    linking:
      anchor: true
      title: true
      relNofollow: true
      targetBlank: true
	  startingPoint: '/sites/site-name'
      nodeTypes: ['Neos.Neos:Document']
      placeholder: i18n
      disabled: false
      assets: false
      nodes: true
    formatting:
      strong: true
      em: true
      sub: true
      sup: true
      p: true
      h1: true
      h2: true
      h3: true
      h4: true
      h5: true
      h6: true
      pre: true
      underline: true
      strikethrough: true
      removeFormat: true
      left: true
      right: true
      center: true
      justify: true
      table: true
      ol: true
      ul: true
      a: true
```

## Inspector editable properties

Inline editing in the live preview looks cool and is really handy for text. if you want to define layout configurations, images or links the inspector panel on the right side is better suited. Inside the inspector you can define arbitrary inspector groups and in those you can define how your properties are editable.

### Inspector Editors

Based on the properties type Neos will choose what editor to display. So for example if you use type: boolean, Neos will render the BooleanEditor**.** 

Of course you can also define it yourself. Here's an example of how to define a select box editor.

```yaml
articleType:
  type: string
  defaultValue: ''
  ui:
    label: 'Article Type'
    reloadIfChanged: true
    inspector:
      group: 'settings'
      editor: Content/Inspector/Editors/SelectBoxEditor
      editorOptions:
        placeholder: 'What kind of article ...'
        values:
          '':
            label: ''
          announcement:
            label: 'Announcement'
          casestudy:
            label: 'Case Study'
          event:
            label: 'Event'
```

By default the following list of editors is available in Neos:

*   **Neos.Neos/Inspector/Editors/BooleanEditor**  
    A checkbox, by default configured for properties of type boolean.
*   **Neos.Neos/Inspector/Editors/DateTimeEditor**  
    A datepicker with support for time selection too. By default configured for properties of type date.
*   **Neos.Neos/Inspector/Editors/CodeEditor**  
    A code editor with syntax highlighting. You can use this editor for editing other types of textual content, by configuring a different highlightingMode and buttonLabel to change usage for this editor:

yaml property definition:
```yaml
style:
  type: string
  ui:
    label: 'CSS'
    reloadIfChanged: true
    inspector:
      group: 'code'
      editor: 'Neos.Neos/Inspector/Editors/CodeEditor'
      editorOptions:
        buttonLabel: 'Edit CSS source'
        highlightingMode: 'text/css'
```

*   **Neos.Neos/Inspector/Editors/ImageEditor**  
    An image editor with cropping and size support. By default configured for properties of type NeosMediaDomainModelImageInterface.
*   **Neos.Neos/Inspector/Editors/ReferenceEditor**  
    A selector with autocomplete to reference to another node. By default configured for properties of type reference.
*   **Neos.Neos/Inspector/Editors/ReferencesEditor**  
    A selector with autocomplete to reference to multiple nodes. By default configured for properties of type references.
*   **Neos.Neos/Inspector/Editors/SelectBoxEditor**  
    A selectbox.
*   **Neos.Neos/Inspector/Editors/TextFieldEditor**  
    A simple textfield. By default configured for properties of type string and integer

The following editors are also available, but will most likely only be used internally in Neos:

*   Neos.Neos/Inspector/Editors/MasterPluginEditor
*   Neos.Neos/Inspector/Editors/PluginViewEditor
*   Neos.Neos/Inspector/Editors/PluginViewsEditor

[See also the Property Editor Reference](https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html)

### Inspector editor validators

When using inspector editors, you can also define validators.

By default the following validators are available in Neos:

*   **Neos.Neos/Validation/AbstractValidator**  
    This abstract validator should be used to base custom validators on.  
    
*   **Neos.Neos/Validation/AlphanumericValidator**  
    Supported options:
    *   regularExpression  
        
*   **Neos.Neos/Validation/CountValidator**  
    Supported options:
    *   minimum
    *   maximum  
        
*   **Neos.Neos/Validation/DateTimeRangeValidator**  
    Supported options:
    *   latestDate
    *   earliestDate  
        
*   **Neos.Neos/Validation/DateTimeValidator**  
    
*   **Neos.Neos/Validation/EmailAddressValidator**  
    Supported options:
    *   regularExpression  
        
*   **Neos.Neos/Validation/FloatValidator**
*   **Neos.Neos/Validation/IntegerValidator**
*   **Neos.Neos/Validation/LabelValidator**  
    Supported options:
    *   regularExpression
*   **Neos.Neos/Validation/NumberRangeValidator**  
    Supported options:
    *   minimum
    *   maximum
*   **Neos.Neos/Validation/RegularExpressionValidator**  
    Supported options:
    *   regularExpression
*   **Neos.Neos/Validation/StringLengthValidator**  
    Supported options:
    *   minimum
    *   maximum
*   **Neos.Neos/Validation/StringValidator**
*   **Neos.Neos/Validation/TextValidator**
*   **Neos.Neos/Validation/UuidValidator**  
    Supported options:
    *   regularExpression  
        

## Depending Properties

There are cases where properties should only be editable if another property has a specific value.

This can be done in Neos with dynamic Client-side Configuration Processing.

> **ℹ️ Note**
> 
> This API is rather low-level and still experimental, we might change some of the implementation details or compliment it with a more high-level API.

All configuration values that begin with `_ClientEval:_` are dynamically evaluated on the client side. They are written in plain JavaScript (evaluated with eval) and have node variable in the scope pointing to the currently focused node, with all transient inspector changes applied. For now it is only related to the NodeTypes inspector configuration, but in the future may be extended to the other parts of the user interface.

### A few Practical Examples

#### Hiding one property when the other one is not set

Here is an example how to hide the property _borderColor_ if _borderWidth_ is empty by evaluating the hidden property on the client side.

Configuration/NodeTypes.Content.YourNodeTypeName.yaml:
```yaml
'Vendor.Site:Content.YourNodeTypeName':
  properties:
    borderWidth:
      type: integer
      ui:
        inspector:
          group: 'style'
    borderColor:
      type: string
      ui:
        inspector:
          hidden: 'ClientEval:node.properties.borderWidth ? false : true'
```

> **💡 Tip**
> 
> If you want to see all the available node information, try  
> `hidden: 'ClientEval:console.info(node)'`  
> In your browser developer tools you will be able to see the node object with all properties. 

#### Dependent SelectBoxes

If you are using select box editors with _data sources_ (see [Data sources](/guide/manual/extending-neos-with-php-flow/custom-data-sources) for more details) you can use client-side processing to adjust `dataSourceAdditionalData` when properties are changed in the inspector. The following example demonstrates this. It defines two properties (`_serviceType_` and `_contractType_`) where changes to the first property cause the `searchTerm` on the second properties’ data source to be updated. That in turn triggers a refresh of the available options from the data source.

Configuration/NodeTypes.Content.YourNodeTypeName.yaml:
```yaml
properties:
  serviceType:
    type: string
    ui:
      label: 'Service Type'
      inspector:
        group: product
        editor: 'Content/Inspector/Editors/SelectBoxEditor'
        editorOptions:
          allowEmpty: true
          placeholder: 'Service Type'
          dataSourceIdentifier: 'acme-servicetypes'
  contractType:
    type: string
    ui:
      label: 'Contract Type'
      inspector:
        group: product
        editor: 'Content/Inspector/Editors/SelectBoxEditor'
        editorOptions:
          allowEmpty: true
          placeholder: 'Contract Type'
          dataSourceIdentifier: 'acme-contracttypes'
          dataSourceAdditionalData:
            searchTerm: 'ClientEval:node.properties.serviceType'
```

## Property Presets

If a property configurations should be reused in multiple NodeTypes they can be defined as preset in the project settings. This is very handy to ensure a consistent configuration of property editors to avoid confusion.

Settings.yaml:
```yaml
Neos:
  Neos:
    nodeTypes:
      presets:
        properties:

          'inlineEditableText':

            'plain':
              type: string
              ui:
                inlineEditable: true

            'richtext':
              type: string
              ui:
                inlineEditable: true
                inline:
                  editorOptions:
                    autoparagraph: true
                    formatting:
                      em: true
                      strong: true
```

Presets can then be applied in _NodeTypes.yaml_ via:

NodeTypes.yaml:
```yaml
'Some.Package:SomeNodeType':
  # ...
  properties:
    'title':
      options:
        preset: 'inlineEditableText.plain'
      defaultValue: 'Title'
    'description':
      options:
        preset: 'inlineEditableText.richtext'
```

## Remove a property

You can completely remove a property of an existing NodeType with the following code:

Configuration/NodeTypes.Override.3rdPartyPackage.Content.YourNodeTypeName.yaml:
```yaml
'Vendor.3rdPartyPackage:Content.YourNodeTypeName.yaml':
  properties:
    someProperty: [ ]
```

> **ℹ️ Be careful**
> 
> It is not recommended to change existing NodeTypes. Instead, define them as abstract and create your own versions. This approach offers several benefits. First, it is more update-safe. Second, having the NodeType in your own namespace allows you to better control changes and migrations. 

## And more...

Learn about how to restrict where NodeTypes can be used in the further chapter [NodeType Constraints](/guide/manual/content-repository/node-constraints), and about how [NodeTypes can be translated](/guide/manual/content-repository/nodetype-translations). 

But NodeTypes allow even more. You can find a full list of configuration options in our versioned [NodeType Definition on ReadTheDocs](https://neos.readthedocs.io/en/stable/CreatingASite/NodeTypes/NodeTypeDefinition.html).

[Documentation for all NodeType configuration options](https://neos.readthedocs.io/en/stable/CreatingASite/NodeTypes/NodeTypeDefinition.html)