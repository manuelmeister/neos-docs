url: /tutorials/cerating-a-custom-fieldcontainer-for-neos-fusion-form
# Creating a custom field container for Neos.Fusion.Form

Centralized label and error rendering and translating for Fusion

Neos.Fusion.Form is as non opinionated as possible and assumes no default markup nor classes other than the html standard itself. However it also is designed to allow the implementation of project specific markup and even implements this for Neos backend.

A custom field container is a component that renders label and errors for a field but expects the field itself as AFX content. The container will in this case define the `field` which is then reused by the inner fields to avoid error prone duplication.

This pattern allows to centralize error and label rendering while the field-controls are still decided for each field separately.

```html
<Neos.Fusion.Form:Form form.data.customer={customer}>
	<Vendor.Site:Form.FieldContainer field.name="customer[saluation]" label="saluation">
	    <label>Mr</label><Neos.Fusion.Form:Checkbox field.value="mr" />
		<label>Ms</label><Neos.Fusion.Form:Checkbox field.value="ms" />
    </Vendor.Site:Form.FieldContainer>
    <Vendor.Site:Form.FieldContainer field.name="customer[firstName]" label="firstName">
		<Neos.Fusion.Form:Input />
	</Vendor.Site:Form.FieldContainer>
  	<Vendor.Site:Form.FieldContainer field.name="customer[firstName]" label="lastName">
		<Neos.Fusion.Form:Input />
	</Vendor.Site:Form.FieldContainer>
  	<Neos.Fusion.Form:Button >Submit</Neos.Fusion.Form:Button>
</Neos.Fusion.Form:Form>
```

A field container is implemented by extending the prototype `Neos.Fusion.Form:Component.Field` as for a custom field. Instead of defining a field renderer the container markup is rendered with the given `content` inside.

```neosfusion
prototype(Vendor.Site:Form.FieldContainer)  < prototype(Neos.Fusion.Form:Component.Field) {

    name = null
    multiple = false
    label = null
    content = null

    renderer = afx`
        <div class={field.errors ? "error"}>
            <label for={field.name} @if.has={props.label}>
                {I18n.translate(props.label, props.label, [], 'Main', 'Vendor.Site')}
            </label>
            
           {props.content}
            
            <ul @if.hasErrors={field.errors} class="errors">
                <Neos.Fusion:Loop items={field.result.flattenedErrors} itemName="errors" >
                    <Neos.Fusion:Loop items={errors} itemName="error" >
                        <li>
                            {I18n.translate(error.code, error, [], 'ValidationErrors', 'Vendor.Site')}
                        </li>
                    </Neos.Fusion:Loop>
                </Neos.Fusion:Loop>
            </ul>
        </div>
    `

    #
    # all FieldComponents will render the field.name as id so
    # the label for from the FieldContainer references them correctly 
    #
    prototype(Neos.Fusion.Form:Component.Field) {
        attributes.id = ${field.name}
    }
}
```