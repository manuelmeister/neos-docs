url: /api/upgrade-instructions/5/upgrade-instructions-5-3-7-0
# Upgrade Instructions 5.3 → 7.0

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/7.0/Appendixes/ChangeLogs/700.html), [Flow](https://flowframework.readthedocs.io/en/7.0/TheDefinitiveGuide/PartV/ChangeLogs/700.html))

## Update Instructions

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~7.0.0"
composer require --no-update "neos/neos-ui:~7.0.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~7.0.0"
```

If you still require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not needed anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~7.0.0"
```

## Breaking changes

With this major release, some breaking changes were introduced. It's most likely that your project is affected if it depends on one of the following changes:

### Neos

##### Remove the legacy aloha configuration handling

We have removed the compatibility layer for the legacy aloha configuration handling. The aloha configuration is deprecated for more than two years now, and if you did not migrate to the current editorOptions, this change would be breaking. We provide a Core migration as an easy helper.

Just execute the migration for your NodeTypes and Mixins like in the following example.

```bash
./flow flow:core:migrate Neos.NodeTypes.BaseMixins --version 20180907103800

```

##### Remove default prototype generator

The default plugin and content prototype generators have been disabled and deprecated with version 5. Now the implementations were removed from the source. Of course, the feature to define a custom prototype generator in the node type definition via options.fusion.prototypeGenerator still exists. But if you rely on the now removed generator, you have to add this generator to your own package.

### Flow

Version 7.0 of Flow has made a tremendous step with features like Node Presets, a faster and more extensible routing, and of course, the great move to Support PSR-15 middlewares. All information you need to know for the upgrade can be found in the [release notes' upgrade instructions](https://flowframework.readthedocs.io/en/7.0/TheDefinitiveGuide/PartV/ReleaseNotes/700.html#upgrade-instructions) section.

## Finish the update

```bash
# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force
./flow flow:session:destroyAll

# Run code migrations, as needed for any packages that need to be
# migrated. Rule of thumb:
#
# - any 3rd party packages that still install fine at least claim
#   to work, and should be updated by their maintainer(s).
# - your own packages should always be treated with a migration,
#   at least it marks that as done.
#
./flow flow:core:migrate <Vendor.PackageName>

# Run database migrations
./flow doctrine:migrate

# Publish resources
./flow resource:publish
```

## Troubleshooting

If you run into trouble with Neos content or resources, the following may help: 

```bash
# If you get error messages when running Flow CLI commands:
rm -rf Data/Temporary

# If you experience issues with pages not working, try 
./flow node:repair

# If you experience issues with resources, thumbnail or assets, try
./flow resource:clean
./flow media:clearthumbnails
```