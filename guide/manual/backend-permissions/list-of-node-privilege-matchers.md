url: /guide/manual/backend-permissions/list-of-node-privilege-matchers
# List of Node Privilege Matchers

The privileges need to be applied to certain nodes to be useful. For this, matchers are used in the policy, written using Eel. Depending on the privilege, various methods to address nodes are available.

> **💡 Note**
> 
> Since the matchers are written using Eel, anything in the Eel context during evaluation is usable for matching. This is done by using the `context` keyword, followed by dotted path to the value needed. E.g. to access the personal workspace name of the currently logged in user, this can be used: 
> 
> privilegeTargets:  
>  'Neos\\ContentRepository\\Security\\Authorization\\Privilege\\Node\\ReadNodePrivilege':  
>    'Neos.ContentRepository:Workspace':  
>      matcher: 'isInWorkspace("context.userInformation.personalWorkspaceName“))’  
>  
> 
>   
> These global objects available under `context` (by default the current `SecurityContext`imported as `securityContext` and the `UserService` imported as `userInformation`) are registered in the _Settings.yaml_ file in section `aop.globalObjects`. That way you can add your own as well.

#### Position in the Node Tree

This allows to match on the position in the node tree. A node matches if it is below the given node or the node itself.

**Signature:**

`isDescendantNodeOf(node-path-or-identifier)`

**Parameters:**

*   `node-path-or-identifier` (string) The nodes’ path or identifier

**Applicable to:**

matchers of all node privileges

This allows to match on the position in the node tree. A node matches if it is above the given node.

**Signature:**

`isAncestorNodeOf(node-path-or-identifier)`

**Parameters:**

*   `node-path-or-identifier` (string) The nodes’ path or identifier

**Applicable to:**

matchers of all node privileges

This allows to match on the position in the node tree. A node matches if it is above the given node or anywhere below the node itself.

**Signature:**

`isAncestorOrDescendantNodeOf(node-path-or-identifier)`

**Parameters:**

*   `node-path-or-identifier` (string) The nodes’ path or identifier

**Applicable to:**

matchers of all node privileges

> **ℹ️ Note**
> 
> The node path is not reliable because it changes if a node is moved. And the path is not “human-readable” in Neos because new nodes get a unique random name. Therefore it is best practice not to rely on the path but on the identifier of a node.

#### NodeType

Matching against the type of a node comes in two flavors. Combining both allows to limit node creation in a sophisticated way.

The first one allows to match on the type a node has:

**Signature:**

`nodeIsOfType(nodetype-name)`

**Parameters:**

*   `nodetype-name` (string|array) an array of supported node type identifiers or a single node type identifier

**Applicable to:**

matchers of all node privileges

Inheritance is taken into account, so that specific types also match if a supertype is given to this matcher.

The second one allows to match on the type of a node that is being created:

**Signature:**

`createdNodeIsOfType(nodetype-identifier)`

**Parameters:**

*   `nodetype-identifier` (string|array) an array of supported node type identifiers or a single node type identifier

**Applicable to:**

matchers of the `CreateNodePrivilege`

This acts on the type of the node that is about to be created.

#### Workspace Name

This allows to match against the name of a workspace a node is in.

**Signature:**

`isInWorkspace(workspace-names)`

**Parameters:**

*   `workspace-names` (string|array) an array of workspace names or a single workspace name

**Applicable to:**

matchers of all node privileges

#### Content Dimension

This allows to restrict editing based on the content dimension a node is in. Matches if the currently-selected preset in the passed dimension `name` is one of `presets`.

**Signature:**

`isInDimensionPreset(name, value)`

**Parameters:**

*   `name` (string) The content dimension name
*   `presets` (string|array) The preset of the content dimension

**Applicable to:**

matchers of all node privileges

The following example first blocks editing of nodes completely (by defining a privilege target that always matches) and then defines a privilege target matching all nodes having a value of “de” for the “language” content dimension. That target is then granted for the “Editor” role.

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege':
    # This privilegeTarget must be defined, so that we switch to a "whitelist" approach
    'Neos.Demo:EditAllNodes':
      matcher: 'TRUE'

    'Neos.Demo:EditGerman':
      matcher: 'isInDimensionPreset("language", "de")'

roles:
  'Neos.Neos:Editor':
    privileges:
      -
        privilegeTarget: 'Neos.Demo:EditGerman'
        permission: GRANT
```

#### Property Name

This allows to match against the name of a property that is going to be affected.

**Signature:**

`nodePropertyIsIn(property-names)`

**Parameters:**

*   `property-names` (string|array) an array of property names or a single property name

**Applicable to:**

matchers of he `ReadNodePropertyPrivilege` and the `EditNodePropertyPrivilege`