url: /guide/manual/content-repository/nodetype-definition
# NodeType Definition

How to define NodeTypes

The NodeType definition is the heart of modeling the content as explained in the previous chapters [Data Structure](/guide/manual/content-repository/data-structure) and [Presentational or Semantic](/guide/manual/content-repository/presentational-or-semantic).

Each Neos ContentRepository Node (we’ll just call it Node in the remaining text) has a specific _NodeType_. NodeTypes can be defined in any package by declaring them in _Configuration/NodeTypes.\*.yaml_. By convention the file-name must represent the namespace of the contained NodeTypes.

Each node type can have _one or multiple parent types_. If these are specified, all properties and settings of the parent types are inherited.

A node type definition can look as follows:

Configuration/NodeTypes.Content.SpecialHeadline.yaml:
```yaml
'Vendor.Site:Content.SpecialHeadline':
  superTypes:
    'Neos.Neos:Content': true
  ui:
    label: 'Special Headline'
    group: 'general'
  properties:
    headline:
      type: 'string'
      defaultValue: 'My Headline Default'
      ui:
        inlineEditable: true
      validation:
        'Neos.Neos/Validation/StringLengthValidator':
          minimum: 1
          maximum: 255
```

Instead of _Vendor_ you should use your own company or project name. In this example _**Site**_ is the package name, you can choose any name. Especially for smaller projects it has proven to be a good pattern to call your site package _Site_.

> **💡 Let your IDE help you**
> 
> Development environments like PHPStorm, VSCode and others allow the use of JSON schemas to validate, autocomplete and provide type hints for yaml files like we use for NodeTypes.  
> You can find a schema and configuration instructions [on our Developer Tooling page](/guide/features/editor-support).

### Namespaces

You might noticed that we named the _SpecialHeadline_ with a **Content** prefix. The namespace of your own NodeTypes should be structured and nested. It is [recommended](https://www.neos.io/blog/neos-best-practices-1-0.html) to start with one of the prefixes **Document**, **Content**, **Mixin**, **Collection** or **Constraint**. You can also introduce custom namespaces.

The meaning of the recommended namespaces is:

*   _**Document**_ NodeTypes inherit from _Neos.Neos:Document_
*   _**Content**_ NodeTypes inherit from _Neos.Neos:Content_
*   _**Collection**_ NodeTypes inherit from _Neos.Neos:ContentCollection_
*   _**Mixin**_ NodeTypes are abstract and define a reusable set of properties or child nodes.
*   _**Constraint**_ NodeTypes are abstract and define the allowed usage of Nodes.

### SuperTypes and Mixins

As described in the chapter [Data Structure](/guide/manual/content-repository/data-structure), Neos is shipped with a number of predefined NodeTypes. Typically, your NodeTypes must inherit from one of these.

Multi-inheritance is possible in Neos - as there can be multiple NodeTypes in the _superTypes_ configuration of the NodeType. This allows you to create mixins for a specific features. So in our documentation for example we have a [Taggable](https://github.com/neos/Neos.DocsNeosIo/blob/master/DistributionPackages/Neos.DocsNeosIo/NodeTypes/Mixin/Tagable.yaml) mixin. We use this across this documentation platform in various places to tag our content. These mixins should always be abstract so that they cannot be directly created.

Configuration/NodeTypes.Mixin.Taggable.yaml:
```yaml
'Neos.DocsNeosIo:Mixin.Taggable':
  abstract: true
  superTypes:
    'Neos.DocsNeosIo:Mixin.InspectorGeneral': true
  properties:
    tags:
      type: references
      ui:
        label: 'Tags'
        reloadIfChanged: true
        inspector:
          group: 'general'
          editorOptions:
            nodeTypes: ['Neos.DocsNeosIo:Document.Tag']
```

As you can also see this mixin again includes another mixin to define an inspector group named _general_. This is a super powerful way of modeling your content structure.

### Backend appearance

If an editor wants to create a new node, _Neos.Neos:Content_ NodeTypes will be shown in the content node creation dialog and _Neos.Neos:Document_ NodeTypes in the document dialog. The _label_, _icon_ and _group_ can be configured:

Configuration/NodeTypes.Content.Image.yaml:
```yaml
'Vendor.Site:Content.Image':
  superTypes:
    'Neos.Neos:Content': true
  ui:
    label: Image
    icon: icon-picture
    position: 300
    group: general
```

![NodeType Selection MenuBox](/_Resources/Persistent/25927706007e55de12a13336715e2515c6982909/Content%20NodeType%20Selection%20MenuBox.png)

As icon, you can use the name of any [FontAwesome icon](http://fontawesome.io/icons/) or an SVG icon as asset resource. The position will order the NodeTypes within the group.

By default, Neos comes with three groups:

*   **General**  
    Basic content elements, like text and image.
*   **Structure**  
    Elements defining a structure. This group contains for example the 2 column element.
*   **Plugins**  
    Available plugins in the site installation.

It is possible to create new groups by using the Setting _Neos.Neos.nodeTypes.groups_. Registering two new groups could look like:

Settings.yaml:
```yaml
Neos:
  Neos:
    nodeTypes:
      groups:
        form:
          label: 'Form elements'
        special:
          position: 50
          label: 'Special elements'
          collapsed: true
          icon: 'icon-fort-awesome'
```

The groups are ordered by the position argument.

### Disable existing NodeTypes

If you want to disable some NodeTypes from third-party packages you have two options:

#### Hide the NodeType from the user interface

Configuration/NodeTypes.Content.YourNodeTypeName.yaml:
```yaml
'Vendor.Site:Content.YourNodeTypeName':
  ui: ~
```

Nodes of this type will still remain valid in the database and being rendered to the frontend. But they will not be shown anymore in the dialog for adding nodes.

#### Completely disallow the direct usage of a NodeType

Configuration/NodeTypes.Content.YourNodeTypeName.yaml:
```yaml
'Vendor.Site:Content.YourNodeTypeName':
  abstract: true
```

As abstract NodeTypes are not valid to be used directly, this will hide the NodeType in the user interface AND additionally make all existing nodes of this type invalid. If you run a _node:repair_ all existing nodes of this type will be removed.

> **ℹ️ Be careful**
> 
> Do not delete the complete NodeType via ~ because this will break all NodeTypes that inherit from this one.

## And more...

Learn about how to add properties in the next chapter [NodeType Properties](/guide/manual/content-repository/nodetype-properties), how to restrict where NodeTypes can be used in the further chapter [NodeType Constraints](/guide/manual/content-repository/node-constraints), and about how [NodeTypes can be translated](/guide/manual/content-repository/nodetype-translations). 

But NodeTypes allow even more. You can find a full list of configuration options in our versioned [NodeType Definition on ReadTheDocs](https://neos.readthedocs.io/en/stable/CreatingASite/NodeTypes/NodeTypeDefinition.html).

[Documentation for all NodeType configuration options](https://neos.readthedocs.io/en/stable/CreatingASite/NodeTypes/NodeTypeDefinition.html)