import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities/list.entity';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [ListItemModule, TypeOrmModule.forFeature([List])],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
