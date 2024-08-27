url: /api/afx/syntax
# AFX Syntax

> **ℹ️ Draft**
> 
> This page is not yet fully completed - we are still working on the content here. Expect some rough edges 🙃

AFX is inspired by [JSX](https://reactjs.org/docs/jsx-in-depth.html). This means you can mostly write HTML and JSX. It also has [decorators like Fusion](/api/fusion/syntax#decorators-meta-properties).

*   [**AFX Fusion Language Rules**  
    Written by Martin Ficzel](https://github.com/neos/fusion-afx)
*   [**How AFX gets converted to Fusion**  
    Guide](/guide/manual/rendering/afx)
*   [**AFX to Fusion Converter**  
    Tool by Marc Henry Schultz](https://afx-converter.marchenry.de/) 

## Simple Example

**AFX**

AFX:
```afx
<p class="paragraph">
  <strong>This is strong</strong><br>
  This is just flow content
</p>
```

**Generated Fusion**

```neosfusion
Neos.Fusion:Tag {
    tagName = 'p'
    attributes.class = 'hello'
    content = Neos.Fusion:Join {
        item_1 = Neos.Fusion:Tag {
            tagName = 'strong'
            content = 'This is strong'
        }
        item_2 = Neos.Fusion:Tag {
            tagName = 'br'
        }
        item_3 = 'This is just flow content'
    }
}
```

**HTML Preview**

**This is strong**  
This is just flow content

## Complex Example

**AFX**

AFX:
```afx
<article class="hello">
    <My.Site:IdGenerator @path="attributes.id" />
    <h2 @key="heading" @if={!props.heading}>AFX Preview</h2>
    <Neos.Fusion:Loop items="props.items" itemName="item">
        <p>{item}</p>
    </Neos.Fusion:Loop>
    <Neos.Fusion:Tag 
      tagName={Type.isString(props.link) ? 'a' : 'button'}
	  {...props.linkProps}
      attributes.href={props.link}>
        Read more
    </Neos.Fusion:Tag>
</article>
```

**Generated Fusion**

```neosfusion
Neos.Fusion:Tag {
    tagName = 'article'
    attributes.class = 'hello'
    attributes.id = My.Site:IdGenerator {
    }
    content = Neos.Fusion:Join {
        heading = Neos.Fusion:Tag {
            tagName = 'h2'
            @if.if_1 = ${!props.heading}
            content = 'AFX Preview'
        }
        item_2 = Neos.Fusion:Loop {
            items = 'props.items'
            itemName = 'item'
            content = Neos.Fusion:Tag {
                tagName = 'p'
                content = ${item}
            }
        }
        item_3 = Neos.Fusion:Tag {
            tagName = ${Type.isString(props.link) ? 'a' : 'button'}
            @apply.spread_1 = ${props.linkProps}
            @apply.spread_2 = Neos.Fusion:DataStructure {
                attributes.href = ${props.link}
            }
            content = 'Read more'
        }
    }
}
```

**Props**

rendering context:
```neosfusion
heading = null
linkProps = Neos.Fusion:DataStructure {
	attributes.tagName = 'span'
	attributes.title = 'Hover me'
	attributes.href = '#'
}
items = Neos.Fusion:DataStructure {
	first = 'First paragraph'
	second = 'Second paragraph'
}
link = '#section1'
```

**HTML Preview**

### AFX Preview

First paragraph

Second paragraph

Read more