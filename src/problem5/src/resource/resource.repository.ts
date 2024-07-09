import { MongooseModel, PaginateResult } from 'mongoose'

import { InjectModel } from '@nestjs/mongoose'

import { PagingDto } from '../shared/dto/paging.dto'
import { Resource, ResourceDocument } from './schemas/resource.schema'

export class ResourceRepository {
  constructor(@InjectModel(Resource.name) private readonly ResourceModel: MongooseModel<ResourceDocument>) {}

  async findById(id: string): Promise<Resource | null> {
    return await this.ResourceModel.findOne({ _id: id, deleted: false })
  }

  async list(condition: Record<string, any>, paging: PagingDto): Promise<PaginateResult<Resource>> {
    const { page = 1, limit = 30 } = paging

    return await this.ResourceModel.paginate(
      { ...condition, deleted: false },
      {
        page,
        limit,
        sort: '-createdAt',
      },
    )
  }

  async create(data: Record<string, any>): Promise<Resource> {
    const resource = new this.ResourceModel(data)
    return await resource.save()
  }

  async update(condition: Record<string, any>, data: Record<string, any>): Promise<Resource | null> {
    return await this.ResourceModel.findByIdAndUpdate(condition, data, { new: true })
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.ResourceModel.deleteOne({ _id: id })
    return result.deletedCount > 0
  }
}
