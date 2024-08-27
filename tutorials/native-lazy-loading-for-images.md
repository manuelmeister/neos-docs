url: /tutorials/native-lazy-loading-for-images
# Native Lazy Loading for Images

The new standard for image loading in browsers

Since Chrome 76, native image lazy loading can be used - other browsers followed since. 

```html
<img src="..." alt="..." loading="lazy|eager|auto">
```

Implementing this in Neos is rather easy, as you can work with Fusion prototypes.

The following code will make all your images lazyload (which is probably not what you want, but helps as an example):

```neosfusion
prototype(Neos.Neos:ImageTag) {
    attributes.loading = 'lazy'
}
```

It might be a better option to eagerly load certain images (those above the fold), but lazy-load most of them. This can be accomplished by several means.

## Decide for the editor

You as an integrator could decide which areas of images to eager-load. If you have a hero-stage with a fixed image, this would be a good shot for eager-loading

```neosfusion
prototype(MyAwesome.Package:HeroStage) < prototype(Neos.Fusion:Component) {
	image = Neos.Neos:ImageTag {
        attributes.loading = 'eager'
    }
}
```

## Let the editor decide

You could simply provide different Image-NodeTypes for eager and lazy loading:

```neosfusion
prototype(MyAwesome.Package:LazyImage) < prototype(Neos.Neos:ImageTag) {
    attributes.loading = 'lazy'
}
																	  
prototype(MyAwesome.Package:EagerImage) < prototype(Neos.Neos:ImageTag) {
    attributes.loading = 'eager'
}
```

You could also provide the editor with a property for handling the loading and adding a nice default:

```yaml
'MyAwesome.Package:ImageLoadingMixin':
  abstract: true
  properties:
    loading:
      type: string
      defaultValue: ''
      ui:
        label: 'Loading'
        reloadIfChanged: true
        inspector:
          group: 'image'
          position: 500
          editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor'
          editorOptions:
            values:
              '':
                label: 'default'
              lazy:
                label: 'lazy'
              eager:
                label: 'eager'

'Neos.NodeTypes.BaseMixins:ContentImageMixin':
  superTypes:
    'Neos.NodeTypes.BaseMixins:ImageMixin': true
    'Neos.NodeTypes.BaseMixins:LinkMixin': true
    'Neos.NodeTypes.BaseMixins:ImageCaptionMixin': true
    'Neos.NodeTypes.BaseMixins:ImageAlignmentMixin': true
    'MyAwesome.Package:ImageLoadingMixin': true

```

```neosfusion
prototype(Neos.Neos:ImageTag) {
    attributes.loading = Neos.Fusion:Case {
        loadingProperty {
            condition = ${q(node).property('loading')}
            renderer = ${q(node).property('loading')}
            @position = 'start'
        }

        default {
            condition = true
            @position = 'end'
            renderer = ${'auto'}
        }
    }
}

```