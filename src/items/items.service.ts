import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs/';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepositoriy: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepositoriy.create(createItemInput);
    return await this.itemsRepositoriy.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    // TODO: filtrar, paginar, por usuario...
    return this.itemsRepositoriy.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepositoriy.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepositoriy.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return this.itemsRepositoriy.save(item);
  }

  async remove(id: string): Promise<Item> {
    // TODO: soft delete, integridad referencial...
    const item = await this.findOne(id);
    await this.itemsRepositoriy.remove(item);
    return { ...item, id };
  }
}
