url: /api/upgrade-instructions/8/upgrade-instructions-8-2-8-3
# Upgrade Instructions 8.2 → 8.3

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/8.3/Appendixes/ChangeLogs/830.html), [Flow](https://flowframework.readthedocs.io/en/8.3/TheDefinitiveGuide/PartV/ChangeLogs/830.html))

## Update Instructions

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~8.3.0"
composer require --no-update "neos/neos-ui:~8.3.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~8.3.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~8.3.0"
```

### Optional: Updating Neos UI plugin build dependency

With Neos 8.3 we moved the logic of `@neos-project/neos-ui-extensibility` to `@neos-project/neos-ui-extensibility-webpack-adapter`, so you will need to require this package instead.

Please make the following adjustments in your `package.json` for your Neos UI Plugin:

1.  Rename `@neos-project/neos-ui-extensibility` to `neos-project/neos-ui-extensibility-webpack-adapter` and pin it to `~8.3.0`.
2.  If you have `@neos-project/build-essentials` required, you should remove it, as it's not needed anymore and abandoned.
3.  Run `npm install` or `yarn` to install the updated dependencies.
4.  Rebuild the plugin as usual with `NODE_ENV=production neos-react-scripts build`.

package.json:
```json
"devDependencies": {
-  "@neos-project/neos-ui-extensibility": "^8.2.0",
-  "@neos-project/build-essentials": "^8.2.0"
+  "@neos-project/neos-ui-extensibility-webpack-adapter": "^8.3.0"
}
```

After completing these steps, your package should be upgraded to the latest version of the Neos UI and ready to use. Thank you for using the Neos project!

## Breaking changes

#### Flow

**Password hashing strategies:** If you implemented `PasswordHashingStrategyInterface`, take note that type declarations will be added for the next major version (9.0) so adjust your implementation to use the added type declarations like in the core implementations. See [pull request](https://github.com/neos/flow-development-collection/pull/2920).

### Deprecation:

#### Neos

**Fusion Parser & FusionService**: The method `Neos\Fusion\Core\Parser::parse()`  
was deprecated. You should update it to `Neos\Fusion\Core\Parser::parseFromSource()`. The external API of the `Neos\Neos\Domain\Service\FusionService` was not changed. In the unlikely case that you extended this service and used internal methods, you probably will have to adjust your code. See [pull request](https://github.com/neos/neos-development-collection/pull/3839).

**PluginViews**: The concept of PluginViews which means rendering specific views of a plugin on a different document was deprecated. It has been used in very few cases and causes trouble in maintenance, and thus will be removed without replacement in Neos 9.

#### Neos UI

**Importing PlowJS in Neos UI plugins**: PlowJS is being removed from the Neos UI codebase, as the JS world moved on and now strict typing with Typescript is important, and also modern JavaScript allows us to replace Plow's `$get` safe access on nullable values via optional chaining. This restructuring will affect Neos UI plugins in the future, as we will remove plow JS from the Neos plugin API in Neos 9.0. For now, we deprecate the use and log a warning in dev context. See [migration](https://github.com/neos/neos-ui/issues/3425).

**Neos UI components** [**@neos-project/react-ui-components**](https://github.com/neos/neos-ui/tree/8.3/packages/react-ui-components%20): With this [pull request](https://github.com/neos/neos-ui/pull/3366) the CSS build stack of the Neos UI was modernized, due to this, it became possible to make the package react-ui-components easier to use: Developers requiring the NPM package will no longer need to worry about the required CSS preprocessing from the sources (lowering nesting, applying css-modules and having the required CSS variables in the environment). A prepack script will build the CSS to native CSS, take care of CSS modules and also inserts the CSS variables as hard-coded values. The distribution will also contain source maps and TypeScript typings. This means that for consumption of the components, you will only need a simple bundler to load the vanilla CSS - nothing else. It is advised to read the new [README](https://github.com/neos/neos-ui/tree/8.3/packages/react-ui-components) before updating, so you can identify any other changes.

#### Flow

**Session garbage collection**: With this [pull request,](https://github.com/neos/flow-development-collection/pull/2911) the garbage collection was moved to the session manager. The method `SessionInterface::collectGarbage` was deprecated and will be removed with 9.0. `SessionManager::collectGarbage` should be used instead.

### Neos UI Plugins

Be aware of any Neos UI plugins, that have not been rebuilt since Neos 8.2 as they might not work. See [Neos 8.2 upgrade instructions](https://docs.neos.io/api/upgrade-instructions/8/upgrade-instructions-8-1-8-2#rebuilding-neos-ui-ckeditor-plugins-to-make-them-compatible-with-neos-ui-hosts-gt-8-2) for further details. 

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