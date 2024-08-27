url: /api/upgrade-instructions/4/upgrade-instructions-4-3-5-0
# Upgrade Instructions 4.3 → 5.0

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/5.0/Appendixes/ChangeLogs/500.html), [Flow](https://flowframework.readthedocs.io/en/6.0/TheDefinitiveGuide/PartV/ChangeLogs/600.html))

## New Requirements

For running Neos 5.0 you need to satisfy all of the following new Requirements.

*   Your system must run PHP **7.2.x** or higher

## Update Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~5.0.0"
composer require --no-update "neos/nodetypes:~5.0.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~6.0.0"
composer require --no-update "neos/site-kickstarter:~5.0.0"
```

If you require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not required anymore.  
  
If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:6.0.x-dev"
```

## Breaking changes

With this major release, some breaking changes where introduced. Its most likely that your project is affected, if it depends on one of the following changes.

### Neos

#### **Plugin and content prototype generators are disabled**

The prototype generator classes are deprecated and removed from the nodeType configuration. This helps to make the fusion-code more explicit and understanding the connection between nodeType and fusion prototype much simpler. The previously assigned base types were not recommended anymore and thus usually are overwritten anyways.

A very welcome effect is that the error message for missing node rendering prototypes will say just that and not any more that a template file is missing. In addition this removes the documentPrototypeGenerator that was deprecated already for Neos 5.

**Upgrade instructions**

To upgrade you have to make sure that content and plugin NodeTypes have a matching fusion prototype that looks like the following examples:

```neosfusion
prototype(Vendor.Site:ContentExample) < prototype(Neos.Neos:Content) {
    templatePath = "resource://Vendor.Site/Private/Templates/NodeTypes/ContentExample.html" 
    /* for all properties needed for rendering */
    title = ${q(node).property('title')}
}

prototype(Vendor.Site:PluginExample) < prototype(Neos.Neos:Plugin) {
    package = "Vendor.Site"
    subpackage = ""
    controller = "Example"
    action = "index"
}
```

####   
The mapping of Neos.NodeTypes to their subpackage namespace was removed

Previously Neos.NodeTypes defined many nodes of subpackages abstract and extends them in its own namespace. This makes it hard to support setups with Neos.NodeTypes or only the subpackages from a single site-package.

This changes adds a migration to convert all NodeTypes that were extracted from Neos.NodeTypes into the namespace of the respective subpackage.

To apply the migration run

```bash
./flow node:migrate 20190304111200
```

See: [https://github.com/neos/neos-development-collection/pull/2385](https://github.com/neos/neos-development-collection/pull/2385)

#### Static robots.txt file is removed for fresh installations

Since the base distribution contains `neos/seo` 3.x which does a much better job at providing a more valuable and accurate `robots.txt` file.

When the default `robots.txt` still remains in the projects `Web`  
folder, this can cause a lot of confusion. To make matters worse, it's  
recreated whenever the composer install scripts are executed.

In case a custom distribution does not install the `neos/seo` package,  
we now have the meta tag within the Neos login page as a fallback, so  
even then status quo remains without the standard `robots.txt` from a SEO perspective.

See: [https://github.com/neos/neos-development-collection/pull/2583](https://github.com/neos/neos-development-collection/pull/2583)

#### Alter `Neos.Fusion:Tag.attributes` to `Neos.Fusion:DataStructure`

In the past integrators often expected to be able to pass data structures to `Tag.attributes` which was not possible since the Tag implementation expected attributes to be a string that usually was rendered by `Neos.Fusion:Attributes`.

This change extends the `Neos.Fusion:Tag` implementation to accept iterables (array and traversables) as `attributes` and changes the default value to `Neos.Fusion:DataStructure`. A fallback to cast non-iterable values to string is in place so if anyone uses Neos.Fusion:Attributes explicitly this will still work.

The key `allowEmptyAttributes` is added to `Neos.Fusion:Tag` to control wether or not empty attributes are allowed. This mimics the behavior of `@allowEmpty` on `Neos.Fusion:Attributes`.

`Neos.Fusion:Attributes` is marked as deprecated but will stay in there for a while.

How to update: This change is almost 100% backwards compatible. Only if you used `attributes.@allowEmpty = false` inside a `Neos.Fusion:Tag` but did not define `attributes = Neos.Fusion:Attributes` the rendering of empty attributes will change. To fix this replace `attributes.@allowEmpty = false` with `allowEmptyAttributes = false`.

See: [https://github.com/neos/neos-development-collection/pull/2698](https://github.com/neos/neos-development-collection/pull/2698)

#### Discardall & publishall CLI commands are removed

Use `publish` and `discard` instead.

See: [https://github.com/neos/neos-development-collection/pull/2521](https://github.com/neos/neos-development-collection/pull/2521)

#### Method `ConvertNodeUrisImplementation` is removed

Use the `ConvertUrisImplementation` instead.

See: [https://github.com/neos/neos-development-collection/pull/2522](https://github.com/neos/neos-development-collection/pull/2522)

#### Method `registerAssetResourceChange` is removed

Use `ContentCacheFlush::registerAssetChange instead`.

See: [https://github.com/neos/neos-development-collection/pull/2526](https://github.com/neos/neos-development-collection/pull/2526)

#### PHPUnit was updated from version 7 to version 8.1

See [https://github.com/sebastianbergmann/phpunit/blob/8.0.0/ChangeLog-8.0.md#800---2019-02-01](https://github.com/sebastianbergmann/phpunit/blob/8.0.0/ChangeLog-8.0.md#800---2019-02-01) for what has changed in PHPUnit 8.

See: [https://github.com/neos/neos-development-collection/pull/2472](https://github.com/neos/neos-development-collection/pull/2472)

### Flow

#### Deprecated HTTP objects are replaced with PSR-7 implementation

This replaces the HTTP stack of Flow with PSR-7.

Many areas of Flow are affected by this, most notably and breaking:

*   All HTTP is now fully PSR-7
*   Response in MVC controllers is no longer an HTTP response and has very different methods.
*   CLI and MVC use different dispatchers now
*   `ActionRequest::getParentRequest()` will return null at the top instead of an HttpRequest, you can still get the HttpRequest via `ActionRequest::getHttpRequest()`
*   `ActionRequest::fromHttpRequest(ServerRequestInterface $httpRequest)` introduced
*   `ActionRequest::createSubRequest()` introduced
*   ActionRequest can longer be created via `new`
*   `\Neos\Flow\Mvc\ActionRequestFactory` introduced to correctly merge arguments from the HTTP request
*   `Neos.Http.Factories` introduced, implementing PSR-17 HTTP factories, use those to create and fake HTTP requests
*   The HTTP process was split into more components to have easier extension points in between. So you can interject between the creation of the top level ActionRequest (after which security is available) and the actual dispatching to a controller

**Example API Changes:**

*   no more `Mvc\Response`, instead `ActionRequest` and `ActionResponse` are the API inside the MVC stack
*   to create an `ActionRequest`, use the `ActionRequestFactory->createActionRequest($serverRequest, $arguments)`
*   inside a Controller:
    *   `$this->response->setHeader('Content-Type', ...)` -> `$this->response->setContentType(...)`
    *   `$this->response->setHeader('Location', ...)` -> `$this->response->setRedirectUri(...)`
    *   `$this->response->setStatus(...)` -> `$this->response->setStatusCode(...)`
    *   `$this->response->setHeader(...)` -> `$this->response->setComponentParameter(SetHeaderComponent::class, ...)`
*   `Request::create(...)` -> `new ServerRequest('GET', ...)`
*   `$httpRequest->getBaseUri()` -> `RequestInformationHelper::generateBaseUri($request)`

See: [https://github.com/neos/flow-development-collection/pull/1552](https://github.com/neos/flow-development-collection/pull/1552)

#### Legacy Logger is removed

The deprecated logger including all deprecated interfaces are removed.  
Please use the PSR-3 interfaces introduced with Flow 5.0 instead.

You must adjust the log settings as well. A code migration is included,  
and you can check against the settings in Neos.Flow itself in case you  
need to adjust things manually.

The `log(…)` method looked like this with the old `Neos\Flow\Log\LoggerInterface`:

```php
log(string $message, int $severity = LOG_INFO, $additionalData = null,
    string $packageKey = null, string $className = null, string $methodName = null);
```

The new interface still has a `log($level, string $message, array $context)`  
method, but be aware of the changed parameters (order)!

You should be using the level-specifc methods like `debug(…)`,  
`info(…)`, `notice(…)`, `warning(…)`, `error(…)`, `critical(…)`, `alert(…)`,`emergency(…)`instead.

Further there is no `logException()` anymore, it should be replaced by using  
`logThrowable()` from the `\Neos\Flow\Log\ThrowableStorageInterface` which stores the exception and returns the message to send to the log with `error(…)` for example.

To replace the previous passing of information about the place the logging call was done, use this to pass the `$context`:

```php
use Neos\Flow\Log\Utility\LogEnvironment;

$logger->debug('Some log message', LogEnvironment::fromMethodName(__METHOD__));
```

See: [https://github.com/neos/flow-development-collection/pull/1574](https://github.com/neos/flow-development-collection/pull/1574)

#### Settings `subdivideHashPathSegment` and `relativeSymlinks` enabled by default

The old defaults for these settings worked but caused trouble once projects got bigger over time:

*   `subdivideHashPathSegment: false` caused having too many symlinks in a single folder for many filesystems
*   `relativeSymlinks: false` did not allow to put the `Web/_Resources` directory into the shared folder for faster deployments

**ATTENTION: This alters the default behavior and the published resources will get a url with nested paths. That is why this is considered a breaking change.**

NOTE: After updating you have to empty the `Web/_Resources/Persistent` folder and run `./flow resource:publish`. This is usually all done automatically from the deployment tool you are using.

If you do not want this behavior you can disable the subdivision via configuration for your project with the following configuration.

```yaml
Neos:
  Flow:
    resource:
      targets:
        localWebDirectoryPersistentResourcesTarget:
          targetOptions:
            subdivideHashPathSegment: false
            relativeSymlinks: false
```

You probably want to redirect requests to the old urls in your webserver configuration, the following regex search/replace patterns may be used for that:

*   searchPattern: `^_Resources\/Persistent\/([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{36})\/(.+)$`
*   replacePattern: `_Resources/Persistent/$1/$2/$3/$4/$1$2$3$4$5/$6`

nginx redirect rule:

nginx :
```none
# redirect resource urls without subdivideHashPathSegments
rewrite "^/_Resources\/Persistent\/([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{36})\/(.+)$" /_Resources/Persistent/$1/$2/$3/$4/$1$2$3$4$5/$6 permanent;
```

See: [https://github.com/neos/flow-development-collection/pull/1689](https://github.com/neos/flow-development-collection/pull/1689)

#### Deprecated methods from AuthenticationManagerInterface were removed

This removes `getTokens()`, `getProviders()` and `setSecurityContext()`from `AuthenticationManagerInterface` and `AuthenticationProviderManager`.

Also return type declarations are set on the interface methods.

To adjust your code using any implementations of the interface, replace

*   `$this->authenticationManager->getTokens()` with `$this->tokenAndProviderFactory->getTokens()`
*   `$this->authenticationManager->getProviders()` with `$this->tokenAndProviderFactory->getProviders()`

(Of course you might need to add injections so the factory is available in your code.)

If you implemented the interface yourself, remove the methods and use injection instead of `setSecurityContext()`:

```php
/**
 * The security context of the current request
 *
 * @Flow\Inject
 * @var Neos\Flow\Security\Context
 */
protected $securityContext;
```

See: [https://github.com/neos/flow-development-collection/pull/1577](https://github.com/neos/flow-development-collection/pull/1577)

#### Doctrine ObjectManager injection support removed

Use `\Doctrine\ORM\EntityManagerInterface` instead.

See: [https://github.com/neos/flow-development-collection/pull/1551](https://github.com/neos/flow-development-collection/pull/1551)

#### Lock package was removed from the dev-collection

This is marked breaking because the LockManager is no longer initialised after this change and the package would not be installed by default.  
If you need the package in your own code you should require it independently and setup the LockManager as you need. We suggest looking into alternative locking solutions though.

[See: https://github.com/neos/flow-development-collection/pull/1771](https://github.com/neos/flow-development-collection/pull/1771)

#### Method `registerRenderMethodArguments()` was removed from AbstractViewHelper

This removes the deprecated `registerRenderMethodArguments()` method from the `AbstractViewHelper` in the Neos.FluidAdaptor package.

To adjust your code, you need to implement `initializeArguments()` in your ViewHelper and call `$this->registerArgument(…)` in it for your former arguments to `render()`.

In `render()` (which must be parameterless now), access the arguments via `$this->arguments['…']`.

See: [https://github.com/neos/flow-development-collection/pull/1578](https://github.com/neos/flow-development-collection/pull/1578)

#### Remove magic \`q\` and replace it with function helpers

Function helpers are static functions that are available in Eel without a containing helper. This change removes the default `q` variable and instead adds a static method `q` to the flowQuery class that is used as helper function with the following configuration:

```yaml
Neos:
  Fusion:
    defaultContext:
      q: 'Neos\Eel\FlowQuery\FlowQuery::q'
  ContentRepository:
    labelGenerator:
      eel:
        defaultContext:
          q: Neos\Eel\FlowQuery\FlowQuery::q
```

Note: Nested paths as identifiers for function-helpers are not allowed and will raise an exception.

This is breaking as it makes it necessary to add the configuration above to Neos.Fusion and Neos.ContentRepository. Also custom code that uses FlowQuery and relies on q beeing always present will have to be adjusted.

**Upgrade Instructions:**

Only if you are using the EelUtility in to evaluate expressions with `q` AND are using a custom defaultContextConfiguration you have to make sure that the configuration line `q: 'Neos\Eel\FlowQuery\FlowQuery::q'` is added to this configuration.

See: [https://github.com/neos/flow-development-collection/pull/1580](https://github.com/neos/flow-development-collection/pull/1580)

#### Be more strict with the default accepted clientIP headers

This will only accept the `X-Forwarded-For` header to override the client IP address by default to be in line with the other headers.

If you use the clientIp from the Http Request, are behind a reverse proxy and did not explicitly configure which HTTP header you expect to contain the original users IP address, then this might break for you if the first reverse proxy in your chain did not set the `X-Forwarded-For` header.  
In that case, make sure which header contains the clients IP address and specify that in the `Neos.Flow.http.trustedProxies.headers.clientIp` Setting.

See: [https://github.com/neos/flow-development-collection/pull/1725](https://github.com/neos/flow-development-collection/pull/1725)

#### **Methods getTokens(), getProviders() and setSecurityContext() are removed**

The method getTokens(), getProviders() and setSecurityContext() from AuthenticationManagerInterface and AuthenticationProviderManager were removed. Also return type declarations are set on the interface methods. To adjust your code using any implementations of the interface, replace

*   $this->authenticationManager->getTokens() with $this->tokenAndProviderFactory->getTokens()
*   $this->authenticationManager->getProviders() with $this->tokenAndProviderFactory->getProviders()

(Of course you might need to add injections so the factory is available in your code.) If you implemented the interface yourself, remove the methods and use injection instead of setSecurityContext().

#### Session for sessionless tokens are not started anymore

Adds a condition to the `Dispatcher` to avoid  
`Neos\Flow\Security\Context::setInterceptedRequest()` from being invoked when authenticating an authentication token that implements the `SessionlessTokenInterface`.

This is a breaking change if code relies on the fact that the intercepted request is stored even when using sessionless authentication.

See: [https://github.com/neos/flow-development-collection/pull/1615](https://github.com/neos/flow-development-collection/pull/1615)

#### `PackageManagerInterface` was removed

Use the `PackageManager` class directly instead.

See: [https://github.com/neos/flow-development-collection/pull/1593](https://github.com/neos/flow-development-collection/pull/1593)

#### `ObjectManager.getSettingsByPath()` was removed

Instead of getSettingsByPath(…) use settings injection or the ConfigurationManager to get settings.

See: [https://github.com/neos/flow-development-collection/pull/1592](https://github.com/neos/flow-development-collection/pull/1592)

#### The type matching pattern was simplified and strengthened

The new pattern will now just match any identifier made up of characters, digits, backslashes and underscores up to a whitespace or lineend, which also matches all the previously hard-coded types.

This is not breaking in the normal sense, but the change in a very core regex pattern can cause different behaviour in some edge-cases, hence why this bugfix is not applied to lowest maintained branch.

See: [https://github.com/neos/flow-development-collection/pull/1640](https://github.com/neos/flow-development-collection/pull/1640)

#### Strict typehints for error message title and code were defined

This is breaking, because the Error messages no longer accept `null` for the `$code` and `$title` constructor arguments.

See: [https://github.com/neos/flow-development-collection/pull/1720](https://github.com/neos/flow-development-collection/pull/1720)

#### Method `createWithOptions()` was added to `ThrowableStorageInterface`

See: [https://github.com/neos/flow-development-collection/pull/1588](https://github.com/neos/flow-development-collection/pull/1588)

#### `CompilableInterface` from FluidAdaptor was removed

See: [https://github.com/neos/flow-development-collection/pull/1595](https://github.com/neos/flow-development-collection/pull/1595)

### Javascript API

#### Remove emberjs based content-module.

With the 5.0 release we removed the whole emberjs based content-module. The components of these modules were never a public API. So if you use components of the emberjs based UI in your custom backend module then this will break with version 5.0 of neos.

See: [https://github.com/neos/neos-development-collection/pull/2672](https://github.com/neos/neos-development-collection/pull/2672)

#### The window.Typo3Neos namespace are replaced with window.NeosCMS

This replaces function calls for the Notification and I18n API.  
The old namespace is still available but will be removed in future releases.  
  
So please use the new `window.NeosCMS` namespace.

```javascript
window.NeosCMS.Notification('New major release', 'Neos has been released in version 5.0');
```

See: [https://github.com/neos/neos-development-collection/pull/2672](https://github.com/neos/neos-development-collection/pull/2672)

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