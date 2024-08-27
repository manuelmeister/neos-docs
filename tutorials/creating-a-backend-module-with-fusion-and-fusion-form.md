url: /tutorials/creating-a-backend-module-with-fusion-and-fusion-form
# Creating a backend module with Fusion and Fusion.Form

Backend modules with pure Fusion, Form and AFX

Forms for backend modules basically work the same as in the frontend but the additional prototype `Neos.Fusion.Form:Neos.BackendModule.FieldContainer` can be used to render fields with translated labels and error messages using the default markup of the Neos backend.

## Creating a custom backend module

The core of a backend module is a controller class that extends the `AbstractModuleController.`

```php
<?php
namespace Vendor\Package\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Controller\Module\AbstractModuleController;

class FusionExampleController extends AbstractModuleController
{
}
```

Tho access the controller a `Policy.yaml` has to be defined that creates `pivilegeTargets` for the controller actions and defines the `roles` that are allowed to use them.

```yaml
privilegeTargets:
  'Neos\Flow\Security\Authorization\Privilege\Method\MethodPrivilege':
    'Vendor.Package:FusionExampleController':
      matcher: 'method(Vendor\Package\Controller\FusionExampleController->(index|submit|create)Action())'

roles:
  'Neos.Neos:AbstractEditor':
    privileges:
      -
        privilegeTarget: 'Vendor.Package:FusionExampleController'
        permission: GRANT

```

Tho show this controller in the menu it has to be added to the `Settings.yaml` so Neos is aware of the controller and knows which privilege targets are required.

```yaml
Neos:
  Neos:
    modules:
      administration:
        submodules:
          exampleModule:
            label: 'Example fusion module'
            description: 'a helpful description'
            icon: 'magic'
            controller: 'Vendor\Package\Controller\FusionExampleController'
            privilegeTarget: 'Vendor.Package:FusionExampleController'
```

## Rendering of backend modules with fusion

To render a backend module controller with fusion two adjustments have to be made to the controller.

1\. Adjust the defaultViewObjectName

2\. Adjust the fusion path pattern (only if the Root.fusion for the backend is located in a subfolder). 

```php
<?php
namespace Vendor\Package\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Controller\Module\AbstractModuleController;
use Neos\Fusion\View\FusionView;

class FusionExampleController extends AbstractModuleController
{
    /**
     * @var FusionView
     */
    protected $defaultViewObjectName = FusionView::class;
  
    /**
     * Sets the Fusion path pattern on the view to avoid conflicts with the frontend fusion 
     * 
     * This is not needed if your package does not register itself to `Neos.Neos.fusion.autoInclude.*`
     */
    protected function initializeView(ViewInterface $view)
    {
        parent::initializeView($view);
        $view->setFusionPathPattern('resource://Vendor.Package/Private/Fusion/Backend');
    }

    /**
     * The variables that are assigned to the view will 
     * be available in fusion as context variables.  
     */
    public function indexAction(): void
    {
        $this->view->assign('customer', $this->getCustomer());
        $this->view->assign('address', $this->getAddress());
    }
	
}
```

In the plain fusion view all includes have to be done explicitly. So the fusion that is required in frontend via the Setting `Neos.Neos.fusion.autoInclude.*` like `Neos.Fusion/Root.fusion` and `Neos.Fusion.Form/Root.fusion` has to be included explicitly like in the example below.

```neosfusion
include: resource://Neos.Fusion/Private/Fusion/Root.fusion 
include: resource://Neos.Fusion.Form/Private/Fusion/Root.fusion
```

> **⚠️ Include loop warning**
> 
> It is possible to create include loops quite easily that will not lead to fusion errors but can lead to hard to debug issues because of an unexpected loading order.  
>   
> A situation where this can occur is when Backend fusion that requires Neos.Neos/Root.fusion is loaded in the frontend aswell. This may mess up the fusion loading order you may expect.  
>   
> **It is good practice to keep the module/controller fusion separate from the frontend fusion. This can be done by using distinct pathes or separate packages that not register themselve to** `Neos.Neos.fusion.autoInclude` 

