url: /guide/manual/content-repository/node-constraints
# NodeType Constraints

... how to restrict editor's choice

In a typical  project, you will create lots of custom NodeTypes. Many NodeTypes should only be used in a limited context and not elsewhere. Neos allows you to define NodeType constraints, which restrict the places where NodeTypes can be added. There are two ways to do this:

*   Regular NodeType constraints are defined per NodeType. They apply in any context the NodeType appears in.
*   Additionally, when a NodeType has auto-created child nodes, you can define additional constraints that only apply for these child nodes. This allows you to restrict NodeType usage depending on the context that the NodeTypes are placed in.  
     

## Regular NodeType Constraints

Let’s assume that, inside the _Chapter_ NodeType of the Neos Demo Site (which is a document node), one should only be able to create nested chapters, and not pages or shortcuts. Using NodeType constraints, this can be enforced:

Configuration/NodeTypes.Document.Chapter.yaml (partly):
```yaml
'Neos.Demo:Document.Chapter':
  constraints:
    nodeTypes:
      'Neos.Neos:Document': false
      'Neos.Demo:Document.Chapter': true
```

In the above example, we disable all document NodeTypes using _'Neos.Neos:Document': false_, and then enable the _Neos.Demo:Document.Chapter_ NodeType as well as any NodeType that inherits from it. The reason why we use _'Neos.Neos:Document': false_ instead of _'\*': false_ here is that by default, only document NodeTypes are allowed as children of other document NodeTypes anyway (see further down for more information regarding the defaults).

You might now wonder why it is still possible to create content inside the chapter (because everything except Chapter is disabled with the above configuration): The reason is that NodeType constraints are only enforced for nodes which are **not auto-created**. Because _Neos.Demo:Document.Chapter_ has an auto-created main ContentCollection, it is still possible to add content inside. In the following example, we see the NodeType definition which is shipped with the demo website:

Configuration/NodeTypes.Document.Chapter.yaml (partly):
```yaml
'Neos.Demo:Document.Chapter':
  superTypes:
    'Neos.Neos:Document': true
  childNodes:
    'main':
      type: 'Neos.Neos:ContentCollection'
```

The main _ContentCollection_ is still added, even though you cannot add any more because _ContentCollections_ are not allowed according to the NodeType constraints.

The _Neos.Neos:Document_ NodeType, by default, allows any other _Neos.Neos:Document_ NodeType below it. This means that if you want to disable all document NodeTypes under your custom one, setting _'\*': false_ will have no effect on anything inheriting from Neos.Neos:Document - the more specific constraint _'Neos.Neos:Document': true_ will override it. You will need to set _'Neos.Neos:Document': false_ instead.

The default _Neos.Neos:Content_ NodeType, on the other hand, only has the catch-all constraint. If you want to enable any child nodes, you can simply allow them.

```yaml
'Neos.Neos:Content':
  constraints:
    nodeTypes:
      '*': false
```

## Auto-Created Child Node Constraints

Let’s assume that our chapter NodeTypes should only contain text within its main _ContentCollection_. This is possible using additional constraints for each _auto-created child node_. These constraints will only be applied for the configured _auto-created child nodes_ - not for any others, even if they are of the same type.

```yaml
'Neos.Demo:Document.Chapter':
  childNodes:
    'main':
      type: 'Neos.Neos:ContentCollection'
      constraints:
        nodeTypes:
          '*': false
          'Neos.NodeTypes:Text': true
```

> **💡 Tip**
> 
> We do not recommend anymore to use _Neos.NodeTypes_ directly. Please build your own NodeTypes.

## In-Depth Behavior

The following logic applies for NodeType constraints:

*   Constraints are only enforced for child nodes which are not auto-created.
*   You can specify NodeTypes explicitly or use ‘\*’ to allow/deny all NodeTypes.
*   Setting the value to true is an explicit _allow_
*   Setting the value to false is an explicit _deny_
*   The default is to _always deny_ (in case ‘\*’ is not specified).
*   More specific constraints override less specific constraints. Specificity is deduced from the inheritance hierarchy of the NodeTypes. This means that e.g. setting ‘\*’: false will only apply if no more specific constraint has been set, such as ‘Neos.Neos:Document’: true.
*   NodeType constraints are inherited from parent NodeTypes. If your NodeType has listed Neos.Neos:Document as a superType, its constraints will apply for your NodeType as well.

The last rule is especially important, since most NodeTypes you define will have either _Neos.NodeTypes:Page_ (which, in turn, inherits from _Neos.Neos:Document_) or _Neos.Neos:Content_ as superTypes. You should know which constraints are defined per default in order to effectively override them. These are the current defaults for these two NodeTypes - this is taken from _NodeTypes.yaml_ in the _Neos.Neos_ package.

```yaml
'Neos.Neos:Document':
  constraints:
    nodeTypes:
      '*': false
      'Neos.Neos:Document': true
```

The document NodeType, by default, allows any other document NodeType below it. This means that if you want to disable all document NodeTypes under your custom one, setting _'\*': false_ will have no effect on anything inheriting from _Neos.Neos:Document_ - the more specific constraint _'Neos.Neos:Document': true_ will override it. You will need to set _'Neos.Neos:Document': false_ instead.

The default content NodeType, on the other hand, only has the catch-all constraint. If you want to enable any child nodes, you can simply allow them.

```yaml
'Neos.Neos:Content':
  constraints:
    nodeTypes:
      '*': false
```

## Further reading

*   [Cookbook: Better NodeType Constraints](/tutorials/better-constraints)