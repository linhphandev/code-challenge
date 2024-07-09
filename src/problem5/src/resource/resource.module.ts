import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ResourceController } from './resource.controller'
import { ResourceRepository } from './resource.repository'
import { ResourceService } from './resource.service'
import { Resource, ResourceSchema } from './schemas/resource.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }])],
  providers: [ResourceService, ResourceRepository],
  controllers: [ResourceController],
  exports: [ResourceService],
})
export class ResourceModule {}
