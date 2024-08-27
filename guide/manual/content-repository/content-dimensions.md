url: /guide/manual/content-repository/content-dimensions
# Content Dimensions

a generic concept of multiple 'node variants'

> **⚠️ Neos <=8.x content**
> 
> This is content for **Neos <= 8.x releases.**
> 
> This content is obsolete with Neos 9.0 and the event sourced Content Repository.

Content Dimensions are a generalization of the multi-language features of Neos, that's why you should read the previous page about [Multiple Languages](/guide/manual/content-repository/multiple-languages) first.

[Multiple Languages](/guide/manual/content-repository/multiple-languages)

## Generalizing Multilanguage

When planning multi-language support, we soon discovered that the same principles which apply to localization could also apply to other contexts like _separation by customer segment_ or _separation by country_. Thus, instead of only implementing multi-language, we implemented a generalized concept which we call **Content Dimensions**. We call things like _language_, _customer segment_, or _country_ a **dimension.**

The Content Repository allows an arbitrary number of dimensions. This enables a _single-tree_ approach for localization, personalization or other variations of the content in a site, where the different Node Variants are still connected with each other.

To understand the task of multiple dimensions, let's look at the combination of _language_ and _target audience_, which is a problem of 2 combined dimensions:

![Content Dimensions](/_Resources/Persistent/9f99d9d070f2a16e718bff624b7787213adf9b0e/Content%20Dimensions-1920x2162.png)

Let's imagine the following:

*   Most of the text is written in _German_, targeting individuals.
*   We start creating some more content in English and French, but if content is not available in French, we want to fall back to English content. This is explained in the [Multiple Languages](/guide/manual/content-repository/multiple-languages) chapter.
*   Additionally, there exists a second dimension _audience_ (private or sommelier), displayed on the x-axis of the diagram.

If content is rendered and thus fetched from the content repository, it will always happen in a _context_. This context contains a list of values for each dimension that specifies which dimension values are visible and in which _fallback order_ these should apply. So the same node variants can yield different results depending on the context that is used to fetch the nodes.

## Configuring Multiple Dimensions

Defining multiple dimensions works pretty much like defining a single dimension - you just add multiple blocks inside _Neos.ContentRepository.contentDimensions:_

Configuration/Settings.yaml:
```yaml
Neos:
  ContentRepository:
    contentDimensions:
      language:
        label: 'Language'
        default: en_US    
        defaultPreset: en 
        presets:
          en:       
            label: 'English (US)'
            values: 
              - en_US
            uriSegment: ''
          de:            
            label: German
            values:
              - de
            uriSegment: de
      targetGroup:
        label: 'Audience'
        default: private
        defaultPreset: private
        presets:
          private:       
            label: 'Private'
            values: 
              - private
            uriSegment: ''
          sommelier:            
            label: Sommeliers
            values:
              - sommelier
            uriSegment: sommelier

```

> **ℹ️ Don't forget to run the Node Migration**
> 
> As explained in [Multiple Languages](/guide/manual/content-repository/multiple-languages), do not forget to run the following node migration after adding or removing dimensions:  
> _./flow node:migrate 20150716212459_

## Presets and Constraints

The allowed combinations of content dimension presets can be controlled via the preset constraints feature, as there are often combinations which do not make sense and are not desirable.

A typical use case is to define separate dimensions for _language_ and _country:_

Consider a website which has dedicated content for the US, Germany and France. The content for each country is available in English and their respective local language. The following configuration would make sure that the combinations “German – US”, “German - France”, “French - US” and “French - Germany” are not allowed:

```yaml
Neos:
  ContentRepository:
    contentDimensions:
      'language':
        default: 'en'
        defaultPreset: 'en'
        label: 'Language'
        icon: 'icon-language'
        presets:
          'en':
            label: 'English'
            values: ['en']
            uriSegment: 'en'
          'de':
            label: 'German'
            values: ['de']
            uriSegment: 'de'
            constraints:
              country:
                'us': false
                'fr': false
          'fr':
            label: 'French'
            values: ['fr']
            uriSegment: 'fr'
            constraints:
              country:
                'us': false
                'de': false
      'country':
        default: 'us'
        defaultPreset: 'us'
        label: 'Country'
        icon: 'icon-globe'
        presets:
          'us':
            label: 'United States'
            values: ['us']
            uriSegment: 'us'
          'de':
            label: 'Germany'
            values: ['de']
            uriSegment: 'de'
          'fr':
            label: 'France'
            values: ['fr']
            uriSegment: 'fr'
```

Instead of configuring every constraint preset explicitly, it is also possible to allow or disallow all presets of a given dimension by using the wildcard identifier. The following configuration has the same effect like in the previous example:

```yaml
Neos:
  ContentRepository:
    contentDimensions:
      'language':
        default: 'en'
        defaultPreset: 'en'
        label: 'Language'
        icon: 'icon-language'
        presets:
          'en':
            label: 'English'
            values: ['en']
            uriSegment: 'en'
          'de':
            label: 'German'
            values: ['de']
            uriSegment: 'de'
            constraints:
              country:
                'de': true
                '*': false
          'fr':
            label: 'French'
            values: ['fr']
            uriSegment: 'fr'
            constraints:
              country:
                'fr': true
                '*': false
      'country':
        default: 'us'
        defaultPreset: 'us'
        label: 'Country'
        icon: 'icon-globe'
        presets:
          'us':
            label: 'United States'
            values: ['us']
            uriSegment: 'us'
          'de':
            label: 'Germany'
            values: ['de']
            uriSegment: 'de'
          'fr':
            label: 'France'
            values: ['fr']
            uriSegment: 'fr'
```

While the examples only defined constraints in the language dimension configuration, it is perfectly possible to additionally or exclusively define constraints in country or other dimensions.

## Behind the Scenes: Routing

Neos provides a route-part handler that will include a prefix with the value of the _uriSegment_ setting of a dimension preset for all configured dimensions. This means URIs will not contain any prefix by default as long as no content dimension is configured. Multiple dimensions are joined with a \_ character, so the _uriSegment_ value must not include an underscore.

The default preset can have an empty _uriSegment_ value. The following example will lead to URLs that do not contain _en_ if the _en\_US_ preset is active, but will show the _uriSegment_ for other languages that are defined as well:

Configuration/Settings.yaml:
```yaml
Neos:
  ContentRepository:
    contentDimensions:

      'language':
        default: 'en'
        defaultPreset: 'en_US'
        label: 'Language'
        icon: 'icon-language'
        presets:
          'en':
            label: 'English (US)'
            values: ['en_US']
            uriSegment: ''
```

The only limitation is that all segments must be unique across all dimensions. If you need non-unique segments, you can switch support for non-empty dimensions off:

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    routing:
      supportEmptySegmentForDimensions: false
```

## Additional Resources

*   [How to remove a language dimension](https://discuss.neos.io/t/remove-language/3485)
*   [Multilingual websites article (In German, by Daniel Lienert)](https://punkt.de/de/blog/2016/neos-workshop/neos-workshop-teil-5-mehrsprachige-seiten-mit-neos.html)
*   [Internationalization & Localization in the Flow Framework](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Internationalization.html)
*   [Enforce a main language as basis for translation (Community package)](https://github.com/flownative/neos-hostbaseddefaultpreset)
*   [Node Migrations](/guide/manual/content-repository/node-migrations)