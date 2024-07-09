/* eslint-disable import/no-import-module-exports */
import * as transformer from '@nestjs/swagger/plugin'

module.exports.name = 'nestjs-swagger-transformer'
// you should change the version number anytime you change the configuration below
// otherwise, jest will not detect changes
module.exports.version = 1

module.exports.factory = (cs) =>
  transformer.before(
    {
      classValidatorShim: true,
      introspectComments: true,
    },
    cs.tsCompiler.program,
  )
