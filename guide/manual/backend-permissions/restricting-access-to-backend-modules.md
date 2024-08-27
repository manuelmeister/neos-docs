url: /guide/manual/backend-permissions/restricting-access-to-backend-modules
# Restricting Access to Backend Modules

## Restrict Module Access

The available modules are defined in the settings of Neos. Here is a shortened example containing only the relevant parts:

Settings.yaml:
```yaml
Neos:
 Neos:
   modules:
    'management':
      controller: 'Some\Management\Controller'
      submodules:
        'workspaces':
          controller: 'Some\Workspaces\Controller'
```

Along with those settings privilege targets should be defined. Those are used to hide the module links from the UI and to protect access to the modules if no access is granted.

The targets are defined as usual in the security policy, using ModulePrivilege. Here is a shortened example:

Policy.yaml:
```yaml
privilegeTargets:

  'Neos\Neos\Security\Authorization\Privilege\ModulePrivilege':

    'Neos.Neos:Backend.Module.Management':
      matcher: 'management'

    'Neos.Neos:Backend.Module.Management.Workspaces':
      matcher: 'management/workspaces'
```

Now those privilege targets can be used to grant/deny access for specific roles. Internally those module privileges create a MethodPrivilege covering all public actions of the configured module controller. Additionally more fine-grained permissions can be configured on top.

_Note:_ If the path of a module changes the corresponding privilege target needs to be adjusted accordingly.

## Disable Modules

To completely disable modules available in the Neos UI a setting can be used:

Settings.yaml:
```yaml
Neos:
  Neos:
    modules:
      'management':
        submodules:
          'history':
            enabled: false
```