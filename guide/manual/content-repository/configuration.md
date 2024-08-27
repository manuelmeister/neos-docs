url: /guide/manual/content-repository/configuration
# 9.x: Content Repository Configuration (including Dimensions)

Support for Multiple Content Repositories

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

## The ContentRepositoryRegistry

In Neos 9, the system supports **multiple content repositories in a single Neos instance**. This is useful e.g. in the following scenarios:

*   to separate content with data which is imported from external systems (e.g. products)
*   to use different dimension configuration for different sites
*   to have a different publishing lifecycle for certain elements like products
*   to use the content repository as the basis for other PHP APIs, f.e. for asset storage.

There is one limitation right now: The Neos-editable content of a single site must reside in the same content repository right now. This is not a limitation of the Content Repository, but of the User Interface (which cannot track multiple CRs yet).

As a consequence, many classes which were singletons before the rewrite (like the NodeTypeManager) are not anymore, and need to be accessed through the ContentRepositoryRegistry.

```php
<?php

use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepository\Core\Feature\WorkspaceCreation\Command\CreateRootWorkspace;

// you can inject the ContentRepositoryRegistry through Dependency Injection:
// Neos\ContentRepositoryRegistry\ContentRepositoryRegistry

$contentRepositoryId = ContentRepositoryId::fromString('default');
$contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);

// $contentRepository is of type Neos\ContentRepository\Core\ContentRepository
// and is the central API:

// access the node type manager
$contentRepository->getNodeTypeManager()->...

// access the content graph (the main read model)
$contentRepository->getContentGraph()->...

// modify the content repository
$contentRepository->handle(new CreateRootWorkspace(...));
```

## ContentRepository Objects

