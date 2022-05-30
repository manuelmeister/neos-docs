# Rendering

To display your content in the browser you need to render it as a HTML page.
Fusion is the central data transformation engine for Neos.
It enables you to create a variety of formats (like HTML, AMP HTML, RSS, JSON...) from the same contents.
To make this happen Fusion fetches data, transforms it and sends the output to the client. That's Fusion's core business.

::: info Content
What can you achieve? Try to create a metaphor for what is possible with fusion, to improve the mental model of fusion.

This has to be easy and show it is used in the cms context.
:::

## Fusion Structure Prototypes

::: info Content
How does the data flow work? Everything is an object, It looks like JavaScript but don't be fooled,
because it has no functions and is more like a JSON. Everything can be overridden.  
props variables are only available inside the renderer key. This makes it complex to create "if else / switch"
statements
:::

::: tip Idee
JS Object Vergleich machen wie sieht das in JS notation aus? was heist dieses prototypisieren? wie wird es gemerged. du
hast für jedes "object property" 4 Möglichkeiten: `@if`, `@process`, `@position`, `@apply`
:::

```php
prototype(My.Package:MyComponent) < prototype(Neos.Fusion:Component) {
    big = false
    test = 'hello'
    renderer = ${'<p>' + props.test + '</p>'}
}
```

```js
function MyComponent() {
    return ({
        big: false,
        test: 'hello',
        renderer: function () {
            props = Object.entries(this).reduce((obj, [key, value]) => {
                if (key !== 'renderer') {
                    if (value instanceof Function) {
                        obj[key] = value.call(this);
                    } else {
                        obj[key] = value;
                    }
                }
                return obj;
            }, {})
            return '<p>' + props.test + '</p>'
        }
    }).renderer()
}
```
