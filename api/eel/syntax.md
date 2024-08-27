url: /api/eel/syntax
# Eel Syntax

All Eel expressions seem like they are valid JavaScript syntax, but in fact it is PHP PEG and [differs in some minor functionality](https://github.com/neos/flow-development-collection/issues/2840). 

## Literals

Eel inside Fusion:
```neosfusion
${42}
${1.5}
${false}
${true}
${null}
${'single quoted string'}
${"double \"quoted\" string"}
${[1, 2, 3, 4]}
${{'data-id': 1}}
```

## Comments

Currently there is no comment syntax in Eel.

## Mathematical operators

Eel inside Fusion:
```neosfusion
${1 + 1}        // 2
${6 * 7}        // 42
${100 - 1}      // 99
${2 / 3}        // 0.66666666666667
${100 % 90}     // 10
${3 + "foo"}    // "3foo"
${3 * "foo"}    // 0
${2 / "foo"}    // INF
${2 - "foo"}    // 2
${"foo" - 2}    // -2
${"foo" / 2}    // 0
```

## Boolean operators

In Eel there is no typecasting like in JavaScript. The comparison is strict, so you will write `==` instead of `===`.

Eel inside Fusion:
```neosfusion
${false == ''}   // equal is false
${0 < null}      // smaller than is false
${42 != 3.14}    // not equal is true
${"test" >= 8}   // greater than or equal is false
${10 > 3}        // greater than is true
${'' <= ''}      // less than or equal is true
${false || true} // or is true
${true && false} // and is false
${!false}        // not is true
```

## Conditional (ternary) operator

Eel inside Fusion:
```neosfusion
${true ? "foo" : "bar"}  // "foo"
// condition ? then : else
```

## Variables & Property access

Variables can't be defined inside Eel. They are always defined outside eel expressions. But you can access them, if they are available in this context.

Some variables are set by the context, like the node variable.

Eel inside Fusion:
```neosfusion
${node}            // context variable set by the Fusion runtime
${customVariable}  // custom variable set in the context
```

Properties of the variables can be either be accessed directly, by offset or with a dynamic key:

Eel inside Fusion:
```neosfusion
${node.contextPath}  // direct access a property on 'node'
${items[1]}          // index access an item
${navigation[slug]}  // dynamic key access a property of 'navigation'
```

> **⚠️ What to do if the variable is unexpectedly undefined?**
> 
> The context can sometimes be a bit difficult to understand. Currently there is no way to fully debug the available variables in the context.
> 
> *   [**Understanding Fusion Context**](/guide/manual/rendering/fusion)

## Method calls

Eel inside Fusion:
```neosfusion
${String.substr('Hello world!', 6, 5)}  // "world"
${q(node).property('title')}            // "Title of node"
```

### Function Literals

Eel inside Fusion:
```neosfusion
${Array.map([1, 2, 3, 4], x => x * x)}  // [1, 4, 9, 16]
${Array.reduce(
	[1, 2, 3, 4],
	(acc, current) => acc + current,
	1
)}                                      // 11
```

For more Eel Helpers (`String`, `Array`, `Type`, …) like  `Array.map()` consult the reference. If you need something special, you can create one yourself.

*   [**Eel Helper Reference** on our ReadTheDocs](https://neos.readthedocs.io/en/stable/References/EelHelpersReference.html#)
*   [**Create Custom Eel Helpers**](/guide/manual/extending-neos-with-php-flow/custom-eel-helpers)

## Eel in Fusion

In Fusion code Eel expressions are inside `${` and `}`

## Eel in AFX

In AFX code Eel expressions are inside `{` and `}`