url: /tutorials/adding-a-simple-contact-form
# Adding a simple Contact Form

With the Neos.Form package you can easily create simple and complex forms.

> **💡 Tip**
> 
> This tutorial describes YAML-based form configurations. For new projects you might want to look at the other options. You can also define them directly in the administration area with the FormBuilder or with Fusion.  
>   
> [Learn more about forms.](/guide/features/forms)

## Enable YAML-based forms

You just have to define where it should find its form configurations in your site package:

DistributionPackages/Vendor.Site/Configuration/Settings.yaml:
```yaml
Neos:
  Form:
    yamlPersistenceManager:
      savePath: 'resource://Vendor.Site/Private/Form/'

```

> **⚠️ Warning !**
> 
> Make sure the Neos.Demo package is deactivated. Otherwise the setting `Neos.Form.yamlPersistenceManager.savePath` may be overwritten by another package. You can deactivate a package with the command   
> `./flow package:deactivate <PackageKey>` 

## Define a form

Now place a valid Neos.Form Yaml configuration in the `Private/Form` folder. 

DistributionPackages/Vendor.Site/Resources/Private/Form/contact-form.yaml:
```yaml
type: 'Neos.Form:Form'
identifier: contact-form
label: Contact
renderingOptions:
  submitButtonLabel: Send
renderables:
  -
    type: 'Neos.Form:Page'
    identifier: page-one
    label: Contact
    renderables:
      -
        type: 'Neos.Form:SingleLineText'
        identifier: name
        label: Name
        validators:
          - identifier: 'Neos.Flow:NotEmpty'
        properties:
          placeholder: Name
        defaultValue: ''
      -
        type: 'Neos.Form:SingleLineText'
        identifier: email
        label: E-Mail
        validators:
          - identifier: 'Neos.Flow:NotEmpty'
          - identifier: 'Neos.Flow:EmailAddress'
        properties:
          placeholder: 'E-Mail'
        defaultValue: ''
      -
        type: 'Neos.Form:MultiLineText'
        identifier: message
        label: Message
        validators:
          - identifier: 'Neos.Flow:NotEmpty'
        properties:
          placeholder: 'Your Message'
        defaultValue: ''
finishers:
  -
    identifier: 'Neos.Form:Email'
    options:
      templatePathAndFilename: resource://Vendor.Site/Private/Templates/Email/Message.txt
      subject: Contact from example.net
      recipientAddress: office@example.net
      recipientName: 'Office of Company'
      senderAddress: server@example.net
      senderName: Server example.net
      replyToAddress: office@example.net
      format: plaintext
  -
    identifier: 'Neos.Form:Confirmation'
    options:
      message: >
        <h3>Thank you for your feedback</h3>
        <p>We will process it as soon as possible.</p>
```

In this example we are using the Neos.Form:Email Finisher. The Email Finisher requires the Neos.SwiftMailer package to be installed. It sends an E-Mail using the defined template and settings.

DistributionPackages/Vendor.Site/Resources/Private/Templates/Email/Message.txt:
```markup
Hello,

<f:for each="{form.formState.formValues}" as="value" key="label">
  {label}: {value}
</f:for>

Thanks

```

The second finisher `Neos.Form:Confirmation` displays a confirmation message.

To find out more about how to create forms see the Neos.Form package.

[Neos Form Framework documentation](https://flow-form-framework.readthedocs.io/en/latest/)

## Add the form to a page

In the Neos administration area open the page you want to add the form and then create a new content node of type "Form". 

And in the inspector select the form you wish to render.

![](/_Resources/Persistent/7991c04d9174861f8e51e3f977c842c098aa5da6/Form%20NodeType%20inspector.png)

[More about forms](/guide/features/forms)