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

  /**
   * When to delete document
   */
  @ApiProperty()
  deletedAt?: Date

  /**
   * Indicate document is soft-deleted or not
   */
  @ApiProperty()
  deleted?: boolean

  constructor(model: BaseModel) {
    if (!model) return
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
    this.deleted = model.deleted
    this.deletedAt = model.deletedAt
  }
}
