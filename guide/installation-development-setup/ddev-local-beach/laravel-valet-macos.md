url: /guide/installation-development-setup/ddev-local-beach/laravel-valet-macos
# Setup Neos with Laravel Valet

## What is Laravel Valet?

Laravel Valet is a advanced development environment for macOS using nginx

> **⚠️ Not available for Windows**
> 
> Laravel Valet is not available for Windows. If you are using Windows, i would recommend that you take a look at the other instructions in the documentation for installing Neos on Windows.

### Install Laravel Valet

Please go to the official Laravel Valet documentation for more information on how to install Laravel Valet on your system.

*   [Laravel Valet Documentation](https://laravel.com/docs/10.x/valet)

### Create your Neos Project

Create your Neos Project with Composer

```bash
composer create-project neos/neos-base-distribution .
```

### Serve your project

In your Project Directory, you can run the following command to make sure that your project can be served from Laravel valet.

~/Sites/your-project:
```bash
valet link
```

If everything worked, you can access your project at the URL `your-project.test`.

### Secure your project

Laravel Valet makes it very easy for you to assign an SSL certificate to your project.

~/Sites/your-project:
```bash
valet secure
```

### Change your TLD

Laravel uses dnsmasq which makes it really easy, to change the top-level-domain of your project.

~/Sites/your-project:
```bash
valet domain local
```

After the command is executed, nginx and dnsmasq will be restarted. If everything has worked, your project should be accessible under the new domain.

### Running the Setup Tool

The last step would be to install Neos itself. For this, you can take a look at the instructions for the setup tool.

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)

_Written by_ **Simon Krull**