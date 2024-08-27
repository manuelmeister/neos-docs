url: /tutorials/flush-varnish-cache-after-successful-surf-deployment
# Flush Varnish cache after success­ful Surf deploy­ment

Automatically flush your Varnish cache once your deployment is successful

> **ℹ️ Before you start**
> 
> To get the full value of this tutorial, you are should 
> 
> *   Use [Surf for deployment](https://docs.typo3.org/other/typo3/surf/2.0/en-us/)
> *   Install the [MOC.Varnish package](https://github.com/mocdk/MOC.Varnish)
> *   Have setup a Varnish setup that allows flushing

## What are we trying to solve?

Serving content from a cache proxy can dramatically improve the performance and decrease server load.

When you are done reading here, I hope that you have gotten an idea, of how to automatically flush the cache every time an editor changes content in Neos.

In this tutorial, we are basing it on you having a Varnish Cache Proxy - the idea and concept can be used for similar software, but is not covered here.

## Configuring Surf deployment

The official documentation of TYPO3 Surf contains a full example of how you setup of Neos CMS and Flow Framework applications.

Go read about it:

*   [Surf installation](https://docs.typo3.org/other/typo3/surf/2.0/en-us/Installation/Index.html#download-phar-archive) (I prefer the ".phar archive"-way)
*   [How to deploy Neos Websites](https://docs.typo3.org/other/typo3/surf/2.0/en-us/Examples/Neos/Index.html)

## Setting up the flushing task after switching

The part about flushing cache, once deployment of a version is done, comes in the **Workflow** of the deployment.

Surf allows us to hook into the workflow and add tasks to be performed after a stage.

In our situation, we are interested in the flushing the cache after the "switch" stage. The "switch" stage, is when Surf points to our just-deployed version.

The Neos integration to Surf, has a "RunCommandTask" that let you run all available Flow commands, like you know them.

First we configure the task options

Task options:
```php
$flushVarnishTaskOptions = [
  'command' => 'moc.varnish:varnish:clear',
  'arguments' => [
    'domains' => 'domain.tld'
  ]
];
```

Then we define a task, with a name that helps us identify our task. And finally tells Surf to run it, after the stage "switch" has completed

Define task:
```php
$deployment->getWorkflow()
  ->defineTask('flushVarnish', \TYPO3\Surf\Task\Neos\Flow\RunCommandTask::class, $flushVarnishTaskOptions)
  ->afterStage('switch', 'flushVarnish');
```

When we put it all together (with the example from the Surf configuration example):

Surf deployment configuration:
```php
$node = new TYPO3\Surf\Domain\Model\Node('production');
$node
   ->setHostname('my.node.com')
   ->setOption('username', 'myuser');
$application = new TYPO3\Surf\Application\Neos\Neos('My Node');
$application
   ->setOption('keepReleases', 3)
   ->setOption('composerCommandPath', 'composer')
   ->setOption('repositoryUrl', '<my repository url>')
   ->setOption('branch', 'master')
   ->setOption('updateMethod', null)
   ->setOption('baseUrl', 'https://my.node.com')
   ->setOption('flushCacheList', [
       'Neos_Fusion_Content',
       'Neos_Neos_Fusion'
   ])
   ->setDeploymentPath('/var/www/vhosts/my.node.com')
   ->addNode($node);
/** @var $deployment TYPO3\Surf\Domain\Model\Deployment "injected" into this script from Surf */
$deployment
   ->addApplication($application)
   ->onInitialize(
      function () use ($deployment, $application) {
	 		// The task options goes here
            $flushVarnishTaskOptions = [
                'command' => 'moc.varnish:varnish:clear',
                'arguments' => [
                    'domains' => 'domain.tld'
                ]
            ];
            $deployment->getWorkflow()
                ->afterStage('switch', TYPO3\Surf\Task\Neos\Flow\FlushCacheListTask::class)
	 	 		// Defining the task and attach to the delpoyment workflow
                ->defineTask('flushVarnish', \TYPO3\Surf\Task\Neos\Flow\RunCommandTask::class, $flushVarnishTaskOptions)
                ->afterStage('switch', 'flushVarnish');
      }
   );
```

And we end up with a running deployment, that tells us about our newly added task in the very end

Surf Deployment Output:
```bash
### Removed all output prior to this point in time
Stage switch
production (My Node) TYPO3\Surf\Task\SymlinkReleaseTask
Node "production" would be live!
production (My Node) TYPO3\Surf\Task\Neos\Flow\FlushCacheListTask
production (My Node) flushVarnish
Stage cleanup
production (My Node) TYPO3\Surf\Task\CleanupReleasesTask
Stage unlock
production (My Node) TYPO3\Surf\Task\UnlockDeploymentTask
Would remove lock file '/var/www/surf-deployment-target/.surf/deploy.lock'
```

_Written by_ **Søren Malling**