url: /tutorials/logging-and-debugging
# Logging and Debugging

for Neos 5 and 7

## Logging

Be aware, that 'Logging' is programmatically a task of the underlying **Flow framework** ...

### System Log

A logger instance for the default System Log can be injected and used for logging quite easily:

```php
use Psr\Log\LoggerInterface;

/**
 * @var LoggerInterface
 */
protected $logger;

/**
 * @param LoggerInterface $logger
 * @return void
 */
public function injectLogger(LoggerInterface $logger)
{
        $this->logger = $logger;
}
```

The various methods can then be used to log according to the level:

```php
$message = 'Whatever you want to log';
$context = [
	'anything' => 'you might need',
	'but can be' => 'left empty as well'
];

$this->logger->debug(string $message, array $context);
$this->logger->info(string $message, array $context);
$this->logger->notice(string $message, array $context);
$this->logger->warning(string $message, array $context);
$this->logger->error(string $message, array $context);
$this->logger->critical(string $message, array $context);
$this->logger->alert(string $message, array $context);
```

In other to be able to distinguish log entries, it is wise to send the some metadata along with the log entry:

```php
use Neos\Flow\Log\Utility\LogEnvironment;

$logger->debug(
	'Some log message',
	LogEnvironment::fromMethodName(__METHOD__)
);
```

### Other logs

While logging to the System Log is easily done, and probably the most common case, you might want to log to the Security Log.

For **Neos 5.x** (based on **Flow 6.x**) this can be done using the `PsrSecurityLogerInterface` – but this is _deprecated_ as of Flow 6.0 already:

```php
/**
 * @var \Neos\Flow\Log\PsrSecurityLoggerInterface
 */
protected $securityLogger;

/**
 * @param \Neos\Flow\Log\PsrSecurityLoggerInterface $securityLogger
 * @return void
 */
public function injectSecurityLogger(\Neos\Flow\Log\PsrSecurityLoggerInterface $securityLogger)
{
        $this->securityLogger = $securityLogger;
}
```

The proper, non-deprecated method for this would be the use of the logger factory:

```php
/**
 * @var \Neos\Flow\Log\PsrLoggerFactoryInterface
 */
protected $loggerFactory;

/**
 * @var \Neos\Flow\Log\PsrSecurityLoggerInterface
 */
protected $securityLogger;

/**
 * @param \Neos\Flow\Log\PsrLoggerFactoryInterface $loggerFactory
 * @return void
 */
public function injectLoggerFactory(\Neos\Flow\Log\PsrLoggerFactoryInterface $loggerFactory)
{
        $this->securityLogger = $loggerFactory->get('securityLogger');
}
```

Flow comes with the following loggers defined by default:

*   `systemLogger`
*   `securityLogger`
*   `sqlLogger`
*   `i18nLogger`

With **Neos 7.0** (based on **Flow 7.0**) the `PsrSystemLoggerInterface` and `PsrSecurityLoggerInterface` (that were deprecated with Flow 6.0) are removed, so either use the logger factory as explained above or use virtual objects to access loggers other than for the system log:

```php
use Neos\Flow\Annotations as Flow;
use Psr\Log\LoggerInterface;

/**
 * @Flow\Inject(name="Neos.Flow:SystemLogger")
 * @var LoggerInterface
 */
protected $systemLogger;

```

Flow comes with the following virtual logger objects defined by default:

*   `Neos.Flow:SystemLogger`
*   `Neos.Flow:SecurityLogger`
*   `Neos.Flow:SqlLogger`
*   `Neos.Flow:I18nLogger`

### Defining a custom logger

A custom logger can in come handy when you want to log specific information to a separate log file to faster analyse e.g. api calls or service information.

First you have to register the a new logger which can get created by Flow:

Settings.yaml:
```yaml
Neos:
  Flow:
    log:
      psr3:
        'Neos\Flow\Log\PsrLoggerFactory':
          myLogger:
            default:
              class: Neos\Flow\Log\Backend\FileBackend
              options:
                logFileURL: '%FLOW_PATH_DATA%Logs/My.log'
                createParentDirectories: true
                severityThreshold: '%LOG_INFO%'
                maximumLogFileSize: 10485760
                logFilesToKeep: 1
                logIpAddress: true
```

Now the define an Object on how to create an instance of the logger, which class it is based on and some more information:

Objects.yaml:
```yaml
'Acme.Demo:Log.MyLogger':
  className: Psr\Log\LoggerInterface
  scope: singleton
  factoryObjectName: Neos\Flow\Log\PsrLoggerFactoryInterface
  factoryMethodName: get
  arguments:
    1:
      value: 'myLogger'
```

To use your custom logger just inject it and specify the name of the custom logger, defined in your Objects.yaml. After that the logger can be used as any regular logger inside Flow

ServiceWithCustomLogger.php:
```php
<?php
declare(strict_types=1);

namespace Acme\Demo\Service;

use Neos\Flow\Annotations as Flow;
use Psr\Log\LoggerInterface;

class ServiceWithCustomLogger
{
    /**
     * @Flow\Inject(name="Acme.Demo:Log.MyLogger")
     * @var LoggerInterface
     */
    protected $myLogger;

    /**
     * Create a log message with our custom logger to a separate log file
     *
     * @param $message
     * @return void
     */
    protected function createLogEntry($message)
    {
        $this->myLogger->info($message);
    }
```

The log file can be found in `Data/Logs/My.log`