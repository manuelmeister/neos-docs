url: /guide/manual/content-repository/migrating-dimension-config
# 9.x: Migrating dimension config

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

Dimensions are configured in Settings.yaml, but are also reflected in the content repository - thus in the database.

**As a consequence, if you change dimension configuration in Settings.yaml you need to run some migrations to adjust the content repository.** On this page, we explain the different cases and how to run them:

*   **adding a dimension**
    *   e.g. site without dimensions => site with a `language` dimension
    *   e.g. site with one dimension `language` => site with dimensions `language, market`
*   **adding a dimension value**
    *   e.g. site with `language:en` dimension value => site with `language:en,de` dimension values
*   **adding a dimension value as fallback**
    *   e.g. site with `language:de` dimension value => site with `language:de,ch` dimension values; where `de` is the fallback of `ch`
*   **renaming dimensions / dimension values**
*   **removing dimensions / dimension values**

## General process

Adjusting dimension configuration of a running site works in two steps:

1.  **Make sure your users do not have unpublished changes**
2.  **adjust dimension configuration** in Settings.yaml at key `Neos.ContentRepositoryRegistry.contentRepositories.default.contentDimensions` (or analogous for other content repositories) - described on page [Content Repository Configuration](/guide/manual/content-repository/configuration).
3.  Also adjust the **Site Dimension Routing configuration** in Settings.yaml at key `Neos.Neos.sites.*.contentDimensions.resolver` - described in the [Routing](/guide/manual/routing) docs.
4.  **Adjust the root node dimensions**  
    by running `./flow content:refreshRootNodeDimensions`.  
    The root node must exist in all configured dimensions - and this command updates its dimension configuration.
5.  **run database migrations** (through CLI commands)
6.  **flush the cache and test** to ensure the updated routing configuration is active.

## Adding a dimension

**Adjust dimension configuration**

In `Settings.yaml` you need to add the `market` dimension configuration.

Settings.yaml:
```yaml
Neos:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          'language':
            label: 'Language'
            values:
              'en':
                label: English
              'de':
                label: German
          # Newly added:
          'market':
            label: 'Market'
            value:
              'b2b':
                label: B2B
              'b2c':
                label: B2C

```

Also adjust the **Site Dimension Routing configuration** in Settings.yaml at key `Neos.Neos.sites.*.contentDimensions.resolver` - described in the [Routing](/guide/manual/routing) docs, to configure how the dimension should be mapped to URLs.

**Adjust the root node dimensions**

The root node is, by definition, existing in **every** DimensionSpacePoint. Thus, if you change dimension configuration, the root node(s) need to be updated as well. This happens with the following command:

```bash
./flow content:refreshRootNodeDimensions
```

**Running dimension migrations**

When switching from no dimensions to 1 dimension; or from 1 dimension to two dimensions, you need to **move all existing DimensionSpacePoints**, because they need the additional "axis" defined.

Moving needs to be done for all existing DimensionSpacePoints, because a 1-dimensional DimensionSpacePoint is not reachable if you have two dimensions configured.

```bash
# Example: No Dimensions => 1 Dimension
# Source: no dimensions
# Target: a "language" dimension, where the already existing content should appear as "en"
./flow content:moveDimensionSpacePoint  '{}' '{"language": "en"}'

# Example: 1 Dimension => 2 Dimensions (additional market dimension)
# For every existing dimension value in "language",  movw it to the "b2c" market.
./flow content:moveDimensionSpacePoint  '{"language": "en"}' '{"language": "en", "market": "b2c"}'
./flow content:moveDimensionSpacePoint  '{"language": "de"}' '{"language": "de", "market": "b2c"}'
```

Finally, **flush the cache**, to ensure no cached routes or cached rendered pages still exist. Then, test your changes:

```bash
./flow flow:cache:flush
```

## Adding a dimension value

**Adjust dimension configuration**

In `Settings.yaml` you need to add the new value for the existing content dimension.

Settings.yaml:
```yaml
Neos:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          'language':
            label: 'Language'
            values:
              'en':
                label: English
              'de':
                label: German
              # Newly added:
              'fr':
                label: French

```

Also adjust the **Site Dimension Routing configuration** in Settings.yaml at key `Neos.Neos.sites.*.contentDimensions.resolver` - described in the [Routing](/guide/manual/routing) docs, to configure how the dimension should be mapped to URLs.

**Adjust the root node dimensions**

The root node is, by definition, existing in **every** DimensionSpacePoint. Thus, if you change dimension configuration, the root node(s) need to be updated as well. This happens with the following command:

```bash
./flow content:refreshRootNodeDimensions
```

**Running dimension migrations**

This is not needed for this scenario.

Finally, **flush the cache**, to ensure no cached routes or cached rendered pages still exist. Then, test your changes:

```bash
./flow flow:cache:flush
```

> **ℹ️ Optional: Copy content from existing dimension**
> 
> You can translate - as usual - in the Neos backend, by using the dimension switcher. Sometimes, however, it is useful to pre-populate content from an existing dimension. This can be done via the `./flow content:createVariantsRecursively` command as shown below:
> 
> ```bash
> # copy all content from "en" to "fr"
> ./flow content:createVariantsRecursively  '{"language": "en"}' '{"language": "fr"}'
> ```
> 
> In case you need this, you could also add the dimension value **as a fallback**. The difference is:
> 
> *   **When not using fallbacks** and copying content, the content is disconnected from the original dimension value. If a node in one dimension changes, it does not in the other.
> *   **When using fallbacks** (see below), then a change on the base dimension (e.g. `de`) will be automatically visible in the specialized dimension (e.g. `ch`), as long as no specific content has been created for the specialization (e.g. `ch`).

## Adding a dimension value as fallback

**Adjust dimension configuration**

In `Settings.yaml` you need to add the new value for the existing content dimension, underneath `specializations` of the parent dimension value:

Settings.yaml:
```yaml
Neos:
  ContentRepositoryRegistry:
    contentRepositories:
      default:
        contentDimensions:
          'language':
            label: 'Language'
            values:
              'en':
                label: English
              'de':
                label: German
                # Newly added:
                specializations:
                  'ch':
                    label: Swiss

```

Also adjust the **Site Dimension Routing configuration** in Settings.yaml at key `Neos.Neos.sites.*.contentDimensions.resolver` - described in the [Routing](/guide/manual/routing) docs, to configure how the dimension should be mapped to URLs.

**Adjust the root node dimensions**

The root node is, by definition, existing in **every** DimensionSpacePoint. Thus, if you change dimension configuration, the root node(s) need to be updated as well. This happens with the following command:

```bash
./flow content:refreshRootNodeDimensions
```

**Running dimension migrations**

Dimension shine through in the event-sourced content repository is implemented on the write side. This means that dimension fallbacks are resolved when writing changes. While reading, dimension fallbacks do not matter.

This is why you need to migrate the content to add a dimension shine-through; possible through `./flow content:addDimensionShineThrough`.

```bash
# add a shine-through from the german to the swiss language (i.e. all german content will be visible in Switzerland,
# until you create specific swiss content)
./flow content:addDimensionShineThrough  '{"language": "de"}' '{"language": "ch"}' 

```

Finally, **flush the cache**, to ensure no cached routes or cached rendered pages still exist. Then, test your changes:

```bash
./flow flow:cache:flush
```