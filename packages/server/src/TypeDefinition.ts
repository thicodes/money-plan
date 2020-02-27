import Dataloader from 'dataloader';

import { IAccount } from './modules/account/AccountModel';
import { ICategory } from './modules/category/CategoryModel';
import { ICreditCard } from './modules/credit-card/CreditCardModel';
import { ISetting } from './modules/setting/SettingModel';
import { ITransaction } from './modules/transaction/TransactionModel';
import { ITag } from './modules/tag/TagModel';
import { IUser } from './modules/user/UserModel';

type Key = string;

export type Dataloaders = {
  AccountLoader: Dataloader<Key, IAccount>;
  CategoryLoader: Dataloader<Key, ICategory>;
  CreditCardLoader: Dataloader<Key, ICreditCard>;
  SettingLoader: Dataloader<Key, ISetting>;
  TransactionLoader: Dataloader<Key, ITransaction>;
  TagLoader: Dataloader<Key, ITag>;
  UserLoader: Dataloader<Key, IUser>;
};

export type GraphQLContext = {
  account?: IAccount;
  category?: ICategory;
  creditCard?: ICreditCard;
  setting?: ISetting;
  tag?: ITag;
  transaction?: ITransaction;
  user?: IUser;
  dataloaders: Dataloaders;
};
