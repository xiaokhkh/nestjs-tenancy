import { Inject } from '@nestjs/common';
import { TENANT_SERVICE } from '../tenancy.constants';
import { getTenantConnectionToken, getTenantModelToken } from '../utils';
import { manualGetTenantModelToken } from '../utils/tenancy.utils';

/**
 * Get the instance of the tenant model object
 *
 * @param model any
 */
export const InjectTenancyModel = (model: string) =>
  Inject(getTenantModelToken(model));

/**
 * Get the instance of the tenant connection
 *
 * @param name any
 */
export const InjectTenancyConnection = (name?: string) =>
  Inject(getTenantConnectionToken(name));

export const InjectTenancyService = () => Inject(TENANT_SERVICE);

export const InjectManualGetFn = (model: string) =>
  Inject(manualGetTenantModelToken(model));
