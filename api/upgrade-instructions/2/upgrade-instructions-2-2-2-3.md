url: /api/upgrade-instructions/2/upgrade-instructions-2-2-2-3
# Upgrade Instructions 2.2 → 2.3

By using composer, you can update an existing installation to a specific version, without having to create a new project.

See the release notes for a list of [breaking changes](http://neos.readthedocs.io/en/2.3/Appendixes/ReleaseNotes/230.html).

For further information on what changed please take a look at the [release notes](http://neos.readthedocs.io/en/2.3/Appendixes/ReleaseNotes/230.html) and the [changelog](http://neos.readthedocs.io/en/2.3/Appendixes/ChangeLogs/230.html).

## Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "typo3/neos:~2.3.0"
composer require --no-update "typo3/neos-nodetypes:~2.3.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~2.3.0"
composer require --no-update "typo3/neos-kickstarter:~2.3.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "typo3/buildessentials:3.3.x-dev"
```

## Now do the actual update:

```bash
# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force

# Run code migrations (all or specific ones)
./flow flow:core:migrate

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
composer remove --no-update "typo3/flow"
composer remove --no-update "doctrine/migrations" 
# Remove deprecated packages
composer remove --no-update "typo3-ci/typo3flow"
```

If you run into trouble with Neos content or resources, the following may help: 

```bash
# If you experience issues with pages not working, try
./flow node:repair

# If you experience issues with resources, thumbnail or assets, try
./flow resource:clean
./flow media:clearthumbnails
```