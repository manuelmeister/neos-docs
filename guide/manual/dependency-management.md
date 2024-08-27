url: /guide/manual/dependency-management
# Depen­dency Manage­ment

Neos uses the defacto PHP standard for dependency management - **composer**. It allows you to declare the libraries your project depends on and it will manage (install/update) them for you.

Check out the [composer documentation for a general understanding](https://getcomposer.org/doc/00-intro.md).

In Neos, each project consists of one git repository for the root. This project can include third party packages via composer.

Each Neos project must have at least one **site package.**

In order to ease integration of Neos within the composer eco-system, we wanted to provide a standard solution for typical Neos projects to use a single git repository for developing multiple packages while fully embracing composer. This is what we describe on this page.

## The "Path Repository" Setup

To avoid problems with composer we propose a setup where the site package - and other project specific packages - are included in the repository but outside the "Packages" folder. It is then loaded via composer and a "path" repository type.

All packages you want to version together with the project distribution go to the _DistributionPackages_ folder. You then need to tell composer where these packages are in the _repositories_ part of your root _composer.json_ manifest.

Since your distribution packages do not have a version of their own – because they are in the same repository as the distribution – you need to require them as "**@dev**".

An example repository with this configuration can be found here: [https://github.com/kitsunet/composer-mono-project](https://github.com/kitsunet/composer-mono-project)

composer.json:
```javascript
{
    "name": "vendor/your-project-distribution",
    "description": "Describe your project here",
    "config": {
        "vendor-dir": "Packages/Libraries",
        "bin-dir": "bin"
    },
    "require": {
        "test/site": "@dev"
    },
    "repositories": {
        "distribution": {
            "type": "path",
            "url": "./DistributionPackages/*"
        }
    },
    "scripts": {
        "post-update-cmd": "Neos\\Flow\\Composer\\InstallerScripts::postUpdateAndInstall",
        "post-install-cmd": "Neos\\Flow\\Composer\\InstallerScripts::postUpdateAndInstall",
        "post-package-update": "Neos\\Flow\\Composer\\InstallerScripts::postPackageUpdateAndInstall",
        "post-package-install": "Neos\\Flow\\Composer\\InstallerScripts::postPackageUpdateAndInstall"
    }
}
```

With this configuration your _test/site_ package is installed via composer despite being in the same repository. Therefore composer picks up all dependencies of your site package.

We like this setup and consider it best practice for Neos projects. That also means we will over time adapt our distributions as well as tools to make use of such a setup.

If you are interested to read about the actual problems this setup solves, read our [blog article Project Repository Best Practice](https://www.neos.io/blog/project-repository-best-practice.html).

> **ℹ️ Future-Proofness**
> 
> Take note that in a future Neos version we might remove support for the old type of setup and only rely on composer for installing packages.

![best practice project repository](/_Resources/Persistent/d3dba79d2f8756c3e50499b85b4a02c08530aa74/best-practice-project-repository.png)

Best practice project repository