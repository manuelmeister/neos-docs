url: /guide/manual/extending-neos-with-php-flow/custom-flowquery-operations
# Custom FlowQuery Operations

The FlowQuery EelHelper provides you with methods to traverse the ContentRepository. Implementing custom operations allows the creation of filters, sorting algorithms and much more.

## Create FlowQuery Operation

Implementing a custom operation is done by extending the `Neos\Eel\FlowQuery\Operations\AbstractOperation` class. The Operation is implemented in the evaluate method of that class.

To identify the operation late on in Fusion the static class variable `$shortName` has to be set.

If you pass arguments to the FlowQuery Operation they end up in the numerical array `$arguments` that is handed over to the evaluate method.

```php
namespace Vendor\Site\FlowQuery\Operation;

use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;

class RandomElementOperation extends AbstractOperation {

        /**
         * {@inheritdoc}
         *
         * @var string
         */
        static protected $shortName = 'randomElement';

        /**
         * {@inheritdoc}
         *
         * @param FlowQuery $flowQuery the FlowQuery object
         * @param array $arguments the arguments for this operation
         * @return void
         */
        public function evaluate(FlowQuery $flowQuery, array $arguments) {
                $context = $flowQuery->getContext();
                $randomKey = array_rand($context);
                $result = array($context[$randomKey]);
                $flowQuery->setContext($result);
        }
}
```

In Fusion you can use this operation to find a random element of the main ContentCollection of the Site-Node:

```neosfusion
randomStartpageContent = ${q(site).children('main').children().randomElement()}
```

> **ℹ️ Note**
> 
> To override an existing operation define another operation with the same _shortName_ and a higher priority.

## Create Final FlowQuery Operations

If a FlowQuery operation does return a value instead of modifying the FlowQuery Context it has to be declared `$final`.

```php
namespace Vendor\Site\FlowQuery\Operation;

use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;

class DebugOperation extends AbstractOperation {

        /**
         * If TRUE, the operation is final, i.e. directly executed.
         *
         * @var boolean
         * @api
         */
        static protected $final = TRUE;

        /**
         * {@inheritdoc}
         *
         * @param FlowQuery $flowQuery the FlowQuery object
         * @param array $arguments the arguments for this operation
         * @return void
         */
        public function evaluate(FlowQuery $flowQuery, array $arguments) {
                return \Neos\Flow\var_dump($flowQuery->getContext(), NULL, TRUE);
        }
}
```

## Further Tips

1.  For checking that the operation can actually work on the current context a `canEvaluate` method can be implemented.
2.  In your FlowQuery `evaluate` function you can apply a filter function by pushing a filter operation. So if you want to filter for all nodes which have a email property set use: `$flowQuery->pushOperation('filter', [ '[email != ""' ]);`