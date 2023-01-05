import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { ModelDefinition } from '../interfaces';
import {
  CONNECTION_MAP,
  MODEL_DEFINITION_MAP,
  TENANT_CONNECTION,
} from '../tenancy.constants';
import {
  ConnectionMap,
  ManualGetConnectionFn,
  ModelDefinitionMap,
} from '../types';
import { MANUAL_TENANT_CONNECTION } from '../tenancy.constants';
import {
  getTenantModelDefinitionToken,
  getTenantModelToken,
  manualGetTenantModelToken,
} from '../utils';

export const createTenancyProviders = (
  definitions: ModelDefinition[],
): Provider[] => {
  const providers: Provider[] = [];

  for (const definition of definitions) {
    // Extract the definition data
    const { name, schema, collection } = definition;

    providers.push({
      provide: getTenantModelDefinitionToken(name),
      useFactory: (
        modelDefinitionMap: ModelDefinitionMap,
        connectionMap: ConnectionMap,
      ) => {
        const exists = modelDefinitionMap.has(name);
        if (!exists) {
          modelDefinitionMap.set(name, { ...definition });

          connectionMap.forEach((connection: Connection) => {
            connection.model(name, schema, collection);
          });
        }
      },
      inject: [MODEL_DEFINITION_MAP, CONNECTION_MAP],
    });

    // Creating Models with connections attached
    providers.push({
      provide: getTenantModelToken(name),
      useFactory(tenantConnection: Connection) {
        return (
          tenantConnection.models[name] ||
          tenantConnection.model(name, schema, collection)
        );
      },
      inject: [TENANT_CONNECTION],
    });

    providers.push({
      provide: manualGetTenantModelToken(name),
      useFactory(manualGetConnectionFn: ManualGetConnectionFn) {
        return async (tenantId: string) => {
          const tenantConnection = await manualGetConnectionFn(tenantId);
          return (
            tenantConnection.models[name] ||
            tenantConnection.model(name, schema, collection)
          );
        };
      },
      inject: [MANUAL_TENANT_CONNECTION],
    });
  }

  // Return the list of providers mapping
  return providers;
};
