url: /guide/tooling/editor-support
# Editor Support

Editor Plugins and other tools

The Neos community has created various editor plugins and helpers to ease development with Neos. Feature-wise, the editor extensions often provide syntax highlighting for Fusion and AFX, and help while writing NodeTypes.yaml. Some editor extensions provide additional features.

### PHPStorm / IntelliJ Plugin

This plugin is actively maintained by our community member Christian Vette. New releases are done regularily, and this package provides a great help for using Neos.

**Neos Fusion language support**

*   Configurable syntax highlighting
*   Basic formatting
*   Brace matching
*   Breadcrumb navigation
*   Code folding
*   Structure view
*   EEL helper references (Ctrl+Click navigation to class/method)
*   Prototype references (Ctrl+Click navigation to prototype definition)
*   Find usages of prototypes
*   Rename refactoring for prototypes

**Support for node type definitions**

*   Configuration keys completion, based on [Shel.Neos.Schema](https://github.com/Sebobo/Shel.Neos.Schema)
*   "Go to definition" for node types / supertypes / constraints

> **💡 Ensure the plugin is activated for Neos projects**
> 
> Sometimes, the plugin does not auto-activate after opening a Neos project, and thus, autocompletions does not work properly.  
> To ensure the plugin is enabled, go to _Preferences -> Languages&Frameworks -> PHP -> Frameworks -> Neos_ and click _**ENABLE PLUGIN FOR THIS PROJECT**_

*   [Neos Support Plugin on JetBrains Marketplace](https://plugins.jetbrains.com/plugin/9362-neos-support)
*   [Source Code on GitHub - cvette/intellij-neos](https://github.com/cvette/intellij-neos)

## Visual Studio Code Plugin for Fusion

This plugin is maintained by Networkteam and makes integrating projects with Neos and VS Code very nice.

**Main Features**

*   Basic syntax highlighting for Fusion
*   AFX Syntax support
*   Code-Snippets for Fusion-Objects
*   starting in 2.0: support for the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) plugin in AFX

*   [Neos Fusion plugin on Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=networkteam.neos-fusion)
*   [Source Code on GitHub - networkteam/vscode-neos-fusion](https://github.com/networkteam/vscode-neos-fusion)

## Visual Studio Code - NodeTypes Autocompletion

The package [Shel.Neos.Schema](https://github.com/Sebobo/Shel.Neos.Schema), maintained by Sebastian Helzle, contains instructions how to install autocompletions into Visual Studio Code. Check out the README of this package!

**Main Features** for  `NodeTypes.*.yaml`, `Caches.yaml` and node migration `Version*.yaml` files:

*   autocompletion
*   typehints
*   validation
*   inline documentation

*   [Shel.Neos.Schema on GitHub](https://github.com/Sebobo/Shel.Neos.Schema)

## neovim plugin based on Treesitter Grammar for Fusion

Community Member Jürgen Messner has worked on a Treesitter grammar for Fusion, which can be used to get syntax highlighting in [neovim](https://neovim.io/).

[NeoVim](https://neovim.io/), a community driven fork of vim, has native support for tressitter and Language Servers in versions >= 0.6.

Details can be found in this [discuss post](https://discuss.neos.io/t/treesitter-grammar-for-fusion/5773), where he explains the details.

Thanks to Language Servers, Shel.Neos.Schema should be easy to use this in neovim as well - see [neovim lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#yamlls)

*   Discuss Forum posting with the announcement
    
*   [jirgn/tree-sitter-fusion on Gitlab](https://gitlab.com/jirgn/tree-sitter-fusion/)