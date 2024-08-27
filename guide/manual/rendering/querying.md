url: /guide/manual/rendering/querying
# Querying the CR

Getting data from the Content Repository

## Getting and transforming data

All data is saved in the content repository. Now we need to get this data to render it in your Fusion.

So let's learn how we can get, transform and later render this data.

## Getting data from the current node

When you render a node, this `node` is available as a [context variable.](https://docs.neos.io/cms/manual/rendering/fusion#default-context-variables) Besides simple Fusion assignments such as `foo = 'bar'`, it is possible to write eel _expressions_ such as `foo = ${q(node).property('bar')}`. to get the property 'bar' from the current node.

Let's say we have a NodeType `Vendor.Example:Content.Text` with two inline editable properties `title` and `text`. We also have a boolean property `columns` to let the editor choose to split the text in colums.

Rendering could look like this:

Text.fusion:
```neosfusion
prototype(Vendor.Example:Content.Text) < prototype(Neos.Neos:ContentComponent) {
    title = Neos.Neos:Editable {
        property = 'title'
    }
    text = Neos.Neos:Editable {
        property = 'text'
    }
    columns = ${q(node).property('columns')}

    renderer = afx`
        <div class="text">
            <div>{props.title}</div>
            <div class={props.columns && 'columns-2'}>{props.text}</div>
        </div>
    `
}

```

So let's break it down. We define a Fusion prototype for rendering, where we set `title` and `text` as editable content. You will learn more about this in the next chapter.

We also use `columns` as a switch in AFX to conditionally apply a css class via the 'AND' `&&` operator (see short circuit evaluation). 

And then we render all of this using AFX, as described in the next chapter.

For more complex usecases, where you want to map not a boolean to a class value but rather a node property value to a class name look into `Neos.Fusion:Match`.

```neosfusion
mappedTextSize = Neos.Fusion:Match {
    @subject = ${q(node).property('textSize')}
    @default = ''
    1 = 'text-lg'
    2 = 'text-xl'
    3 = 'text-2xl'
	// ...
}

```

### Inside the curly brackets ${...}

We call the language inside the curly brackets the _Embedded Expression Language_ (Eel), `${...}` is the delimiter for Eel expressions.

Basically, the syntax and semantics is like a condensed version of JavaScript:

*   Most things you can write as a single JavaScript expression (that is, without a `;`) can also be written as Eel expression.
*   Eel does not throw an error if `null` values are dereferenced, i.e. inside `${foo.bar}` with `foo` being `null`. Instead, `null` is returned. This also works for calling undefined functions.
*   Eel does not support control structures or variable declarations.
*   Eel supports the common JavaScript arithmetic and comparison operators, such as `+-*/%` for arithmetic and `== != > >= < <=` for comparison operators. Operator precedence is as expected, with multiplication binding higher than addition. This can be adjusted by using brackets. Boolean operators `&&` and `||` are supported.
*   Eel supports the ternary operator to allow for conditions `<condition> ? <ifTrue> : <ifFalse>`.
*   When object access is done (such as `node.context.inBackend`) on PHP objects, getters (`get*` and `is*`) are called automatically.
*   Object access with the offset notation is supported as well: `foo['bar']`

This means the following expressions are all valid Eel expressions:

```neosfusion
${foo.bar}         // Traversal
${foo.bar()}       // Method call
${foo.bar().baz()} // Chained method call

${foo.bar("arg1", true, 42)} // Method call with arguments

${12 + 18.5}         // Calculations are possible
${foo == bar}      // ... and comparisons

${foo.bar(12+18.5, foo == bar)} // and of course also use it inside arguments

${[foo, bar]}           // Array Literal
${{foo: bar, baz: test}} // Object Literal (PHP associative array)
```

> **💡 Background**
> 
> It is a building block for creating Domain Specific Languages. It provides a rich _syntax_ for arbitrary expressions, such that the author of the DSL can focus on its Semantics.

### Functions inside Eel

Eel does not define any functions or variables by itself. Instead, it exposes the _Eel context array_, meaning that functions and objects which should be accessible can be defined there.

Because of that, Eel is perfectly usable as a “domain-specific language construction kit”, which provides the syntax, but not the semantics of a given language.

For Eel **inside Fusion**, the semantics are as follows:

*   All variables of the Fusion context are made available inside the Eel context.
*   The special variable `this` always points to the current Fusion object implementation.
*   The function `q()` is available, which wraps its argument into a FlowQuery object. [FlowQuery](https://neos.readthedocs.io/en/stable/CreatingASite/Fusion/EelFlowQuery.html#flowquery) is explained below.

By default the following Eel helpers are available in the default context for Eel expressions:

*   `String`, exposing `Neos\Eel\Helper\StringHelper`
*   `Array`, exposing `Neos\Eel\Helper\ArrayHelper`
*   `Date`, exposing `Neos\Eel\Helper\DateHelper`
*   `Configuration`, exposing `Neos\Eel\Helper\ConfigurationHelper`
*   `Math`, exposing `Neos\Eel\Helper\MathHelper`
*   `Json`, exposing `Neos\Eel\Helper\JsonHelper`
*   `Security`, exposing `Neos\Eel\Helper\SecurityHelper`
*   `Translation`, exposing `Neos\Flow\I18n\EelHelper\TranslationHelper`
*   `Neos.Node`, exposing `Neos\Neos\Fusion\Helper\NodeHelper`
*   `Neos.Link`, exposing `Neos\Neos\Fusion\Helper\LinkHelper`
*   `Neos.Array`, exposing `Neos\Neos\Fusion\Helper\ArrayHelper`
*   `Neos.Rendering`, exposing `Neos\Neos\Fusion\Helper\RenderingHelper`

See: [Eel Helpers Reference](https://neos.readthedocs.io/en/stable/References/EelHelpersReference.html#eel-helpers-reference)

This is configured via the setting `Neos.Fusion.defaultContext`.

Additionally, the defaultContext contains the `request` object, where you have also access to Arguments. e.g. `${request.httpRequest.arguments.nameOfYourGetArgument}`

## Getting data from other nodes with FlowQuery

You might already noticed that we use a function to get the property of the current node with `myObject.foo = ${q(node).property('bar')}`

This function q is called FlowQuery. As the name might suggest, _is like jQuery for Flow_. It’s syntax has been heavily influenced by jQuery.

FlowQuery is a way to process the content (being a Neos ContentRepository node within Neos) of the Eel context. FlowQuery operations are implemented in PHP classes. For any FlowQuery operation to be available, the package containing the operation must be installed. Any package can add their own FlowQuery operations. A set of basic operations is always available as part of the Neos.Eel package itself.

In Neos.Neos, the following FlowQuery operations are defined:

*   `**property**`  
    Adjusted to access properties of a Neos ContentRepository node. If property names are prefixed with an underscore, internal node properties like start time, end time, and hidden are accessed.  
     
*   `**filter**`  
    Used to check a value against a given constraint. The filters expressions are given in [Fizzle](https://neos.readthedocs.io/en/stable/CreatingASite/Fusion/EelFlowQuery.html#fizzle), a language inspired by CSS selectors. The Neos-specific filter changes `instanceof` to work on node types instead of PHP classes.  
     
*   `**children**`  
    Returns the children of a Neos ContentRepository node. They are optionally filtered with a `filter` operation to limit the returned result set.  
     
*   `**parents**`  
    Returns the parents of a Neos ContentRepository node. They are optionally filtered with a `filter` operation to limit the returned result set.

  
A reference of all FlowQuery operations defined in Neos.Eel and Neos.Neos can be found in the [FlowQuery Operation Reference](https://neos.readthedocs.io/en/stable/References/FlowQueryOperationReference.html#flowquery-operation-reference).

### Operation Resolving

When multiple packages define an operation with the same short name, they are resolved using the priority each implementation defines, higher priorities have higher precedence when operations are resolved.

The `OperationResolver` loops over the implementations sorted by order and asks them if they can evaluate the current context. The first operation that answers this check positively is used.

### FlowQuery by Example

Any context variable can be accessed directly:

${myContextVariable}

and the current node is available as well:

${node}

There are various ways to access its properties:

While direct access like `${node.properties.foo}` is possible, it should be avoided because it would lead to all properties being "prepared" - eg. references being resolved. A performance hit might occur in this case, so it's sensible to use FlowQuery with the `property` operation instead:

${q(node).property('foo')} // Better: use FlowQuery instead

Through this a node property can be fetched and assigned to a path:

text = ${q(node).property('text')}

Fetching all parent nodes of the current node:

${q(node).parents()}

Here are two equivalent ways to fetch the first node below the `left` child node:

${q(node).children('left').first()}
${q(node).children().filter('left').first()}

Fetch all parent nodes and add the current node to the selected set:

${node.parents().add(node)}

The next example combines multiple operations. First it fetches all children of the current node that have the name `comments`. Then it fetches all children of those nodes that have a property `spam`with a value of false. The result of that is then passed to the `count()` method and the count of found nodes is assigned to the variable ‘numberOfComments’:

numberOfComments = ${q(node).children('comments').children("\[spam = false\]").count()}

The following expands a little more on that. It assigns a set of nodes to the `collection` property of the comments object. This set of nodes is either fetched from different places, depending on whether the current node is a `ContentCollection` node or not. If it is, the children of the current node are used directly. If not, the result of `this.getNodePath()` is used to fetch a node below the current node and those children are used. In both cases the nodes are again filtered by a check for their property `spam` being false.

comments.collection = ${q(node).is('\[instanceof Neos.Neos:ContentCollection\]') ?
        q(node).children("\[spam = false\]") : q(node).children(this.getNodePath()).children("\[spam = false\]")}

Querying for nodes of two or more different node types

elements = ${q(node).filter('\[instanceof Neos.NodeTypes:Text\],\[instanceof Neos.NodeTypes:TextWithImage\]').get()}

### Filter Operations

Filter operations as already shown are inspired by the selector syntax known from CSS.

#### Property Name Filters

The first component of a filter query can be a `Property Name` filter. It is given as a simple string. Checks against property paths are not currently possible:

```neosfusion
foo          //works
foo.bar      //does not work
foo.bar.baz  //does not work
```

In the context of Neos the property name is rarely used, as FlowQuery operates on Neos ContentRepository nodes and the `children` operation has a clear scope. If generic PHP objects are used, the property name filter is essential to define which property actually contains the `children`.

#### Attribute Filters

The next component are `Attribute` filters. They can check for the presence and against the values of attributes of context elements:

```neosfusion
baz[foo]
baz[answer = 42]
baz[foo = "Bar"]
baz[foo = 'Bar']
baz[foo != "Bar"]
baz[foo ^= "Bar"]
baz[foo $= "Bar"]
baz[foo *= "Bar"]

```

As the above examples show, string values can be quoted using double or single quotes.

#### Available Operators

The operators for checking against attribute are as follows:

`**=**`     Strict equality of value and operand  
`**!=**`   Strict inequality of value and operand  
`**$=**`   Value ends with operand (string-based)  
`**^=**`   Value starts with operand (string-based)  
`***=**`   Value contains operand (string-based)  
`**instanceof**` Checks if the value is an instance of the operand

For the latter the behavior is as follows: if the operand is one of the strings object, array, int(eger), float, double, bool(ean) or string the value is checked for being of the specified type. For any other strings the value is used as class name with the PHP instanceof operation to check if the value matches.

#### Using Multiple Filters

It is possible to combine multiple filters:

`**[foo][bar][baz]**`

All filters have to match (AND)

`**[foo],[bar],[baz]**`

Only one filter has to match (OR)

## Extended core behavior

*   [Custom Eel Helpers](/guide/manual/extending-neos-with-php-flow/custom-eel-helpers)
*   [Custom FlowQuery Operations](/guide/manual/extending-neos-with-php-flow/custom-flowquery-operations)