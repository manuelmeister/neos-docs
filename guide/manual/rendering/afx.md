url: /guide/manual/rendering/afx
# AFX Template Language

React's JSX for Neos and PHP

> **ℹ️ Draft**
> 
> This page is not yet fully completed - we are still working on the content here. Expect some rough edges 🙃

## The Foundations of AFX

While Fusion can declare Tags and Contents and thus create all possible Markup the syntax to do this would be longish and also hard to read.

Instead you should use the AFX syntax to describe the markup you want to generate in way that strongly resembles the expected HTML but at the same time allows to user other Fusion prototypes as well. AFX will afterwards be converted into Neos.Fusion:Tags including all properties and attributes you've passed to it. While writing this HTML-related markup, you have access to Neos variables, components, Eel helpers and of course Fusion.

Now, avoiding to go too much into depth about the technical aspects of how exactly AFX manages this miraculous transformation from HTML-like markdown to Fusion components, what you really need to know is the syntax.

NOTE: All examples in this section are taken from the [blog article covering AFX](https://www.neos.io/blog/the-afx-fusion-dsl.html) and its development, history and implementation by Martin Ficzel.

## HTML to Fusion in a Nutshell

In this section, you will learn how to write HTML-like markup that will then be processed into side-effect free, reusable Fusion components.

#### HTML-Tags (Tags without Namespace)

The HTML tags you write are transformed into Neos.Fusion:Tags objects, with all attributes you define being passed on accordingly. This means that the following block of AFX:

AFX:
```afx
<h1 class="headline">{props.headline}</h1>
```

will be transpiled into this Fusion object:

```neosfusion
Neos.Fusion:Tag {
    tagName = 'h1'
    attributes.class = 'headline'
    content = ${props.headline}
}
```

#### Fusion-Object-Tags (namespaced Tags)

Correspondingly, a namespaced tag will be transpiled into prototype names, while the attributes you pass on will be interpreted as top-level properties. This means that the following block of AFX:

AFX:
```afx
<Your.SitePackage:Prototype type="headline">
 {props.headline}
</Your.SitePackage:Prototype>
```

will be transpiled into this Fusion object:

```neosfusion
Your.SitePackage:Prototype {
    type = 'headline'
    content = ${props.headline}
}
```

#### Dynamic Attributes / Eel

When you want to set a class via the props or mix a static class with a prop use the following syntax:

AFX:
```afx
<h1 class={props.class + ' static_class'}>...</h1>
<h2 class={props.class}>...</h2>
```

Note, that the following syntax won't suffice, as the curly brackets in a string won't be interpreted as Eel expression: \`class="{props.class} static\_class"\`

#### Tag-Children

Depending on how many child nodes there are, AFX handles the rendering differently. Lets's look at the differences in transformation between having one child node versus multiple.

If there's exactly one child node, the following AFX:

AFX:
```afx
<h1>{props.headline}</h1>
```

will be transpiled into this Fusion object:

```neosfusion
Neos.Fusion:Tag {
    tagName = 'h1'
    content = ${props.headline}
}
```

However, if you nest more than one child node within your AFX-node, the following AFX:

```neosfusion
afx`
  <h1>{props.title}: {props.subtitle}</h1>
`
```

will be transpiled into this Fusion object:

```neosfusion
Neos.Fusion:Tag {
    tagName = 'h1'
    content = Neos.Fusion:Join {
        item_1 = {props.title}
        item_2 = ': '
        item_3 = ${props.subtitle}
    }
}
```

#### 4\. Meta-Attributes

As a rule, meta attributes are characterized by an @-sign. In your AFX markup, you can use them normally, as they will be added as meta-properties into the transpiled Fusion objects. This means you can use @if, @children or @key.

The following example shows how to render a headline only, if a headline is available. (Without the @if, the h1-tag would still be rendered, albeit empty.)

AFX:
```afx
<h1 @if.has={props.title}>{props.title}</h1>
```

This AFX markup will be transpiled into the following Fusion object:

```neosfusion
Neos.Fusion:Tag {
    tagName = 'h1'
    @if.has={props.title}
    content = {props.title}
}
```

Another use case is the @children attribute. Using this, you can for instance map AFX children to the "itemRenderer" resulting in an iteration within a Neos.Fusion:Collection object.

You can see that done in this AFX markup:

AFX:
```afx
<Neos.Fusion:Collection collection={['one','two','three']} @children="itemRender">
  <p>{item}</p>
</Neos.Fusion:Collection>
```

This will be transpiled into the following Fusion object:

```neosfusion
Neos.Fusion:Collection {
    collection = ${['one','two','three']}
    itemRender = Neos.Fusion:Tag {
      tagName = 'p'
      content = ${item}  
    }
}
```

The @key attribute is somewhat of an exception. It can be used to define a name for an AFX child node if multiple children are rendered into a Neos.Fusion:Array object. However, this use case is discouraged as it breaks with the concept of encapsulating the presentational component.

#### 5\. Whitespace and Newlines

In the transformation process, AFX makes some simplifications, in order to streamline the generated Fusion output and to allow the developer to structure the notation in regards to the component hierarchy.

One of those ways of streamlining is the handling of white spaces. If you look at the following example, you will notice, that all white spaces that are connected to a new line are considered irrelevant and are consequently ignored in the output.

AFX:
```afx
<h1>
  {'eelExpression 1'}
  {'eelExpression 2'} 
</h1>
```

This will be transpiled into the following Fusion object:

```neosfusion
Neos.Fusion:Tag {
    tagName = 'h1'
    contents = Neos.Fusion:Join {
        item_1 = ${'eelExpression 1'}
        item_2 = ${'eelExpression 2'}   
    }
}
```

In contrast to this, all whitespaces within a single line are respected in the output. If you take the same Fusion as above but replace the line break with a space, the output will differ. Explicitly, the following AFX markup:

AFX:
```afx
<h1>
  {'eelExpression 1'}  {'eelExpression 2'}      
</h1>
```

will be transpiled into this Fusion object:

```neosfusion
Neos.Fusion:Tag {
    tagName = 'h1'
    contents = Neos.Fusion:Join {
        item_1 = ${'eelExpression 1'}        
        item_2 = ' '
        item_3 = ${'eelExpression 2'}   
    }
}
```

#### AFX Comments

AFX accepts html comments but they are not transpiled to any fusion. However if you are converting html to afx it is allowed to have comments inside and you can use comments for disabeling parts of your afx during testing.

AFX:
```afx
foo<!-- comment -->bar
```

will be transpiled into this Fusion:

```neosfusion
Neos.Fusion:Join {
    item_1 = 'foo'
    item_2 = 'bar'
}
```

> **ℹ️ The comment support was added in AFX version 1.4**
> 
> In previous versions html-comments were not specified as part of the afx language yet and are reported as syntax errors.

## AFX inside Fusion

Inside fusion you need to set a dslSpecifier (in this case it is `afx` ) and then you can write AFX code between the backticks:

```neosfusion
prototype(My.Site:Preview) < prototype(Neos.Fusion:Component) {
	renderer = afx`
		<strong>bold statement</strong><br />
		<em>italic</em>
	`
}
```

fusion generated from afx:
```neosfusion
prototype(My.Site:Preview) < prototype(Neos.Fusion:Component) {
	renderer = Neos.Fusion:Join {
    	item_1 = Neos.Fusion:Tag {
        	tagName = 'strong'
        	content = 'bold statement'
    	}
    	item_2 = Neos.Fusion:Tag {
        	tagName = 'br'
        	selfClosingTag = true
    	}
    	item_3 = Neos.Fusion:Tag {
        	tagName = 'em'
        	content = 'italic'
   		}
	}
}
```

**bold statement**  
_italic_

## Hungry for More?

This summary doesn't come close to exhaustively describing the power you have at your fingertips when you use AFX. Instead it's aimed at giving you a first taste of the syntax and the underlying concept. For further information (partly by the original developers of AFX), take a look at the following sources:

*   [**Better Rendering with Fusion-AFX**  
    Blog von Martin Ficzel, SiteGeist](https://www.neos.io/blog/the-afx-fusion-dsl.html)
*   [**Living Styleguide**  
    Blog von Martin Ficzel, SiteGeist](https://sitegeist.de/blog/das-neos-projekt/living-styleguide-fuer-neos.html)
*   [**Atomic.Fusion and a living style guide for Neos**](https://www.youtube.com/watch?v=lIY0epkqwxg)
*   [**Video: Tasty Atomic Fusion recipes for your website**  
    Neos Conference](https://www.youtube.com/watch?v=_8fv1D0zVLo)
*   **AFX Syntax**