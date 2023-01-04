import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InjectTenancyModel,
  InjectTenancyService,
  SERVICE_MAP,
} from '../../../lib';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './schemas/dog.schema';

@Injectable()
export class DogsService {
  constructor(
    @InjectTenancyModel(Dog.name) private readonly dogModel: Model<Dog>,
    @InjectModel(Dog.name) private readonly pubDogModel: Model<Dog>,
    @InjectTenancyService() private readonly service: any,
    @Inject(SERVICE_MAP) private readonly tenancyServiceMap: Map<string, any>,
  ) {
    console.log(this.tenancyServiceMap);
  }

  async create(createDogDto: CreateDogDto): Promise<Dog> {
    const createdDog = new this.dogModel(createDogDto);
    const createdDogPub = new this.pubDogModel(
      Object.assign({}, createDogDto, { breed: 'pub' }),
    );
    createdDogPub.save();
    return createdDog.save();
  }

  async findAll(): Promise<Dog[]> {
    return this.dogModel.find().exec();
  }

  async call() {
    return this.service.call();
  }
}
