url: /guide/installation-development-setup/manual-setup/mac-os-linux-using-the-embedded-web-server
# Simple Setup (Linux/Mac OS)

On Mac OS X and Linux, using the embedded web server is the most convenient and easy option.

## 1\. Install PHP and MariaDB

**Mac OS**

For Mac OS, we suggest installing PHP through homebrew, so [you need to install it first](https://brew.sh).

Afterwards, run the following command to install PHP and MariaDB:

```bash
brew install php mariadb@10.3
```

Furthermore, we recommend to install [Sequel Ace](https://github.com/Sequel-Ace/Sequel-Ace), which is an open source database management tool for OSX - this helps to get a glance into the database.

**Debian**

On Linux, installing PHP and MariaDB is different depending on which distribution you have.

#### Install php

The following steps were written for **php 8.1** but should work for any previous or future php version. (Just make sure you 'fully' qualify your major php version to 2 digits and dot: '8.1').

_The Debian repository holds by experience never the latest php version but lacks a few releases behind. This guide will help you to install the latest php version. If you however wish to use the php version available via the Debian repository, skip the step below and use your php version in the further instructions. (Just be aware that those versions are most likely soon to be outdated and its worth to start using the latest php version.)_

If you want to check if a certain php version is already available on your system, use:

```bash
apt search php8.1
```

##### Add repository (for latest php version)

To be able to get a more **recent php version,** we need to use a **third party repository**. In this case, we will be using [DEB.SURY.ORG.](https://deb.sury.org/)

```bash
# (Update your system)
sudo apt update && sudo apt upgrade

# Transfer data safely (SSL) and more
sudo apt -y install apt-transport-https lsb-release ca-certificates wget

# Add GPG key
sudo wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg

# Add the DEB.SURY.ORG repository
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/php.list

sudo apt update

```

##### Install php 8.1

install the most common/required **php extensions** for the use with Neos:

```bash
sudo apt install php8.1 php8.1-{common,mbstring,mysql,xml,imagick,curl,intl,igbinary}
```

#### Install mariadb/mysql

MySQL was replaced with MariaDB in the Debian repository - so we will be using MariaDB. (Make sure if you are using an older Debian version, that your MariaDB version fullfills the [System Requirements](/guide/installation-development-setup/system-requirements))

```bash
sudo apt install mariadb-server

sudo service mysql start

# Answer all with (Y)es
sudo mysql_secure_installation

# Enter the MySQL Shell (ctrl+c to exit)
sudo mysql
```

**Database Setup**

#### Create a database user (MariaDB/MySQL)

You should create a new user instead of using the root user. See [\[SOLVED\] An exception occurred in driver: SQLSTATE\[HY000\] \[1698\] Access denied for user 'root'@'localhost'](https://discuss.neos.io/t/solved-an-exception-occurred-in-driver-sqlstate-hy000-1698-access-denied-for-user-root-localhost/5542)

```bash
# Enter the MySQL Shell (ctrl+c to exit)
sudo mysql
```

```sql
-- If you want to change the username, feel free to do so
CREATE USER 'neos'@localhost;

-- Let user have access to all databases and set user password
-- Reminder: Change the username if changed in the create command
-- You can change the password as well
GRANT ALL PRIVILEGES ON *.* TO 'neos'@localhost IDENTIFIED BY '123456';

-- Apply changes
FLUSH PRIVILEGES;

```

```bash
# Test the user
mysql -u neos -p
# -p will ask you to type in the password
```

#### Continue creating the database

Remember your chosen username and password for the upcoming database configuration.

You can create the necessary database via the visual [Setup Tool](/guide/installation-development-setup/running-the-setup-tool) or continue with the new CLI tool from _'neos/cli-setup'_. Use the `_./flow welcome_` command to get an overview of all the available setup commands.

There you can follow the steps or just execute `./flow setup:database` to get a database for your neos project.

## 2\. Install composer

**macOS/Linux**

[Composer](https://getcomposer.org/) is the PHP dependency manager, similar to NPM for Node.js, or Maven for Java. If you do not have it installed yet, you need to install it now because it is the way to install Neos then.

```bash
curl -sS https://getcomposer.org/installer | php
```

```bash
mv composer.phar /usr/local/bin/composer
```

You may **check** your composer's **version** by typing “**composer -V**” ...

*   [https://getcomposer.org/download/](https://getcomposer.org/download/) (see versions)
*   to "**self-update**" your composer itself to its latest version ...
*   [https://getcomposer.org/doc/03-cli.md#self-update-selfupdate-](https://getcomposer.org/doc/03-cli.md#self-update-selfupdate-) 

**Windows**

Please consult the [offical documentation](http://getcomposer.org/doc/00-intro.md#installation-windows) on how to install Composer on Windows.

## 3\. Check out the project (or start from scratch)

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

## 4\. Start "embedded server"

In your project directory, run the following command to start the embedded development web server:

```bash
./flow server:run

# After a while, the following is shown:
# Server running. 
# Please go to http://127.0.0.1:8081 to browse the application.
```

> **ℹ️ Info: Speed at first launch**
> 
> When executing ./flow server:run for the first time, it takes between 10 and 30 seconds until the server is fully started. This is because all classes are analyzed and precompiled on the initial start. On subsequent invocations, the server starts up in less than a second.

## 5\. Visit the setup

Now, open your "php embedded development server" at [http://127.0.0.1:8081](http://127.0.0.1:8081) in your browser and be redirected to the Neos Setup Tool.

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)