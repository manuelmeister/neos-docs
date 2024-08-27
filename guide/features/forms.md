url: /guide/features/forms
# Forms

HTTP Forms are a very old and important concept of the Web Platform. Neos offers you different ways to create, render and store them.

## Defining forms

Neos offers you multiple ways to create forms:

*   [Neos.Fusion.Form](/guide/manual/rendering/neos-fusion-form) _(since 2021)_ renders forms with Fusion and AFX to submit data to controllers. It can also be used to create backend modules.
*   [Neos.Form](https://github.com/neos/form) ecosystem _(since 2012)_
    *   [Neos.Form.YamlBuilder](https://github.com/neos/form-yamlbuilder) lets developers create file-based forms which are persistent in your site package. [Here's a tutorial on how to create a simple contact form](/tutorials/adding-a-simple-contact-form).
    *   [Neos.Form.Builder](https://github.com/neos/form-builder) lets editors create forms in the content area which are persistent in the content repository.

#### Which Form package to choose?

**In case you are unsure, use the Neos.Fusion.Form package, which is natively integrated into Fusion and AFX.**

The older Neos.Form ecosystem is not suggested for new projects. There, we pioneered many of the concepts which are now simplified and supported by the newer Neos.Fusion.Form package.

## Neos.Fusion.Form (since 2021)

[Neos.Fusion.Form](https://github.com/neos/fusion-form) is the newer and **recommended** way to build Forms in Neos. It currently supports the following features:

*   Form rendering in fusion with AFX and data binding
*   Clear separation of automation and magic for understandable results
*   Flexibility:
    *   Make no assumption about the required markup like classNames
    *   Allow to override all automatically assigned attributes
    *   Enable form fragments as Fusion components
    *   Allow to bind multiple objects to a single form
    *   Enable to create custom controls
    *   Respect form elements that are defined as plain html when rendering \_\_trustedProperties
*   Convenience:
    *   Render hidden fields for validation, security and persistence magic
    *   Provide validation errors and restore previously submitted values
    *   Prefix field names with the current request namespace if needed
*   Make writing of Fusion backend modules easy:
    *   Create a backend field container with translated labels and error messages
    *   Adjust field markup inside the field container for the Neos backend

The following feature is **currently not implemented** (compared to the legacy Neos.Form ecosystem):

*   Node Types for building a form through the Neos UI

### Neos.Form Ecosystem (since 2012)

> **ℹ️ supported**
> 
> We have no plans to deprecate the older Neos.Form ecosystem - just expect development to be slower.

For legacy reasons, by default the form rendering of Neos.Form is based on the Fluid renderer and Fluid templates for all the form elements.

That approach is flexible and probably the easiest for developers that are used to working with Fluid. When a lot of custom rendering is required, though, it can lead to a duplication and accidental complexity.  
For these cases the [Neos.Form.FusionRenderer](https://github.com/neos/form-fusionrenderer) package offers an alternative to build forms in Fusion.

It defines a new form preset that replaces the default form renderer with a Fusion implementation. The default prototypes render elements just like the "default" preset would. But now the complete output is adjustable with a bit of Fusion code.

The following example will remove the labels of all elements and render their content as placeholders instead: 

```neosfusion
prototype(Neos.Form.FusionRenderer:FormElement) {
    label >
    fieldContainer.field.attributes.placeholder = ${element.label}
}
```

Make sure to have a look at the Fusion prototypes to see how they work together and how they can be manipulated to your needs.

#### Core Packages

*   [**Neos.Form**  
    _The actual Form Framework core_](https://github.com/neos/form)
*   [**Neos.Form.Builder**  
    _A Form Builder IDE integrated to Neos CMS that allows for form definitions to be created via the Backend interface and/or Fusion_](https://github.com/neos/form-builder)
*   [**Neos.Form.FusionRenderer**  
    _A custom Form preset that allows Forms to be rendered via Fusion_](https://github.com/neos/form-fusionrenderer)
*   [**Neos.Form.YamlBuilder**  
    _The original Form Builder IDE that can be used with Flow alone to create YAML Form Definitions_](https://github.com/neos/form-yamlbuilder)

#### More Form Packages

*   [**Tms.Hcaptcha**  
    _privacy friendly captcha implementation_](https://github.com/tmsdev/Tms.Hcaptcha)
*   [**MapSeven.Neos.Form**  
    Bundle Various custom Form Finishers and helpers](https://github.com/khuppenbauer/MapSeven.Neos.FormBundle)
*   [**Wegmeister.DatabaseStorage**  
    _Custom Form Finisher that helps storing form data into the database and export it in various formats, e.g. Excel_](https://github.com/die-wegmeister/Wegmeister.DatabaseStorage)
*   [**Wegmeister.Recaptcha**  
    _Custom Form Element that renders Google's reCAPTCHAs_](https://github.com/die-wegmeister/Wegmeister.Recaptcha)
*   [**Wwwision.Form.ContentReferences**  
    _Example Form Element that renders Neos Content References_](https://github.com/bwaidelich/Wwwision.Form.ContentReferences)
*   [**Wwwision.Form.MultiColumnSection**  
    Example Section Form Element that renders child Form Elements in multiple columns](https://github.com/bwaidelich/Wwwision.Form.MultiColumnSection)
*   [**WebExcess.Form**  
    _Collection of custom presets and Form Elements_](https://github.com/webexcess/WebExcess.Form)
*   [**Dl.HoneypotFormField**  
    _Useful for spam protection of forms_](https://github.com/daniellienert/honeypotformfield)
*   [_**Sitegeist.PaperTiger**_  
    Form builder for Neos CMS based on Neos.Fusion.Form](https://github.com/sitegeist/Sitegeist.PaperTiger/)

#### Further reading

*   [Adding a Simple Contact Form](/tutorials/adding-a-simple-contact-form)
*   [Create forms with the Neos Form Framework (DE)](https://punkt.de/de/blog/neos-workshop/neos-workshop-teil-4-formulare-erstellen-mit-dem-neos-form-framework.html)