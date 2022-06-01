# Fusion Objects

## Basic

`Neos.Fusion:Value`
{.api-name}
### Value  
{data-name=gugus}

Evaluate any value as a Fusion object

#### Properties
| Name  | Type              | Default | Description           |
|:------|:------------------|:--------|:----------------------|
| value | `mixed, required` |         | The value to evaluate |

#### Example
```php
myValue = Neos.Fusion:Value {
    value = 'Hello World'
}
```

::: tip
Most of the time this can be simplified by directly assigning the value instead of using the Value object.

```php
value = 'foo'
```
:::

`Neos.Fusion:CanRender`
{.api-name}
### CanRender

Check whether a Fusion prototype can be rendered. For being renderable a prototype must exist and have an implementation class, or inherit from an existing renderable prototype. The implementation class can be defined indirectly via base prototypes.

#### Properties
| Name | Type               | Default | Description                        |
|:-----|:-------------------|:--------|:-----------------------------------|
| type | `string, required` |         | The prototype name that is checked |


#### Example
```php
canRender = Neos.Fusion:CanRender {
    type = 'My.Package:Prototype'
}
```

`Neos.Fusion:Component`
{.api-name}
### Component

Create a component that adds all properties to the props context and afterward evaluates the renderer. This is one of the most central Fusion objects.

#### Properties
| Name     | Type              | Default | Description                   |
|:---------|:------------------|:--------|:------------------------------|
| renderer | `mixed, required` |         | The value which gets rendered |

#### Example
```php
canRender = Neos.Fusion:CanRender {
    type = 'My.Package:Prototype'
}
```

`Neos.Fusion:Renderer`
{.api-name}
### Renderer

The Renderer object will evaluate to a result using either `renderer`, `renderPath` or `type` from the configuration.

#### Properties
| Name         | Type     | Default | Description                                                                                  |
|:-------------|:---------|:--------|:---------------------------------------------------------------------------------------------|
| type         | `string` |         | Object type to render (as string)                                                            |
| element.*    | `mixed`  |         | Properties for the rendered object (when using type)                                         |
| rendererPath | `string` |         | Relative or absolute path to the fusion ast object, overrules `type`                         |
| renderer     | `mixed`  |         | Rendering definition (simple value, expression or object), overrules `renderPath` and `type` |

#### Example
```php
myCase = Neos.Fusion:Renderer {
    type = 'Neos.Fusion:Value'
    element.value = 'hello World'
}
```

::: tip
This is especially handy if the prototype that should be rendered is determined via eel or passed via `@context`.
:::

`Neos.Fusion:Template`
{.api-name}
### Template

Render a Fluid template specified by `templatePath`.

#### Properties
| Name            | Type               | Default | Description                                                                                  |
|:----------------|:-------------------|:--------|:---------------------------------------------------------------------------------------------|
| templatePath    | `string, required` |         | Path and filename for the template to be rendered, often a `resource://` URI                 |
| partialRootPath | `string`           |         | Path where partials are found on the file system                                             |
| layoutRootPath  | `string`           |         | Path where layouts are found on the file system                                              |
| sectionName     | `string`           |         | The Fluid `<f:section>` to be rendered, if given                                             |
| [key]           | `mixed`            |         | Rendering definition (simple value, expression or object), overrules `renderPath` and `type` |

#### Example
```php
myTemplate = Neos.Fusion:Template {
    templatePath = 'resource://My.Package/Private/Templates/FusionObjects/MyTemplate.html'
    someDataAvailableInsideFluid = 'my data'
}
```

``` html
<strong class="hero">
    {someDataAvailableInsideFluid}
</strong>
```

**my data**{.hero}
{.preview}

::: tip
This is especially handy if the prototype that should be rendered is determined via eel or passed via `@context`.
:::

## Array with string result

`Neos.Fusion:Loop`
{.api-name}
### Loop

Render each item in `items` using `itemRenderer`.

#### Properties

| Name          | Type                          | Default    | Description                                                                                                                                                                                                                                          |
|:--------------|:------------------------------|:-----------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| items         | `array/Iterable` **required** |            | The array or iterable to iterate over                                                                                                                                                                                                                |
| itemName      | `string`                      | `item`     | Context variable name for each item                                                                                                                                                                                                                  |
| itemKey       | `string`                      | `itemKey`  | Context variable name for each item key, when working with array                                                                                                                                                                                     |
| iterationName | `string`                      | `iterator` | A context variable with iteration information will be available  under the given name: `index` (zero-based), `cycle` (1-based), `isFirst`, `isLast`                                                                                                  |
| itemRenderer  | `string` **required**         |            | The renderer definition (simple value, expression or object) will be called once for every collection element, and its results will be concatenated (if itemRenderer cannot be rendered the path content is used as fallback for convenience in afx) |
| @glue         | `string`                      | `''`       | The glue used to join the items together.                                                                                                                                                                                                            |

