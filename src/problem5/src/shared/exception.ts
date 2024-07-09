// eslint-disable-next-line max-classes-per-file
import { ValidationError } from 'class-validator'
import * as _ from 'lodash'
import { MongoError } from 'mongodb'

import { HttpStatus } from '@nestjs/common'

export const enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CAMPAIGN_ERROR = 'CAMPAIGN_ERROR',
  BLOCKED_USER_ERROR = 'BLOCKED_USER_ERROR',
  OVER_LIMIT = 'OVER_LIMIT',
}

export interface ISubError {
  code: ErrorCode
  message?: string
  parameter?: string
  log?: string
  custom?: Record<string, string>
}

export class Exception extends Error {
  public code: HttpStatus

  public errors?: ISubError[]

  public stack?: string

  public payload?: any

  constructor(params?: {
    statusCode: HttpStatus
    code?: ErrorCode
    message?: string
    parameter?: string
    log?: string
    stack?: string
    payload?: any
    custom?: Record<string, string>
    errors?: ISubError | ISubError[]
  }) {
    const {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      code = ErrorCode.INTERNAL_ERROR,
      message,
      parameter,
      log,
      stack,
      payload,
      custom,
      errors,
    } = params || {}
    super()
    this.code = statusCode
    this.stack = stack
    this.payload = payload
    this.stack = stack
    this.errors = _.flatten([
      errors || {
        code,
        message,
        parameter,
        log,
        custom,
      },
    ])
    this.errors = <ISubError[]>this.errors.map((e) => _.omitBy(e, _.isUndefined))
  }
}

const traverseErrors = (errors: ValidationError[], prefix = ''): ISubError[] =>
  _.compact(
    errors.reduce((acc: ISubError[], cur: ValidationError) => {
      const parameter = prefix === '' ? cur.property : `${prefix}.${cur.property}`
      if (!cur) {
        return acc
      }
      if (cur.children && cur.children.length > 0) {
        acc.push(...traverseErrors(cur.children, parameter))
      }
      if (cur.constraints) {
        const errorItems = Object.keys(cur.constraints).map((key) => ({
          parameter,
          code: (cur.contexts && cur.contexts.errorCode) || ErrorCode.INVALID_PARAMETER,
          message: cur.constraints && cur.constraints[key],
        }))
        acc.push(...errorItems)
      }
      return acc
    }, []),
  )

export class ValidationException extends Exception {
  constructor(property: string, constraints?: string | { [type: string]: string }, errorCode?: ErrorCode) {
    const validationError = new ValidationError()
    validationError.property = property
    validationError.constraints = typeof constraints === 'string' ? { match: constraints } : constraints
    validationError.contexts = {
      errorCode,
    }
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      errors: traverseErrors([validationError]),
    })
  }
}

export class NotFoundException extends Exception {
  constructor(message?: string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      errors: [
        {
          code: ErrorCode.NOT_FOUND,
          message,
        },
      ],
    })
  }
}

export class UnauthorizedException extends Exception {
  constructor(message?: string) {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      errors: [
        {
          code: ErrorCode.AUTHENTICATION_ERROR,
          message,
        },
      ],
    })
  }
}

export class TooManyRequestsException extends Exception {
  constructor(message?: string, custom?: Record<string, string>) {
    super({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      errors: [
        {
          code: ErrorCode.OVER_LIMIT,
          message,
          custom,
        },
      ],
    })
  }
}

export const transformValidationErrors = (errors: ValidationError[]): Exception =>
  new Exception({
    statusCode: HttpStatus.BAD_REQUEST,
    errors: traverseErrors(errors),
  })

export const getMongoError = (error: MongoError): Exception => {
  if (error.code === 11000) {
    return new Exception({
      statusCode: HttpStatus.CONFLICT,
      errors: [
        {
          code: ErrorCode.DUPLICATE,
          message: 'duplicate key entry',
        },
      ],
    })
  }

  return new Exception({
    statusCode: HttpStatus.BAD_REQUEST,
    message: error.message,
  })
}
