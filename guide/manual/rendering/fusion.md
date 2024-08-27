url: /guide/manual/rendering/fusion
# Fusion

A declarative approach to website developement

## Why Fusion?

Fusion is the central data transformation engine for Neos. It enables you to create a variety of formats (like HTML, AMP HTML, RSS, JSON...) from the same contents. To make this happen, Fusion fetches data, transforms it and sends the output to the client. That's Fusion's core business.

Fusion is declarative. You don't tell Fusion in which order to do things, instead you just define the how and Fusion will make it happen. We've included several standard functions like string concatenation. Those are used in pretty much every website and you don't need to implement those over and over again. Because Fusion brings so many standard transformations out of the box, depending on your requirements, you may be building an entire site without a single line of custom PHP code.

Another way to put it: You define the contents' behavior with Fusion. You could create a set of components, reuse them and make adjustments. Taming nodes with very specific requirements (like displaying a headline in red for Christmas) is easy. And the main bonus remains: Those modifications to the output are always separated from the content. Showing the same content in different contexts and formats is a key feature.

You could achieve the same thing using plain PHP. In that case, however, you need to take special care to have meaningful code structure and separation. Fusion nudges you in a friendly way to do it right.

Fusion never forces you to say no to your client or boss. Everything can be overwritten and customized to your wishes. Although Fusion equips you with a lot of power, you can dig in deeper with custom PHP classes and extensions. See the documentation on [using PHP and Flow in Neos](https://docs.neos.io/cms/manual/using-neos-with-php-flow) for further information.

## The Language

```neosfusion
// String assignment
name = "Earth"

// Nested object
planet.name = "Earth"               // String
planet.population = 8000000000      // Integer
planet.dead = false                 // Boolean
planet.areafiftyone = null          // Null
planet.plancktime = 5.39116         // Floating point

// Nesting without repeating the key (or lazy programmer style)
planet {
  name = "Earth"
  population = 8000000000
  dead = false
  areafiftyone = null
  plancktime = 5.39116
}
```

Fusion has many similarities to existing languages and borrows good concepts. The three ingredients are literals, expressions and objects. 

*   [**Fusion Language Syntax**  
    API References](/api/fusion/syntax)

## Fusion File Inclusion

Fusion is read from files. In the context of Neos, some of these files are loaded automatically, and Fusion files can be split into parts to organize things as needed.

### Automatic Fusion file inclusion

All Fusion files are expected to be in the package subfolder `Resources/Private/Fusion`. Neos will automatically include the file _Root.fusion_ for the current site package (the package which resides in `Packages/Sites` and has the type “neos-site” in its composer manifest).

To automatically include `Root.fusion` in your package, you will need to add the package to the configuration setting `Neos.Neos.fusion.autoInclude`:

Your.Package/Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    fusion:
      autoInclude:
        Your.Package: true
```

Neos will then auto-include `Root.fusion` files from the included packages in the order defined by the composer requirements. Files with a name other than `Root.fusion` **will never be auto-included** even with that setting. You will need to include them manually in your `Root.fusion`.

According to the agreed-upon best practices for future-proof Fusion, the `Root.fusion` must only contain includes and no other code.

A typical Root.fusion looks like this:

Your.Package/Resources/Private/Fusion/Root.fusion:
```neosfusion
# A typical Root.fusion only consists of one include statement
include: **/*.fusion
```

## Understanding manual Fusion file inclusion

To better understand how this works, read on. Or just jump to the next section.

You can include any Fusion file in further files using the include statement. The path is either relative to the current file or can be given with the resource wrapper:

```neosfusion
include: NodeTypes/CustomElements.fusion
include: resource://Acme.Demo/Private/Fusion/Quux.fusion
```

In addition to giving exact filenames, globbing is possible in two variants:

```neosfusion
# Include all .fusion files in NodeTypes
include: NodeTypes/*

# Include all .fusion files in NodeTypes and its subfolders recursively
include: NodeTypes/**/*
```

The first variant includes all Fusion files in the _NodeTypes_ folder, the latter will recursively include all Fusion files in NodeTypes and any folders below.

The globbing can also be combined with the resource wrapper:

```neosfusion
include: resource://Acme.Demo/Private/Fusion/NodeTypes/*
include: resource://Acme.Demo/Private/Fusion/**/*
```

## Objects & Your Data

The language itself is built around objects that perform the action. Objects could be pages, buttons, sections, contacts... Now you need to tell Neos how to handle and render an object. Let's have a look how this works:

An object has attributes and a context. Attributes help you to define the behavior of your object. The context gives you insight on the surroundings of your object.

The context answers questions like: Which node am I processing? Which is the closest document node? What HTTP request parameters are set? Those answers change depending on the node your object is working on.

The Content Repository supplies the context. You bring those in and map the relevant context variables to object attributes. This makes them available in your templates.

### Fusion Objects

Fusion is a language designed to describe Fusion objects. A Fusion object has variable properties which are used to configure the object. Additionally, as mentioned above, a Fusion object has access to a context, which is a list of variables. The goal of a Fusion object is to take the variables from the context and transform them to the desired output, using its properties for configuration as needed.

Thus, Fusion objects take some input which is given through the context and the properties, and produce a single output value. Internally, they can modify the context, and trigger rendering of nested Fusion objects: This way, a big task (like rendering a whole site) can be split into many smaller tasks (render a single image, render some text, …): The results of the small tasks are then put together again, forming the final end result.

Fusion object nesting is a fundamental principle of Fusion. As Fusion objects call nested Fusion objects, the rendering process forms a tree of Fusion objects.

A Fusion object can be instantiated by assigning it to a Fusion path, such as:

```neosfusion
foo = Neos.Neos:Page
# or:
my.object = Neos.Fusion:Value
# or:
my.image = Neos.Neos.ContentTypes:Image
```

The name of the to-be-instantiated Fusion prototype is listed without quotes. And qualified with the whole [namespace](https://docs.neos.io/cms/manual/rendering/fusion/in-depth#namespaces-of-fusion-objects) (f.x Neos.Neos).

By convention, Fusion paths (such as my.object) are written in lowerCamelCase, while Fusion prototypes (such as Neos.Neos.ContentTypes:Image) are written in UpperCamelCase.

It is possible to set properties on the newly created Fusion objects:

```neosfusion
foo.myProperty1 = 'Some Property which Page can access'
my.object.myProperty1 = "Some other property"
my.image.width = ${q(node).property('foo')}
```

Property values that are strings have to be quoted (with either single or double quotes). Alternatively, the value can be an expression that manipulates a variable.

To reduce typing overhead, curly braces can be used to abbreviate long Fusion paths:

```neosfusion
my {
  image = Vendor.Name:Image
  image.width = 200

  object {
    myProperty1 = 'some property'
  }
}
```

You can also instantiate a Fusion object and set properties on it in a single pass. All three following examples result in the same output:

```neosfusion
someImage = Vendor.Name:Image
someImage.foo = 'bar'

# Instantiate object, set property one after each other
someImage = Vendor.Name:Image
someImage {
  foo = 'bar'
}

# Instantiate an object and set properties directly
someImage = Vendor.Name:Image {
  foo = 'bar'
}
```

> **💡 Structuring Fusion files**
> 
> While Fusion files can contain several prototypes, according to the best practice, they should contain the definition for only one single prototype. Furthermore, the folder and filenames must reflect the names of the prototypes within.

### Avoiding Side-Effects

When Fusion objects are rendered, they are allowed to modify the Fusion context (they can add or override variables) or can invoke other Fusion objects. However, after rendering, the parent Fusion object must make sure to clean up the context, so that it contains exactly the state it had before the rendering.

The only thing you need to make sure is that if you add some variable to the stack, effectively creating a new stack frame, you need to remove exactly this stack frame after rendering again. This means that a Fusion object can only manipulate Fusion objects below it, but not following or preceding it.

In order to enforce this, Fusion objects are only allowed to communicate through the Fusion context and they are never allowed to be invoked directly. Instead, all invocations need to be done through the Fusion runtime.

All these constraints make sure that a Fusion object is side-effect-free, leading to an important benefit for you: If somebody knows the exact path towards a Fusion object together with its context, it can be rendered in a stand-alone manner, exactly as if it was embedded in a bigger element. This enables you, for example, to render parts of pages with different cache lifetimes.

## Prototypes & Inheritance

When you instantiate a Fusion object, the Fusion prototype for this object is copied and used as a basis for the new object. The prototype is defined using the following syntax:

```neosfusion
prototype(Vendor.Name:MyImage) {
  width = '500px'
  height = '600px'
}
```

When the above prototype is instantiated, the instantiated object will have all the properties of the copied prototype. This is illustrated through the following example:

```neosfusion
someImage = Vendor.Name:MyImage
# now, someImage will have a width of 500px and a height of 600px

someImage.width = '100px'
# now, we have overridden the height of "someImage" to be 100px.
```

> **💡 Prototype- vs. class-based languages**
> 
>  There are generally two major “flavors” of object-oriented languages. Most languages (such as PHP, Ruby, Perl, Java, C++) are class-based, meaning that they explicitly distinguish between the place where the behavior for a given object is defined (the “class”) and the runtime representation which contains the data (the “instance”).  
> Other languages such as JavaScript are prototype-based, meaning that there is no distinction between classes and instances: At object creation time, all properties and methods of the object’s prototype (which roughly corresponds to a “class”) are copied (or otherwise referenced) to the instance.  
> Fusion is a prototype-based language because it copies the Fusion prototype to the instance when an object is evaluated.

Prototypes in Fusion are mutable, which means that you can easily modify them:

```neosfusion
prototype(Vendor.Name:MyYouTube) {
  width = '100px'
  height = '500px'
}

# you can change the width/height
prototype(Vendor.Name:MyYouTube).width = '400px'

# or define new properties:
prototype(Vendor.Name:MyYouTube).showFullScreen = ${true}
```

Defining and instantiating a prototype from scratch is not your only way to define and instantiate them. You can also use an existing Fusion prototype as basis for a new one when needed. This can be done by inheriting from a Fusion prototype using the < operator:

```neosfusion
prototype(Vendor.Name:MyImage) < prototype(Neos.Neos:Content)

# now, the Vendor.Name:MyImage prototype contains all properties of the Template
# prototype, and can be further customized.
```

This implements prototype inheritance, meaning that the “subclass” (Vendor.Name:MyImage in the example above) and the “parent class" (Content) are still attached to one another. If you modify the parent class, for example by adding a property, this change will also apply to the subclass, as in the following example:

```neosfusion
prototype(Neos.Neos:Content).fruit = 'apple'
prototype(Neos.Neos:Content).meal = 'dinner'

prototype(Vendor.Name:MyImage) < prototype(Neos.Neos:Content)
# now, Vendor.Name:MyImage also has the properties "fruit = apple" and "meal = dinner"

prototype(Neos.Neos:Content).fruit = 'Banana'
# because Vendor.Name:MyImage *extends* Neos.Neos:Content, Vendor.Name:MyImage.fruit equals 'Banana' as well.

prototype(Vendor.Name:MyImage).meal = 'breakfast'
prototype(Neos.Fusion:Content).meal = 'supper'
# because MyImage now has an *overridden* property "meal", the change of
# the parent class' property is not reflected in the MyImage class
```

Prototype inheritance can only be defined globally (not nested), i.e. with a statement of the following form:

```neosfusion
prototype(Vendor.Name:Foo) < prototype(Vendor.Name:Bar)
```

> **⚠️ Don't nest prototype inheritance!**
> 
> It is not allowed to nest prototypes when defining prototype inheritance. It is invalid Fusion and will result in an exception.  
> While it would be theoretically possible to support this, we have chosen not to do so in order to reduce complexity and to keep the rendering process more understandable. We have not yet seen a Fusion example where a construct such as the above can't be solved another way.  
> (this will not work: `foo.prototype(Vendor.Name:Foo) < prototype(...)`)

### Hierarchical Fusion Prototypes

You can flexibly adjust the rendering of a Fusion object by modifying its prototype in certain parts of the rendering tree. This is possible because Fusion prototypes are hierarchical, meaning that prototype(Foo) can be part of any Fusion path in an assignment. This can even be done multiple times:

```neosfusion
prototype(Vendor.Name:Foo).bar = 'baz'
prototype(Vendor.Name:Foo).some.thing = 'baz2'

some.path.prototype(Vendor.Name:Foo).some = 'baz2'

prototype(Vendor.Name:Foo).prototype(Vendor.Name:Bar).some = 'baz2'
prototype(Vendor.Name:Foo).left.prototype(Vendor.Name:Bar).some = 'baz2'

```

*   **prototype(Vendor.Name:Foo).bar** is a simple, top-level prototype property assignment. It means: _For all objects of type Vendor.Name:Foo, set property bar_. The second example is another variant of this pattern, just with more nesting levels inside the property assignment.
*   **some.path.prototype(Vendor.Name:Foo).some** is a prototype property assignment _inside some.path_. It means: _For all objects of type Vendor.Name:Foo which occur inside the Fusion path some.path, the property some is set._
*   **prototype(Vendor.Name:Foo).prototype(Vendor.Name:Bar).some** is a prototype property assignment _inside another prototype_. It means: _For all objects of type Vendor.Name:Bar which occur somewhere inside an object of type Vendor.Name:Foo, the property some is set._
*   This can both be combined, as in the last example inside prototype(Vendor.Name:Foo).left.prototype(Vendor.Name:Bar).some.

> **💡 Internals of hierarchical prototypes**
> 
> As mentioned before, Fusion objects are side-effect free, which means that they can be rendered deterministically knowing only their Fusion path and the context.  
> In order to make this work with hierarchical prototypes, we need to encode the types of all Fusion objects above the current one into the current path. This is done using angular brackets:  
> `a1/a2<Vendor.Name:Foo>/a3/a4<Vendor.Name:Bar>`  
> When this path is rendered, a1/a2 is rendered as a Fusion object of type Vendor.Name:Foo, which is needed to apply the prototype inheritance rules correctly.  
> Those paths are rarely visible on the “outside” of the rendering process, but you might come across them at times, as they appear in exception messages if rendering fails. For those cases it is helpful to know their semantics.  
> Bottom line: It is not important to know exactly how the rendering of a Fusion object’s Fusion path is constructed. Just pass it on, without modification to render a single element out of band.

## Setting Properties On a Fusion Object

Although the Fusion object can read its context directly, it is good practice to instead use _properties_ for configuration: 

```neosfusion
# imagine there is a property "foo=bar" inside the Fusion context at this point
myObject = Vendor.Name:MyObject

# explicitly take the "foo" variable's value from the context and pass it into the "foo"
# property of myObject. This way, the flow of data is more visible.
myObject.foo = ${foo}
```

While `myObject` could rely on the assumption that there is a `foo` variable inside the Fusion context, it has no way (besides written documentation) to communicate this to the outside world.

Therefore, a Fusion object’s implementation should _only use properties_ of itself to determine its output, and be independent of what is stored in the context.

However, in the prototype of a Fusion object, it is perfectly legal to store the mapping between the context variables and Fusion properties, such as in the following example:

```neosfusion
# this way, an explicit default mapping between a context variable and a property of the
# Fusion object is created.
prototype(Vendor.Name:MyObject).foo = ${foo}
```

To sum it up: When implementing a Fusion object, it should not access its context variables directly, but instead use a property. In the Fusion object’s prototype, a default mapping between a context variable and the prototype can be set up.

## Default Context Variables

Neos exposes some default variables to the Fusion context that can be used to control page rendering in a more granular way.

*   `node` can be used to get access to the current node in the node tree and read its properties. It is of type `NodeInterface` and can be used to work with node data, such as:  
      
    `# Make the node available in the template`  
    `node = ${node}`  
      
    `# Expose the "backgroundImage" property to the rendering using FlowQuery`  
    `backgroundImage = ${q(node).property('backgroundImage')}`  
      
    In a Fluid template, to see what data is available on the node, you can expose it to the template as above and wrap it in a debug view helper:  
      
    `{node -> f:debug()}`  
     
*   `documentNode` contains the closest parent document node - broadly speaking, it is the page the current node is on. Just like `node`, it is a `NodeInterface` and can be provided to the rendering in the same way:  
      
    `_# Expose the document node to the template_`  
    `documentNode = ${documentNode}`  
      
    `_# Display the document node path_ nodePath = ${documentNode.path}`  
      
    `documentNode` is in the end just a shorthand to get the current document node faster. It could be replaced with:  
      
    `_# Expose the document node to the template using FlowQuery and a Fizzle operator_`   
    `documentNode = ${q(node).closest('[instanceof Neos.Neos:Document]').get(0)}`  
     
*   `request` is an instance of `Neos\Flow\Mvc\ActionRequest` and allows you to access the current request from within Fusion. Use it to provide request variables to the template:  
      
    `_# This would provide the value sent by an input field with name="username"._`  
    `userName = ${request.arguments.username}`  
      
    `_# request.format contains the format string of the request, such as "html" or "json"_`  
    `requestFormat = ${request.format}`  
      
    Another use case is to trigger an action, e.g. a search, via a custom Eel helper:  
      
    `searchResults = ${Search.query(site).fulltext(request.arguments.searchword).execute()}`  
      
    A word of caution: You should never trigger write operations from Fusion, since it can be called multiple times (or not at all, because of caching) during a single page render. If you want a request to trigger a persistent change on your site, it’s better to use a [Plugin](/guide/manual/extending-neos-with-php-flow/creating-a-plugin).

## Manipulating the Fusion Context

The Fusion context can be manipulated directly through the use of the `@context` meta property:

```neosfusion
myObject = Vendor.Name:MyObject
myObject.@context.bar = ${foo * 2}
```

In the above example, there is now an additional context variable `bar` with twice the value of `foo`.

This functionality is especially helpful if there are strong conventions regarding the Fusion context variables. This is often the case in standalone Fusion applications, but for Neos, this functionality is hardly ever used.

> **ℹ️ Warning**
> 
> In order to prevent unwanted side effects, it is not possible to access context variables from within `@context` on the same level. This means that the following will never return the string `Hello World!`  
>   
> `@context.contextOne = 'World!'`  
> `@context.contextTwo = ${'Hello ' + contextOne}`   
> `output = ${contextTwo}`

## Processors

Processors allow you to manipulate the values in Fusion properties. A processor is applied to a property using the `@process` meta property:

```neosfusion
myObject = Vendor.Name:MyObject {
  property = 'some value'
  property.@process.1 = ${'before ' + value + ' after'}
}
# results in 'before some value after'
```

Multiple processors can be used. Their execution order is defined by the numeric position given in the Fusion after `@process`. In the example above, a `@process.2` would run on the results of `@process.1`.

Additionally, an extended syntax can be used as well:

```neosfusion
myObject = Vendor.Name:MyObject {
  property = 'some value'
  property.@process.someWrap {
    expression = ${'before ' + value + ' after'}
    @position = 'start'
  }
}
```

This allows you to use string keys for the processor name, and support `@position` arguments as explained for Arrays.

Processors are expressions or Fusion objects operating on the value property of the context. Additionally, they can access the current Fusion object they are operating on as `this`.

## Conditions

Conditions can be added to all values to prevent evaluation of the value. A condition is applied to a property using the `@if` meta property:

```neosfusion
myObject = Neos.Neos:Menu {
  @if.1 = ${q(node).property('showMenu') == true}
}
# results in the menu object only being evaluated if the node's showMenu property is not ``false``
# the php rules for mapping values to boolean are used internally so following values are
# considered being false: ``null, false, '', 0, []``
```

You can use multiple conditions. If one of them doesn’t return true, the condition stops evaluation.

## Apply

`@apply` allows to override multiple properties of a Fusion prototype with a single expression. This is useful when complex data structures are mapped to Fusion prototypes.

The example shows the rendering of a `teaserList` array by using a Teaser component and passing all keys of each teaser to the Fusion object:

```neosfusion
teasers = Neos.Fusion:Collection {
        collection = ${teaserList}
        itemName = 'teaser'
        itemRenderer = Vendor.Site:Teaser {
                @apply.teaser = ${teaser}
        }
}
```

The code avoids passing down each Fusion property explicitly to the child component. A similar concept with different syntax from the JavaScript world is known as ES6 Spreads.

Another use case is to use `Neos.Fusion:Renderer` to render a prototype while type and properties are based on data from the context:

```neosfusion
example = Neos.Fusion:Renderer {
        type = ${data.type}
        element.@apply.properties = ${data.properties}
}
```

That way some meta programming can used in Fusion and both prototype and properties are decided late in the rendering by the Fusion runtime.

#### How it works

The keys below `@apply` are evaluated before the Fusion object and the `@context` are initialized. Each key below `@apply` must return a key-value map (values other than an array are ignored). During the evaluation of each Fusion path, the values from `@apply` are always checked first.

If a property is defined via `@apply` , this value is returned without evaluating the fusionPath.

The `@process` and `@if` rules of the original Fusion key are still applied even if a value from `@apply` is returned.

Since `@apply` is evaluated first, the overwritten values are already present during the evaluation of `@context` and will overlay the properties of `this` if they are accessed.

`@apply` supports the same extended syntax and ordering as Fusion processors and supports multiple keys. The evaluation order is defined via `@position`, the keys that are evaluated last will override previously defined keys. This is also similar to the rules for `@process`:

```neosfusion
test = Vendor.Site:Prototype {
        @apply.contextValue {
                @position = 'start'
                expression = ${ arrayValueFromContext }
        }
        @apply.fusionObject {
                @position = 'end'
                expression = Neos.Fusion:RawArray {
                        value = "altered value"
                }
        }
}
```

Other than `@context` , `@apply` is only valid for a single Fusion path, so when subpaths or children are rendered, they are not affected by the parent's `@apply` unless they are explicitly passed down.

## Debugging

To show the result of Fusion expressions directly, you can use the `Neos.Fusion:Debug` Fusion object:

```neosfusion
debugObject = Neos.Fusion:Debug {
  # optional: set title for the debug output
  # title = 'Debug'

  # optional: show result as plain text
  # plaintext = TRUE

  # If only the "value" key is given it is debugged directly,
  # otherwise all keys except "title" and "plaintext" are debugged.
  value = "hello neos world"

  # Additional values for debugging
  documentTitle = ${q(documentNode).property('title')}
  documentPath = ${documentNode.path}
}
# the value of this object is the formatted debug output of all keys given to the object
```

## Guide & Reference

*   [**Fusion in depth**  
    Guide](/guide/manual/rendering/fusion/in-depth)
*   [**Fusion Syntax**  
    API References](/api/fusion/syntax)
*   [**Fusion Objects**  
    References on Read the Docs](https://neos.readthedocs.io/en/8.3/References/NeosFusionReference.html)

## Further reading

*   [**Learn Neos**  
    Blog](https://learn-neos.com/blog.html)
*   [**A Round Trip Through Your Presentation Layer in Neos**](https://www.youtube.com/watch?v=8bZikINA2UA)
*   [**Context Variables explained**](https://www.youtube.com/watch?v=CvEsGes4pZw)
*   [**Conditional Logic in Neos Fusion**  
    Blog by Bastian Heist](https://sandstorm.de/de/blog/post/the-definitive-guide-to-conditional-logic-in-neos-fusion.html)