#### Example using an object itemRenderer:

```php
myLoop = Neos.Fusion:Loop {
    items = ${[1, 2, 3]}
    itemName = 'element'
    itemRenderer = Neos.Fusion:Template {
    templatePath = 'resource://...'
    element = ${element}
    }
}
```
#### Example using an expression itemRenderer:

```php
myLoop = Neos.Fusion:Loop {
    items = ${[1, 2, 3]}
    itemName = 'element'
    itemRenderer = ${element * 2}
    @glue = ','
}
```
2,4,6
{.preview}

`Neos.Fusion:Collection`
{.api-name}
### ~~Collection~~

::: warning Deprecated
The Neos.Fusion:Collection object is DEPRECATED and will be removed in Neos 9.0. Use [Neos.Fusion:Loop](#loop) instead.
:::

`Neos.Fusion:Join`
{.api-name}
### Join

Render multiple nested definitions and concatenate the results.

#### Properties
| Name                    | Type             | Default | Description                                                                         |
|:------------------------|:-----------------|:--------|:------------------------------------------------------------------------------------|
| [key]                   | `string`         |         | A nested definition (simple value, expression or object) that evaluates to a string |
| [key].@ignoreProperties | `array`          |         | A list of properties to ignore from being "rendered" during evaluation              |
| [key].@position         | `string/integer` |         | Define the ordering of the nested definition                                        |
| @glue                   | `string`         | `''`    | The glue used to join the items together.                                           |

The order in which nested definitions are evaluated are specified using their `@position` meta property. For this argument, the following sort order applies:
*   `start [priority]` positions. The higher the priority, the earlier the object is added. If no priority is given, the element is sorted after all `start` elements with a priority.
*   `[numeric ordering]` positions, ordered ascending.
*   `end [priority]` positions. The higher the priority, the later the element is added. If no priority is given, the element is sorted before all `end` elements with a priority.

Furthermore, you can specify that an element should be inserted before or after a given other named element, using `before` and `after` syntax as follows:
* `before [namedElement] [optionalPriority]`: add this element before `namedElement`; the higher the priority the more in front of `namedElement` we will add it if multiple `before [namedElement]` statements exist. Statements without `[optionalPriority]` are added the farthest before the element.  
  If `[namedElement]` does not exist, the element is added after all `start` positions.
* `after [namedElement] [optionalPriority]`: add this element after `namedElement`; the higher the priority the more closely after `namedElement` we will add it if multiple `after [namedElement]` statements exist. Statements without `[optionalPriority]` are added farthest after the element.
  If `[namedElement]` does not exist, the element is added before all all `end` positions.


#### Example Ordering:
in this example, we would not need to use any @position property;  as the default (document order) would then be used.
However, the order (o1 ... o9) is *always* fixed, no matter in which order the individual statements are defined.

```php
myArray = Neos.Fusion:Join {
        property1 = '(1)'
        property1.@position = 'start 12'
        
        property2 = '(2.0)'
        property2.@position = 'start 5'
        
        property2 = '(2.1)'
        property2.@position = 'start'
    
        property3 = '(3)'
        property3.@position = '20'
        
        property4 = '(4)'
        property4.@position = '10'
    
        property5 = '(5)'
        property5.@position = 'before property1'
    
        property6 = '(6)'
        property6.@position = 'end 40'
        
        property7 = '(7)'
        property7.@position = 'end 20'
        
        property8 = '(8)'
        property8.@position = 'end 30'
    
        property9 = '(9)'
        property9.@position = 'after property7'
}
```

[(5)(1)(2.1)(4)(3)(7)(9)(8)(6)]{.preview}

If no `@position` property is defined, the array key is used. However, we suggest to use `@position` and meaningful keys in your application, and not numeric ones.

#### Example of numeric keys (discouraged):

```php
myArray = Neos.Fusion:Join {
    10 = Neos.NodeTypes:Text
    20 = Neos.NodeTypes:Text
}
```

`Neos.Fusion:Array`
{.api-name}
### ~~Array~~

::: warning Deprecated
The Neos.Fusion:Array object has been renamed to [Neos.Fusion:Join](#join) the old name is DEPRECATED and will be removed in Neos 9.0.
:::

## Array with array result

`Neos.Fusion:Map`
{.api-name}
### Map

Render each item in `items` using `itemRenderer` and return the result as an array (opposed to string for [Neos.Fusion:Collection](#collection)).

#### Properties

| Name          | Type                          | Default      | Description                                                                                                                                                                                                                           |
|:--------------|:------------------------------|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| items         | `array/Iterable` **required** |              | The array or iterable to iterate over                                                                                                                                                                                                 |
| itemName      | `string`                      | `'item'`     | Context variable name for each item                                                                                                                                                                                                   |
| itemKey       | `string`                      | `'itemKey'`  | Context variable name for each item key, when working with array                                                                                                                                                                      |
| iterationName | `string`                      | `'iterator'` | A context variable with iteration information will be available under the given name: `index` (zero-based), `cycle` (1-based), `isFirst`, `isLast`                                                                                    |
| itemRenderer  | `mixed` **required**          |              | The renderer definition (simple value, expression or object) will be called once for every collection element to render the item (if `itemRenderer` cannot be rendered the path `content` is used as fallback for convenience in afx) |
| keyRenderer   | `mixed` **optional**          |              | The renderer definition (simple value, expression or object) will be called once for every collection element to render the key in the result collection.                                                                             |


`Neos.Fusion:RawCollection`
{.api-name}
### ~~RawCollection~~

::: warning Deprecated
The Neos.Fusion:RawCollection object is DEPRECATED and will be removed in Neos 9.0. Use [Neos.Fusion:Map](#map) instead.
:::

`Neos.Fusion:DataStructure`
{.api-name}
### DataStructure

Evaluate nested definitions as an array (opposed to string for [Neos.Fusion:Array](#array)).

#### Properties
| Name            | Type             | Default | Description                                                                                                |
|:----------------|:-----------------|:--------|:-----------------------------------------------------------------------------------------------------------|
| [key]           | `mixed`          |         | A nested definition (simple value, expression or object), `[key]` will be used for the resulting array key |
| [key].@position | `string/integer` |         | Define the ordering of the nested definition                                                               |

::: tip
For simple cases an expression with an array literal `${[1, 2, 3]}` might be easier to read
:::

`Neos.Fusion:RawArray`
{.api-name}
### ~~RawArray~~

Evaluate nested definitions as an array (opposed to string for Neos.Fusion:Array)

::: warning Deprecated
The Neos.Fusion:RawArray object has been renamed to [Neos.Fusion:DataStructure](#datastructure) the old name is DEPRECATED and will be removed in Neos 9.0.
:::


## Conditional

`Neos.Fusion:Match`
{.api-name}
### Match

Matches the given subject to a value


`Neos.Fusion:Case`
{.api-name}
### Case

Conditionally evaluate nested definitions.

Evaluates all nested definitions until the first `condition` evaluates to `TRUE`.
The Case object will evaluate to a result using either `renderer`, `renderPath` or `type` on the matching definition.

## Helper

`Neos.Fusion:Reduce`
{.api-name}
### Reduce

`Neos.Fusion:Fragment`
{.api-name}
### Fragment

A fragment is a component that renders the given content without additional markup.
That way conditions can be defined for bigger chunks of afx instead of single tags.


`Neos.Fusion:Augmenter`
{.api-name}
### Augmenter

Modify given html content and add attributes. The augmenter can be used as processor or as a standalone prototype.

`Neos.Fusion:Memo`
{.api-name}
### Memo

Returns the result of previous calls with the same "discriminator".


`Neos.Fusion:Http.Message`
{.api-name}
### Http.Message

A prototype based on [Neos.Fusion:Array](#array) for rendering an HTTP message (response).
It should be used to render documents since it generates a full HTTP response and allows to override the HTTP status code and headers.


`Neos.Fusion:Http.ResponseHead`
{.api-name}
### Http.ResponseHead

A helper object to render the head of an HTTP response


`Neos.Fusion:UriBuilder`
{.api-name}
### UriBuilder

Built a URI to a controller action


`Neos.Fusion:ResourceUri`
{.api-name}
### ResourceUri

Build a URI to a static or persisted resource


## HTML centered

`Neos.Fusion:Tag`
{.api-name}
### Tag

Render an HTML tag with attributes and optional body


`Neos.Fusion:Attributes`
{.api-name}
### ~~Attributes~~

::: tip
The Neos.Fusion:Attributes object is DEPRECATED in favor of a solution inside [Neos.Fusion:Tag](#tag) which takes attributes as [Neos.Fusion:DataStructure](#datastructure) now. If you have to render attributes as string without a tag you can use Neos.Fusion:Join with `@glue` but you will have to concatenate array attributes yourself.
:::

## Development

`Neos.Fusion:Debug`
{.api-name}
### Debug

Keep in mind that you don't have access to the parent properties just anywhere.

`Neos.Fusion:DebugConsole`
{.api-name}
### DebugConsole
