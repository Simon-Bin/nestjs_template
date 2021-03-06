import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatEntity } from './cat.entity';
import { PUB_SUB } from 'src/common/providers/contants';
import { PubSub } from 'graphql-subscriptions';

@Resolver('Cat')
export class CatResolver {
  constructor(
    @Inject(CatService) private readonly catService: CatService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Mutation('createCat')
  async createCat(@Args('cat') cat: CatEntity) {
    return await this.catService.createCat(cat);
  }

  @Mutation('deleteCat')
  async deleteCat(@Args('id') id: number) {
    return await this.catService.deleteCat(id);
  }

  @Mutation('updateCat')
  async updateCat(@Args() updateInput: { id: number; cat: CatEntity }) {
    await this.catService.updateCat(updateInput.id, updateInput.cat);
    return { code: 200, message: '更新成功' };
  }

  @Mutation('pubMessage')
  async sayHi(@Args('msg') args: string) {
    this.pubSub.publish('subMessage', { subMessage: `msg: ${args}` });
    return `msg: ${args}`;
  }

  @Subscription('subMessage')
  subMessage() {
    return this.pubSub.asyncIterator('subMessage');
  }

  @Query('findOneCat')
  async findOneCat(@Args('id') id: number) {
    const data = await this.catService.findOneCat(id);
    return data;
  }

  @Query('findCats')
  async findCats() {
    const data = await this.catService.findCats();
    return data;
  }

  @Query('sayHello')
  async sayHello(@Args('name') name: string) {
    return name;
  }
}
