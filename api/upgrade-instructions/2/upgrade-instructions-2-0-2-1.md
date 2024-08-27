url: /api/upgrade-instructions/2/upgrade-instructions-2-0-2-1
# Upgrade Instructions 2.0 → 2.1

By using composer, you can update an existing installation to a specific version, without having to create a new project.

See the release notes for a list of [breaking changes](http://neos.readthedocs.org/en/2.1/Appendixes/ReleaseNotes/210.html#breaking-changes).

For further information on what changed please take a look at the [release notes](http://neos.readthedocs.org/en/2.1/Appendixes/ReleaseNotes/210.html) and the [changelog](http://neos.readthedocs.org/en/2.1/Appendixes/ChangeLogs/210.html).

## Instructions

As always, before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "typo3/neos:~2.1.0"
composer require --no-update "typo3/neos-nodetypes:~2.1.0"

# Update optional package dependencies (if installed)
composer require --no-update "typo3/neosdemotypo3org:~2.1.0"
composer require --no-update "typo3/neos-kickstarter:~2.1.0"
```

If you have development packages in your composer manifest, update them to match as well:

```none
# Update development packages (if installed)
composer require --no-update --dev "typo3/buildessentials:~3.1.x-dev"
composer require --no-update --dev "mikey179/vfsstream:~1.6"
composer require --no-update --dev "phpunit/phpunit:~4.8 || ~5.2.0"
 
```

## Now do the actual update:

```none
# Update the packages
composer update 

# Flush the caches
./flow flow:cache:flush --force

# Ensure you have correct database charset/collation to prevent issues with foreign key constraints
./flow database:setcharset

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