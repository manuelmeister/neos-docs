url: /guide/installation-development-setup/docker-and-docker-compose-setup
# Docker and Docker Compose

Recommended setup for all platforms.

Docker is a lightweight way to put your application inside containers. With docker compose, you can very easily spin up a development environment containing Neos and a matching MySQL Database.

For development, we need to be able to change files inside the Neos application container. Thus, we **mount** the local directory inside the container.

On Windows and OSX, mounting a directory with loads of files (like a Neos / Flow distribution) is quite slow. That is why this approach **copies all Neos files into the container** and then we **selectively mount the directories** which we modify.

## Step by Step Instructions

> **ℹ️ PHP Version**
> 
> Be sure to have the **same PHP version** in your **composer** **container** as in your **PHP container**.

### 1\. Install composer and Docker

[Composer](https://getcomposer.org/) is the PHP dependency manager, similar to NPM for Node.js, or Maven for Java.

**Mac OS / Linux**

You'll only need PHP locally to run Composer - so e.g. the built-in PHP of Mac OS is totally fine. If you do not have a **php** executable available in your system, install it (through homebrew, APT, RPM). Then, install Composer:

```bash
curl -sS https://getcomposer.org/installer | php
```

By issuing this command, Composer will get downloaded as _composer.phar_ to your working directory. We suggest to have composer installed globally, so you can simply move it to a directory within your $PATH environment:

```bash
mv composer.phar /usr/local/bin/composer
```

Now **install Docker** on your operating system:

*   [**Install Docker for Mac**](https://docs.docker.com/docker-for-mac/install/)
*   [**Install Docker for Linux**](https://docs.docker.com/install/linux/docker-ce/debian/)

**Windows**

As installing Composer on Windows is some more work (install PHP, install Composer), here, we're demonstrating how you can use Composer through Docker as well.

> **💡 In case you already have composer installed...**
> 
> ... then it's easiest to just use it.  
> Simply run `composer create-project neos/neos-base-distribution` in your directory of choice, and continue with step 2.

First, **please install** [**Docker for Windows**](https://hub.docker.com/editions/community/docker-ce-desktop-windows)**.**  
If you have **Windows 10 Home install** [**Docker Toolbox.**](https://docs.docker.com/toolbox/toolbox_install_windows/)

After installing Docker, instead of running _composer_, you run the following command:

```bash
# instead of running "composer [sub-command]", run the following command:
docker run -v %cd%:/app -it --rm composer [sub-command]
```

On the first run, a notification pops up asking you for access to the drive – you need to press **Share it** here.

![](/_Resources/Persistent/e210491064167296f9227c1a86b505e6aec06953/40.114.211.213%202019-01-31%2015-55-48.png)

### 2\. Check out the project (or start from scratch)

Now, this part is different depending on whether you want to start from scratch, or you have an existing project you want to work on.

**From scratch**

**Start from Scratch:**

To create a new project, use the following commands, which will create the base directory structure and download all dependencies.

```bash
# with native Composer:
composer create-project neos/neos-base-distribution neos-example

# ALTERNATIVE, with Composer through Docker:
docker run -v .:/app -it --rm composer create-project neos/neos-base-distribution neos-example
```

We furthermore strongly recommend to directly create a new Git repository for making the installation reproducible:

```bash
cd neos-example
git init
git add .
git commit -m "TASK: Initial Commit"
# optionally, also run "git remote add ..." and "git push"
```

**Boilerplate**

**Start with a good boilerplate:**

The [Neos-Skeleton](https://github.com/code-q-web-factory/Neos-Skeleton) provides an easy and powerful start for new projects - beginner-friendly and highly scalable. It is frontend tooling agnostic.

On top, it adds well-tested community packages to provide everything you need for an amazing website.

**Features**

*   A powerful best practice layout rendering mechanism
*   Best practice folder and naming structure
*   A well-rounded set of packages to build typical websites

[\-> Steps to get started](https://github.com/code-q-web-factory/Neos-Skeleton/blob/master/docs/GETTING_STARTED.md#steps-to-get-started)

**Existing project**

**Check out an existing project:**

To check out an existing project, simply clone it and run _composer install_ to install all dependencies.

```bash
git clone http://YOUR-PROJECT-URL-HERE your-project
cd your-project

# with native Composer:
composer install

# ALTERNATIVE, with Composer through Docker:
docker run -v .:/app -it --rm composer install
```

> **ℹ️ Stick with your composer method**
> 
> Either consistently run Composer through docker, or on your local host; but do not mix these approaches during your project – lots of errors can occur when mixing this (see the FAQ below).

### 3\. Set up docker-compose

In your project, you need to create a Dockerfile.dev and a docker-compose.yml with the contents below:

Dockerfile.dev:
```none
FROM php:8.1-cli

RUN apt-get update \
    # install GraphicsMagick
	&& apt-get install -y \
		libgraphicsmagick1-dev graphicsmagick zlib1g-dev libicu-dev gcc g++ --no-install-recommends \
	&& pecl -vvv install gmagick-beta && docker-php-ext-enable gmagick \
    # pdo_mysql
    && docker-php-ext-install pdo_mysql \
    # redis
    && pecl install redis && docker-php-ext-enable redis \
	# intl
	&& docker-php-ext-configure intl && docker-php-ext-install intl \
    # cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/*


WORKDIR /app
EXPOSE 8081

# copy everything in the project into the container. This is what
# makes this image so fast!
COPY . /app

# start the dev server
CMD [ "./flow", "server:run", "--host", "0.0.0.0" ]

```

docker-compose.yml:
```yaml
# NEOS DEVELOPMENT ENVIRONMENT
#
# For instructions how to use docker-compose, see
# https://docs.neos.io/cms/installation-development-setup/docker-and-docker-compose-setup#docker-compose-cheat-sheet
version: '3.7'
services:
  # Neos CMS
  neos:
    build:
      context: .
      dockerfile: Dockerfile.dev
    environment:
      FLOW_CONTEXT: 'Development/Docker'
    volumes:
      - ./composer.json:/app/composer.json
      - ./composer.lock:/app/composer.lock
      - ./Configuration/:/app/Configuration/
      - ./DistributionPackages/:/app/DistributionPackages/
      # if you work on other packages, you need to add them here.

      # WARNING: you need to add all packages from Distribution packages here ONE BY ONE, see the notice below for explanation.
      - ./Packages/Sites/:/app/Packages/Sites/
    ports:
      - 8081:8081
  # DB
  db:
    image: mariadb:10.7
    environment:
      MYSQL_ROOT_PASSWORD: 'db'
    volumes:
      - db:/var/lib/mysql
    ports:
      - 13306:3306

volumes:
  db:

```

> **ℹ️ Warning: All the linked packages from DistributionPackages must be added to docker-compose.yml**
> 
> **See** [**Step 6 below**](#6-adjust-docker-compose-yml-when-creating-new-packages) **for a thorough explanation!**

### 4\. Build and Run

Now, it's time to build and start the container:

The command _docker compose build_ is creating the container (by executing everything in _Dockerfile.dev_), and adds all the Neos files into the container.

The command _docker compose up -d_ starts the container and mounts the folders specified in _docker-compose.yml_ section _services.neos.volumes_.

```bash
docker compose build
docker compose up -d
```

After a couple of seconds, your Neos instance is running.

You can view the log output of the Neos startup process with

```bash
docker compose logs neos -f
```

### 5\. Finish the setup

[Following Guide: Finish the setup](/guide/installation-development-setup/running-the-setup-tool)

### 6\. When creating new packages: adjust docker-compose.yml 

**This is needed for proper Windows support.**

When running an "ADD" directive in a Dockerfile, on Docker for Windows, this _copies the files_ instead of copying the Symlink.  
  
This has the effect that changes to these files (in _DistributionPackages_) do not appear inside the Docker container; f.e. modifications to the classes do not appear.  
  
To fix this, you need to add **every package** from **DistributionPackages** to the _volumes_ block of the _docker-compose.yml_ file.

##### Example

As an example, let's take the following file structure - we have a site package and a "normal" package in _DistributionPackages:_

```directory
.
├── DistributionPackages
│   ├── Your.SitePackage
│   ├── ...
│   └── Your.Other.Package
├── Packages
│   ├── Application
│   │   ├── Your.Other.Package -> ../../DistributionPackages/Your.Other.Package
│   └── Sites
│       └── Your.SitePackage -> ../../DistributionPackages/Your.SitePackage
├── ...
└── docker-compose.yml
```

Now, you need to adjust the following part in _docker-compose.yml:_

docker-compose.yml:
```yaml
# ...
services:
  neos:
    # ...
    volumes:
      # ...
      - ./DistributionPackages:/app/DistributionPackages/:cached
      - ./Packages/Sites/:/app/Packages/Sites/:cached

      # HERE, list all your ADDITIONAL packages from DistributionPackages, which are not installed in Packages/Sites
      - ./Packages/Application/Your.Other.Package/:/app/Packages/Application/Your.Other.Package/:cached
```

Finally, run _docker compose up -d_ again to restart the container with the new configuration.

## Docker Compose Cheat Sheet

1.  `**composer install**`
2.  `**docker compose build**`
3.  `**docker compose up -d**`
4.  `**docker compose exec neos /bin/bash**`
5.  `**docker compose stop**`
6.  `**docker compose rm -sfv**`
7.  `**docker compose exec neos cat /app/Data/SetupPassword.txt**`

#### Important ports

*   Neos can be accessed at [http://127.0.0.1:8081](http://127.0.0.1:8081)
*   The MySQL Database can be accessed at _127.0.0.1 Port 13306_

#### Starting Neos

```bash
# ensure that all source code in the container matches the local directory
docker compose build
# actually start the container
docker compose up -d
```

#### Stopping Neos

```bash
docker compose stop
```

#### Removing all containers

> **⚠️ Removes the database and all data!**
> 
> The following command removes the MySQL database **including its content** and also the uploaded files from Neos.  
> So you might want to do a Site export or a database dump beforehand.

```bash
docker compose rm -sfv
```

#### Viewing Neos Logs

```bash
docker compose exec neos tail -f /app/Data/Logs/System_Development.log
```

#### Entering the Container

```bash
docker compose exec neos /bin/bash
```

#### Running a Flow command

Replace _help_ in the command below with the Flow command you want to execute.

```bash
docker compose exec neos /app/flow help
```

#### Installing a new package through composer

Run your composer command as usual, adjust[**docker-compose.yml as explained in Step 6 above**](#6-adjust-docker-compose-yml-when-creating-new-packages), then [stop](#stopping-neos) the container, [build it and start it again](#starting-neos) again (as explained above).

## Docker & Windows FAQ

When running docker compose for Windows, you might get some errors -- this section should help diagnosing these kinds of problems.

#### I change things in the DistributionPackage, but the changes do not appear in my application.

See [Step 6 above](#6-adjust-docker-compose-yml-when-creating-new-packages) for a thorough explanation!

#### Neos container does not start: /usr/bin/env: 'php\\r': No such file or directory

This problem happens because Windows uses \\r\\n line endings; and the _flow_ executable script needs to have simply \\n line endings.

To fix this, set the line endings to \\n in Git. You can do this via one of the following ways:

*   In PHPstorm, File -> Line Separators -> LF (Unix)
*   _\[TODO insert command line explanations here\]_

#### DB Container does not start:  
Fatal error: Can't open and lock privilege tables: 'mysql.user' is not of type 'TABLE'

This error occurs when downgrading the mariadb version, and having run the Mariadb container beforehand.

To fix this, run _docker compose down -v_ do remove all containers **and their associated persistent volumes** and restart using _docker compose up -d_

#### There is just a file in Packages/Sites/...

When running composer through Docker, linux-symlinks are created - this means that on Windows, they do not appear as links in Explorer, but as simple files.

**This is the expected behavior. Inside the docker container, the symlink works properly.**

Simply edit your packages in _DistributionPackages/_ instead of _Packages/Sites_.

**Hint: When running Composer through Docker, you always need to run it through Docker in subsequent runs - otherwise Composer fails with weird issues (like the next bug)**

#### Composer Error: Packages/Sites/\[yourPackage\] does not exist and could not be created

This problem appears when running composer sometimes on windows, and sometimes through Docker.

To fix this, remove Packages/Sites/\[yourPackage\] and run _composer install_ again.