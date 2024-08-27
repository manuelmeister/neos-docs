url: /guide/installation-development-setup/manual-setup/manual-installation-with-a-web-server
# Manual Neos Setup on a web server 

## 1\. Install composer

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

## 2\. Check out the project (or start from scratch) 

Now, this part is different depending on whether you want to start from scratch, or you have an existing project you want to work on.

```bash
cd /your/htdocs/
```

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

## 3\. Virtual domain/host

Next set up a virtual domain/host in your webserver configuration

**Apache**

Set up a virtual host inside your Apache configuration. Set the _DocumentRoot_ to the _Web_ directory inside the Neos installation. Set the directive _AllowOverride_ to _ALL_ to allow access to .htaccess

Apache Configuration:
```apacheconf
NameVirtualHost *:80 # if needed

<VirtualHost *:80>
  DocumentRoot "/your/htdocs/Neos/Web/"
  # enable the following line for production context
  #SetEnv FLOW_CONTEXT Production
  ServerName neos.demo
</VirtualHost>

<Directory /your/htdocs/Neos/Web>
  AllowOverride All
</Directory>

```

Make sure that the _mod\_rewrite_ module is loaded and restart apache. For further information on how to set up a virtual host with apache please refer to the [Apache Virtual Host documentation](https://httpd.apache.org/docs/2.2/en/vhosts/).

**nginx**

Set up a server block inside your NginX configuration. Set the _root_ to the _Web_ directory inside the Neos installation.

NginX Configuration:
```bash

server {
  listen [::]:80;
  listen 80;
  server_name  daniel.lienert.cc;

  root   /your/htdocs/Neos/Web/;
  index index.php;
  
  location ~ /_Resources/ {
    access_log off;
    log_not_found off;
    expires max;

    if (!-f $request_filename) {
      rewrite "/_Resources/Persistent/([a-z0-9]{40})/.+\.(.+)" /_Resources/Persistent/$1.$2 break;
      rewrite "/_Resources/Persistent(?>/[a-z0-9]{5}){8}/([a-f0-9]{40})/.+\.(.+)" /_Resources/Persistent/$1.$2 break;
    }
  }

  location / {
    try_files $uri $uri/ /index.php?$args;
  }

  # Pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
  location ~ \.php$ {
    include        /usr/local/etc/nginx/fastcgi_params;
    try_files      $uri =404;
    fastcgi_pass   unix:/var/run/php-fpm/php-fpm.socket;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param  PATH_INFO         $fastcgi_path_info;
    fastcgi_param  FLOW_REWRITEURLS  1;
    fastcgi_param  FLOW_CONTEXT      Development;
    fastcgi_param  X-Forwarded-For   $proxy_add_x_forwarded_for;
    fastcgi_param  X-Forwarded-Port  $proxy_port;
    fastcgi_param  REMOTE_ADDR       $remote_addr;
    fastcgi_param  REMOTE_PORT       $remote_port;
    fastcgi_param  SERVER_ADDR       $server_addr;
    fastcgi_param  SERVER_NAME       $http_host;
    fastcgi_split_path_info ^(.+\.php)(.*)$;
    fastcgi_read_timeout         300;
    fastcgi_buffer_size          128k;
    fastcgi_buffers              256 16k;
    fastcgi_busy_buffers_size    256k;
    fastcgi_temp_file_write_size 256k;
  }
}
```

For further information on how to set up a virtual domain with nginx please refer to the [nginx documentation](https://www.linode.com/docs/websites/nginx/how-to-configure-nginx).

Add an entry to _/etc/hosts_ to make your virtual host reachable:

/etc/hosts:
```none
127.0.0.1	neos.demo
```

Make sure to use the same name you defined in _ServerName_ in the virtual host configuration above.

## 4\. Set file permissions

**Unix / Mac OS**

Set file permissions as needed so that the installation is read- and writeable by the webserver’s user and group:

```bash
sudo ./flow core:setfilepermissions john www-data www-data
```

Replace _john_ with your current username and _www-data_ with the webserver’s user and group.

For detailed instructions on setting the needed permissions see [Flow File Permissions.](http://flowframework.readthedocs.org/en/stable/TheDefinitiveGuide/PartII/Installation.html#file-permissions)

**Windows**

Setting file permissions is not necessary and not possible on Windows machines. For Apache to be able to create symlinks, you need to use Windows Vista (or newer) and Apache needs to be started with Administrator privileges.

## 5\. Visit the setup

Now, go to [http://neos.demo/setup](http://neos.demo/setup) in your browser, and you get redirected to the setup tool.

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)