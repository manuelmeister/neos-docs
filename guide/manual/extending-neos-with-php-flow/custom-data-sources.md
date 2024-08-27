url: /guide/manual/extending-neos-with-php-flow/custom-data-sources
# Custom Data Sources

In the administration area you often want to offer editors select boxes for selecting external content. So for example you could have a YouTube NodeType and let the user select any of their YouTube videos in a dropdown (instead of manually needing to copy-paste the id). Even if the list becomes very long, this works great. Backend dropdown support search and autocomplete out of the box.

Data sources provide data to the editing interface without having to define routes, policies and a controller.

Data sources can be used for various purposes, however the return format is restricted to JSON. An example of their usage is as a data provider for the inspector `SelectBoxEditor` (see [Property Type: string / array<string> SelectBoxEditor – Dropdown Select Editor](https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html#property-editor-reference-selectboxeditor) for details).

## Create a data source

To implement a data source, create a class that implements `Neos\Neos\Service\DataSource\DataSourceInterface`, preferably by extending `Neos\Neos\Service\DataSource\AbstractDataSource`. Then set the static protected property `identifier` to a string. Make sure you use a unique identifier, e.g. `vendor-site-test-data`.

A data source is defined by an identifier and this identifier has to be unique.

Then implement the `getData` method, with the following signature:

```php
/**
 * Get data
 *
 * The return value must be JSON serializable data structure.
 *
 * @param NodeInterface $node The node that is currently edited (optional)
 * @param array $arguments Additional arguments (key / value)
 * @return mixed JSON serializable data
 * @api
 */
public function getData(NodeInterface $node = null, array $arguments = []);
```

The return value of the method will be JSON encoded.

Let's say have a BlogPost NodeType and want to have a authors selectbox for all Neos editors. First we create the DataSource

TestDataSource.php:
```php
<?php
namespace Vendor\Site\DataSource;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;

class EditorsDataSource extends AbstractDataSource
{

    /**
     * @var string
     */
    static protected $identifier = 'vendor-site-editors';

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @param NodeInterface $node The node that is currently edited (optional)
     * @param array $arguments Additional arguments (key / value)
     * @return array
     */
    public function getData(NodeInterface $node = null, array $arguments = [])
    {
        $options = [];
        foreach ($this->userService->getUsers() as $user) {
			$options[] = [
                'value' => $this->persistenceManager->getIdentifierByObject($user),
                'label' => $user->getLabel(),

                // additional optional parameters:
                'secondaryLabel' => "works here",
                'tertiaryLabel' => "is a nice person"
            ];
        }
        return $options;
    }
}
```

As array key we define the users identifier, as value we set the `label` to the human readable name.

![locations of different labels explained](/_Resources/Persistent/69c7350b4106f2cd940396550eca2fedc5811754/image%20(1).png)

location of different labels explained

```yaml
  properties:
    authors:
      type: array
      ui:
        label: 'Author(s)'
        reloadIfChanged: true
        inspector:
          group: 'document'
          position: '200'
          editor: Neos.Neos/Inspector/Editors/SelectBoxEditor
          editorOptions:
            placeholder: Choose
            dataSourceIdentifier: vendor-site-editors
```

> **ℹ️ Note**
> 
> By default the results from data sources are cached in JavaScript memory based on the parameters given to the data source. You can turn this behaviour off in your property configuration by setting \`dataSourceDisableCaching: true\` in the \`editorOptions\` group.

  
The result:

![](/_Resources/Persistent/b278515e79c5989a5785b47a902ccca6919765af/custom%20data%20source%20-%20select%20box%20example.png)

## Understanding routing

Data sources are available with the following URI pattern `/neos/service/data-source/<identifier>`, which can be linked to using the follow parameters:

*   @package: ‘Neos.Neos’
*   @subpackage: ‘Service’
*   @controller: ‘DataSource’
*   @action: ‘index
*   @format: ‘json’
*   dataSourceIdentifier: ‘<identifier>’

Arbitrary additional arguments are allowed. Additionally the routing only accepts GET requests.

If additional arguments are provided then they will automatically be available in the $arguments parameter of the `getData` method. Additional arguments will not be property mapped, meaning they will contain their plain value. However if an argument with the key node is provided, it will automatically be converted into a node. Provide a valid node path to use this, and keep in mind that the node argument is restricted to this use-case. This is done to make working with nodes easy.

The dataSourceIdentifier will automatically be removed from the arguments parameter.

> **ℹ️ Note**
> 
> Data sources are restricted to only be accessible for users with the Neos.Neos:Backend.DataSource privilege, which is included in the Neos.Neos:Editor role. This means that a user has to have access to the backend to be able to access a data point.

## Eager and Lazy Data Sources

The data sources are normally **eager**, which means that when selecting a node with a data source, a backend request is done to load **all possible elements** from the PHP implementation of the data source.

For some use cases, like having 100s of elements on the backend, this might be too slow.

A community package [sandstorm/LazyDataSource](https://github.com/sandstorm/LazyDataSource) exists, which solves this issue by implementing lazy loading for data sources. Check out the README for further instructions on how to use the package.

*   [Sandstorm.LazyDataSource package on GitHub](https://github.com/sandstorm/LazyDataSource)