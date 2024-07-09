import { ApiProperty } from '@nestjs/swagger'

import { BaseModel } from '../base-model'

export class BaseModelDto {
  /**
   * When to create document
   */
  @ApiProperty()
  createdAt?: Date

  /**
   * When to update document
   */
  @ApiProperty()
  updatedAt?: Date

  constructor(model: BaseModel) {
    if (!model) return
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}
