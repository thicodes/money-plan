import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';
import mongoose from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import CreditCardModel, { ICreditCard } from './CreditCardModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class CreditCard {
  id: string;
  _id: Types.ObjectId;
  institutionFlag: string;
  name: string;
  limit: string;
  closingDay: number;
  dueDay: number;

  constructor(data: ICreditCard, { creditCard }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.institutionFlag = data.institutionFlag;
    this.name = data.name;
    this.limit = data.limit;
    this.closingDay = data.closingDay;
    this.dueDay = data.dueDay;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(CreditCardModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string | Object | ObjectId): Promise<CreditCard | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.CreditCardLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new CreditCard(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.CreditCardLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ICreditCard) =>
  dataloaders.CreditCardLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ICreditCard) =>
  clearCache(context, id) && primeCache(context, id, data);

type CreditCardArgs = ConnectionArguments & {
  search?: string;
};
export const loadCreditCards = async (context: GraphQLContext, args: CreditCardArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const creditCards = CreditCardModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: creditCards,
    context,
    args,
    loader: load,
  });
};
