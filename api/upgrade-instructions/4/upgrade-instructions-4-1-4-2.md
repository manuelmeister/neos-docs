url: /api/upgrade-instructions/4/upgrade-instructions-4-1-4-2
# Upgrade Instructions 4.1 → 4.2

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the [changelog](https://neos.readthedocs.io/en/4.2/Appendixes/ChangeLogs/index.html).

## Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~4.2.0"
composer require --no-update "neos/nodetypes:~4.2.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~4.2.0"
composer require --no-update "neos/site-kickstarter:~4.2.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:5.2.x-dev"
```

## Getting the new UI 

To upgrade an existing project to the new React UI you have to add the following dependencies. If you didn't upgrade already with Neos 4.1, you should definitely do it now.

```bash
# Change into your Neos directory
cd /installation-root/

# Flush the caches 
./flow flow:cache:flush --force

# Update the core package dependencies
composer require --no-update "neos/neos-ui:^1.4"
```

> **ℹ️ Custom Inspector Editors**
> 
> If your project uses custom inspector-editors you will have to rewrite them for the new UI. We prepared the package [neos-ui-extensibility-examples](https://github.com/neos/neos-ui-extensibility-examples) to help you doing so.

## Breaking Changes

This release includes two potentially breaking changes:

1.  User Sessions now persist by default even if the normal caches are flushed. If you prefer them to be flushed you can add the command _./flow session:destroyall_ to your CI or execute it manually (see [#1390](https://github.com/neos/flow-development-collection/issues/1390))
2.  _NodeType::isOfType()_ now correctly returns _false_ if a super type is removed explicitly. This is in sync with the _instanceof_ FlowQuery filter. The change only affects the PHP API (see [#1390](https://github.com/neos/flow-development-collection/issues/1390))

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