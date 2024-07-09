import { BaseModelDto } from '../../shared/dto/base-model.dto'
import { PaginateResultDto } from '../../shared/dto/paginate-result.dto'
import { Resource } from '../schemas/resource.schema'

export class ListResourceItemDto extends BaseModelDto {
  id: string

  name: string

  constructor(resource: Resource) {
    super(resource)
    this.id = resource._id
    this.name = resource.name
  }
}

export class ListResourceDto extends PaginateResultDto(ListResourceItemDto) {}
