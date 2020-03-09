import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';
import mongoose from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import SettingModel, { ISetting } from './SettingModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Setting {
  id: string;
  _id: Types.ObjectId;
  currency: string;
  isFinishedSetup: boolean;

  constructor(data: ISetting, { setting }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.currency = data.currency;
    this.isFinishedSetup = data.isFinishedSetup;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(SettingModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string | Object | ObjectId): Promise<Setting | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.SettingLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Setting(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.SettingLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ISetting) =>
  dataloaders.SettingLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ISetting) =>
  clearCache(context, id) && primeCache(context, id, data);

type SettingArgs = ConnectionArguments & {
  search?: string;
};
export const loadSettings = async (context: GraphQLContext, args: SettingArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const settings = SettingModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: settings,
    context,
    args,
    loader: load,
  });
};
