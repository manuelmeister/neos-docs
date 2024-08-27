url: /api/upgrade-instructions/7/upgrade-instructions-7-2-7-3
# Upgrade Instructions 7.2 → 7.3

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/7.3/Appendixes/ChangeLogs/730.html), [Flow](https://flowframework.readthedocs.io/en/7.3/TheDefinitiveGuide/PartV/ChangeLogs/730.html))

## Update Instructions

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~7.3.0"
composer require --no-update "neos/neos-ui:~7.3.0"


# Update optional package dependencies (if installed)
composer require --no-update "neos/site-kickstarter:~7.3.0"
composer require --no-update "neos/demo:~7.3.0"
```

If you still require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not needed anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~7.3.0"
```

> **ℹ️ Not on Neos 7.2 yet?**
> 
> If you are upgrading from a lower version than 7.2, be sure to read the upgrade instructions from the previous Release Notes first.

## Breaking Changes

With this minor release, no breaking changes have been added apart from a deprecation announcement.

#### Neos

##### Fusion Parser deprecate namespace alias

Starting with Neos 8.0 the namespace alias will not work anymore.  
Instead of the namespace alias, the users need to use the full namespace again.

##### Always show current node in breadcrumb

The Prototype `Neos.Neos:BreadcrumbMenu` was using `node`, this is fixed and use `documentNode` now. In addition, the Prototype `Neos.Neos:BreadcrumbMenuItems` had the wrong order. This has been fixed, but eventually the reverse ordering needs to be removed now \[Array.reverse(props.menuItems)\].

##### `value` is now an `array` in Neos.Neos:ContentCollection `attributes.class.@process`

[https://github.com/neos/neos-development-collection/pull/3438](https://github.com/neos/neos-development-collection/pull/3438)

#### Flow

With this minor release, no breaking changes have been added.

## Finish the update

In general just make sure to run the following commands:

To clear all file caches:

```bash
# Update the packages
composer update

# Flush the caches
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