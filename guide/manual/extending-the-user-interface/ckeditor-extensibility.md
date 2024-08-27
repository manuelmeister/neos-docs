url: /guide/manual/extending-the-user-interface/ckeditor-extensibility
# Extending CKEditor

> **ℹ️ Draft**
> 
> This page is not yet fully completed - we are still working on the content here. Expect some rough edges 🙃

The inline editor of Neos CMS (CKEditor) is very extensible. The following video gives an overview on how to hook in there:

[![Neos Con 2019 | Piotrek Koszulinski & Sebastian Kurfürst: Neos + CKEditor 5 = a love story](/_Resources/Persistent/be8855aecd4ac243d2a96b888ffaf01ae3c16797/Youtube-fVcV_KnynGE-maxresdefault.jpg)](https://www.youtube.com/watch?v=fVcV_KnynGE)

> **ℹ️ You can help us!**
> 
> We would love to have the content of Piotrek's and Sebastian's talk above in written form on this page. Please get in touch with us on [slack.neos.io](https://slack.neos.io) #guild-documentation if you want to help.

#### CKEditor4 vs CKEditor5

The Neos UI supports both CKEditor4, and the new CKEditor5. In **Settings.yaml**, under the key [_Neos.Neos.Ui.frontendConfiguration.defaultInlineEditor_](https://github.com/neos/neos-ui/blob/2.x/Configuration/Settings.yaml#L92) you can configure which editor to use.

**For all new projects, we recommend using CKEditor5, which is also the default. This page will explain CKEditor5 only.**

#### Basics of CKEditor5 Architecture

In CKEditor5, there are three main parts which are relevant:

*   the model is the abstract tree of content. **This is no HTML**, but a more abstract structure.
*   The model is converted to the view prior to rendering. The view is HTML.
*   Then, the view is converted to the actual DOM - at this point only minor adjustments are made like inserting spacer <br /> tags where necessary.

For every change, the model is updated accordingly; which then updates the view and the DOM automatically (through a reactive system).

![](/_Resources/Persistent/4e1c1314f285dba89d0cf46d4d74603bc38bcc0a/ckeditor_model_view_dom.png)

CKEditor5 Main Data Architecture

The process of converting data between the different representations is called **downcasting** and **upcasting**.

#### CKEditor5 Inspector

CKEditor5 features an [Inspector tool](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/development-tools.html), which helps to understand the current model and view structure of an editor.

To see the inspector in Neos, install the [Sandstorm.CkEditorInspector](https://github.com/sandstorm/CkEditorInspector) package - then, in the development context, you see the CKEditor inspector popping up as soon as you select a text element.

![The Inspector in action](/_Resources/Persistent/93fab50680d921c90e5cff1f745e99f2ffb3fe7d/ckeditor_inspector-1920x1125.png)

the inspector in action

Using that inspector, you can:

*   understand the CKEditor model with all properties
*   see the rendered view
*   see the current selection
*   execute commands