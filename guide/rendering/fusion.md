# Fusion

Fusion is a declarative templating language. This means that you define your templates and partials and include and iterate over your data.
Additionally, you can extend and override existing templates granular.

The language itself is built around objects that define the rendering structure.
Every object prototype works differently; but basically you define keys-value properties of objects. 

The body of fusion objects is like an associative array. Certain objects have special properties that are predefined, e.g. 
the `renderer` property inside the `Fusion:Component` object. The current context is given to the The value of this property is returned to render the component.

#### Example
```php
prototype(MyComponent) < prototype(Fusion:Component) {
    myProp = 'value'
    renderer = ${'String: ' + props.myProp}
}
```

#### Preview

[String: value]{.preview}

::: tip CAUTION
While the syntax may look similar to JavaScript, it is something you probably haven't seen before. It doesn't have a procedural character, but it has an object character like JSON.
Except that you can define rules for every property like an `@if` and merge multiple JSON objects, process that huge object tree and render it.
:::

### What is it?
::: info Content
More about how fusion works and a bit less about how fusion is integrated with the content repository, as this is already present in the essentials and in the following sub chapter
:::

::: danger The Fusion.Component "body" is a associated array.
This means, while it looks like other languages like JavaScript and you have control structures like _Collection_, "Case", "Map", "Loop" … you are not in a procedural context.

For every key and value:  
`key = 'value'`  
you create an entry in the associated array
:::

::: info Content
Explain that you can't really program in fusion, but declare something, and if really needed, process "array items"
:::

### What is it not?
::: info Content
Common beginner mistakes with the mental model
:::

## Integration with Neos
::: info Content
How is it connected with the cms?
:::
