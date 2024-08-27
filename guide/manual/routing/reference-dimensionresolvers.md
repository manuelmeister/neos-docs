url: /guide/manual/routing/reference-dimensionresolvers
# Reference: DimensionResolvers

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

> **💡 Disable Routing Caches**
> 
> When changing routing configuration, it is sometimes difficult to see the results of changes, because both URL generation and URL resolving is heavily cached. For development, don't forget to flush the routing cache:
> 
> ```bash
> ./flow cache:flushone Flow_Mvc_Routing_Resolve
> ./flow cache:flushone Flow_Mvc_Routing_Route
> ```

## AutoUriPathResolverFactory

Only works if no content dimensions or **a single content dimension** (e.g. language) is configured.

**Resolver Options**: none

**All dimension values from the dimension configuration are taken as URL slugs.** For the config below, the following slugs are configured:

*   `/en_US` <-- default; so if you open **/** (the homepage), the page in en\_US is displayed. All other pages in en\_US have the `/en_US` URL prefix.
*   `/en_UK`
*   `/de`

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentRepository: default
        contentDimensions:
          defaultDimensionSpacePoint:
            language: en_US
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\AutoUriPathResolverFactory

  # for completeness of the example, we assume the following dimension config here:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          language:
            label: 'Language'
            icon: icon-language
            values:
              'en_US':
                label: English (US)
                specializations:
                  'en_UK':
                    label: English (UK)
              'de':
                label: German

```

## UriPathResolverFactory

**Resolver Options**:

*   `segments`: list of objects with the following properties:
    *   `dimensionIdentifier`: Name of the dimension
    *   `dimensionValueMapping`:  Dimension Value to URI path segment string; empty segment values allowed (once).
*   `separator`: how multiple segments are connected to form ther first URL part (default `-`)

The dimension URL slug (the first part of the URL after the hostname) is built by concatenating the configured segments together: `[segment1]-[segment2]-[segment3]`

For each segment and dimension, the dimensionValueMapping is used. Only configured dimensions (which appear in dimensionValueMapping) are taken into account; so you can also partially map a dimension. This is useful for combining with custom resolvers.

For the config below, the following slugs are configured:

*   `/`  (empty slug) for `language:en_US,market:b2c` dimension
*   `/biz` for `language:en_US,market:b2b` dimension
*   `/uk` for `language:en_UK,market:b2c` dimension
*   `/biz-uk` for `language:en_UK,market:b2b` dimension
*   `/de` for `language:de,market:b2c` dimension
*   `/biz-de` for `language:de,market:b2b` dimension

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentRepository: default
        contentDimensions:
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\UriPathResolverFactory
            options:
              # separator between different dimensions, default "-"
              separator: '-'
              segments:
                - dimensionIdentifier: market
                  dimensionValueMapping:
                    b2c: ''
                    b2b: 'biz'
				- dimensionIdentifier: language
                  dimensionValueMapping:
                    en_US: ''
                    en_UK: 'uk'
                    de: 'de'
                    # NOTE: "ch" is not mapped; so you'd need to add another resolver which handles this case

  # for completeness of the example, we assume the following dimension config here:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          language:
            label: 'Language'
            icon: icon-language
            values:
              'en_US':
                label: English (US)
                specializations:
                  'en_UK':
                    label: English (UK)
              'de':
                label: German
              'ch':
                label: Swiss
          market:
            label: 'Market'
            value:
              'b2b':
                label: B2B
              'b2c':
                label: B2C
```