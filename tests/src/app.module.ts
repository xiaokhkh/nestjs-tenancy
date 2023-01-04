import { Injectable, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenancyModule, TENANT_SERVICE_REGISTER } from '../../lib';
import { CatsModule } from './cats/cats.module';
import { DogsModule } from './dogs/dogs.module';
import { DEVICE_SERVICE_TOKEN } from '../../lib/tenancy.constants';

class MockService {
  constructor(public readonly tenantId: string) {}
  async call() {
    return this.tenantId;
  }
}
const mockServiceRegister: Provider = {
  provide: TENANT_SERVICE_REGISTER,
  useValue: async (tenantId: string) => {
    return new MockService(tenantId);
  },
};
@Module({
  providers: [mockServiceRegister],
  exports: [mockServiceRegister],
})
class MockServiceModule {}

@Injectable()
class MockDeviceService {
  findOne(deviceId: string) {
    return deviceId;
  }
}
const service = { provide: DEVICE_SERVICE_TOKEN, useClass: MockDeviceService };

@Module({
  providers: [service],
  exports: [service],
})
class MockDeviceModule {}

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    TenancyModule.forRootAsync<any>({
      imports: [MockServiceModule, MockDeviceModule],
      useFactory: async () => {
        return {
          tenantIdentifier: 'X-TENANT-ID',
          uri: (tenantId: string) =>
            `mongodb://localhost/test-tenant-${tenantId}`,
          options: () => {},
          // validator: (tenantId: string) => {
          //   return () => true;
          // },
        };
      },
      inject: [],
    }),
    // TenancyModule.forRoot({
    //   tenantIdentifier: 'X-TENANT-ID',
    //   options: () => {},
    //   uri: (tenantId: string) => `mongodb://localhost/test-tenant-${tenantId}`,
    // }),
    CatsModule,
    DogsModule,
  ],
})
export class AppModule {}