The [ContentRepository](https://github.com/neos/neos-development-collection/blob/9.0/Neos.ContentRepository.Core/Classes/ContentRepository.php) object is the main public API you'll interact with, which you'll retrieve by calling `ContentRepositoryRegistry::get($contentRepositoryId)`. It is responsible for:

*   **setting up** the necessary database tables and contents via `ContentRepository::setUp()`
*   sending **commands to the system to mutate state** via `ContentRepository::handle(Command)`
    *   catching up projections using `ContentRepository::catchUpProjection()` (you don't need to call this yourself normally)
*   **accessing projection state** (to read the current model) via `ContentRepository::projectionState(ProjectionClass)`   
    ... and their specialized accessors (because they are used so much):
    *   `ContentRepository::getContentGraph()` 
    *   `ContentRepository::getWorkspaceFinder()`
    *   `ContentRepository::getContentStreamFinder()` 
*   accessing configuration:
    *   **accessing the NodeTypeManager** via `ContentRepository::getNodeTypeManager()`
    *   **accessing Dimension Configuration via** `ContentRepository::getVariationGraph()` and `ContentRepository::getContentDimensionSource()`

## Using the Default Content Repository

The Content Repository named `default` is automatically registered by the `ContentRepositoryRegistry`, and is used as the default repository. This is purely a convention though and not hardcoded at any place.

## Creating a new Content Repository

You can register a new ContentRepository by defining it in `Settings.yaml`. Then, you need to run `./flow cr:setup  --content-repository-identifier <name>` to create the necessary database tables.

Settings.yaml:
```yaml

Neos:
  ContentRepositoryRegistry:
    contentRepositories:
      'custom':
        preset: default
        contentDimensions:
        # Dimensions Config follows here - this configures no content dimensions.

```

Each content repository is identified by the key underneath `contentRepositories` (so `custom` in the example above).

For each content repository, you can specify the following options:

*   `preset` (required): Which content repository preset _to use. This configures the detailed implementation classes of the content repository (read below for details)._
*   `contentDimensions`_: The Content Dimension Configuration for this content repository (see below for the exact schema)._

You'll still need to initialize the new content repository before you can use it, by creating a root content stream and a root workspace. This is done only through PHP code right now as follows:

(TODO: Insert example here)

## Configuring Content Dimensions

Configuring Content Dimensions is done through `Settings.yaml` underneath the `Neos.ContentRepositoryRegistry.contentRepositories.<name>.contentDimensions` key.

Example:

Settings.yaml:
```yaml
Neos:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          'language':
            label: 'Neos.Demo:Main:contentDimensions.language'
            icon: icon-language
            values:
              'en_US':
                label: English (US)
                specializations:
                  'en_UK':
                    label: English (UK)
                constraints: # TODO how does this work (@Bernhard)
              'de':
                label: German
              'ch':
                label: Swiss
          'market':
            label: 'Market'
            value:
              'b2b':
                label: B2B
              'b2c':
                label: B2C
                specializations:
                  'b2c_special':
                    label: B2C Special
```

The above configuration defines two content dimensions **language** and **market**. The order of the dimensions is relevant for **defining the shine-through** (see below). For each dimension, the following properties can be set:

*   `label`: **human readable name** as shown in the UI. Supports translation, so you can reference a label like `Neos.Demo:Main:contentDimensions.language`
*   `icon` (optional): visual **indicator icon** for the dimension selector in the Neos UI
*   `values`: the different top-level dimension values. For each dimension value, you can configure:
    *   `label`: **human readable name** as shown in the UI. Supports translation. 
    *   `specializations`: dimension values below this value **fall back** to the parent dimension.
    *   `constraints`: TODO how does this work? :)

The example above configures the following dimension trees:

> **💡 Dimension URL configuration changed with Neos 9.x**
> 
> For Neos <= 8.x, the dimension `uriSegment` and the `defaultValue` was configured inside this configuration as well. This has changed with Neos 9.0 and became a lot more flexible. This configuration is now in the [Site Configuration](/guide/manual/site-configuration).

## Dimension Shine-Through Ordering

TODO explain intuition behind

## Dimension Constraints

TODO @Bernhard

## Configuring Node Types

Currently, the NodeTypes are stored (as always) in `NodeTypes.yaml` files.

If you want to create contentRepository-specific NodeTypes, you right now need to create a custom preset (see below) and need to override `nodeTypeManager.factoryObjectName` in the preset.

## Configuring Presets

This is an advanced topic, needed if you want to change how the internals of the content repository work; or if you want to extend it through new projections.

We'll cover the use cases in a deep dive about extensibility later, but we'll here add the **reference of the configurable properties** underneath `Neos.ContentRepositoryRegistry.presets.<presetName>`:

*   `eventStore`: how the **events are stored and retrieved** in the system.
    *   `factoryObjectName`: class name of the factory responsible for building the Event Store. Must conform to `Neos\ContentRepositoryRegistry\Factory\EventStore\EventStoreFactoryInterface`.
*   `nodeTypeManager`: which **node types** exist for the content repository
    *   `factoryObjectName`: class name of the factory responsible for building the NodeTypeManager. Must conform to `Neos\ContentRepositoryRegistry\Factory\NodeTypeManager\NodeTypeManagerFactoryInterface`.
    *   `options`
        *   `fallbackNodeTypeName` (only for `DefaultNodeTypeManagerFactory`): Node name to return when a NodeType is unknown (to not break editing)
*   `contentDimensionSource`: what **content dimensions** exist for the content repository
    *   `factoryObjectName`: class name of the factory responsible for building the ContentDimensionSource. Must conform to `Neos\ContentRepositoryRegistry\Factory\ContentDimensionSource\ContentDimensionSourceFactoryInterface`.
*   `projectionCatchUpTrigger`: after an event is processed in the system, how does the **projection catch up** run?
    *   `factoryObjectName`: class name of the factory responsible for building the ProjectionCatchUpTrigger. Must conform to `Neos\ContentRepositoryRegistry\Factory\ProjectionCatchUpTrigger\ProjectionCatchUpTriggerFactoryInterface`.
*   `userIdProvider`: to determine `which user ID` has executed a command
    *   `factoryObjectName`: class name of the factory responsible for building the UserIdProvider. Must conform to `Neos\ContentRepositoryRegistry\Factory\UserIdProvider\UserIdProviderFactoryInterface`.
*   `propertyConverters`: Serialization/Deserialization of properties as stored in the CR
    *   `[name of converter]`
        *   `className`: a class implementing `Symfony\Component\Serializer\Normalizer\NormalizerInterface` and `Symfony\Component\Serializer\Normalizer\DenormalizerInterface`
*   `projections`: Which projections exist in the content repository
    *   `[name of projection]`
        *   `factoryObjectName`: class name of the factory responsible for building the Projection. Must conform to `Neos\ContentRepository\Core\Projection\ProjectionFactoryInterface`.
        *   `options`: extra options for the projection factory (currently empty)
        *   `catchUpHooks`: Some projections (like the GraphProjection) allow to hook custom logic into the catch-up process, f.e. to clear caches. This is registered here.
            *   `[name of catch up hook]`
                *   `factoryObjectName`: class name of the factory responsible for building the CatchUpHook. Must conform to `Neos\ContentRepository\Core\Projection\CatchUpHookFactoryInterface`.

> **💡 Overriding preset configuration in individual Content Repository Instances**
> 
> Presets are a convenient way to re-use Content Repository configuration; and allow to easily create new content repository instances.  
> In case you want to customize the configuration for a single Content Repository, this is possible: **The preset configuration and the individual CR configuration are merged together** - so you can easily override or extend anything from the preset in the individual Content Repository configuration.