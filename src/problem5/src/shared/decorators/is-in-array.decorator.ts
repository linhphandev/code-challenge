import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function IsInArray(values: any[] | Record<string, any>, ignoreCase = false, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isInArray',
      target: object.constructor,
      propertyName,
      constraints: [values, ignoreCase],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let _values = args.constraints[0]
          const _ignoreCase = args.constraints[1]
          if (!Array.isArray(_values)) {
            _values = Object.values(_values)
          }
          if (_ignoreCase) {
            return _values.find((item) => String(item).toLowerCase() === String(value).toLowerCase())
          }
          return _values.includes(value)
        },
      },
    })
  }
}
