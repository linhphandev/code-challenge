import * as _ from 'lodash'

import { Injectable } from '@nestjs/common'

import { NotFoundException, BadRequestException } from '../shared/exception'
import { CreateResourceDto } from './dto/create-resource.dto'
import { GetResourceDetailDto } from './dto/get-resource-detail.dto'
import { ListResourceDto, ListResourceItemDto } from './dto/list-resource-item.dto'
import { SearchResourceDto } from './dto/search-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { ResourceRepository } from './resource.repository'
import { Resource } from './schemas/resource.schema'

@Injectable()
export class ResourceService {
  constructor(private readonly resourceRepo: ResourceRepository) {}

  async create(body: CreateResourceDto): Promise<GetResourceDetailDto> {
    const resource = await this.resourceRepo.create(body)
    return new GetResourceDetailDto(resource)
  }

  async update(id: string, body: UpdateResourceDto): Promise<GetResourceDetailDto> {
    const resource = await this.resourceRepo.update({ _id: id }, body)
    if (!resource) {
      throw new NotFoundException('Resource not found')
    }
    return new GetResourceDetailDto(resource!)
  }

  async list(dto: SearchResourceDto): Promise<ListResourceDto> {
    const { page = 1, limit = 30 } = dto
    let condition = {}

    const { keyword = '' } = dto
    if (keyword) {
      condition = { name: { $regex: dto.keyword, $options: 'i' } }
    }

    const resources = await this.resourceRepo.list(
      { ...condition },
      {
        page,
        limit,
      },
    )
    return {
      docs: resources.docs.map((item: Resource) => new ListResourceItemDto(item)),
      limit: resources.limit,
      total: resources.total,
      page: resources.page,
      pages: resources.pages,
    }
  }

  async get(id: string): Promise<GetResourceDetailDto> {
    const resource = await this.resourceRepo.findById(id)
    if (!resource) {
      throw new NotFoundException('Resource not found')
    }
    return new GetResourceDetailDto(resource)
  }

  async delete(id: string): Promise<void> {
    const result = await this.resourceRepo.deleteById(id)
    if (!result) {
      throw new BadRequestException('Delete resource failed')
    }
  }
}
