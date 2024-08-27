url: /guide/manual/content-repository/node-migrations
# Node Migrations

Mass-Update Nodes programmatically

> **⚠️ Neos <=8.x content**
> 
> This is content for **Neos <= 8.x releases.**
> 
> This content is obsolete with Neos 9.0 and the event sourced Content Repository.

Node Migrations are a way to programmatically mass-update the Nodes you have in Neos. This is needed when you want to rename NodeTypes, adjust property names or update Content Dimensions.

## The core idea

Node migrations are defined in YAML files, residing in the _Migrations/ContentRepository/_ folder of a package.

A migration must have an _up_ part (for migrating "upwards"), and it can have a _down_ part for reverting the migration (if possible).

Each Node migration consists of two steps:

1.  a set of **filters** which determine when a node should be transformed. Only if a node matches all filters, it is transformed.
2.  a list of **transformations** to update the filtered nodes.

## Running a migration

You can list all migrations in all packages using the _./flow node:migrationstatus_ command:

```bash
$ ./flow node:migrationstatus

Available migrations

+----------------+---------------------+------------------------+--------------------------------------------------------------+
| Version        | Date                | Package                | Comments                                                     |
+----------------+---------------------+------------------------+--------------------------------------------------------------+
| 20120725073211 | 25-07-2012 07:32:11 | Neos.ContentRepository | This is the migration to adjust your content to the Phoenix  |
|                |                     |                        | content types definition committed in the July 2012 sprint   |
|                |                     |                        | release                                                      |
| 20120921140942 | 21-09-2012 14:09:42 | Neos.Neos              | This is the migration to adjust sites to the new             |
|                |                     |                        | TYPO3.Phoenix.ContentTypes namespace                         |
| 20121030105142 | 30-10-2012 10:51:42 | Neos.NodeTypes         | This is the migration to adjust sites from Phoenix to Neos   |
| 20121030110246 | 30-10-2012 11:02:46 | Neos.Demo              | Rename from Phoenix to Neos                                  |
| 20130326131600 | 26-03-2013 13:16:00 | Neos.NodeTypes         | This is the migration to adjust from "Content Types" to      |
|                |                     |                        | "NodeTypes"                                                 |
| 20130515214324 | 15-05-2013 21:43:24 | Neos.NodeTypes         | This is the migration to add new property hasCaption to      |
|                |                     |                        | already existing "Image" and "Text With Image" nodes         |
| 20130516212400 | 16-05-2013 21:24:00 | Neos.NodeTypes         | This is the migration to adjust the NodeTypes to the        |
|                |                     |                        | renaming as per #45317                                       |
| 20130911165510 | 11-09-2013 16:55:10 | Neos.NodeTypes         | This is the migration to move the "page" NodeType from       |
|                |                     |                        | TYPO3.Neos to TYPO3.Neos.NodeTypes as per #52020             |
| 20140326143834 | 26-03-2014 14:38:34 | Neos.ContentRepository | Migrate from no node dimensions to default dimension values. |
| 20140516221523 | 16-05-2014 22:15:23 | Neos.ContentRepository | Migrate from "locales" dimension to "languages" dimension.   |
| 20140708120530 | 08-07-2014 12:05:30 | Neos.ContentRepository | Delete removed nodes that were published to "live" workspace |
| 20140723115900 | 23-07-2014 11:59:00 | Neos.Neos              | Migrate from "languages" dimension to "language" dimension.  |
| 20140930125621 | 30-09-2014 12:56:21 | Neos.Neos              | Migrate shortcut nodes: targetMode value adjustment and      |
|                |                     |                        | rename targetNode property                                   |
| 20141103100401 | 03-11-2014 10:04:01 | Neos.Neos              | Migrate serialized Media objects to relation format.         |
| 20141210114800 | 10-12-2014 11:48:00 | Neos.NodeTypes         | This is the migration to rename the "insert record" NodeType |
|                |                     |                        | from TYPO3.Neos.NodeTypes:Records to                         |
|                |                     |                        | TYPO3.Neos.NodeTypes:ContentReferences as per NEOS-847       |
| 20150716212459 | 16-07-2015 21:24:59 | Neos.ContentRepository | Migrate from some node dimensions to default dimension       |
|                |                     |                        | values, adding missing dimension default values.             |
| 20150907194505 | 07-09-2015 19:45:05 | Neos.Neos              | Migrate PluginViews references from node paths to            |
|                |                     |                        | identifiers.                                                 |
| 20160427182952 | 27-04-2016 18:29:52 | Neos.Demo              | Rename from Neos.NeosDemoTypo3Org to Neos.Demo               |
+----------------+---------------------+------------------------+--------------------------------------------------------------+
```

To actually run a migration, use the _./flow node:migrate \[version\]_ command:

