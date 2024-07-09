/* eslint-disable @typescript-eslint/ban-types */
import mongoose = require('mongoose')

declare module 'mongoose' {
  type overridableMethods = 'count' | 'countDocuments' | 'find' | 'findOne' | 'findOneAndUpdate' | 'update'
  export interface PaginateOptions {
    select?: Object | string
    sort?: Object | string
    populate?: Array<Object> | Array<string> | Object | string | mongoose.QueryPopulateOptions
    lean?: boolean
    leanWithId?: boolean
    offset?: number
    page?: number
    limit?: number
  }

  interface QueryPopulateOptions {
    /** space delimited path(s) to populate */
    path: string
    /** optional fields to select */
    select?: any
    /** optional query conditions to match */
    match?: any
    /** optional model to use for population */
    model?: string | mongoose.Model<any>
    /** optional query options like sort, limit, etc */
    options?: any
    /** deep populate */
    populate?: QueryPopulateOptions | QueryPopulateOptions[]
  }

  export interface PaginateResult<T> {
    docs: Array<T>
    total: number
    limit: number
    page?: number
    pages?: number
    offset?: number
  }

  interface SoftDeleteInterface {
    /** Soft deleted ? */
    deleted?: boolean
    deleteAt?: Date
    deletedBy?: mongoose.Types.ObjectId | string | Document
  }

  export interface MongooseModel<T extends mongoose.Document, QueryHelpers = {}> extends mongoose.Model<T, QueryHelpers> {
    paginate(
      query?: Object,
      options?: PaginateOptions,
      callback?: (err: any, result: PaginateResult<T>) => void,
    ): Promise<PaginateResult<T>>

    /** Count only deleted documents */
    countDeleted: typeof mongoose.Model.count
    /** Count all documents including deleted */
    countWithDeleted: typeof mongoose.Model.count
    /** Find only deleted documents */
    findDeleted: typeof mongoose.Model.find
    /** Find all documents including deleted */
    findWithDeleted: typeof mongoose.Model.find
    /** Find One only deleted documents */
    findOneDeleted: typeof mongoose.Model.findOne
    /** Find One all documents including deleted */
    findOneWithDeleted: typeof mongoose.Model.findOne
    /** Find One And Update only deleted documents */
    findOneAndUpdateDeleted: typeof mongoose.Model.findOneAndUpdate
    /** Find One And Update all documents including deleted */
    findOneAndUpdateWithDeleted: typeof mongoose.Model.findOneAndUpdate
    /** Update only deleted documents */
    updateDeleted: typeof mongoose.Model.update
    /** Update all documents including deleted */
    updateWithDeleted: typeof mongoose.Model.update

    /**
     * Delete documents by conditions
     */
    delete(
      conditions?: any,
      deleteBy?: any,
      fn?: Callback<T, this>,
    ): QueryWithHelpers<mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number }, T, QueryHelpers>

    /**
     * Restore documents by conditions
     */
    restore(conditions?: any, fn?: Callback<T, this>): mongoose.Query<T, T> & QueryHelpers

    /**
     * Delete a document by ID
     */
    deleteById(
      id?: string | mongoose.Types.ObjectId | Callback<T, this>,
      deleteBy?: string | mongoose.Types.ObjectId | mongoose.Document | Callback<T, this>,
      fn?: Callback<T, this>,
    ): QueryWithHelpers<mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number }, T, QueryHelpers>
  }
}

interface Options {
  overrideMethods: boolean | 'all' | mongoose.overridableMethods[]
  deletedAt: boolean
  deletedBy: boolean
  indexFields: boolean | 'all' | Array<keyof mongoose.SoftDeleteInterface>
  validateBeforeDelete: boolean

  /**
   * DeleteBy Schema type, equal to
   * ```
   * Schema({
   * deletedBy: {
   *  type: options.deletedByType
   *  }
   * })
   * ```
   * @default ObjectId
   */
  deletedByType: any
}
