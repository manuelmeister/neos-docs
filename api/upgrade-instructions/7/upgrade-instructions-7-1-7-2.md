url: /api/upgrade-instructions/7/upgrade-instructions-7-1-7-2
# Upgrade Instructions 7.1 → 7.2

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/7.2/Appendixes/ChangeLogs/720.html), [Flow](https://flowframework.readthedocs.io/en/7.2/TheDefinitiveGuide/PartV/ChangeLogs/720.html))

## Update Instructions

## Preparation

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~7.2.0"
composer require --no-update "neos/neos-ui:~7.2.0"
composer require --no-update "neos/site-kickstarter:~7.2.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~7.2.0"
```

If you still require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not needed anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~7.2.0"
```

## Updating

This section contains instructions for upgrading your Flow 7.1 based applications to Flow 7.2.

> **ℹ️ Not on Neos 7.1 yet?**
> 
> If you are upgrading from a lower version than 7.1, be sure to read the upgrade instructions from the previous Release Notes first.

In general just make sure to run the following commands:

To update the dependencies to the latest version:

```bash
composer update
```

To clear all file caches:

```bash
./flow flow:cache:flush --force
```

If you have additional cache backends configured, make sure to flush them too.

To apply core migrations:

```bash
  ./flow flow:core:migrate <Package-Key>
```

For every package you have control over (see **Upgrading existing code** below).

To validate/fix the database encoding, apply pending migrations and to (re)publish file resources:

```bash
 ./flow database:setcharset
 ./flow doctrine:migrate
 ./flow resource:publish
```

## Upgrading existing code

## Breaking changes

Flow 7.2 comes with the following breaking change:

*   [Extensible configuration loaders](https://github.com/neos/flow-development-collection/pull/2449)
*   [Avoid broken proxy docblocks](https://github.com/neos/flow-development-collection/pull/2568)

### Flow

There have two changes in Flow 7.2 which might require your code to be adjusted.

All information you need to know for the upgrade can be found in the [release notes' upgrade instructions](https://flowframework.readthedocs.io/en/7.2/TheDefinitiveGuide/PartV/ReleaseNotes/720.html#upgrade-instructions) section.

Given you have a Flow system with your (outdated) package in place you should run the following before attempting to fix anything by hand:

```bash
 ./flow core:migrate Acme.Demo
```

This will adjust the package code automatically and/or output further information. Read the output carefully and manually adjust the code if needed.

To see all the other helpful options this command provides, make sure to run:

```bash
 ./flow help core:migrate
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