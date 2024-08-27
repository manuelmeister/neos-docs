url: /guide/tooling/debugging
# Debugging

Neos is a complex system and making mistakes is normal. But how to get the system working again and what actually happened? Let's have a look at strategies for answering these questions and getting more confident in dealing with errors while working with Neos.

**Christian's talk from Neos Conference 2019 contains many valuable insights on this topic:**

[![Neos Con 2019 | Christian Müller: Debugging Neos CMS](/_Resources/Persistent/08bb483a8826da6ca4e468964f8bb322d2611c86/Youtube-LUFxfQYmcLo-maxresdefault.jpg)](https://www.youtube.com/watch?v=LUFxfQYmcLo)

> **ℹ️ You can help us!**
> 
> We would love to have the content of Christian's talk above in written form on this page. Please get in touch with us on [slack.neos.io](https://slack.neos.io) #guild-documentation if you want to help.

## Built-in Configuration Display and Validation

You can use the command `./flow configuration:show` and the `Administration -> Configuration` Module in Neos to see the merged configuration. Combined with `./flow package:list --loading-order`, you can debug loading order issues well.

Additionally, Flow and Neos ships with a [Configuration Schema language](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Configuration.html#configuration-validation) (adapted from JSON Schema) which can be used to validate the existing configuration via `./flow configuration:validate`. The Flow documentation furthermore contains [information how to write additional configuration schemata](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Configuration.html#configuration-validation).