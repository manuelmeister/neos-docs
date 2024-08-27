url: /api/upgrade-instructions/5/upgrade-instructions-5-0-5-1
# Upgrade Instructions 5.0 → 5.1

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/5.1/Appendixes/ChangeLogs/510.html), [Flow](https://flowframework.readthedocs.io/en/6.1/TheDefinitiveGuide/PartV/ChangeLogs/610.html))

## Update Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~5.1.0"
composer require --no-update "neos/neos-ui:~5.1.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~6.1.0"
composer require --no-update "neos/nodetypes:~5.1.0"
composer require --no-update "neos/site-kickstarter:~5.1.0"
```

If you require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not required anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:6.1.x-dev"
```

## Breaking changes

With this major release, some breaking changes where introduced. Its most likely that your project is affected, if it depends on one of the following changes.

#### Introducing the OriginDimensionSpacePoint Interface

A new interface for the EventSourced Content Repository has been implemented. Since interface changes are breaking changes, this should be in the next major release. But considering the fact, that probably nobody ist using it right now, and for the sake of the further development of the new CR, we decided to ship it with the 5.1 release.

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