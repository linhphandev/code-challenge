export type ClassType<T = any> = new (...args: any[]) => T

export class BaseModel {
  createdAt?: Date

  updatedAt?: Date

  deletedAt?: Date

  deleted?: boolean
}
