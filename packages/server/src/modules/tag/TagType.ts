import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const TagType = registerType(
  new GraphQLObjectType({
    name: 'Tag',
    description: 'Tag data',
    fields: () => ({
      id: globalIdField('Tag'),
      _id: {
        type: GraphQLString,
        resolve: tag => tag._id,
      },
      name: {
        type: GraphQLString,
        resolve: tag => tag.name,
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TagType;

export const TagConnection = connectionDefinitions({
  name: 'Tag',
  nodeType: GraphQLNonNull(TagType),
});
