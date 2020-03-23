import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { timestamps } from '../../graphql/timestampResolver';
import { mongooseIDResolver } from '../../graphql/mongooseIDResolver';

const TagType = registerType(
  new GraphQLObjectType({
    name: 'Tag',
    description: 'Tag data',
    fields: () => ({
      id: globalIdField('Tag'),
      ...mongooseIDResolver,
      name: {
        type: GraphQLString,
        resolve: tag => tag.name,
      },
      ...timestamps,
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TagType;

export const TagConnection = connectionDefinitions({
  name: 'Tag',
  nodeType: GraphQLNonNull(TagType),
});
