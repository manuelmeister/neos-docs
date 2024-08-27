url: /api/upgrade-instructions/1/upgrade-instructions-1-2-2-0-1
# Upgrade Instructions 1.2 → 2.0

By using composer, you can update an existing installation to a specific version, without having to create a new project.

**See the release notes for a list of** [**breaking changes**](http://neos.readthedocs.org/en/2.0/Appendixes/ReleaseNotes/200.html#breaking-changes)**.**

For further information on what changed please take a look at the [release notes](http://neos.readthedocs.org/en/2.0/Appendixes/ReleaseNotes/200.html) and the [changelog](http://neos.readthedocs.org/en/2.0/Appendixes/ChangeLogs/200.html).

## Instructions

```bash
# Make sure you create a backup of the database and files!

cd /installation-root/

# Remove the following line from composer.json (if present)
"minimum-stability": "dev",

# Update the composer.json file
composer remove --no-update "typo3/flow"
composer remove --no-update "doctrine/migrations"

composer require --no-update "typo3/neos:~2.0.0"
composer require --no-update "typo3/neos-nodetypes:~2.0.0"

# Optional packages
composer require --no-update "typo3/neosdemotypo3org:~2.0.0"
composer require --no-update "typo3/neos-kickstarter:~2.0.0"
composer require --no-update "typo3/neos-seo:~1.0.0"
composer require --no-update "typo3/neos-googleanalytics:~1.0.0"

# Optional development packages
composer require --no-update --dev "typo3/buildessentials:3.0.x-dev"
composer require --no-update --dev "mikey179/vfsstream:~1.5.0"
composer require --no-update --dev "phpunit/phpunit:~4.8 || ~5.2.0"

# Remove deprecated packages
composer remove --no-update "typo3-ci/typo3flow"

# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force

# Ensure you have correct database charset/collation to prevent issues with foreign key constraints
./flow database:setcharset

# Run code migrations all or specific ones (required for running migrations)
./flow flow:core:migrate

./flow flow:core:migrate --version TYPO3.Neos-20150303231600
./flow flow:core:migrate --version TYPO3.TYPO3CR-20150510103823

# Run database and node migrations (stops in-between)
./flow doctrine:migrate
./flow node:migrate --version 20141103100401 --confirmation TRUE
./flow doctrine:migrate

# Publish resources
./flow resource:publish

# TIP: If you experience issues with pages not working, try running the node repair command
./flow node:repair

# TIP: If you get stuck when applying the node migration "20141103100401", make sure you apply the code migration "TYPO3.Neos-20150303231600" or manually replace "Neos\Media\Domain\Model\ImageVariant" with "Neos\Media\Domain\Model\ImageInterface"

# TIP: If you get an error regarding "Neos\Party\Domain\Service\PartyService",
make sure you delete the old Party package (moved from Framework to Application)
rm -rf Packages/Framework/TYPO3.Party
```