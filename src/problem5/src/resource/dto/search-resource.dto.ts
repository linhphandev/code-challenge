import { MinMax } from '../../shared/constants/validation-rules'
import { CheckString } from '../../shared/decorators/validation.decorator'
import { PagingDto } from '../../shared/dto/paging.dto'

export class SearchResourceDto extends PagingDto {
  @CheckString({
    optional: true,
    minMaxLength: MinMax.keyword,
    minLengthMessage: 'keyword is too short',
    maxLengthMessage: 'keyword is too long',
    typeMessage: 'keyword is invalid',
  })
  readonly keyword?: string
}
