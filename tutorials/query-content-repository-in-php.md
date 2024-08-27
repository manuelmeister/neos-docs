url: /tutorials/query-content-repository-in-php
# Query the Content Repository in PHP

You can also query the Content Repository outside of Fusion. This can be helpful when creating asynchronous jobs or commands which need information about nodes.

First you will need to inject a context factory into your PHP class to allow accessing the CR. A content context is a certain "view" into the Content Repository. It's defined by its dimensions, the site and the workspace.

```php
/**
 * @Flow\Inject
 * @var ContentContextFactory
 */
protected $contentContextFactory;
```

To create a context we have to give the factory the parameters to create it. Add the following code to a PHP method in your class.

```php
/** @var ContentContext $contentContext */
$contentContext = $this->contentContextFactory->create([
    'workspaceName' => 'live',
    'dimensions' => $dimensions,
    'currentSite' => $site,
    'currentDomain' => $site->getFirstActiveDomain(),
]);
```

To make the previous code snippet work we first have to define which dimensions we want to access and which site should be the root of our view.

```php
/** @var Site $site */
$site = $this->siteRepository->findOneByNodeName('neosdemo');

$dimensions = ['en_US'];
```

Now you can retrieve the site node from the context. The site node is the starting point for any query for its subnodes.

```php
$siteNode = $contentContext->getNode('/sites/neosdemo');
```

Now you can write your first FlowQuery to get some nodes. In this example snippet we retrieve all document nodes except shortcuts.

But you can use all the operations and features you know from Fusion.

```php
$documentNodeQuery = new FlowQuery([$siteNode]);
$documentNodeQuery->pushOperation('find', ['[instanceof Neos.Neos:Document][!instanceof Neos.Neos:Shortcut]']);
$documentNodes = $documentNodeQuery->get();
```

_Written by_ **Sebastian Helzle**