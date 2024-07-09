import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: async () => ({
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resource-management',
        maxPoolSize: 10,
        autoIndex: true,
        connectionFactory: (connection) => {
          connection.once('open', async () => {
            console.log('Connected to MongoDB successfully')
          })
          connection.on('error', (error) => {
            console.error(`Failed to connect to MongoDB at ${connection.host}:${connection.port}`, error)
          })
          return connection
        },
      }),
      inject: [],
    }),
  ],
  providers: [],
})
export class AppModule {}
