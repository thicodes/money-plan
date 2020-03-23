import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { timestamps } from '../../graphql/timestampResolver';
import { mongooseIDResolver } from '../../graphql/mongooseIDResolver';

const SettingType = registerType(
  new GraphQLObjectType({
    name: 'Setting',
    description: 'Setting data',
    fields: () => ({
      id: globalIdField('Setting'),
      ...mongooseIDResolver,
      currency: {
        type: GraphQLString,
        resolve: setting => setting.currency,
      },
      isFinishedSetup: {
        type: GraphQLBoolean,
        resolve: setting => setting.isFinishedSetup,
      },
      ...timestamps,
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default SettingType;

export const SettingConnection = connectionDefinitions({
  name: 'Setting',
  nodeType: GraphQLNonNull(SettingType),
});
