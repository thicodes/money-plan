import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const SettingType = registerType(
  new GraphQLObjectType({
    name: 'Setting',
    description: 'Setting data',
    fields: () => ({
      id: globalIdField('Setting'),
      _id: {
        type: GraphQLString,
        resolve: setting => setting._id,
      },
      name: {
        type: GraphQLString,
        resolve: setting => setting.name,
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default SettingType;

export const SettingConnection = connectionDefinitions({
  name: 'Setting',
  nodeType: GraphQLNonNull(SettingType),
});