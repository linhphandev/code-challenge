import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { v4 } from 'uuid'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { BaseModel } from '../../shared/base-model'

@Schema({
  _id: false,
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    },
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    },
  },
})
export class Resource extends BaseModel {
  @Prop({
    type: String,
    default: v4,
  })
  _id: string

  @Prop({
    required: true,
    trim: true,
  })
  name: string

  @Prop({
    trim: true,
  })
  description?: string
}

export const ResourceSchema = SchemaFactory.createForClass(Resource)

ResourceSchema.index({ createdAt: 1 })
ResourceSchema.index({ name: 1 })

ResourceSchema.plugin(mongoosePaginate)

export type ResourceDocument = Resource & mongoose.Document
