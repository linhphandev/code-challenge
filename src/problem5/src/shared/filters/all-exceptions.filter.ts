import { Response, Request } from 'express'
import * as _ from 'lodash'
import { MongoError } from 'mongodb'

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

import { ErrorCode, Exception, getMongoError } from '../exception'

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  constructor() {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let caughtException: Exception
    if (exception instanceof MongoError) {
      caughtException = getMongoError(<MongoError>exception)
    } else if (exception instanceof Exception) {
      caughtException = <Exception>exception
    } else if (exception instanceof HttpException) {
      const httpException = <HttpException>exception
      caughtException = new Exception({
        statusCode: httpException.getStatus(),
        stack: httpException.stack,
        errors: [
          {
            code: ErrorCode.INTERNAL_ERROR,
            message: httpException.message,
            ...(typeof httpException.getResponse() === 'object'
              ? <Record<string, unknown>>httpException.getResponse()
              : { code: <string>httpException.getResponse() }),
          },
        ],
      })
    } else if (exception instanceof Error) {
      const error = <Error>exception
      caughtException = new Exception({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: ErrorCode.INTERNAL_ERROR,
        message: error.message,
        stack: error.stack,
      })
    } else {
      caughtException = new Exception({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
    console.error(caughtException.stack)

    if (caughtException.errors) {
      caughtException.errors = caughtException.errors.map((error) => {
        if (error.message) {
          if (error.custom) {
            const keys = Object.keys(error.custom)
            for (let i = 0; i < keys.length; i += 1) {
              const replaceKey = new RegExp(`{{${keys[i]}}}`, 'g')
              error.message = error.message.replace(replaceKey, error.custom[keys[i]])
            }
          }
        }
        return _.pick(error, ['code', 'message', 'parameter', 'log'])
      })
    }

    response.status(caughtException.code).header('Content-Type', 'application/json').send(JSON.stringify(caughtException))
  }
}
