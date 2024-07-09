import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { DocumentIdPipe } from '../shared/pipes/document-id.pipe'
import { CreateResourceDto } from './dto/create-resource.dto'
import { GetResourceDetailDto } from './dto/get-resource-detail.dto'
import { ListResourceDto } from './dto/list-resource-item.dto'
import { SearchResourceDto } from './dto/search-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { ResourceService } from './resource.service'

@ApiTags('Resource')
@Controller('resources')
@ApiBearerAuth()
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @ApiOkResponse({ type: GetResourceDetailDto })
  @ApiOperation({
    summary: 'Create a resource',
  })
  async create(@Body() createResource: CreateResourceDto) {
    const resource = await this.resourceService.create(createResource)
    return resource
  }

  @Get()
  @ApiOkResponse({ type: ListResourceDto })
  @ApiOperation({
    summary: 'Get list resources with basic filters.',
  })
  async list(@Query() dto: SearchResourceDto) {
    const resource = await this.resourceService.list(dto)
    return resource
  }

  @Get(':id')
  @ApiOkResponse({ type: GetResourceDetailDto })
  @ApiOperation({
    summary: 'Get details of a resource.',
  })
  async get(@Param('id', DocumentIdPipe) id: string) {
    const resource = await this.resourceService.get(id)
    return resource
  }

  @Put('/:id')
  @ApiOkResponse({ type: GetResourceDetailDto })
  @ApiOperation({
    summary: 'Update a resource',
  })
  async update(@Param('id', DocumentIdPipe) id: string, @Body() updateResource: UpdateResourceDto) {
    const resource = await this.resourceService.update(id, updateResource)
    return resource
  }

  @Delete('/:id')
  @ApiOkResponse({
    schema: {
      properties: {
        result: {
          type: 'string',
          example: 'success',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Delete a resource',
  })
  async delete(@Param('id', DocumentIdPipe) id: string) {
    await this.resourceService.delete(id)
    return { result: 'success' }
  }
}
