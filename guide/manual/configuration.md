url: /guide/manual/configuration
# Configuration

From database settings to image optimization and different environments

## Configuration Overview

Neos is not a single piece of software but assembled of several different packages. Each package brings it's own configuration keys. We store those settings in YAML files.

### How to write configuration?

All Neos and Flow packages use YAML files to describe their settings. This is the same configuration language that is used to define [NodeTypes](/guide/manual/content-repository/nodetype-definition).

```yaml
# This is an example for a YAML file.
# Those files end with .yml or .yaml

string1: Hello
string2: "Hello"
number: 1233
bool: true

# Both array definitions are equal.
Array:
  - First
  - Second
  - Third

Array: ["First", "Second", "Third"]

# This is a real example. It disabled the automatic
# logout after 60min of inactivity.
Neos:
  Flow:
    session:
      inactivityTimeout: 0

```

> **⚠️ YAML files have strict formatting rules.**
> 
> You have to get the formatting right. Whenever you are working with YAML files remember the following rules.

### Correct formatting of YAML files

1.  **Only whitespaces are allowed for indentation.** This is very important and the number one issue when something is not working. A single missing whitespace can break a whole config file.
2.  **Use two whitespaces to nest configuration keys.**
3.  Only UTF-8 as file encoding is allowed.

Tutorials Point has a [good introduction](https://www.tutorialspoint.com/yaml/yaml_quick_guide.htm) into the YAML file format.

### Where should I place my configuration?

Configuration changes can be made in several different places but everything lives inside one big configuration tree. There is no differentiation between different sites. If you need site specific configurations you need to set up two different Neos instances.

1.  `/Packages/Sites/<SiteName>/Configuration/`
2.  `/Configuration/`

Everything **related to a specific site** should be configured in the respective **site package**. General settings like database configurations should be in the global Configuration directory.

Neos is based on the Flow Framework. Be sure to check out the [official Flow docs](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Configuration.html).

### Checking your configuration

To check the finally used configuration use the `./flow configuration:show` command. By default, this command outputs all configuration - which is a lot. You can scope it to only show the specific configuration you are interested in.

```bash
#output all Flow configuration
./flow configuration:show
```

```bash
#output the database configuration only:
./flow configuration:show --type Settings --path Neos.Flow.persistence.backendOptions
```

### Which settings are available?

Currently, we do not have an extensive list of the configuration options. Although inconvenient, you can directly look in the base configuration files of each package. There are several important packages to look for:

1.  [Neos.Neos](https://github.com/neos/neos-development-collection/blob/master/Neos.Neos/Configuration/Settings.yaml) (the CMS itself)
2.  [Neos.Media](https://github.com/neos/neos-development-collection/blob/master/Neos.Media/Configuration/Settings.yaml) (the file and media management)

## Configuration Load Order and Hierarchy

### Load Order

The same configuration key can be used in different `Settings.yaml` files. Flow will use one specific configuration at the end. Which configuration is used, is dependent on the package load order. A package that is loaded later will overwrite the configuration (of the same key) of a package that was loaded earlier.

### Hierarchy

global context specific > local (package) context specific > global > local (package)

Package configuration is overwritten by global configuration. Context specific configuration overwrites global - unspecific - configuration. Global context specific configuration overwrites package configuration.

[![Neos Tutorial - Application Contexts & Configuration](/_Resources/Persistent/5e76780b583c3900e8be80013f53c3e01f9d3b16/Youtube-AgLxbMMOgg0-maxresdefault.jpg)](https://www.youtube.com/watch?v=AgLxbMMOgg0)

## Application Contexts

Neos and Flow configuration can be scoped to specific application contexts. This allows different configurations to be used e.g. in Production or Development. 

Neos and Flow ship with three predefined application contexts:

*   Development (default): optimized for development workflows with file watching and automatic cache deletion
*   Testing: used to run automated tests
*   Production: optimized for speed, a lot of caching, no file watching

To find out in which context your Neos or Flow application is running, execute `./flow`.

```bash
./flow

# output:
Neos 8.3.1 ("Development" context)
usage: ./flow <command identifier>

See "./flow help" for a list of all available commands.
```

### Run a command in a specific context

To run a Flow command in a specific context, prefix it with `FLOW_CONTEXT=[your context]`.

```bash
FLOW_CONTEXT=Production ./flow

#output:
Neos 8.3.1 ("Production" context)
usage: ./flow <command identifier>

See "./flow help" for a list of all available commands.
```

### Sub-Contexts

You can specify sub-contexts within the three application contexts.

For example `Development/Docker` for Docker specific configuration.

So configuration present in a `Settings.yaml` file in the `Configuration/Development/Docker` folder will only by used in the `Development/Docker` context. To use a sub-context specifically you can execute a flow command with `FLOW_CONTEXT=Development/Docker ./flow`.

```bash
FLOW_CONTEXT=Development/Docker ./flow

#output:
Neos 8.3.1 ("Development/Docker" context)
usage: ./flow <command identifier>

See "./flow help" for a list of all available commands.
```

## Troubleshooting

1.  **My configuration is not loaded.** If you placed your site package directly under `Packages/Sites` you may have an issue with the **loading order of the packages**. For this exact reason we [recommend a different approach](/guide/manual/dependency-management). A hotfix is to store your settings in the global Configuration folder. This is regarded as a bad practice and we recommend switching to the new approach as we may be removing support for storing packages directly in the file system.

## Further Reading

*   [Neos Configuration Reference](https://neos.readthedocs.io/en/stable/References/Configuration/Configuration.html)
*   [Flow Configuration Reference](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Configuration.html)
*   [Flow Application Context Reference](https://neos.github.io/flow/8.2/Neos/Flow/Core/ApplicationContext.html)
*   [My 10 most favourite Neos CMS settings you might not know yet](/tutorials/my-10-most-favourite-neos-cms-settings-you-might-not-know-yet)