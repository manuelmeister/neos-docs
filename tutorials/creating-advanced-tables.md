url: /tutorials/creating-advanced-tables
# Creating Advanced Tables

Building a powerful table element

Tables (i.e. comparison tables, product tables) are a common use case for many Neos and CMS projects. Here, we explain how you can use the powerful features of Neos to build one, and customize it to your needs.

> **💡 Needed Packages to copy/paste these examples**
> 
> To copy/paste these examples, you need to install [Neos.NodeTypes.BaseMixins](https://packagist.org/packages/neos/nodetypes-basemixins) and [Flowpack.NodeTemplates](https://packagist.org/packages/flowpack/nodetemplates) via composer.  
> The main ideas described here work without these packages as well, as it is relying for most of its functionality on Neos Core features.

## Neos Core Behavior

Basically, inline editing (based on CKEditor) is well-equipped for handling tables. With the following configuration in `NodeTypes.yaml`, tables can be inserted and edited inside free-form text:

NodeTypes.yaml:
```yaml
'Neos.Demo:Content.Table':
  superTypes:
    'Neos.Neos:Content': true
    'Neos.NodeTypes.BaseMixins:TextMixin': true
  ui:
    label: Table
    icon: 'icon-file-table'
  properties:
    text:
      ui:
        inline:
          editorOptions:
            formatting:
              # THIS LINE enables the table controls
              table: true

```

Here, enabling the table feature by setting `ui.inline.editorOptions.formatting.table` to `true` does the following:

*   In the top bar, a button is shown to create tables of arbitrary sizes (similar to Word)
*   When being inside a table, additional buttons in the top bar are shown to create new columns or rows, combine cells, **or mark rows/columns as table header**.

The output is a normal, well-formatted HTML table, which can be styled as usual.

## Creating a custom content element only containing a table

Often, tables are special in the sense that they need additional configuration (like styling etc). So creating a custom Node Type is a good idea (as shown in the example above). We can further make it easier for end-users by inserting a template table already using `defaultValue`:

NodeTypes.yaml:
```yaml
'Neos.Demo:Content.Table':
  superTypes:
    'Neos.Neos:Content': true
    'Neos.NodeTypes.BaseMixins:TextMixin': true
  ui:
    label: Table
    icon: 'icon-file-table'
  properties:
    text:

      # Let's focus on this default value
      defaultValue: |
        <table>
          <thead>
            <tr>
              <th>Headline 1</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Content 1</td>
            </tr>
          </tbody>
        </table>

      ui:
        inline:
          editorOptions:
            formatting:
              table: true
  
```

By setting a default table using the default value, the user gets shown a table when inserting the element and can start to modify it.

Furthermore, because there is no wrapping `<p>` or `<div>` tag, the table is the outermost element of the editable area. **This means the user can not create content before or after the element (in this editable block), which is what we want.**

> **ℹ️ Deletion of the Table**
> 
> Under some specific circumstances it is still possible to delete the outermost table; which is something we could work on preventing in the future, using a custom CKEditor 5 extension.

## Custom styling for the table

Custom styling can be applied by wrapping the table in a `<div>` and applying CSS classes (which can be set in the inspector):

NodeTypes.yaml:
```yaml
'Neos.Demo:Content.Table':
  superTypes:
    'Neos.Neos:Content': true
    'Neos.NodeTypes.BaseMixins:TextMixin': true
  ui:
    label: Table
    icon: 'icon-file-table'

    # we need to add an inspector group
    inspector:
      groups:
        table:
          label: 'Table Properties'
          icon: 'icon-table'
          position: 5


  properties:
    text:
      ui:
        inline:
          editorOptions:
            formatting:
              table: true

	# and we need to add a style property to choose the table style
    style:
      ui:
        label: 'Style'
        reloadIfChanged: true
        inspector:
          group: table
          editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor'
          editorOptions:
            values:
              table--green:
                label: 'Green'
                icon: 'icon-legal'
              table--orange:
                label: 'Orange'
                icon: 'icon-legal'

```

Content.Table.fusion:
```neosfusion
prototype(Neos.Demo:Content.Table) < prototype(Neos.Neos:ContentComponent) {
    text = Neos.Neos:Editable {
        property = 'text'
    }

    renderer = Neos.Fusion:Tag {
        tagName = 'div'
        // here, we use the style property of the node as CSS class.
        attributes.class = ${node.properties.style}
        content = ${props.text}
    }
}

```

Now, you can style the table as usual via CSS.

## Option: Creating Wizard-Like Presets

Sometimes, if you have table styles which differ a lot, it might make sense to display something like a "wizard" upon inserting new tables, where the user can choose a preset to be used.

This can be easily done by combining a [Node Creation Dialog](/guide/manual/content-repository/node-creation-dialog) with [Flowpack.NodeTemplates](https://github.com/Flowpack/Flowpack.NodeTemplates):

NodeTypes.yaml:
```yaml
'Neos.Demo:Content.Table':
  superTypes:
    'Neos.Neos:Content': true
    'Neos.NodeTypes.BaseMixins:TextMixin': true
  ui:
    label: Table
    icon: 'icon-file-table'

    inspector:
      groups:
        table:
          label: 'Table Properties'
          icon: 'icon-table'
          position: 5

    # we configure that we want to use a creation dialog
    # where the user can choose preset options
    creationDialog:
      elements:
        'tableHeader':
          defaultValue: 'top'
          type: string
          ui:
            label: 'Table Header'
            editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor'
            editorOptions:
              values:
                left:
                  label: 'Table Header on the left'
                  icon: 'icon-legal'
                top:
                  label: 'Tabel Header on top'
                  icon: 'icon-legal'
          validation:
            'Neos.Neos/Validation/NotEmptyValidator': []
  
  # and we need to configure Flowpack.NodeTemplates to use a
  # dynamic default value, depending on the choice of the user.
  options:
    template:
      properties:
        text: |
          ${data.tableHeader == "top" ? "
            <table>
              <thead>
                <tr>
                  <th>Headline 1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Content 1</td>
                </tr>
              </tbody>
            </table>
          " : "
            <table>
              <tbody>
                <tr>
                  <th>Headline 1</th>
                  <td>Content 1</td>
                </tr>
              </tbody>
            </table>
          "}

  properties:
    text:
      # no defaultValue needed here
      ui:
        inline:
          editorOptions:
            formatting:
              table: true

    style:
      ui:
        label: 'Style'
        reloadIfChanged: true
        inspector:
          group: table
          editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor'
          editorOptions:
            values:
              table--green:
                label: 'Green'
                icon: 'icon-legal'
              table--orange:
                label: 'Orange'
                icon: 'icon-legal'

```

> **💡 Advanced Node Templates**
> 
> If the markup you want to use as default value becomes more and more complex, it might make sense to configure a `nodeCreationHandler` as explained in [Node Creation Dialog Confi­gura­tion](/guide/manual/content-repository/node-creation-dialog), and then do the HTML building inside PHP.

## Summary

Here, we have seen how a complex table can be built with Neos CMS - enabling lots of flexibility and all the default formatting options inside the table cells. Have fun building!

_Written by_ **Sebastian Kurfuerst**