```bash
$ ./flow node:migrate 20160427182952

Comments
  Rename from Neos.NeosDemoTypo3Org to Neos.Demo

Successfully applied migration.
```

## Adding a Content Dimension

One of the most common cases to run a node migration is when you have created your website without dimensions first, and lateron want to introduce e.g. a _language_ dimension. In this case, the existing content (which has no dimension information attached) needs to be moved to the default of the dimension; otherwise it just disappears because it is not reachable anymore.

As an example, let's say we have started our website without dimensions, and then we add the following dimension configuration:

Configuration/Settings.yaml:
```yaml
Neos:
  ContentRepository:
    contentDimensions:
      language:
        label: 'Language'
		# the following line determines the default language
        default: en_US
        defaultPreset: en_US
        presets:
          en_US:
            label: 'English (US)'
            values:
              - en_US
            uriSegment: en
          de:
            label: German
            values:
              - de
            uriSegment: de

```

With the above configuration, our complete website has no visible content anymore, as the content in the system is not yet moved to the _language_ dimension.

This can be done with a node migration which is included in the Neos.ContentRepository package:

```bash
./flow node:migrate 20150716212459
```

> **ℹ️ Needs to be run whenever you add new dimensions**
> 
> This migration has to be applied whenever a new dimension is configured to set the default value on all existing nodes.

Now, every content in the system is moved to _language en\_US_, because this is the dimension's _default_ in the configuration above.

This means your content is visible again in _en\_US_, and you can start translating from _en\_US_ to _de_.

## Writing a custom  migration

To create a node migration, place a new YAML file inside the _Migrations/ContentRepository_ folder of your package.

The name of the Migration YAML file must be _Version\[YYYYMMDDHHmmss\].yaml_, so the full timestamp (Year + Month + Day + Hour + Minute + Second) of the time when the migration is migrated is part of the filename, as in-order execution of migrations is sometimes important.

Here is an example of a migration that operates on nodes in the “live” workspace that are marked as removed and applies the RemoveNode transformation on them, i.e. deleting the nodes permanently.

Migrations/ContentRepository/Version20140708120530.yaml:
```yaml
up:
  comments: 'Delete removed nodes that were published to "live" workspace'
  warnings: 'There is no way of reverting this migration since the nodes will be deleted in the database.'
  migration:
    -
      filters:
        -
          type: 'IsRemoved'
          settings: []
        -
          type: 'Workspace'
          settings:
            workspaceName: 'live'
      transformations:
        -
          type: 'RemoveNode'
          settings: []

down:
  comments: 'No down migration available'
```

> **ℹ️ Note:**
> 
> Node migrations in Migrations/TYPO3CR directories are also supported for historic reasons

> **💡 Pro tip:**
> 
> Since Neos 8.3 it is possible to create node migrations also via the console. You can find more information in the documentation.
> 
> [Documentation](https://neos.readthedocs.io/en/8.3/References/CommandReference.html?highlight=migrationcreate#package-neos-contentrepository-migration)

#### Available Filters

 The Content Repository comes with a number of filters:

*   DimensionValues
*   IsRemoved
*   NodeName
*   NodeType
*   PropertyNotEmpty
*   Workspace

They all implement the Neos\\ContentRepository\\Migration\\Filters\\FilterInterface. Custom filters can be developed against that interface as well, just use the fully qualified class name for those when specifying which filter to use.

[Browse the Node Migration Filter Reference](https://neos.readthedocs.io/en/stable/References/NodeMigrations.html#filters-reference)

#### Available Transformations

The Content Repository comes with a number of common transformations:

*   AddDimensions
*   AddNewProperty
*   ChangeNodeType
*   ChangePropertyValue
*   RemoveNode
*   RemoveProperty
*   RenameDimension
*   RenameNode
*   RenameProperty
*   SetDimensions
*   StripTagsOnProperty

They all implement the _Neos\\ContentRepository\\Migration\\Transformations\\TransformationInterface_. Custom transformations can be developed against that interface as well, just use the fully qualified class name for those when specifying which transformation to use.

[Browse the Node Migration Transformation Reference](https://neos.readthedocs.io/en/stable/References/NodeMigrations.html#transformations-reference)

*   [Node Migration Reference (applying transformations on nodes)](https://neos.readthedocs.io/en/stable/References/NodeMigrations.html)
*   [How to Migrate Nodes in Neos (Blog by Sandstorm)](https://sandstorm.de/de/blog/post/how-to-migrate-nodes-in-neos.html)
*   [Migration of new dimensions](https://neos.readthedocs.io/en/stable/HowTos/TranslatingContent.html#migration-of-existing-content)

[Next Chapter: Rendering](/guide/manual/rendering)