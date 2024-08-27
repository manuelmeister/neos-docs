url: /guide/manual/site-configuration
# 9.x: Site Configuration

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

## Site Configuration in Settings.yaml

Starting with Neos 9, site-specific configuration has been introduced in Settings.yaml, underneath the key `Neos.Neos.sites`.

You can either specify configuration for a certain site node name, or you can specify a fallback configuration using the special key `*`.

The custom configuration **is not merged with the fallback**: If you create custom configuration for a site, you need to specify it completely. This is to reduce complexity, and to prevent problems due to base-config which cannot be reset properly.

Let's look at an example:

Settings.yaml:
```yaml
Neos:
  Neos:
    sites:
      '*':
        contentRepository: default
        contentDimensions:
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\AutoUriPathResolverFactory

      'docsneosio':
        contentRepository: docs
        contentDimensions:
          resolver:
            factoryClassName: Neos\Neos\FrontendRouting\DimensionResolution\Resolver\UriPathResolverFactory
            options:
              # separator between different dimensions, default "-"
              separator: '-'
              segments:
				- dimensionIdentifier: language
                  dimensionValueMapping:
                    en_US: ''
                    de: 'de'
           
```

For the site with the site node name `docsneosio`, explicit configuration is used, specifying the dimension routing configuration, and a separate content repository (which must be created in `Neos.ContentRepositoryRegistry.contentRepositories.docs` - as explained on  [Content Repository Configuration](/guide/manual/content-repository/configuration)).

For all other sites, the default ContentRepository is used.

## Site Specific Configuration Reference

For each site (or the fallback `*`), you can configure:

*   `contentRepository` (required): Identifier of the contentRepository to use
*   `contentDimensions`
    *   `resolver`
        *   `factoryClassName`: class name pointing to a DimensionResolverFactory. You'll either use existing ones, or create your own class and reference it here. See [Reference: DimensionResolvers](/guide/manual/routing/reference-dimensionresolvers) for DimensionResolvers shipped with Neos.
        *   `options`: Options for the resolver. See [Reference: DimensionResolvers](/guide/manual/routing/reference-dimensionresolvers) for resolver-specific options.
    *   `defaultDimensionSpacePoint` (Dimension Space Point) - this is relevant for the following scenario:
        *   If the user visits the homepage (/), and no dimension resolver resolves this, which dimension should be shown.

## adjusting Site Resolving

For context, the [Routing Architecture](/guide/manual/routing/architecture) gives helpful overview.

Site resolving is normally done via the [SiteDetectionMiddleware](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/SiteDetection/SiteDetectionMiddleware.php), which implements the default logic, checking out site and domain records in the database. 

Feel free to copy and adjust the [SiteDetectionMiddleware](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/SiteDetection/SiteDetectionMiddleware.php) to your own package - this is a planned extension point. In your middleware, you need to create a [SiteDetectionResult](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/SiteDetection/SiteDetectionResult.php), and then store it in the HTTP request.

You then need to override the `detectSite` middleware via `Settings.yaml` (make sure to add a composer dependency to `neos/neos` in your site package, to ensure your configuration wins):

Settings.yaml:
```yaml
Neos:
  Flow:
    http:
      middlewares:
        'detectSite':
          position: 'before routing'
          middleware: 'Your\Custom\SiteDetectionMiddleware'
```

This way, you can freely change how you resolve which site (and content repository) is active for the given request.

If you change this, you'll likely also want to override [CrossSiteLinkerInterface](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/CrossSiteLinking/CrossSiteLinkerInterface.php) for the reverse direction when generating links.

## Accessing the ContentRepositoryId from within PHP

If you received a ContentRepository instance from somewhere from the framework, you can assume this is the correct instance.

If you write PHP controllers, you can retrieve the ContentRepositoryId from the SiteDetectionResult via the following snippet:

YourController.php:
```php
<?php

class YourController extends ActionController {
    public function indexAction(string $nodeAddress) {
        $contentRepositoryId = SiteDetectionResult::fromRequest($this->request->getHttpRequest())->contentRepositoryId;

        // for reference, this is how you fetch the ContentRepository then.
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);

        // as soon as you have the ContentRepository, you can resolve the NodeAddress
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        $contextNodeAddress = $nodeAddressFactory->createFromUriString($contextNode);

        // ... and then you can load the node via the content graph.
        $subgraph = $contentRepository->getContentGraph()->getSubgraph($contextNodeAddress->contentStreamId, $contextNodeAddress->dimensionSpacePoint, VisibilityConstraints::withoutRestrictions());
        $contextNode = $subgraph->findNodeById($contextNodeAddress->nodeAggregateId);

   }
}
```