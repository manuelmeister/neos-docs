url: /guide/features/background-jobs-and-cron
# Background Jobs and Cron

Solutions for long-running jobs and scheduled jobs

There are great open source packages for long-running jobs and background jobs available from the core team and the community.

#### What to choose?

In case you need **cron-like functionality**, use [Flowpack.Task](https://github.com/Flowpack/task) or [NeosRulez.Neos.Scheduler](https://github.com/patriceckhart/NeosRulez.Neos.Scheduler).

In case you need **something like a CI pipeline**, but within your project, use [Flowpack.Prunner](https://github.com/Flowpack/Flowpack.Prunner).

In case you need **a job queue**, either [roll your own with Redis](https://github.com/Flowpack/Flowpack.DecoupledContentStore/blob/91663455b1ff8d4c2a1f6186c78173e855f804e5/Classes/NodeRendering/Infrastructure/RedisRenderingQueue.php), or use [Flowpack.JobQueue](https://github.com/Flowpack/jobqueue-common).

### Flowpack.JobQueue

This is the oldest of the job queue packages and infrastructure, created by some core team members.

Job queues work well and support different storage backends - but it is not easily possible to use the specific features of individual queues. **Use this if you need flexibility on which backend system the queue is executed.**

Alternatively, you can of course also implement queues directly f.e. via Redis without any abstraction - this is the route done [here](https://github.com/Flowpack/Flowpack.DecoupledContentStore/blob/91663455b1ff8d4c2a1f6186c78173e855f804e5/Classes/NodeRendering/Infrastructure/RedisRenderingQueue.php).

*   [**Flowpack.JobQueue.Common**  
    Base Package containing the API](https://github.com/Flowpack/jobqueue-common)
*   [**Flowpack.JobQueue.Doctrine**  
    Doctrine DBAL storage for jobs](https://github.com/Flowpack/jobqueue-doctrine)
*   [**Flowpack.JobQueue.Redis**  
    Redis storage for jobs](https://github.com/Flowpack/jobqueue-redis)
*   [**Flowpack.JobQueue.Beanstalkd**  
    Beanstalkd storage for jobs](https://github.com/Flowpack/jobqueue-beanstalkd)
*   [**t3n.JobQueue.RabbitMQ**  
    RabbitMQ Storage for jobs](https://github.com/t3n/JobQueue.RabbitMQ)
*   [**Passcreator.JobQueue.GooglePubSub**  
    Google PubSub storage for jobs](https://gitlab.com/passcreator/passcreator.jobqueue.googlepubsub)
*   [**Netlogix.JobQueue.FastRabbit**  
    Low memory footprint worker for RabbitMQ jobs](https://github.com/netlogix/Netlogix.JobQueue.FastRabbit)

## Flowpack.Task

The package [Flowpack.Task](https://github.com/Flowpack/task) was created in 2021 and provides a simple to use task scheduler for Neos Flow for one-time or recurring tasks. **Tasks are configured via settings, recurring tasks can be configured using cron syntax.** 

Additionally, there is a backend module for seeing the task status in package [Wwwisision.Neos.TaskModule](https://github.com/bwaidelich/Wwwision.Neos.TaskModule).

*   [**Flowpack.Task**  
    Base Package containing the Task Runner](https://github.com/Flowpack/task)
*   [**Wwwision.Neos.TaskModule**  
    Backend module for showing the task status in Neos](https://github.com/bwaidelich/Wwwision.Neos.TaskModule)

## NeosRulez.Neos.Scheduler

The package [NeosRulez.Neos.Scheduler](https://github.com/patriceckhart/NeosRulez.Neos.Scheduler) was created in 2021 and allows to add and configure tasks completely via a Neos backend module, and not as Settings.

In this package, the script is entered directly in the Neos backend, whereas Flowpack.Task has the configuration of the script in Settings YAML.

*   [**NeosRulez.Neos.Scheduler**  
    Scheduler Package](https://github.com/patriceckhart/NeosRulez.Neos.Scheduler)

## Flowpack.Prunner

[Flowpack.Prunner](https://github.com/Flowpack/Flowpack.Prunner) was created in 2021 and is an embeddable task / pipeline runner for Neos and Flow. It is good for orchestrating long-running jobs with multiple steps; so if you think "I need a CI pipeline", but within your project, this is for you. For instance, [Flowpack.DecoupledContentStore](https://github.com/Flowpack/Flowpack.DecoupledContentStore) uses this.

The pipeline definition is done in a `pipelines.yml` file and is static. The package also contains a Neos backend module for observing the pipeline status.

For executing the pipelines, a lightweight [go-based daemon](https://github.com/Flowpack/prunner) needs to be installed on the server.

Prunner does not support Cron jobs as of now.

*   [**Flowpack.Prunner**  
    Neos/Flow package for Prunner API](https://github.com/Flowpack/Flowpack.Prunner)
*   [**prunner**  
    go-based executor](https://github.com/Flowpack/prunner/)