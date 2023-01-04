import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './schemas/dog.schema';

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  async create(@Body() createDogDto: CreateDogDto) {
    return this.dogsService.create(createDogDto);
  }

  @Get()
  async findAll(): Promise<Dog[]> {
    return this.dogsService.findAll();
  }

  @Get('call')
  async call(): Promise<string> {
    return this.dogsService.call();
  }
}
