import { MinMax } from '../../shared/constants/validation-rules'
import { CheckString } from '../../shared/decorators/validation.decorator'

export class CreateResourceDto {
  @CheckString({
    minMaxLength: MinMax.name,
    minLengthMessage: 'name is too short',
    maxLengthMessage: 'name is too long',
    typeMessage: 'name is invalid',
  })
  readonly name: string

  @CheckString({
    optional: true,
    minMaxLength: MinMax.description,
    minLengthMessage: 'description is too short',
    maxLengthMessage: 'description is too long',
    typeMessage: 'description is invalid',
  })
  readonly description?: string
}
