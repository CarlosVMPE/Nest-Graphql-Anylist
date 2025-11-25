import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs/';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepositoriy: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepositoriy.create({ ...createItemInput, user });
    return await this.itemsRepositoriy.save(newItem);
  }

  async findAll(user: User): Promise<Item[]> {
    // TODO: filtrar, paginar, por usuario...
    return this.itemsRepositoriy.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepositoriy.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepositoriy.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return this.itemsRepositoriy.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    // TODO: soft delete, integridad referencial...
    const item = await this.findOne(id, user);
    await this.itemsRepositoriy.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepositoriy.count({
      where: { user: { id: user.id } },
    });
  }
}
