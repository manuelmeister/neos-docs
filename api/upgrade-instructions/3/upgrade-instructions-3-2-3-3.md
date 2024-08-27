url: /api/upgrade-instructions/3/upgrade-instructions-3-2-3-3
# Upgrade Instructions 3.2 → 3.3

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the [release notes](http://neos.readthedocs.io/en/3.3/Appendixes/ReleaseNotes/330.html) and the [changelog](https://neos.readthedocs.io/en/3.3/Appendixes/ChangeLogs/330.html).

## Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~3.3.0"
composer require --no-update "neos/nodetypes:~3.3.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~3.3.0"
composer require --no-update "neos/site-kickstarter:~3.3.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:4.3.x-dev"
```

## Getting the new UI

To upgrade an existing project to the new React UI have add the following dependencies.

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos-ui:~1.0.0"
composer require --no-update "neos/neos-ui-compiled:~1.0.0"
```

> **ℹ️ Custom Inspector Editors**
> 
> Attention: If your project uses custom inspector-editors you will have to rewrite them for the new UI.

## Internal API-changes

Some internal APIs were changed for this release and while this is technically not a breaking change you should review your code if you have custom code in one of the following areas:

1.  Custom Routers: The signature of the internal Router implementation has changed. In the unlikely case that you replaced the flow-router with a custom-router you have to adjust your code accordingly.
2.  Custom inspectors-editors: If you implemented custom inspector-editors for the old ui you will have to reimplement them if you want to switch to the new React-UI. We prepared the package [neos-ui-extensibility-examples](https://github.com/neos/neos-ui-extensibility-examples) to help you doing so.

## Finish the update

```bash
# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force

# Run code migrations (as needed for any packages that need to be migrated)
./flow flow:core:migrate <Vendor.PackageName>

# Run database migrations
./flow doctrine:migrate

# Publish resources
./flow resource:publish
```

## Troubleshooting

You may have some legacy dependencies and configuration entries in your composer manifest. Feel free to check if the following is needed in your setup:

```bash
# Remove the following line from composer.json (if present)
"minimum-stability": "dev",
 # Remove unneeded dependencies
composer remove --no-update "neos/flow"
composer remove --no-update "doctrine/migrations"
```

If you run into trouble with Neos content or resources, the following may help:

```bash
# If you experience issues with pages not working, try
./flow node:repair

# If you experience issues with resources, thumbnail or assets, try
./flow resource:clean
./flow media:clearthumbnails
```