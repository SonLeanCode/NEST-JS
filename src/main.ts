import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  const config  = new DocumentBuilder()
  .setTitle('Blog APIs')
  .setDescription("List APIs By SonCode")
  .setVersion('1.0')
  .addTag('Auth')
  .addTag('User')
  .addBearerAuth() //cần add này vào là do muốn lấy  được thông tin thì phải qua bước xác thực 
  .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document)
  // swagger
  await app.listen(process.env.PORT ?? 4004);
}
bootstrap();
