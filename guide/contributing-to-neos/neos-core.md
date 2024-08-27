url: /guide/contributing-to-neos/neos-core
# Neos Core

## Installing Neos Dev

Contributing to Neos is easier than ever! Thanks to the user-friendly interface of GitHub and the always active community on Slack we are happy to help you if you want to contribute some code, let it be bugfixes, features or other! Any help is appreciated!

### Getting Started Screencast

We've prepared a screencast to help you get started with contributing to Neos. It will give you an overview about the structure of the Neos repositories and the intention behind it, as well as guide you on how to create your first pull request.

[![Getting Started With Contributing to Neos](/_Resources/Persistent/fb6086dd438a1de0b5914ab9b46fd3554d21f7c9/Youtube-cwBd7qN2q6I-maxresdefault.jpg)](https://www.youtube.com/watch?v=cwBd7qN2q6I)

### Neos on GitHub

All packages maintained by the Neos team are bundled in the [Neos organisation on GitHub](https://github.com/neos/). It's [members](https://github.com/orgs/neos/people) have read and write access to all repositories of the organisation and can create new repositories as needed. To keep things simple, there are no further teams or distinctions when it comes to permissions. The exception to prove the rule is the "Owner" role, which not everyone has. If there is anything you need which only an owner can do, contact us via [#guild-ops](https://neos-project.slack.com/messages/guild-ops/) in Slack.

The repositories on GitHub are your average git repositories and the usual way of working with them applies. Again, of course there is an exception. Some repositories for single packages (Flow, Fluid, Neos, Fusion and others) are marked as read-only. These exist only to "feed" Packagist to enable installation of those packages via Composer. The development of those packages happens in monolithic repositories for [Flow](https://github.com/neos/flow-development-collection) and [Neos](https://github.com/neos/neos-development-collection) we call "development collections". [Pull requests](https://github.com/pulls?q=is%3Apr+user%3Aneos) (Github login required) are created against those and whenever something is merged the read-only repositories are updated automatically.

### Quick Start

#### Docker Setup

For instructions on specialized development environments based on docker like DDEV or Flownative Beach see [Specialized Development Environment](/guide/installation-development-setup/ddev-local-beach).

For instructions on how to install Docker on your system see [Install Docker](/guide/installation-development-setup#1-install-docker).

```bash
git clone git@github.com:neos/neos-development-distribution.git

cd neos-development-distribution

docker compose up
```

This will do the following things:

1.  Starts a database container in Docker
2.  Starts a PHP Neos container
3.  Runs Composer install in PHP container
    *   Install all `"neos/*"` packages as source
4.  Initializes database
5.  Creates Neos instance based on Neos.Demo with default settings
6.  Creates a admin user with username "admin" and password "password"
7.  Starts the Neos instance on [localhost:8081](localhost:8081)

> **ℹ️ For detailed information have a look at:**
> 
> `/docker/Dockerfile` : building the Neos Docker container image  
> `/docker/entrypoint.sh` : executed when container starts  
> `/docker-compose.yml` : Docker Compose setup  
> `/Configuration/Development/Docker/Settings.yaml` : default Neos Settings

#### Join a Code Sprint!

Even if you do not know any team members personally: [Join a sprint](https://www.neos.io/events.html)! You will [learn, meet us in person and hopefully have a lot of fun](http://dimaip.github.io/2014/10/05/the-code-sprint/). Just imagine how easy problems get if there is always someone in the room to ask and discuss.

#### Start Coding

You want to known the details: scroll down to the basics section for the required tools and frameworks.  
You want to get your hands dirty first: read ahead!

##### Setup a local Web Server

1.  Install [MySQL](https://www.mysql.com/) or [PostgreSQL](http://www.postgresql.org/)
2.  [Install PHP](http://php.net/manual/en/install.php) according to our [requirements](http://flowframework.readthedocs.org//en/stable/TheDefinitiveGuide/PartII/Requirements.html)

##### Checking out the Code Base

```bash
mkdir -p /your/local/path
cd /your/local/path
git clone https://github.com/neos/neos-development-distribution.git
cd neos-development-distribution
curl -s https://getcomposer.org/installer | php
php composer.phar install
./flow server:run & echo "Open http://localhost:8081/setup and follow the instruction on the screen"
```

Check out our [online documentation](http://neos.readthedocs.org/en/stable/GettingStarted/Installation.html) if you want to know what the commands do.

### Basics

If you want to start to program you should get roughly familiar with the used tools and programming languages. Note that PHP is used on the backend, and JavaScript for the in-place editing UI.

#### Programming Languages

*   [PHP](http://php.net/manual/en/getting-started.php)
*   [JavaScript](https://developer.mozilla.org/en-US/Learn/Getting_started_with_the_web/JavaScript_basics), especially [ECMAScript6](http://www.2ality.com/2015/08/getting-started-es6.html)

#### Development Tools

*   [git](http://pcottle.github.io/learnGitBranching/) to synchronize file changes with others
*   [github.com](http://readwrite.com/2013/09/30/understanding-github-a-journey-for-beginners-part-1) as git platform
*   [hub](https://github.com/github/hub) to easy access github from the command line
*   [composer](https://getcomposer.org/doc/00-intro.md#using-composer) for managing dependencies between different packages in different git repositories
*   [npm](http://www.sitepoint.com/beginners-guide-node-package-manager/) / [nvm](https://davidwalsh.name/nvm) to manage JavaScript dependencies

## Contribution Workflow

### Contribute Changes

1.  Create a **Fork**
    *   git remote add fork git@github.com:your-github-fork
    *   https://help.github.com/en/articles/fork-a-repo
2.  **Branch off** for every PR you want to create
    *   git checkout -b dev-your-new-feature-or-bug-fix
    *   this keeps the version branches within your fork "clean"
    *   put "fixes [#1234](https://github.com/neos/neos-development-collection/pull/1234)" into the PR message body (helps identifying)
    *   so, the 'third-party-contribution' is more identifiable/isolated for whatever happens after initial PR ...
3.  Checkout the **lowest** **maintained** version (concerned by your issue)
    *   do your changes in the lowest maintained branch, - NOT in the master
    *   \--> [Release Roadmap](https://www.neos.io/download-and-extend/release-process.html) 
4.  Make your changes
    *   feature
    *   bugfix
    *   ...
5.  **Commit**
    *   [Coding Guide Lines: COMMIT messages](https://flowframework.readthedocs.io/en/latest/TheDefinitiveGuide/PartV/CodingGuideLines/PHP.html#commit-messages) 
    *   git commit -m "[a nice message](http://flowframework.readthedocs.org/en/latest/TheDefinitiveGuide/PartV/CodingGuideLines/PHP.html#commit-messages)"
6.  **Push** fork
    *   git push fork
7.  Create a PR (=[**Pull Request**)](https://help.github.com/articles/creating-a-pull-request/)
8.  Eventually ToDo's **after** the successful merge
    *   merged branch can be deleted in 'my fork'
    *   "**close**" the related **issue** (if not already done automatically)
    *   "**don't touch**" already **closed PR**s ([#xxxx](https://github.com/neos/neos-development-collection/pull/2188) which were errored) as they are in the main branches ...

*   [Contribute Features, Bugfixes,   
    Report issues](https://www.neos.io/contribute/developing-neos.html)
*   [Development workflow for GitHub](https://discuss.neos.io/t/development-workflow-for-github/428)

## Style Guides

To have a clear and focused history of code changes is greatly helped by using a consistent way of writing commit messages. Because of this and to help with (partly) automated generation of change logs for each release we have defined a fixed syntax for commit messages that is to be used.

*   [Commit Message Style](https://discuss.neos.io/t/commit-message-style/507)
*   [Coding Guide Lines: COMMIT messages](https://flowframework.readthedocs.io/en/latest/TheDefinitiveGuide/PartV/CodingGuideLines/PHP.html#commit-messages)
*   [Publications Style Guide](https://flowframework.readthedocs.io/en/stable/StyleGuide/index.html)

## Releasing

*   [Neos Travis (Continuous Integration for Neos-Development)](https://travis-ci.org/neos/neos-development-collection/branches)
*   [Doing Neos releases](/guide/contributing-to-neos/neos-core/doing-neos-releases)