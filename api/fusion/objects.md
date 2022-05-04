# Fusion Objects

## Basic

### Value  
`Neos.Fusion:Value`

#### Properties
| name | type | default | description |
|-|-|-|-|
| value | `mixed, required` | null | The value to evaluate |

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
### CanRender

`Neos.Fusion:CanRender`

### Component

`Neos.Fusion:Component`

### Renderer

`Neos.Fusion:Renderer`

### Template

`Neos.Fusion:Template`

## Array with string result

### Loop

`Neos.Fusion:Loop`

### ~~Collection~~

`Neos.Fusion:Collection`

### Join

`Neos.Fusion:Join`

### ~~Array~~

`Neos.Fusion:Array`

## Array with array result

### Map

`Neos.Fusion:Map`

### ~~RawCollection~~

`Neos.Fusion:RawCollection`

### DataStructure

`Neos.Fusion:DataStructure`

### ~~RawArray~~

`Neos.Fusion:RawArray`

## Conditional

### Match

`Neos.Fusion:Match`

### Case

`Neos.Fusion:Case`

## Helper

### Reduce

`Neos.Fusion:Reduce`

### Fragment

`Neos.Fusion:Fragment`

### Augmenter

`Neos.Fusion:Augmenter`

### Template

`Neos.Fusion:Template`

### Memo

`Neos.Fusion:Memo`

### Http.Message

`Neos.Fusion:Http.Message`

### Http.ResponseHead

`Neos.Fusion:Http.ResponseHead`

### UriBuilder

`Neos.Fusion:UriBuilder`

### ResourceUri

`Neos.Fusion:ResourceUri`

## HTML centered

### Tag

`Neos.Fusion:Tag`

### ~~Attributes~~

`Neos.Fusion:Attributes`

::: tip
The Neos.Fusion:Attributes object is DEPRECATED in favor of a solution inside [Neos.Fusion:Tag](#tag) which takes attributes as [Neos.Fusion:DataStructure](#datastructure) now. If you have to render attributes as string without a tag you can use Neos.Fusion:Join with ``@glue` but you will have to concatenate array attributes yourself.
:::

## Development

### Debug

`Neos.Fusion:Debug`

### DebugConsole

`Neos.Fusion:DebugConsole`
