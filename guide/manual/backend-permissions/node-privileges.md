url: /guide/manual/backend-permissions/node-privileges
# List of Node Privileges

These node privileges are offered by the Neos core.

### NodeTreePrivilege

A privilege that prevents matching document nodes to appear in the Navigate Component. It also prevents editing of those nodes in case the editor navigates to a node without using the Navigate Component (e.g. by entering the URL directly).

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Neos\Security\Authorization\Privilege\NodeTreePrivilege':
    'Some.Package:SomeIdentifier':
      matcher: 'isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")'
```

This defines a privilege that intercepts access to the specified node (and all of its child nodes) in the node tree.

### EditNodePropertyPrivilege

A privilege that targets editing of node properties.

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePropertyPrivilege':
    'Some.Package:SomeIdentifier':
      matcher: >-
        isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")
        && nodePropertyIsIn(["hidden", "name"])
```

This defines a privilege target that intercepts editing the “hidden” and “name” properties of the specified node (and all of its child nodes).

### ReadNodePropertyPrivilege

A privilege that targets reading of node properties.

Usage example:

Policy.yaml:
```yaml
'Neos\ContentRepository\Security\Authorization\Privilege\Node\ReadNodePropertyPrivilege':
  'Some.Package:SomeIdentifier':
    matcher: 'isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")'
```

This defines a privilege target that intercepts reading any property of the specified node (and all of its child-nodes).

### RemoveNodePrivilege

A privilege that targets deletion of nodes.

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
 'Neos\ContentRepository\Security\Authorization\Privilege\Node\RemoveNodePrivilege':
   'Some.Package:SomeIdentifier':
     matcher: 'isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")'

```

This defines a privilege target that intercepts deletion of the specified node (and all of its child-nodes).

### CreateNodePrivilege

A privilege that targets creation of nodes.

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\CreateNodePrivilege':
    'Some.Package:SomeIdentifier':
      matcher: >-
        isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")
        && createdNodeIsOfType("Neos.NodeTypes:Text")
```

This defines a privilege target that intercepts creation of Text nodes in the specified node (and all of its child nodes).

### EditNodePrivilege

A privilege that targets editing of nodes.

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
 'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege':
    'Some.Package:SomeIdentifier':
      matcher: >-
        isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")
        && nodeIsOfType("Neos.NodeTypes:Text")
```

This defines a privilege target that intercepts editing of Text nodes on the specified node (and all of its child nodes).

### ReadNodePrivilege

The ReadNodePrivilege is used to limit access to certain parts of the node tree:

With this configuration, the node with the identifier _c1e528e2-b495-0622-e71c-f826614ef287_ and all its child nodes will be hidden from the system unless explicitly granted to the current user (by assigning _SomeRole_):

> **🚨 Do not use ReadNodePrivilege in backend!**
> 
> ReadNodePrivilege completely removes nodes from everywhere, _this includes the rendered frontend page._  
>   
> Thus, only use the ReadNodePrivilege if you want to create a _frontend login with a restricted area!_  
>   
> **For the backend, please use the** _**NodeTreePrivilege**_ **instead!**

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\ReadNodePrivilege':
    'Some.Package:MembersArea':
      matcher: 'isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")'

roles:
  'Some.Package:SomeRole':
    privileges:
      -
        privilegeTarget: 'Some.Package:MembersArea'
        permission: GRANT
```

This defines a privilege target that intercepts editing the “hidden” and “name” properties of the specified node (and all of its child nodes).