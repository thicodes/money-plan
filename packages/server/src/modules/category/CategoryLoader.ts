import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';
import mongoose from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import CategoryModel, { ICategory } from './CategoryModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Category {
  id: string;

  _id: Types.ObjectId;

  name: string;

  constructor(data: ICategory, { category }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.name = data.name;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(CategortyModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string | Object | ObjectId): Promise<Category | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.CategoryLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Category(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.CategoryLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ICategory) =>
  dataloaders.CategoryLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ICategory) =>
  clearCache(context, id) && primeCache(context, id, data);

type CategoryArgs = ConnectionArguments & {
  search?: string;
};
export const loadCategories = async (context: GraphQLContext, args: CategoryArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const categories = CategoryModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: categories,
    context,
    args,
    loader: load,
  });
};
