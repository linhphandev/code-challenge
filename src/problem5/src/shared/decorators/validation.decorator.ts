import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

import { applyDecorators } from '@nestjs/common'

import { IsInArray } from './is-in-array.decorator'

export type ValidationMessage = string | ((validationArguments: ValidationArguments) => string)

export function CheckInt(options?: {
  minMax?: number[]
  optional?: boolean
  typeMessage?: ValidationMessage
  minMessage?: ValidationMessage
  maxMessage?: ValidationMessage
  optionalMessage?: ValidationMessage
}) {
  const { minMax = [], optional = false, typeMessage, minMessage, maxMessage, optionalMessage } = options || {}
  const [min, max] = minMax
  return applyDecorators(
    IsInt({ message: typeMessage }),
    ...(optional ? [IsOptional({ message: optionalMessage })] : []),
    ...(min !== undefined ? [Min(min, { message: minMessage })] : []),
    ...(max !== undefined ? [Max(max, { message: maxMessage })] : []),
  )
}

export function CheckString(options?: {
  minMaxLength?: number[]
  patternMatch?: {
    pattern: string | RegExp
    modifiers?: string
  }
  email?: boolean
  phone?: {
    enabled: boolean
    countryCode?: string
  }
  array?: {
    values: any[] | Record<string, any>
    ignoreCase?: boolean
  }
  optional?: boolean
  typeMessage?: ValidationMessage
  minLengthMessage?: ValidationMessage
  maxLengthMessage?: ValidationMessage
  patternMessage?: ValidationMessage
  emailMessage?: ValidationMessage
  phoneMessage?: ValidationMessage
  arrayMessage?: ValidationMessage
  optionalMessage?: ValidationMessage
}) {
  const {
    minMaxLength = [],
    patternMatch,
    email,
    phone,
    array,
    optional = false,
    typeMessage,
    minLengthMessage,
    maxLengthMessage,
    patternMessage,
    emailMessage,
    arrayMessage,
    optionalMessage,
  } = options || {}
  const [min, max] = minMaxLength
  const { values, ignoreCase } = array || {}
  return applyDecorators(
    IsString({ message: typeMessage }),
    ...(optional ? [IsOptional({ message: optionalMessage })] : []),
    ...(min !== undefined ? [MinLength(min, { message: minLengthMessage })] : []),
    ...(max !== undefined ? [MaxLength(max, { message: maxLengthMessage })] : []),
    ...(patternMatch !== undefined ? [Matches(new RegExp(patternMatch.pattern, patternMatch.modifiers), { message: patternMessage })] : []),
    ...(email === true ? [IsEmail({}, { message: emailMessage })] : []),
    ...(array !== undefined && values !== undefined ? [IsInArray(values, ignoreCase, { message: arrayMessage })] : []),
  )
}

export function IsDateGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]

          if (relatedValue instanceof Date && value instanceof Date) {
            return value > relatedValue
          }

          return false
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          return `${propertyName} must be larger than ${relatedPropertyName}`
        },
      },
    })
  }
}
