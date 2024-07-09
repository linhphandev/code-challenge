import { ApiProperty } from '@nestjs/swagger'

import { CheckInt } from '../decorators/validation.decorator'

const pageLimit = [1, 100]
const pageCount = [1, 99999999]

export class PagingDto {
  /**
   * The page to load data
   */
  @CheckInt({ minMax: pageLimit })
  @ApiProperty()
  page: number = 1

  /**
   * The number of items per page
   */
  @CheckInt({ minMax: pageCount })
  @ApiProperty()
  limit: number = 30
}
