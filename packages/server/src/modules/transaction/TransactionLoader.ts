import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';
import mongoose from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import TransactionModel, { ITransaction } from './TransactionModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Transaction {
  id: string;
  _id: Types.ObjectId;
  name: string;
  date: integer;
  expenseOrIncome: string;
  kind: string;
  kindModel: string;
  isPaid: boolean;
  tags: Array<string>;

  constructor(data: ITransaction, { transaction }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.name = data.name;
    this.date = data.date;
    this.expenseOrIncome = data.expenseOrIncome;
    this.kind = data.kind;
    this.kindModel = data.kindModel;
    this.isPaid = data.isPaid;
    this.tags = data.tags;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(TransactionModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string | Object | ObjectId): Promise<Transaction | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.TransactionLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Transaction(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.TransactionLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ITransaction) =>
  dataloaders.TransactionLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ITransaction) =>
  clearCache(context, id) && primeCache(context, id, data);

type TransactionArgs = ConnectionArguments & {
  search?: string;
};
export const loadTransactions = async (context: GraphQLContext, args: TransactionArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const transactions = TransactionModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: transactions,
    context,
    args,
    loader: load,
  });
};
