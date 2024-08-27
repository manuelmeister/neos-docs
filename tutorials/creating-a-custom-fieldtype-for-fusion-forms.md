url: /tutorials/creating-a-custom-fieldtype-for-fusion-forms
# Creating a custom fieldtype for a Neos.Fusion.Form

Project specific custom and opinionated controls

The most obvious extension point for forms is the definition of custom fieldtypes. To do so the `Neos.Fusion.Form:Component.Field` prototype is extended and a custom renderer is implemented.

During the rendering you have access to the `field` in the fusion context that enables accessing to the current value, target value and the fieldname in the current argument namespace.

> **ℹ️ Field vs. Attributes** 
> 
> All the automatic features of fields are controlled via the `field` fusion property that is defined in the prototype `Neos.Fusion.Form:Component.Field.`  
>   
> Additionally all field components support the direct setting of `attributes` which should override all automatically defined values. Also it is recommended to accept `content` where it makes sense to allow configuring via afx.

```neosfusion
prototypeVendor.Site:Form.Textarea) < prototype(Neos.Fusion.Form:Component.Field) {
    renderer = afx`
        <textarea
            name={field.name}
            {...props.attributes}
        >
            {String.htmlspecialchars(field.getCurrentValueStringified() || props.content)}
        </textarea>
    `
}
```

> **⚠️ Security**
> 
> When the values of custom fields are rendered as tag-content you have to ensure that no malicious input will be rendered, as the forms will rerender submitted values when validation errors occur. This is no problem when values are rendered as attributes as those are passed trough htmlspecialchars automatically.

## Implementing a custom DatetimeLocal field

This example shows a datetime-local field that implements a custom stringification for DateTime and integer values.

```neosfusion
prototype(Vendor.Site:Form.DatetimeLocal) < prototype(Neos.Fusion.Form:Component.Field) {

    # 
    # Since we want calculate the value via fusion but want to avoid 
    # making value an api a wrapper component is used  
    #
    renderer = Neos.Fusion:Component {

        # the `field` provides the name
        name = ${field.getName()}
        
        #
        # the value is fetched from the `field` with fallback to target value
        #
        value = ${field.getCurrentValue() || field.getTargetValue()}
        
        #
        # the value might be an object so we have to process it to a string for html
        #
        value.@process.formatDatime = Neos.Fusion:Case {
            isDateTime {
                condition = ${(Type.getType(value) == 'object') && Type.instance(value , '\DateTime') }
                renderer = ${Date.format(value, 'Y-m-d\TH:i')}
            }
            isInteger {
                condition = ${(Type.getType(value) == 'integer')}
                renderer = ${Date.format(Date.create('@' + value), 'Y-m-d\TH:i')}
            }
            default {
                condition = true
                renderer = ${field.getCurrentValueStringified() || field.getTargetValueStringified()}
            }
        }
        
        #
        # attributes are passed down 
        #
        attributes = ${props.attributes}


        #
        # the actual markup
        #
        renderer = afx`
            <input
                    type="datetime-local"
                    name={props.name}
                    value={props.value}
                    {...props.attributes}
            />
        `
    }
} 
```