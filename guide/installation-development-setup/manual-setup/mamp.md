url: /guide/installation-development-setup/manual-setup/mamp
# MAMP Setup (Windows/macOS)

For Windows & macOS, using MAMP allows an easy start into Neos.

## What is MAMP

MAMP is a free, local server environment that can be installed under macOS and Windows with just a few clicks.

MAMP Pro adds some more features which can be useful when working on multiple projects at the same time.

## Step by Step Instructions

### 1\. Install MAMP or MAMP Pro

Download and install MAMP according to the instructions on [mamp.info](https://www.mamp.info/en/)

### 2\. Adjust the MAMP PHP configuration

Enable the OPcache feature which will speed up Neos:

![MAMP PHP configuration](/_Resources/Persistent/cd368897de042326486a355dfc25c30fb7a8cf85/MAMP%20PHP%20config.jpg)

Use the [supported PHP version](/guide/installation-development-setup/system-requirements) and change the Cache to OPcache

### 3\. Install composer if necessary

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

### 4\. Install Neos with composer

Open your terminal and go to the htdocs folder in your MAMP installation. On Mac OSX that would be in _"/Applications/MAMP/htdocs"_.

There run the following command:

```bash
composer create-project neos/neos-base-distribution neos-example
```

### 5\. Adjust the MAMP webserver configuration

Change the root folder for your project to the _"Web"_ subfolder of your new Neos project.

![MAMP webserver configuration](/_Resources/Persistent/381fbbdb941b6c1d8487650a680a6d5fa7aab274/MAMP%20Webserver%20config.jpg)

Change the root folder to the Web subfolder of Neos

### 6\. Visit the setup

Go to [http://127.0.0.1:8888](http://127.0.0.1:8888) in your browser and get redirected to the Neos setup.

Use **root** as username and **password** in the database screen. 

Use **127.0.0.1:8889** as database host.

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)

_Written by_ **Sebastian Helzle**