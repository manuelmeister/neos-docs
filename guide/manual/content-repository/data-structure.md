url: /guide/manual/content-repository/data-structure
# Data Structure

How content is saved in a tree-based structure

The content in Neos is not stored inside tables of a relational database, but inside a _tree-based_ structure: the so-called Neos Content Repository.

To a certain extent, it is comparable to files in a file-system: They are also structured as a tree, and are identified uniquely by the complete path towards the file.

> **💡 Note**
> 
> Internally, the Neos Content Repository currently stores the nodes inside database tables as well, but you do not need to worry about that as you never deal with the database directly. This high-level abstraction helps to decouple the data modelling layer from the data persistence layer.

### Basic structure

Each element in this tree is called a _Node_, and is structured as follows:

*   It has a _node name_ which identifies the node, in the same way a file or folder name identifies an element in your local file system.
*   It has a _NodeType_ which determines which properties a node has. Think of it as the type of a file in your file system.
*   Furthermore, it has _properties_ which store the actual data of the node. The _NodeType_ determines which properties exist for a node. As an example, a text node might have a headline and a text property.
*   Nodes may have _sub nodes_ underneath them.

  
Take a website with a hierarchical menu structure. Each page is represented by a _Node_ of type _**Document**_. However, not only the pages themselves are represented as a tree: Imagine a page has two columns, with different content elements inside each of them. The columns are stored as Nodes of type _**ContentCollection**_, and they contain nodes of type text, image, or whatever structure is needed.

This nesting can be done indefinitely: Inside a _ContentCollection_, there could be another three-column element which again contains _ContentCollection_ nodes with arbitrary content inside.

### Predefined NodeTypes

Neos is shipped with a number of predefined NodeTypes. Typically you will create your own NodeTypes and define one of them as a super type. They can be useful types to extend, and Neos depends on some of them for proper behavior.

#### Neos.Neos:Node

_Neos.Neos:Node_ is an internal base type which should be extended by all content types which are used in the context of Neos. In most cases you will use its sub-types _Neos.Neos:Document_, _Neos.Neos:Content_ or _Neos.Neos:ContentCollection_.

_Neos.Neos:Node_ does not define any properties.

#### Neos.Neos:Document

We differentiate between nodes which look and behave like _pages_ and _content rendered on a page_ such as text.

Nodes which behave like pages are called _Document Nodes_ in Neos. They have a unique, externally visible URL by which they can be rendered.

#### Neos.Neos:Content

Is used for all standard nodes within a page, such as text, image, youtube, …. This is–by far–the most often extended NodeType.

It inherits from _Neos.Neos:Hidable_, which allows to hide a node, so it is not rendered in the frontend, and _Neos.Neos:Timable_, which allows to define within which time frame a node is visible.

#### Neos.Neos:ContentCollection

A _Neos.Neos:ContentCollection_ has a structural purpose. It usually contains an ordered list of child nodes which are rendered inside. _Neos.Neos:ContentCollection_ may be extended by custom types, and can be combined with _Neos.Neos:Content_.

There are two main use cases. First, if you want to have a _Neos.Neos:Content_ or _Neos.Neos:Document_ NodeType with automatically created child nodes, in which further content can be placed.

Example: Neos.Neos:ContentCollection as child node:
```yaml
'Vendor.Site:Content.TwoColumns':
  superTypes:
    'Neos.Neos:Content': true
  ui:
    label: 'Two Column Layout'
    icon: icon-columns
    position: 10
    group: structure
  childNodes:
    contentLeft:
      type: 'Neos.Neos:ContentCollection'
    contentRight:
      type: 'Neos.Neos:ContentCollection'

```

The other use case is a _Neos.Neos:Content_ NodeType, which at the same time acts as a _Neos.Neos:ContentCollection_. An example is a slider which allows slides as direct children.

Example: Neos.Neos:ContentCollection as child node:
```yaml
'Vendor.Site:Content.Slider':
  superTypes:
    'Neos.Neos:Content': true
    'Neos.Neos:ContentCollection': true
  ui:
    label: 'Image Slider'
    icon: 'icon-image'
    group: structure
  constraints:
    nodeTypes:
      # only allow slides inside the slider
      '*': false
      'Vendor.Site:Content.Slider.Slide': true


'Vendor.Site:Content.Slider.Slide':
  superTypes:
    'Neos.Neos:Content': true
  ui:
    label: 'Slide'
    icon: 'icon-image'
    inspector:
      groups:
        image:
          label: 'Image'
          position: 5
          icon: 'icon-image'
  properties:
    image:
      type: Neos\Media\Domain\Model\ImageInterface
      ui:
        label: 'Image'
        reloadIfChanged: true
        inspector:
          group: 'image'
```