url: /guide/manual/content-repository
# Content Repository

Content's first choice

### What is it?

The **Content Repository** (CR) stores your content. Imagine a table of contents. Every section is identified by a unique path. The CR works the same. Everything you see in the navigation tree in Neos is a node. You can nest them indefinitely. If you can think of it as a tree, you can build it with Neos.

We use nodes to structure content and save it to the CR. Everything you add into Neos is a node. A page is a node. A heading is a node. A two-column layout is a node. Those nodes can be nested just like headings in a table of contents. Each node has a NodeType, and, depending on this NodeType, can have various _properties_.

![](/_Resources/Persistent/2b70f22b3e3d1526ea8160ca67d03e699d1d6fa0/content.dimensions.svg)

### Why do we have it?

We are fond of having reusable content. The only known way to us to enable this, is to separate the actual content, e.g. text, headlines or images, from visual aspects, e.g. styling, composition or even HTML. Neos is built around this idea. The Content Repository is the heart of Neos. It stores the content and makes it available to the Fusion rendering layer.

Using Fusion, you can style and format your content as you wish. Different output formats like HTML and JSON are possible at the same time. The concept of separation enables you to reuse the content indefinitely and independently from different presentational variations.

With Neos you rarely need any plugins. You can build a calendar, blog or a wine catalogue without a single line of PHP. These features use the CR. Getting the three latest blog posts on your homepage is easy. Showing the next event in your app is easy.

### Characteristics

###### The CR is the Core of Neos.

The Content Repository is the conceptual core of Neos. The content in Neos is not stored inside tables of a relational database, but inside a tree-based structure: the so-called Neos Content Repository. It can store arbitrary content by managing so called _nodes_ that can have custom properties and child nodes.  
 

###### Configurable mapping of the 'Content Model'

To implement a content model, you do not have to deal with database migrations.

Instead, a model can be implemented using YAML configuration in the NodeTypes.yaml file. This allows to change existing and create new NodeTypes with a text editor.  
 

###### Create the NodeTypes that fit your needs

Content elements are easily configurable and extensible, so that plugins are rarely necessary anymore. The configuration of custom content elements is sufficient.  
 

###### Modelling abstraction layer to the database

To a certain extent, the CR is comparable to files in a file-system: They are also structured as a tree, and are identified uniquely by the complete path towards the file.

Internally, the Neos Content Repository (=CR) currently stores the nodes inside database tables as well, but you do not need to worry about that as you never deal with the database directly. This high-level abstraction helps to decouple the data modelling layer from the data persistence layer.

#### Learn more about the Content Repository in the inner chapters:

*   [Data Structure](/guide/manual/content-repository/data-structure)
*   [Presenta­tio­nal or Semantic](/guide/manual/content-repository/presentational-or-semantic)
*   [NodeType Definition](/guide/manual/content-repository/nodetype-definition)
*   [NodeType Properties](/guide/manual/content-repository/nodetype-properties)
*   [NodeType Constraints](/guide/manual/content-repository/node-constraints)
*   [NodeType Translations](/guide/manual/content-repository/nodetype-translations)
*   [Node Creation Dialog Confi­gura­tion](/guide/manual/content-repository/node-creation-dialog)
*   [NodeType Presets](/guide/manual/content-repository/nodetype-presets)
*   [Multisite Support](/guide/manual/content-repository/multisite-support)
*   [9.x: References vs Properties](/guide/manual/content-repository/references-vs-properties)
*   [9.x: Property Scopes to keep properties in sync across dimensions](/guide/manual/content-repository/property-scopes)
*   [Multiple Languages](/guide/manual/content-repository/multiple-languages)
*   [Content Dimensions](/guide/manual/content-repository/content-dimensions)
*   [Node Migrations](/guide/manual/content-repository/node-migrations)
*   [9.x: Content Repository Configuration (including Dimensions)](/guide/manual/content-repository/configuration)
*   [9.x: Migrating dimension config](/guide/manual/content-repository/migrating-dimension-config)