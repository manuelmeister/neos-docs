url: /guide/manual/routing/configuring-dimension-resolving
# Configuring Dimension Resolving

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

For demonstrating the different resolving configuration, we'll use the following dimension configuration (taken and simplified from the Neos Demo Site):

Settings.yaml:
```yaml
Neos:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          language:
            label: 'Language'
            values:
              'en_US':
                label: English (US)
                specializations:
                  'en_UK':
                    label: English (UK)
              'de':
                label: German
```

The example above configures the dimension values `en_us`, `en_UK` and `de` for the dimension `language`.

## Default - AutoUriPathResolverFactory

The default configuration (shipped with Neos.Neos) uses [AutoUriPathResolverFactory](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/Resolver/AutoUriPathResolverFactory.php).

Settings.yaml (default configuration):
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentDimensions:
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\AutoUriPathResolverFactory

```

It automatically configures a dimension slug in the same way as the dimension value; so the above leads to the following URLs:

*   `/en_US` - for the homepage in `language:en_US`
*   `/en_US/features` - for a subpage in `language:en_US`
*   `/en_UK` - for the homepage in `language:en_UK`
*   `/en_UK/features` - for a subpage in `language:en_UK`
*   `/de` - for the homepage in `language:de`
*   `/de/funktionen` - for a subpage in `language:de`

You cannot customize the URL mapping further - if you want to do this, you need UriPathResolverFactory (see below).

## Special Case of Homepage

Now, the above configuration still has a problem - if the user visits the root page at `/`, he gets a `404 Not Found` because the system does not know what dimension to resolve.

To fix this, we can specify a `defaultDimensionSpacePoint` to specify what dimension should be rendered for the homepage:

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentDimensions:
          # added:
          defaultDimensionSpacePoint:
            language: en_US
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\AutoUriPathResolverFactory

```

This leads to the following URL structure:

*   `/` - for the homepage in `language:en_US`  
    **This is what changed compared to the last example.**
*   `/en_US/features` - for a subpage in `language:en_US`
*   `/en_UK` - for the homepage in `language:en_UK`
*   `/en_UK/features` - for a subpage in `language:en_UK`
*   `/de` - for the homepage in `language:de`
*   `/de/funktionen` - for a subpage in `language:de`

Setting the `defaultDimensionSpacePoint` effectively **moves** the homepage to `/` - it disables the URL `/en_US` for the homepage. This is to prevent the same content under different URLs (which would be bad for SEO reasons).

## custom URL mapping with UriPathResolverFactory

Usually, you want more control about the URL structure and the mapping of URLs to dimensions. For example, we might want to configure the URL prefixes `/en`, `/uk` and `/de` for the three dimensions. This is possible by specifying an explicit [UriPathResolverFactory](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/Resolver/UriPathResolverFactory.php) instead of the default AutoUriPathResolverFactory with some options:

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentDimensions:
          defaultDimensionSpacePoint:
            language: en_US
          resolver:
            # changed
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\UriPathResolverFactory
            options:
              segments:
                - dimensionIdentifier: language
                  dimensionValueMapping:
                    # dimension value -> URL path segment
                    en_US: en
                    en_UK: uk
                    de: de
              

```

This leads to the following URL structure:

*   `/` - for the homepage in `language:en_US`
*   `/en/features` - for a subpage in `language:en_US`
*   `/uk` - for the homepage in `language:en_UK`
*   `/uk/features`  - for a subpage in `language:en_UK`
*   `/de` - for the homepage in `language:de`
*   `/de/funktionen` - for a subpage in `language:de`

Again, setting the `defaultDimensionSpacePoint` effectively **moves** the homepage to `/` - it disables the URL `/en` for the homepage. This is to prevent the same content under different URLs (which would be bad for SEO reasons).

## Multiple Dimensions with UriPathResolverFactory

If you have multiple dimensions, this is also supported by [UriPathResolverFactory](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/Resolver/UriPathResolverFactory.php). These are separated by a separator (by default `-`) . You can then specify which orderings the dimensions should have:

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentDimensions:
          defaultDimensionSpacePoint:
            language: en_US
            # new:
            market: b2b
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\UriPathResolverFactory
            options:
              segments:
                - dimensionIdentifier: language
                  dimensionValueMapping:
                    # dimension value -> URL path segment
                    en_US: en
                    en_UK: uk
                    de: de              
                # new:
                - dimensionIdentifier: market
                  dimensionValueMapping:
                    # dimension value -> URL path segment
                    b2b: business
                    b2c: customer
              

```

This leads to the following URL structure:

*   US:
    *   `/` - for the homepage in `language:en_US,market:b2b`  
        (because of `defaultDimensionSpacePoint` config) 
    *   `/en-business/features` - for a subpage in `language:en_US,market:b2b`
    *   `/en-customer` - for the homepage in `language:en_US,market:b2c`
    *   `/en-customer/features` - for a subpage in `language:en_US,market:b2c`
*   UK:
    *   `/uk-business` - for the homepage in `language:en_UK,market:b2b`
    *   `/uk-business/features`  - for a subpage in `language:en_UK,market:b2b`
    *   `/uk-customer` - for the homepage in `language:en_UK,market:b2c`
    *   `/uk-customer/features`  - for a subpage in `language:en_UK,market:b2c`
*   DE:
    *   `/de-business` - for the homepage in `language:de,market:b2b`
    *   `/de-business/funktionen` - for a subpage in `language:de,market:b2b`
    *   `/de-customer` - for the homepage in `language:de,market:b2c`
    *   `/de-customer/funktionen` - for a subpage in `language:de,market:b2c`

Again, setting the `defaultDimensionSpacePoint` effectively **moves** the homepage to `/` - it disables the URL `/en` for the homepage. This is to prevent the same content under different URLs (which would be bad for SEO reasons).

## Empty Segments

Empty URL segments are also supported - as long as you ensure that two prefixes do not collide. Example:

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentDimensions:
          # default dimension space point not needed, because we have empty segments configured.
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\UriPathResolverFactory
            options:
              segments:
                - dimensionIdentifier: language
                  dimensionValueMapping:
                    # dimension value -> URL path segment
                    en_US: ''
                    en_UK: uk
                    de: de              
                # new:
                - dimensionIdentifier: market
                  dimensionValueMapping:
                    b2b: ''
                    b2c: customer
              

```

This leads to the following URL structure:

*   US:
    *   `/` - for the homepage in `language:en_US,market:b2b`  
        (because of empty URL segments)
    *   `/features` - for a subpage in `language:en_US,market:b2b`  
        (because of empty URL segments)
    *   `/customer` - for the homepage in `language:en_US,market:b2c`
    *   `/customer/features` - for a subpage in `language:en_US,market:b2c`
*   UK:
    *   `/uk` - for the homepage in `language:en_UK,market:b2b`
    *   `/uk/features`  - for a subpage in `language:en_UK,market:b2b`
    *   `/uk-customer` - for the homepage in `language:en_UK,market:b2c`
    *   `/uk-customer/features`  - for a subpage in `language:en_UK,market:b2c`
*   DE:
    *   `/de` - for the homepage in `language:de,market:b2b`
    *   `/de/funktionen` - for a subpage in `language:de,market:b2b`
    *   `/de-customer` - for the homepage in `language:de,market:b2c`
    *   `/de-customer/funktionen` - for a subpage in `language:de,market:b2c`