By default the fusion view will a render a fusion path that is created from the current package, controller and action. It is recommended to map a prototype to this path.

```neosfusion
# The show and update action both render via Form.Example:Backend.UserForm 
Form.Example.FusionController.create = Form.Example:Backend.UserForm {
    targetAction = "addUser"
}
Form.Example.FusionController.edit = Form.Example:Backend.UserForm {
    targetAction = "updateUser"
}

# The info action uses a different prototype
Form.Example.FusionController.info = Form.Example:Backend.Info
```

## Using Neos.Fusion.Form in backend modules

The fusion forms are used in the backend in almost the same way as in the frontend. For convenience fusion forms contain the prototype `Neos.Fusion.Form:Neos.BackendModule.FieldContainer` implements the specific markup for the backend with adds label and error rendering.

> **ℹ️ Beware of dragons**
> 
> Do not use the Neos.BackendModule.FieldContainer in your frontend project as it will evolve with the Neos backend and may break your code.   
>   
> You may use the Neos.BackendModule.FieldContainer as a template to implement your own FieldContainers.

```neosfusion
#
# Include requried base fusion
#
include: resource://Neos.Fusion/Private/Fusion/Root.fusion
include: resource://Neos.Fusion.Form/Private/Fusion/Root.fusion

#
# Map controller pathes to fusion prototypes 
#
Vendor.Package.FusionExampleController.createUser = Vendor.Package:FusionExample.UserForm {
    user = ${user}
    targetAction = 'addUser'
}

Vendor.Package.FusionExampleController.editUser = Vendor.Package:FusionExample.UserForm {
    user = ${user}
    targetAction = 'updateUser'
}

#
# The rendering of the form is centralized in a single prototype 
# that expects the values `user` and `targetAction`
#
prototype(Vendor.Package:FusionExample.UserForm) < prototype(Neos.Fusion:Component) {

	# fusion api																   
    user = null
    targetAction = null
																	   
    renderer = afx`
        <h2>{title}</h2>

        <Neos.Fusion.Form:Form form.data.user={props.user} form.target.action={props.targetAction} >

            <Neos.Fusion.Form:Neos.BackendModule.FieldContainer field.name="customer[firstName]" label="user.firstName">
                <Neos.Fusion.Form:Input />
            </Neos.Fusion.Form:Neos.BackendModule.FieldContainer>

            <Neos.Fusion.Form:Neos.BackendModule.FieldContainer field.name="customer[firstName]" label="user.lastName">
                <Neos.Fusion.Form:Input />
            </Neos.Fusion.Form:Neos.BackendModule.FieldContainer>

            <Neos.Fusion.Form:Neos.BackendModule.FieldContainer field.name="customer[roles]" label="user.role" field.multiple>
                <Neos.Fusion.Form:Checkbox field.value="B2B" />
                <Neos.Fusion.Form:Checkbox field.value="B2C" />
                <Neos.Fusion.Form:Checkbox field.value="Press" />			 
            </Neos.Fusion.Form:Neos.BackendModule.FieldContainer>

            <Neos.Fusion.Form:Neos.BackendModule.FieldContainer field.name="user[language]" label="user.language" >
                <Neos.Fusion.Form:Select>
                    <Neos.Fusion.Form:Select.Option option.value="en" >Englisch</Neos.Fusion.Form:Select.Option>
                    <Neos.Fusion.Form:Select.Option option.value="de" >Deutsch</Neos.Fusion.Form:Select.Option>
                    <Neos.Fusion.Form:Select.Option option.value="ru" >Russian</Neos.Fusion.Form:Select.Option>
                    <Neos.Fusion.Form:Select.Option option.value="kg" >Klingon</Neos.Fusion.Form:Select.Option>
                </Neos.Fusion.Form:Select>
            </Neos.Fusion.Form:Neos.BackendModule.FieldContainer>

            <Neos.Fusion.Form:Button>submit</Neos.Fusion.Form:Button>

        </Neos.Fusion.Form:Form>
    `
}
```