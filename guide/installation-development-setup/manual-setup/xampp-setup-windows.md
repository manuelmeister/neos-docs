url: /guide/installation-development-setup/manual-setup/xampp-setup-windows
# XAMPP Setup (Windows)

Popular PHP development environment

## What is XAMPP

XAMPP is a completely free, easy to install Apache distribution containing MariaDB, PHP, and Perl. The XAMPP open source package has been set up to be incredibly easy to install and to use.

## Step by Step Instructions

### 1\. Install XAMPP

Download and install **XAMPP** from [**apachefriends.org**](https://www.apachefriends.org/download.html) as instructed.

At the end of the installation, you will be suggested to run '**Control Panel**'. Do it, but don't rush to start **Apache** :).

> **ℹ️ Notice**
> 
> Be aware that latest **XAMPP** builds use **MariaDB 10.4**. But, to work with Neos, you will need **XAMPP** with **MariaDB 10.3** or earlier.  
>   
> The last builds with **MariaDB 10.3** are: [**7.3.7**](https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/7.3.7/), [**7.2.20**](https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/7.2.20/), [**7.1.30**](https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/7.1.30/).

### 2\. Install Composer

If you haven't installed **composer** yet, go to [**getcomposer.org**](https://getcomposer.org/download/) and follow the instructions. Get back to this guide once you finish installing it.

### 3\. Configuration

#### 3.1. Hosts

This file contains the mappings of IP addresses to host names. Usually, it can be found under: `_**C:\Windows\System32\drivers\etc\hosts**_`

This file needs to be opened with **administrative privileges** to be able to save it.

Each entry in this file should be kept on an individual line. The IP address should be placed in the first column followed by the corresponding host name. The IP address and the host name should be separated by at least one space.

This means that the **host name** for your locally deployed Neos site and its **IP address** could be:

`**my.site 127.0.0.2**`

> **ℹ️ localhost**
> 
> To reduce the possibility of configuration errors and conflicts, it is suggested not to use the **localhost** host name to access your locally deployed sites

> **💡 Tip**
> 
> Should you wish to have several different **Neos** distributions (or other projects), you better put them into **different folders** and assign corresponding **host names with a unique IP address** like  
> `other.site 127.0.0.3`  
> and so on.

#### 3.2. Virtual Hosts

Let's open `**httpd-vhosts.conf**` file with any decent text editor and add a **virtual host** with name `**my.site**` to the configuration.

By default, this file can be found under:  
`**C:\xampp\apache\conf\extra\httpd-vhosts.conf**`

The configuration will look like this:

Sample Virtual Host configuration:
```apacheconf
<VirtualHost 127.0.0.2:80>
	ServerName my.site
	DocumentRoot "c:/xampp/htdocs/mySite/Web"
	<Directory "c:/xampp/htdocs/mySite/Web/">
		Options +Indexes +Includes +FollowSymLinks +MultiViews
		AllowOverride All
		Require local
	</Directory>
</VirtualHost>

```

After saving the `**httpd-vhosts.conf**` file, we are ready to start our server. But don't do it yet, because we need to install **Neos** first :).

### 4\. Installing Neos via Composer

Open any **Terminal** (_like Command Prompt, Windows PowerShell or any other command-line application_) and go to the **htdocs** folder in your **XAMPP** installation. By default, it is `**C**_**:/xampp/htdocs/**_`, but it definitely depends on where you installed **XAMPP**.

In the last step we configured a **virtual host** pointing to the `**mySite**` folder, so run the following command:

Terminal command:
```bash
composer create-project neos/neos-base-distribution mySite
```

### 5\. XAMPP Control Panel

If you did everything correctly, it is now time to start Apacheand MySQL.

Open the **XAMPP Control Panel** and click on **Start** buttons (_Actions column_) right to Apache and MySQL signs (_Modules column_).

If you are using any kind of **Firewall** application, you will/should be asked to let these modules access the network. **Give them access**.

Once started, the Apacheand MySQLsigns will have a green background.

### 6\. Neos Setup

Now, open your favorite browser and visit: [http://my.site/setup](http://my.site/setup)

Use **root** as username and an empty password (_by default for XAMPP_) in the database screen.

Use **127.0.0.1** as database host.

Following the instructions on the screen will most likely get you to your first Neos site, but if something goes wrong, just follow the link below for explanations:

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)