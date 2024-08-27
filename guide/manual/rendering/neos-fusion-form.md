url: /guide/manual/rendering/neos-fusion-form
# Neos.Fusion.Form

Form rendering with Fusion and AFX

The Neos.Fusion.Form package contains the fusion prototypes to render forms with data-binding, handling of validation errors   
and other security and comfort features. 

Fusion forms help to create forms for controllers, plugins and backend modules with pure fusion and afx rendering. 

> **ℹ️ Neos.Fusion.Form**
> 
> These examples require the package Neos.Fusion.Form. Neos 5.1 has this package preinstalled. For Neos 4.3 and 5.0 it can be installed via _composer require neos/fusion-form._

> **💡 Documentation**
> 
> The package [Neos.Fusion.Form](https://github.com/neos/fusion-form) is currently developed as a separate project on github. Until the fusion forms are moved to the neos development collection the documentation is not part of the main Neos documentation yet:
> 
> 1.  [Neos.Fusion.Form Readme](https://github.com/neos/fusion-form/blob/master/README.md)
> 2.  [Documentation of Neos.Fusion.Form fusion prototypes](https://github.com/neos/fusion-form/blob/master/Documentation/FusionReference.rst)
> 3.  [Documentation of  theForm, Field and Options Helper Objects](https://github.com/neos/fusion-form/blob/master/Documentation/HelperReference.rst) 

## Creating a Form in Fusion

Forms are defined by using the `Neos.Fusion.Form:Form prototype` in AFX and configuring the target controller or the url the form shall be submitted to. 

```html
<Neos.Fusion.Form:Form 
   form.target.package="Vendor.Site"
   form.target.controller="Order"
   form.target.action="sendOrder"
>...</Neos.Fusion.Form:Form>  
```

As usual the current `package`, `controller` and `action` are assumed and only have to be specified if they diverge from the current values.

When forms are used to manipulate existing data it has to be bound the form via `form.data`. Fusion forms allow to manipulate multiple objects at once that are sent to the target controller as separate arguments.

```html
<Neos.Fusion.Form:Form
    form.data.customer={customer}
	form.data.shipmentAddress={shipmentAddress} 
>...</Neos.Fusion.Form:Form>
```

The actual input elements, fieldsets and labels are defined as afx content for the form and reference the data they manipulate via the _field.name_ property.

```html
<Neos.Fusion.Form:Form form.data.customer={customer}>
    <Neos.Fusion.Form:Input field.name="customer[firstName]" />
    <Neos.Fusion.Form:Input field.name="customer[lastName]" />
    <Neos.Fusion.Form:Button >Submit</Neos.Fusion.Form:Button>
</Neos.Fusion.Form:Form>
```

> **💡 Automation vs. manual control**
> 
> All automatic features of fusion forms are crontrolled by the properties `form`, `field` and `option` wich are own fusion prototypes with their own subkeys.   
>   
> In addition to the automatic features fusion forms support defining of `attributes` which will are applied to the html input tag and will even override automatic attributes. Whre it makes sense passing of `content` _(_which usually is defined by AFX) is supportted aswell.

Whenever possible fusion-forms accept AFX `content`. An important example for that is the `Neos.Fusion.Form:Select` prototype that uses afx to define the options via `Neos.Fusion.Form:Select.Option`.

```html
<Neos.Fusion.Form:Select attributes.id=country field.name="city">
  <Neos.Fusion.Form:Select.Option>none</Neos.Fusion.Form:Select.Option>
  <Neos.Fusion:Loop items={cities} itemName="city">
    <Neos.Fusion.Form:Select.Option option.value={city.id}>{city.name} </Neos.Fusion.Form:Select.Option>
  </Neos.Fusion:Loop>
</Neos.Fusion.Form:Select>
```

## Full Example

```html
<Neos.Fusion.Form:Form
	form.target.action="sendOrder"				   
    form.data.customer={customer}
	form.data.shipmentAddress={shipmentAddress} 
	attributes.id="orderForm"
	attributes.class="form"  				   
>
    <fieldset>
	  <legend>Customer</legend>	  
	  <label for="salutation">Salutation</label>
      <Neos.Fusion.Form:Select 
	      field.name="customer[salutation]" 
		  attributes.id="salutation"
      >
		<Neos.Fusion.Form:Select.Option option.value="mr" >Mr</Neos.Fusion.Form:Select.Option>
        <Neos.Fusion.Form:Select.Option option.value="ms" >Ms</Neos.Fusion.Form:Select.Option>
      </Neos.Fusion.Form:Select>		 
      <label for="firstname">First Name</label>
	  <Neos.Fusion.Form:Input 
	      field.name="customer[firstName]" 
		  attributes.id="firstname"	/>
      <label for="lastname">First Name</label>
      <Neos.Fusion.Form:Input 
          field.name="customer[lastName]" 
          attributes.id="lastname"/>		
    </fieldset>
    <fieldset>
	  <legend>Address</legend>
      <label for="city">City</label>
	  <Neos.Fusion.Form:Input 
	      field.name="shipmentAddress[city]" 
		  attributes.id="city"	/>
      <label for="street">Street</label>
      <Neos.Fusion.Form:Input 
          field.name="shipmentAddress[street]" 
          attributes.id="street"/>		
    </fieldset>
    <Neos.Fusion.Form:Button attributes.class="btn">Submit</Neos.Fusion.Form:Button>
</Neos.Fusion.Form:Form>
```

> **⚠️ Deviations from Fluid Forms**
> 
> Fusion forms are not a 1:1 port of the classic Fluid Form-ViewHelpers. Instead we took the chances a fresh implementation offered and created a much simpler and cleaner api that even allows to implement   
> custom field-types in pure fusion.  
>   
> The following deviations are probably the ones developers used to fluid will most likely stumble over. 
> 
> *   Instead of binding a single object to a form, fusion forms support generic data-binding. To achieve this a whole DataStructure is bound to the form via `form.data.object={object}` instead of `objectName` and `object`.
> *   Field data-binding is defined vis `field.name="object[title]"` with the object name and square brackets for nesting. Data binding with `property` path syntax is not supported.
> *   Select `options` and `groups` are defined directly as AFX content and not options.

## Reference and Documentation 

The package [Neos.Fusion.Form](https://github.com/neos/fusion-form) is currently developed as a separate project on github outside of the Neos development collection to allow for a faster release pace until the package is mature enough for being moved into the Neos development collection.  
  
Because of that the documentation is not yet part of the main fusion documentation:

1.  [Neos.Fusion.Form Readme](https://github.com/neos/fusion-form/blob/master/README.md)
2.  [Documentation of Neos.Fusion.Form fusion prototypes](https://github.com/neos/fusion-form/blob/master/Documentation/FusionReference.rst)
3.  [Documentation of  theForm, Field and Options Helper Objects](https://github.com/neos/fusion-form/blob/master/Documentation/HelperReference.rst) 

## Extending Fusion forms

Fusion forms can be used in some more advanced ways that are covered by the following cookbook recipes.

1.  [Creating a custom Field for Neos.Fusion.Form](/tutorials/creating-a-custom-fieldtype-for-fusion-forms)  
    Project specific custom and opinionated controls
2.  [Creating a custom FieldContainer for Neos.Fusion.Form](/tutorials/cerating-a-custom-fieldcontainer-for-neos-fusion-form)  
    Centralized label and error rendering and translating for fusion
3.  [Creating a backend Module with Neos.Fusion.Form](/tutorials/creating-a-backend-module-with-fusion-and-fusion-form)  
    Backend modules with pure fusion, forms and AFX

> **ℹ️ Limitations**
> 
> Fusion forms NOT cover the features of the Neos.Form package with form definition and finisher handling via yaml configuration. We are currently working on this topic and fusion forms will be the foundation where the new form handling will built upon.