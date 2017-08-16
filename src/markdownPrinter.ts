import {
  buildASTSchema,
  print,
  parse,

  Kind,

  ASTNode,
  DefinitionNode,
  DocumentNode,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  TokenKind,
} from 'graphql';

declare function getDescription(): string;

export function printSchema(schemaIdl: string): string {
  const ast = parse(schemaIdl);
  const schema = buildASTSchema(ast);
  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  const subscriptionType = schema.getSubscriptionType();

  const definitionMap = ast.definitions.reduce((previous, definition) => {
    let kind: string = definition.kind;
    if (definition.kind == 'ObjectTypeDefinition') {
      if (queryType.name == definition.name.value) {
        kind = 'QueryType';
      } else if (mutationType && mutationType.name == definition.name.value) {
        kind == 'MutationType';
      } else if (subscriptionType && subscriptionType.name == definition.name.value) {
        kind = 'SubscriptionType';
      }
    }
    if (!previous[kind]) {
      previous[kind] = new Array<DefinitionNode>();
    }
    previous[kind].push(definition);
    return previous;
  }, {} as { [key: string]: Array<DefinitionNode> } );
  
  let markupString = '';
  if (definitionMap['SchemaDefinition']) {
    markupString = printDefinitions('Schema', definitionMap['SchemaDefinition'], schema, '##');
  }
  if (definitionMap['OperationDefinition']) {
    markupString += printDefinitions('Operations', definitionMap['OperationDefinition'], schema);
  }
  if (definitionMap['QueryType']) {
    markupString += printDefinitions('Queries', definitionMap['QueryType'], schema, '');
  }
  if (definitionMap['InterfaceTypeDefinition']) {
    markupString += printDefinitions('Interfaces', definitionMap['InterfaceTypeDefinition'], schema);
  }
  if (definitionMap['ObjectTypeDefinition']) {
    markupString += printDefinitions('Object Types', definitionMap['ObjectTypeDefinition'], schema);
  }
  if (definitionMap['MutationType']) {
    markupString += printDefinitions('Mutations', definitionMap['MutationType'], schema, '');
  }
  if (definitionMap['InputObjectTypeDefinition']) {
    markupString += printDefinitions('Input Object Types', definitionMap['InputObjectTypeDefinition'], schema);
  }
  if (definitionMap['SubscriptionType']) {
    markupString += printDefinitions('Subscriptions', definitionMap['SubscriptionType'], schema, '');
  }
  if (definitionMap['ScalarTypeDefinition']) {
    markupString += printDefinitions('Scalar Types', definitionMap['ScalarTypeDefinition'], schema);
  }
  if (definitionMap['EnumTypeDefinition']) {
    markupString += printDefinitions('Enum Types', definitionMap['EnumTypeDefinition'], schema);
  }
  if (definitionMap['TypeExtensionDefinitionNode']) {
    markupString += printDefinitions('Type Extensions', definitionMap['TypeExtensionDefinitionNode'], schema);
  }
  if (definitionMap['UnionTypeDefinitionNode']) {
    markupString += printDefinitions('Union Types', definitionMap['UnionTypeDefinitionNode'], schema);
  }
  if (definitionMap['DirectiveDefinition']) {
    markupString += printDefinitions('Directives', definitionMap['DirectiveDefinition'], schema);
  }

  return markupString;
}

function printDefinitions(title: string, definitions: Array<DefinitionNode>, schema: GraphQLSchema, subHeadings?: string): string {
  if (subHeadings === undefined) {
    subHeadings = '###';
  }
  return `## ${title}\n`
    +definitions.map(definition => printDefinition(definition, schema, subHeadings)).join('\n\n')
    +'\n\n';
}

function printDefinition(definition: any, schema: GraphQLSchema, heading?: string): string {
  let name = definition.operation || '';
  let description = '';
  if (definition.name) {
    name = definition.name.value;
    const object: any = schema.getType(name);
    if (object) {
      description = object.description || '';
    }
  }

  const nameString = (name && heading) ? `${heading} ${name}\n\n` : '';
  const descriptionString = description ? description+'\n\n' : '';

  return nameString
    +descriptionString
    +'```graphql\n'
    +`${print(definition)}\n`
    +'```';
}

function printDefinitionTable(definition: DefinitionNode) {
  
}

