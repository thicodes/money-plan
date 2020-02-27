import Dataloader from 'dataloader';

import { IAccount } from './modules/account/AccountModel';
import { IBudget } from './modules/budget/BudgetModel';
import { ICategory } from './modules/category/CategoryModel';
import { ICreditCard } from './modules/credit-card/CreditCardModel';
import { ITransaction } from './modules/transaction/TransactionModel';
import { ITag } from './modules/tag/TagModel';
import { IUser } from './modules/user/UserModel';

type Key = string;

export type Dataloaders = {
  AccountLoader: Dataloader<Key, IAccount>;
  BudgetLoader: Dataloader<Key, IBudget>;
  CategoryLoader: Dataloader<Key, ICategory>;
  CreditCardLoader: Dataloader<Key, ICreditCard>;
  TransactionLoader: Dataloader<Key, ITransaction>;
  TagLoader: Dataloader<Key, ITag>;
  UserLoader: Dataloader<Key, IUser>;
};

export type GraphQLContext = {
  account?: IAccount;
  buget?: IBudget;
  category?: ICategory;
  carditCard?: ICreditCard;
  tag?: ITag;
  transaction?: ITransaction;
  user?: IUser;
  dataloaders: Dataloaders;
};
