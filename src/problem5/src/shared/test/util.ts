import { ModuleMetadata } from '@nestjs/common'

export function getTestingGlobalModule(metadata?: ModuleMetadata) {
  const { imports = [], providers = [], controllers = [] } = metadata || {}
  return {
    imports: [...imports],
    providers: [...providers],
    controllers,
  }
}
