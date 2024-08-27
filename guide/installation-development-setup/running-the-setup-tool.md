url: /guide/installation-development-setup/running-the-setup-tool
# Running the Setup Tool

Finish your Neos Setup

When the development server is running, you can complete your Neos Setup either via the command line (recommended!) or via the web UI. This guide explains the different steps of the Setup Tool.

## Using the command line (recommended)

With your Neos running, execute the following command to display the necessary setup steps:

```bash
./flow welcome 

OR in a docker compose environment:

docker compose exec neos /app/flow welcome
```

In a docker compose environment you can either execute the flow commands from outside the container or within the container. For example:

```bash
from outside the container: docker compose exec neos /app/flow welcome

enter the container with: docker compose exec neos /bin/bash
afterwards execute the flow commands like locally: ./flow welcome
```

Which outputs the following information:

```bash

    ....######          .######
    .....#######      ...######
    .......#######   ....######
    .........####### ....######
    ....#......#######...######
    ....##.......#######.######
    ....#####......############
    ....#####  ......##########
    ....#####    ......########
    ....#####      ......######
    .#######         ........

Welcome to Neos.


The following steps will help you to configure Neos:

1. Configure the database connection:
   ./flow setup:database
2. Create the required database tables:
   ./flow doctrine:migrate
3. Configure the image handler:
   ./flow setup:imagehandler
4. Create an admin user:
   ./flow user:create --roles Administrator username password firstname lastname
5. Create your own site package or require an existing one (choose one option):
   - ./flow kickstart:site Vendor.Site
   - composer require neos/demo && ./flow flow:package:rescan
6. Import a site or create an empty one (choose one option):
   - ./flow site:import Neos.Demo
   - ./flow site:import Vendor.Site
   - ./flow site:create sitename Vendor.Site Vendor.Site:Document.HomePage
```

### 1\. Configure database connection

You can use the following database credentials for a Neos Demo:

*   **host**: _db_
*   **user**: _root_
*   **password**: _db_
*   **database:** _db_

```bash
./flow setup:database

DB Driver (pdo_mysql):
  [pdo_mysql] MySQL/MariaDB via PDO
 >
# [press ENTER to use MySQL]
Host (): #enter your database hostname
Database (): #enter your database name
Username (): #enter your database username
Password (): #enter your database user's password

# output:

Database [your database name] was connected sucessfully.

Neos:
  Flow:
    persistence:
      backendOptions:
        driver: pdo_mysql
        host: [your database hostname]
        dbname: [your database name]
        user: [your database username]
        password: [your database user's password]
```

### 3\. Configure the Image Handler 

```bash
./flow setup:imagehandler
Select Image Handler (Gmagick):
  [Gmagick] Gmagick php module
 >
# [press ENTER to use the proposed image handler]
# output:

Neos:
  Imagine:
    driver: Gmagick

The new image handler setting were written to Configuration/Settings.Imagehandling.yaml
```

### 5\. Site package configuration 

Execute the composer command with your [previously chosen method](/guide/installation-development-setup/docker-and-docker-compose-setup): either through docker, or on your local host.

### 7\. Setup complete

**Congratulations! You successfully installed Neos.**

You now have several options to proceed:

