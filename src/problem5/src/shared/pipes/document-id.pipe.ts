import { ValidationError } from 'class-validator'

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

import { MinMax } from '../constants/validation-rules'
import { transformValidationErrors } from '../exception'

@Injectable()
export class DocumentIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (value === undefined || value === null) {
      return value
    }
    const [min, max] = MinMax.id
    if (min !== undefined && value.length < min) {
      const validationError = new ValidationError()
      validationError.property = metadata.data || 'id'
      validationError.constraints = { min: `${validationError.property} is too short` }
      throw transformValidationErrors([validationError])
    }
    if (max !== undefined && value.length > max) {
      const validationError = new ValidationError()
      validationError.property = metadata.data || 'id'
      validationError.constraints = { min: `${validationError.property} is too long` }
      throw transformValidationErrors([validationError])
    }
    return value
  }
}
