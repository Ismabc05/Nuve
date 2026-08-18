import { Controller } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';

import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { BrandsService } from '../services/brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private brandService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Post()
  create(@Body() newBrand: CreateBrandDto) {
    return this.brandService.create(newBrand);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrand: UpdateBrandDto,
  ) {
    return this.brandService.update(id, updateBrand);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
