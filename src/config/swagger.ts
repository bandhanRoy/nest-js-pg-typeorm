import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Nest JS POC')
  .setDescription('The nest js poc description')
  .setVersion('1.0')
  .addTag('auth')
  .addTag('user')
  .addTag('health')
  .addBearerAuth()
  .build();
