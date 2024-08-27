url: /api/upgrade-instructions/3/upgrade-instructions-3-0-3-1
# Upgrade Instructions 3.0 → 3.1

By using composer, you can update an existing installation to a specific version, without having to create a new project.

See the release notes for a list of [breaking changes](http://neos.readthedocs.io/en/3.1/Appendixes/ReleaseNotes/310.html).

For further information on what changed please take a look at the [release notes](http://neos.readthedocs.io/en/3.1/Appendixes/ReleaseNotes/310.html) and the [changelog](http://neos.readthedocs.io/en/3.1/Appendixes/ChangeLogs/310.html).

## Instructions

As always, before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~3.1.0"
composer require --no-update "neos/nodetypes:~3.1.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~3.1.0"
composer require --no-update "neos/site-kickstarter:~3.1.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:4.1.x-dev"
```

## Now do the actual update:

```bash
# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force

# Run code migrations (as needed for any packages that need to be migrated)
./flow flow:core:migrate --package-key …

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