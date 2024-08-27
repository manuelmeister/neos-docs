url: /api/upgrade-instructions/7/upgrade-instructions-7-3-8-0
# Upgrade Instructions 7.3 → 8.0

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/8.0/Appendixes/ChangeLogs/800.html), [Flow](https://flowframework.readthedocs.io/en/8.0/TheDefinitiveGuide/PartV/ChangeLogs/800.html))

## Update Instructions

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~8.0.0"
composer require --no-update "neos/neos-ui:~8.0.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~8.0.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~8.0.0"
```

## Breaking changes

With this major release, some breaking changes were introduced. It's most likely that your project is affected if it depends on one of the following changes:

### Neos

#### **Dropped support for fusion namespaces and new fusion parser**

The namespace feature in fusion was deprecated and is now removed. There is a migration for the default Neos.Fusion namespace but custom namespaces have to be adjusted manually.

```bash
./flow core:migrate Neos.Demo --force --verbose --version Neos.Fusion-20220326120900
```

#### **Dropped support for CKEditor version 4**

CKEditor 5 is default for several releases now but the neos-ui still had an option to define the default inline editor. The option was needed to be Internet Explorer compatible. As the Internet Explorer is end of life, we now also drop the possibility to choose the CKEditor version 4 as default editor.

#### Remove depracted and legacy code

Also a lot of legacy and deprecated code has been removed, like cache tag support, ConvertNodeUris, ContentCollectionRenderer 'collection' prop, window.Typo3Neos API, VIE schema and aloha configuration compatibility code. Most of that should not affect your installation unless you customized it to still use any of those.

##### `value` is now an `array` in Neos.Neos:Page `bodyTag.attributes.class.@process`

[https://github.com/neos/neos-development-collection/pull/3654](https://github.com/neos/neos-development-collection/pull/3654)

### Flow

Version 8.0 of Flow updates PSR dependencies to make use of PHP 8 typing, removes legacy fluid custom error view options and changes default JsonView DateTime format to ISO compliant DateTime::ATOM. All information you need to know for the upgrade can be found in the [release notes' upgrade instructions](https://flowframework.readthedocs.io/en/8.0/TheDefinitiveGuide/PartV/ReleaseNotes/800.html#upgrade-instructions) section.

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