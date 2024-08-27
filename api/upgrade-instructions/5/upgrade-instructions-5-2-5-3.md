url: /api/upgrade-instructions/5/upgrade-instructions-5-2-5-3
# Upgrade Instructions 5.2 → 5.3

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/5.3/Appendixes/ChangeLogs/530.html), [Flow](https://flowframework.readthedocs.io/en/6.3/TheDefinitiveGuide/PartV/ChangeLogs/630.html))

## Update Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~5.3.0"
composer require --no-update "neos/neos-ui:~5.3.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~6.2.0"
composer require --no-update "neos/nodetypes:~5.3.0"
composer require --no-update "neos/site-kickstarter:~5.3.0"
```

If you still require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not needed anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~6.3.0"
```

## Breaking changes

With this minor release, no breaking changes where introduced as far as was possible. Its most likely that your project can safely upgrade. Still there are few changes you might need to adapt to:

#### Node persistence changes

Neos 5.3 greatly speeds up node move actions. This is achieved by a change that circumvents certain Doctrine behaviour by committing all changed entities at once. Including entities which might not have been included with the previous code but would have been persisted at the end of the request instead. See [PR #3015](https://github.com/neos/neos-development-collection/pull/3015) for details.

_In the vast majority of Neos projecte the change does not need to ba adjusted for._

#### Browser arguments are the request parsed body

Since 6.0 the Browser _$arguments_ were accidentally moved to the request query parameters, while they should reflect the post body arguments. This has been corrected and slightly changes behaviour of the Browser class. See [PR #2050](https://github.com/neos/flow-development-collection/pull/2050) for details.

_You need to adjust your code if you adapted your usage of Browser since 6.0.0 already. If you want to send query parameters, you should instead provide an Uri instance with the parameters, as was already the case prior to 6.0._

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