# Fusion Syntax

## Literals
```php
bookTitle = 'The Guide'
chapterTitle = "Universe"
answer = 42
isAwesome = true
```

## Comments
```php
// Line comment

# Another line comment

/*
 * Multiline comment
 */
```

## Expressions
```php
caluclated = ${'USD ' + 1337}
rounded = ${Math.floor(3.14)}
```
If you want to know more about what is possible inside the expressions, read the section about [eel expressions and eel helpers](/guide/rendering/eel).

## Objects

### Property Definition
```php
obj = {
    someProperty = 'value' 
}
// is the same as
obj.someProperty = 'value'
```

### Clear property
```php
obj {
    myProp >
}
// is the same as
obj.myProp >
```

## Prototypes
### Definition
```php
prototype(MyCustomComponent) {
    myProp = 'Some value'
}
```

### Extension
```php{1}
prototype(MyCustomComponent) < prototype(Component) {
    …
}
```

#### Hierarchical override
```php{2}
prototype(Book) < prototype(Component) {
    prototype(Input).attributes.type = 'email'
}
```
Override type attribute of all `Input` Prototypes inside `Book` to "email"

## Decorators / meta properties
For every property you can define decorators. For instance you can hide a property by defining a `@if` decorator and
setting it to false:

#### Example
```php
prototype(MyComponent) < prototype(Fusion:Component) {
    myProp = 'value'
    myProp.@if.someKeyToIdentifyThisDecorator = false
    renderer = ${'String: ' + props.myProp}
}
```
#### Preview

[String: ]{.preview}

### @if
### @apply
### @process
### @position
### @context
### @cache
### @class
### @execptionHandler
