url: /guide/installation-development-setup/system-requirements
# System Requirements

PHP & MySQL or PostgreSQL

## PHP

We recommend the newest released PHP version, as it is generally faster than the version before.

##### Supported versions

| Neos version | Flow version | compatible PHP version |
| --- | --- | --- |
| 5.3* | 6.3* | 7.2 - 7.4* |
| 7.x | 7.x | 7.3 - 7.4* / 8.0 - 8.1 |
| 8.x | 8.x | 8.0 - 8.1 |

\* see danger notice below

We recommend using the latest PHP version supported by the Neos version. Furthermore, we strongly recommend ensuring that the PHP version is [supported by PHP](https://www.php.net/supported-versions.php) or your distribution.

> **🚨 PHP 7.x out of security support**
> 
> As PHP 7.x has reached its end of life, we strongly recommend to update your Neos installation to a version that runs on PHP 8. 

##### Unsupported versions

| Neos version | Flow version | compatible PHP version |
| --- | --- | --- |
| 1.3 | 2.3 | 5.3 - 7.0 |
| 2.x | 3.x | 5.5 - 7.0 |
| 3.x | 4.x | 7.0 - 7.3 |
| 4.x | 5.x | 7.1 - 7.4* |
| 5.0 - 5.2 | 6.0 - 6.2 | 7.2 - 7.4 |

\*PHP 7.4 support was introduced with Neos 4.3.16/Flow 5.3.9.

For security reasons, unsupported versions should be upgraded at the earliest convenience.

##### php.ini

*   PHP modules mbstring, tokenizer, xml and pdo\_mysql
*   PHP functions exec(), shell\_exec(), escapeshellcmd() and escapeshellarg()
*   It is recommended to install one of the PHP modules VIPS, imagick or gmagick. We also support GD (but it is quite slow, so we do not recommend it for production).

For security reasons, unsupported versions should be upgraded at the earliest convenience.

> **⚠️ Ensure your PHP CLI version matches the PHP web server version.**
> 
> If you run PHP together with Apache or Nginx, you need to ensure that the corresponding PHP CLI (Command Line) version is installed as well, as we require it to precompile classes properly. **Neos won't work without this!**

## Database

*   **MySQL > 5.7.7**
*   **MariaDB > 10.2.2** 
*   **PostgreSQL > 9.4**

are supported.

Other databases [supported by Doctrine DBAL](http://www.doctrine-project.org/projects/dbal.html) should generally work, but we do not officially support them.

> **ℹ️ DB compatibility notes**
> 
> *   When running MySQL or MariaDB, be aware that the most recent versions of Neos and Flow require at least **MariaDB 10.2.2** or **MySQL 5.7.7**.
> *   If you run into errors like "Specified key was too long" with MySQL or MariaDB even though you have the required version, make sure you are using the _DYNAMIC_ or _COMPRESSED_ [row format](https://dev.mysql.com/doc/refman/5.7/en/innodb-row-format.html). 
> *   When running **PostgreSQL 10** or higher, you need at least Flow 5.0 (which means Neos 4.0). For older versions, only PostgreSQL 9.4 – 9.6 are supported.

## Web server

*   Apache
*   Nginx

For development you can also use the [embedded PHP server](https://www.php.net/manual/en/features.commandline.webserver.php). For production, you need one of the above two webservers

> **ℹ️ Develop locally, deploy to live**
> 
> We suggest that you develop on your local machine, **not directly on a remote web server**. Then, use Git and some kind of deployment process to deploy your code to a production server.

*   [IDE "Fusion Plugins" (Neos Discuss)](https://discuss.neos.io/t/development-tools/4037)

#### Supported Graphic Libraries

*   PHP-GD2
*   ImageMagick
*   GraphicsMagick
*   VIPS

## How do you want to install it?

*   [**Docker Setup (recommended)**  
    Containerized setup with Docker Compose](/guide/installation-development-setup/docker-and-docker-compose-setup)
*   [**Specialized Development Environment**  
    Platforms like DDEV, Local Beach & Valet](/guide/installation-development-setup/ddev-local-beach)
*   [**Manual Setup**  
    MAMP, XAMPP or Webserver](/guide/installation-development-setup/manual-setup)