*   Read the [documentation](/guide/manual)
*   Read about [application contexts](/guide/manual/configuration)
*   Go to the [frontend](http://127.0.0.1:8081)
*   Go to the [backend](http://127.0.0.1:8081/neos)

![Neos Demo Site frontend welcome page](/_Resources/Persistent/76ae95f3fa760c0e536b73fde74072002719148a/Neos_83-Demo_SetupSuccessful-1920x1384.jpg)

## Using the web UI

> **⚠️ Currently broken!**
> 
> The Setup via the web UI is currently broken. You need to configure your database connection via the command line first.   
> Afterwards you can use the web UI Setup.

visit the setup tool using **http://your-server-base-url/setup**.

### 1\. Welcome Screen

After you have installed Neos for the first time locally, you will be prompted to visit http://your-server-base-url/setup.

Typically it will be: [**http://127.0.0.1:8081/setup**](http://127.0.0.1:8081/setup)

A check for the basic requirements of Flow and Neos will be run. If all is well, you will see a login screen. If a check failed, hints on solving the issue will be shown and you should fix what needs to be fixed. Then just reload the page, until all requirements are met.

**Click "Go to setup" to proceed**

![](/_Resources/Persistent/595e5312c9afafd5a436ec7e8b88f9bf65af68f1/Step-1-Neos-Setup-Tool-1920x1160.png)

_Due to an unfinished setup, the technical Information will typically show some errors, that can be ignored._

### 2\. Initialising Neos Setup

After you hit "Go to setup" the Neos Setup will initialise for the first time.

![](/_Resources/Persistent/4f6becb4dafd2bd5e7916594786b23112b347c1c/Step-2-Neos-Setup-Tool-1920x1160.png)

### 3\. Setup Password

The login screen will tell you the location of a file with a generated password. Keep that password in some secure place, the **generated file will be removed upon login**! It is possible to have a new password generated if you lost it.

1.  Look for the **SetupPassword.txt** file which contains your setup password
2.  Paste the password
3.  Click "login" to proceed

```bash
docker compose exec neos cat /app/Data/SetupPassword.txt
```

![](/_Resources/Persistent/0de26ba67f0627571a9017eb4e2b35703ebd0648/Step-3-Neos-Setup-Tool-1920x1160.png)

### 4\. Neos Requirements Check

Neos now checks, if an image manipulation software is installed that can be used. It will also automatically select the best option for you.

**Click "Next" to proceed**

![](/_Resources/Persistent/68e8e7984552db0feedc85a9accb97b6b256be15/Step-4-Neos-Setup-Tool-1920x1160.png)

### 5\. Configure Database

The next step is all about the used database. In our example we use MySQL.

**Fill in the database credentials.**

> **ℹ️ Localization**
> 
> Configure your MySQL server to use the `utf8_unicode_ci` collation by default if possible!

![](/_Resources/Persistent/17aee21258948531510599b3f0b3ea58a2b5d827/Step-5-1-Neos-Setup-Tool-1920x1160.png)

If the connection was established successfully, the info box will be updated and shows accessible **databases to choose from, or you can create a new one**.

![](/_Resources/Persistent/3523995065d7f9c929dfb8fd3072e26932efac1a/Step-5-2-Neos-Setup-Tool-1920x1160.png)

![](/_Resources/Persistent/4cc2a2e9131175d179cb54454800cd5253672d31/Step-5-3-Neos-Setup-Tool.png)

In most cases it is useful to **create a new database, choose a name and proceed with "Next".**

![](/_Resources/Persistent/d1e15e5060abe85fc98e2f53ca864471e32cbd91/Step-5-4-Neos-Setup-Tool-1920x1160.png)

### 6\. Create Administrator Account

This step creates an initial user with administrator privileges.

![](/_Resources/Persistent/1c119bf57631c8ed084331bfe5ad39d91f285cc3/Step-6-1-Neos-Setup-Tool-1920x1160.png)

**Enter your prefered credentials** and **proceed with "Next".**

![](/_Resources/Persistent/d66532db597cb92557395fde7cb52efe48b2eaea/Step-6-2-Neos-Setup-Tool-1920x1160.png)

### 7\. Create a new Site

One last step, before you can start:

*   Import a Site from existing site package (e.g. Neos Demo Package)
*   Create a new Site Package with a "dummy" Site

### 7.1 Import a Site from existing site package 

Use the provided **Neos.Demo site package, if you want to try Neos and have a basic styling** of all the provided NodeTypes like Headline, Text, Image and so forth.

![](/_Resources/Persistent/c9eca630fcc0ddb6ef59aefd9f68f502eee952fd/Step-7-1-Neos-Setup-Tool-1920x1160.png)

> **ℹ️ Neos.Demo Site**
> 
> If you install the Neos demo site and it is publicly accessible, make sure the “Try me” page in the page tree is not publicly accessible because it has a form allowing users to create backend editor accounts with rights to edit website content.)

### 7.2 Create a new Site Package with a "dummy" Site

**Create a new site package, if you want to start a clean install of Neos** (without any CSS), creating a new site package is for you.

> **ℹ️ Dummy/Empty Site Package**
> 
> If you start empty, you start empty. Seems odd, true. Here is why:  
>   
> If you start with a clean site package, you will see some basic NodeTypes like Columns, YouTube, Headline, Text, Image, etc. But they will have no styling and will throw an exception in the Neos backend.  
>   
> Neos only provides building blocks and wants to give you full control over the complete styling of those elements. So there is **no default CSS provided**.   
>   
> **Why not add some basic CSS styling?**  
> It is not an easy task to solve. If some basic CSS would be added, it would be a breaking change for people that expect it not to be there. Additionally those elements would probably not be really best practice.  
>   
> **If you want basic styling, the demo site is for you**. Nevertheless, our best practice usually suggests to build elements from scratch (with the help of existing mixins for example) to have full control.

![](/_Resources/Persistent/79e9aef510dd13bdba9b077712c13f4ef14bad74/Step-7-2-Neos-Setup-Tool-1699x956.png)

### 8\. Setup complete

**Congratulations! You successfully installed Neos.**

You now have several options to proceed:

*   Read the [documentation](/guide/manual)
*   Read about [application contexts](/guide/manual/configuration)
*   Go to the [frontend](http://127.0.0.1:8081)
*   Go to the [backend](http://127.0.0.1:8081/neos)

![](/_Resources/Persistent/b5a17922a8fabf8bb3153d27c0fcc548af055251/Step-8-Neos-Setup-Tool-1920x1160.png)