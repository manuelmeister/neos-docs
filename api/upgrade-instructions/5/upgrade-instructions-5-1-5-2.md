url: /api/upgrade-instructions/5/upgrade-instructions-5-1-5-2
# Upgrade Instructions 5.1 → 5.2

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/5.2/Appendixes/ChangeLogs/520.html), [Flow](https://flowframework.readthedocs.io/en/6.2/TheDefinitiveGuide/PartV/ChangeLogs/620.html))

## Update Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~5.2.0"
composer require --no-update "neos/neos-ui:~5.2.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~6.2.0"
composer require --no-update "neos/nodetypes:~5.2.0"
composer require --no-update "neos/site-kickstarter:~5.2.0"
```

If you require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not required anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:6.2.x-dev"
```

## Breaking changes

With this minor release, no breaking changes where introduced. Its most likely that your project can safely upgrade. Still there are few changes to adapt to optionally to already help with future changes:

#### Icons and description for asset sources

To make your **AssetSources** compatible with the future **Neos 6.0** add the methods

**\* public function getIcon(): string**  
**\* public function getDescription(): string**

to your asset source.

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

# If never done since 4.0 or 4.1, set database charset and update
# to the current default given character set and collation
./flow database:setcharset

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