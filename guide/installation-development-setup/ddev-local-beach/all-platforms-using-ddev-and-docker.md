url: /guide/installation-development-setup/ddev-local-beach/all-platforms-using-ddev-and-docker
# Setup Neos with DDEV

For Windows, Mac OS and Linux, using DDEV can be a good way to move to a dockerized setup.

## What is ddev?

Ddev provides an easy to use and fast to setup development environment, based on docker and docker-compose.

*   [**DDEV on Github**](https://github.com/drud/ddev)
*   [**DDEV Website**](https://ddev.com/)
*   [**DDEV Documentation**](https://ddev.readthedocs.io/en/stable/)

## Step by Step Instructions

This tutorial describes how to put some parts of these caches inside the docker containers created by DDEV, so that the execution times are very acceptable and developing is fun.

### 1\. Install DDEV

`ddev` is a command line tool that has to be installed first.  
Please follow the [getting started guide to install DDEV](https://ddev.readthedocs.io/en/stable/) that has instructions for all common operating systems.

After that running the command `ddev` on your shell should give you a description of all available DDEV commands.

### 2\. Check out the project (or start from scratch)

Now, this part is different depending on whether you want to start from scratch, or you have an existing project you want to work on.

**From scratch**

**Start from Scratch:**

To create a new project, use the following commands, which will create the base directory structure and download all dependencies.

```bash
mkdir neos-example
ddev config
```

*   Give the project a name
*   as **Docroot Location**, enter _**Web**._ Choose yes to auto-create it.
*   as **Project Type**, choose _**php**._

If you're going to adjust ddev settings as shown in the next section **3\. Adjust ddev settings**, do it now, before creating the project structure with the following command:

```bash
ddev composer create neos/neos-base-distribution
```

Confirm that any existing contents in the project root will be removed, and grab a cup of tea while all the dependencies will be downloaded.

Now, it's the right time to create a new Git repository for your project and add everything to it.

```bash
git init
git add .
git commit -m "TASK: Initial Commit"
# optionally, also run "git remote add ..." and "git push"
```

**Existing project**

**Check out an existing project:**

To check out an existing project, simply clone it and  to install all dependencies.

```bash
git clone http://YOUR-PROJECT-URL-HERE your-project
cd your-project
ddev config
```

*   Give the project a name
*   as **Docroot Location**, enter _**Web**._ Choose to auto-create it.
*   as **Project Type**, choose _**php**._

If you're going to adjust ddev settings as shown in the next section **3\. Adjust ddev settings**, do it now, before running composer with the following command:

```bash
ddev composer install
```

### 3\. Adjust DDEV settings

The generated .ddev/config.yaml should be checked to ensure that a recent version of php and mariadb is used by ddev that matches the Neos requirements.

.ddev/config.yaml:
```yaml
php_version: "8.1"
database:
  type: mariadb
  version: 10.4
```

*   [**Neos System requirements**](/guide/installation-development-setup/system-requirements)

The following environment variables speed up Neos and configure it correctly - storing temporary files inside the container.

.ddev/config.yaml:
```yaml
web_environment:
 - FLOW_CONTEXT=Development/Ddev
 - FLOW_PATH_TEMPORARY_BASE=/tmp/Flow
 - FLOW_REWRITEURLS=1

```

### 4\. Adjust Neos settings

Neos supports so-called **Contexts**, which helps to separate different sets of settings for different environments. The instructions above set up Neos to run in context _Development/ddev._

By putting the the following Configuration file into the path _Configuration/Development/Ddev/Settings.yaml_ the necessary configuration to run Neos with ddev is added:

Configuration/Development/ddev/Settings.yaml:
```yaml
Neos:
  Imagine:
    driver: Imagick
  Flow:
    persistence:
      backendOptions:
        driver: pdo_mysql
        dbname: db
        user: db
        password: db
        host: db

    # The following is necessary to allow ddev to act as a proxy on your local machine
    http:
      trustedProxies:
        proxies: "*"

  # The following is optional, but will redirect all mails directly to ddev's MailHog
  SwiftMailer:
    transport:
      type: 'Swift_SmtpTransport'
      options:
        host: 'localhost'
        port: 1025
        encryption: ~
```

*   [Learn more about Neos Contexts](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartII/Configuration.html#contexts)

### 5\. Optimize performance for MacOS and Windows

On Linux DDEV/Docker can use the host filesystem directly but on other systems filesystem operations in docker tend to be very slow.

That is the reason why you have to take special measures to avoid slow execution times on macOS and Windows as Flow does some very resource intensive tasks involving lots of file IO. This includes scanning all the files and building various caches.

The DDEV documentation has a dedicated section about performance optimization that describes the necessary preparations for macOS and Windows to circumvent those problems.

*   [Learn more about optimizing ddev performance](https://ddev.readthedocs.io/en/latest/users/install/performance/)

DDEV supports mutagen and nfs syncing of the filesystem with the web container. You can enable both by using a local config.override.yaml file. This way coworkers without the need to use NFS, f.e. those working on linux, do not need to change the config file of ddev.

.ddev/config.overrides.yaml:
```yaml
# enable mutagen sync of the filesystem into the web container
mutagen_enabled: true

```

.ddev/config.overrides.yaml:
```yaml
# enable mounting the filesystem via nfs to avoid docker io performance issues
nfs_mount_enabled: true
```

### 6\. Start ddev

It's time to start DDEV. After the command has run through, you can open your website for the first time. It may take some time to load for the first hit as Neos needs to fill all the caches and the webcache (if enabled) needs to sync all files.

```bash
ddev start
```

### 7\. Run the setup tool

Now, you are ready to access the Neos instance in your browser and you will be redirected to the setup tool on the first run.

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)

## How to fine tune the setup?

### Run flow commands in the container

There are multiple ways, but the most convenient one is to implement a [ddev command](https://ddev.readthedocs.io/en/latest/users/extend/custom-commands/). You can either add it to the current project in `.ddev/commands/web/flow` or globally for all your ddev projects at `~/.ddev/commands/web/flow` 

.ddev/commands/web/flow:
```bash
#!/bin/bash

## Description: Run FLOW CLI (neos-flow) command inside the web container
## Usage: flow [args]
## Example: "ddev flow help"

./flow "${@}"

```

### Connecting to the container

Please use the following command to open an ssh connection to the container:

```bash
ddev ssh
```

### Using xdebug

If you want to use xdebug, you can enable and disable it easily with the following two commands:

```bash
ddev exec enable_xdebug
ddev exec disable_xdebug 
```

*   [_**Xdebug**_ **usage in DDEV Docs**](https://ddev.readthedocs.io/en/latest/users/debugging-profiling/step-debugging/)

### Using post start commands

You can set start up hooks in DDEV to speed up the first run and avoid any problems or solve them easier using **.ddev/config.yaml**:

.ddev/config.yaml:
```yaml
hooks:
  post-start:
  - exec: composer install
  - exec: ./flow neos.flow:package:rescan
  - exec: ./flow database:setcharset
  - exec: ./flow doctrine:migrate

```

### Working with older Neos/Flow versions

If you are using Flow 5.x, you are fine with the defaults for the PHP project type. If you are using Flow 4.x or lower you may need to adjust the PHP version in _.ddev/config.yaml_ to 7.1 or 7.0 - use the one your hosting provider supports!

## Further readings

*   [Creating a Neos Flow app with Fusion, AFX and DDEV tooling as a base for custom Neos extensions](/tutorials/creating-neos-flow-application-with-fusion-afx-and-ddev)

_Written by_ **Kay Strobach**