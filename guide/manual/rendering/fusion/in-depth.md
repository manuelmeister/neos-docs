url: /guide/manual/rendering/fusion/in-depth
# Fusion in Depth

Fusion has many things you might want to know

## Namespaces of Fusion objects

The benefits of namespacing apply just as well to Fusion objects as they apply to other languages. Namespacing helps to organize the code and avoid name clashes.

In Fusion the namespace of a prototype is given when the prototype is declared. The following declares a `YouTube` prototype in the `Acme.Demo` namespace:

```neosfusion
prototype(Acme.Demo:YouTube) {
        width = '100px'
        height = '500px'
}
```

The namespace is, by convention, the package key of the package in which the Fusion resides.

Fully qualified identifiers can be used everywhere an identifier is used:

```neosfusion
prototype(Neos.Neos:ContentCollection) < prototype(Neos.Neos:Collection)
```

**Since Neos 7.3**

> **⚠️ Namespace Alias depreciated**
> 
> The namespace alias and the default namespace will be depreciated with Neos 7.3 and removed with Neos 8.

**Before Neos 7.3**

In Fusion a `default` namespace of `Neos.Fusion` is set. So whenever `Value` is used in Fusion, it is a shortcut for `Neos.Fusion:Value`.

Custom namespace aliases can be defined using the following syntax:

```neosfusion
namespace: Foo = Acme.Demo

# the following two lines are equivalent now
video = Acme.Demo:YouTube
video = Foo:YouTube
```

> **⚠️ Warning**
> 
> These declarations are scoped to the file they are in and have to be declared in every fusion file where they shall be used.

## Domain-specific languages in Fusion

Fusion allows the implementation of domain-specific sublanguages. Those DSLs can take a piece of code, that is optimized to express a specific class of problems, and return the equivalent fusion-code that is cached and executed by the Fusion-runtime afterwards.

Fusion-DSLs use the syntax of tagged template literals from ES6 and can be used in all value assignments:

```neosfusion
value = dslIdentifier`... the code that is passed to the dsl ...`
```

If such a syntax-block is detected fusion will:

*   Lookup the key `dslIdentifier` in the Setting `Neos.Fusion.dsl` to find the matching dsl-implementation.
*   Instantiate the dsl-implementation class that was found registered.
*   Check that the dsl-implementation satisfies the interface `\Neos\Fusion\Core\DslInterface`
*   Pass the code between the backticks to the dsl-implementation.
*   Finally parse the returned Fusion-code

Fusion DSLs cannot extend the fusion-language and -runtime itself, they are meant to enable a more efficient syntax for specific problems.