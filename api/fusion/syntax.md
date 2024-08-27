url: /api/fusion/syntax
# Fusion Syntax

## Literals

```neosfusion
bookTitle = 'The Guide'
chapterTitle = "Universe"
answer = 42
isAwesome = true
```

## Comments

```neosfusion
// Line comment

# Another line comment

/*
* Multiline comment
*/
```

## Eel Expressions

```neosfusion
calculated = ${'USD ' + 1337}
rounded = ${Math.floor(3.14)}
```

If you want to know more about what is possible inside the expressions, read the section about [eel expressions and eel helpers](/api/eel/syntax).

## Objects

### Property Definition 

```neosfusion
obj {
    someProperty = 'value' 
}
// is the same as
obj.someProperty = 'value'
```

### Clear property 

```neosfusion
obj {
    myProp >
}
// is the same as
obj.myProp >
```

## Prototypes

### Definition 

```neosfusion
prototype(MyCustomComponent) {
    myProp = 'Some value'
}
```

### Extension

```neosfusion
prototype(MyCustomComponent) < prototype(Component) {
    …
}
```

### Hierarchical override 

```neosfusion
prototype(Book) < prototype(Component) {
    prototype(Input).attributes.type = 'email'
}
```

Override type attribute of all `Input` Prototypes inside `Book` to "email"

## Decorators / meta properties 

For every property you can define decorators / meta properties. For instance you can hide a property by defining a `@if` decorator and setting it to false:

### @if

##### Example

```neosfusion
prototype(MyComponent) < prototype(Fusion:Component) {
    myProp = 'value'
    myProp.@if.someKeyToIdentifyThisDecorator = false
    renderer = ${'String: ' + props.myProp}
}
```

##### Preview

String:

### @apply

*   [Learn more about **@apply** in the fusion guide](/guide/manual/rendering/fusion#id-)