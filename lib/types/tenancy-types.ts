import { Connection, Model } from 'mongoose';

export type ModelDefinitionMap = Record<string, any>;

export type ConnectionMap = Record<string, any>;

export type ServiceMap<T = any> = Record<string, T>;

export type ManualGetConnectionFn = (tenanId: string) => Promise<Connection>;

export type ManualGetModelFn<T> = (tenanId: string) => Promise<Model<T>>;
