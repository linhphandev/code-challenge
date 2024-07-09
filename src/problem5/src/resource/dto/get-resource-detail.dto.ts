import { BaseModelDto } from '../../shared/dto/base-model.dto'
import { Resource } from '../schemas/resource.schema'

export class GetResourceDetailDto extends BaseModelDto {
  id: string

  name: string

  description?: string

  constructor(resource: Resource) {
    super(resource)
    this.id = resource._id
    this.name = resource.name
    this.description = resource.description
  }
}
