import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';
import mongoose from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import AccountModel, { IAccount } from './AccountModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Account {
  id: string;

  _id: Types.ObjectId;

  name: string;

  bank: string | null | undefined;

  kind: string;

  constructor(data: IAccount, { account }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.name = data.name;
    this.bank = data.bank;
    this.kind = data.kind;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(AccountModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string | Object | ObjectId): Promise<Account | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.AccountLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Account(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.AccountLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IAccount) =>
  dataloaders.AccountLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IAccount) =>
  clearCache(context, id) && primeCache(context, id, data);

type AccountArgs = ConnectionArguments & {
  search?: string;
};
export const loadAccounts = async (context: GraphQLContext, args: AccountArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const accounts = AccountModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: accounts,
    context,
    args,
    loader: load,
  });
};
