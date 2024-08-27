url: /guide/tooling/development-helper-packages
# Debug Helpers

On this page, we list various packages which help with debugging and profiling a Neos/Flow installation.

## [Content Repository Debugger](https://github.com/Sebobo/Shel.ContentRepository.Debugger)

This package by Sebastian Helzle allows to output the Node Types of your Neos CMS project as various types of graphs via a backend module.

It helps understanding dependencies between packages and nodetypes. Also it shows which nodetypes are actually being used and can make your refactoring our code structuring efforts easier.

![](/_Resources/Persistent/43b1728005e8679749e48b3c7141863997db1fd8/NodeTypeAnalyzer.png)

a view of the node types of different packages

## [Neos Terminal](https://github.com/Sebobo/Shel.Neos.Terminal)

This package by Sebastian Helzle allows to interact with Neos through a terminal, f.e. to evaluate Eel expressions in the current context or repairing Nodes.

![](/_Resources/Persistent/7491417bb35cdbca3c93d11126bccaa06b3df8e2/shel-neos-terminal-example.jpg)

a view of the node types of different packages

## [t3n.Neos.Debug](https://github.com/t3n/neos-debug)

This package is a helper package to add a debug panel to your Neos CMS website. At this point in time you're able to:

*   debug your content cache configuration
*   debug SQL queries

Additionally, the Server-Timing http header can be enabled that will add request timings to responses, which Those then can be viewed in the browser network tab.

## [Sandstorm.Plumber](https://github.com/sandstorm/Plumber)

This package by Sebastian Kurfürst is a profiling and tracing GUI for Neos and Flow. It supports the following features:

*   **list** all profiling runs in an overview
*   show a **graphical timeline** for a single profiling run
*   **filter** the graphical timeline
*   show the **xhprof** analyzer for a single profiling run
*   **compare** two profiling runs with the timeline
*   **tag** your profiling runs
*   show **aggregated statistics** in the overview

![](/_Resources/Persistent/934b045d8dc9186a2fa243774d869f4f78ae97d3/plumber-1.jpg)

![](/_Resources/Persistent/81f56b8e400aae4cd4c0878023048d02931ba26a/plumber-2.png)