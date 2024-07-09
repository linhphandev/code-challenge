import * as express from 'express'
import * as helmet from 'helmet'

import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use((helmet as any)())
  app.use(express.urlencoded({ extended: false }))

  // Register middlewares, pipes, and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      },
      whitelist: true,
    }),
  )
  app.useGlobalFilters(new AllExceptionsFilter())

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  const swaggerBuilderConfig = new DocumentBuilder()
    .setTitle('Resource Management API document')
    .setDescription('API document for Resource Management')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-access-token',
      },
      'bearer',
    )
    .build()
  const document = SwaggerModule.createDocument(app, swaggerBuilderConfig)
  SwaggerModule.setup('/docs', app, document)

  const appPost = parseInt(process.env.PORT || '3000', 10)
  const appHost = process.env.HOST || '0.0.0.0'
  await app.listen(appPost, appHost)
  console.log(`resource-management-api (${appPost}) worker ${process.pid} is running on: ${await app.getUrl()}`)
}

bootstrap()
