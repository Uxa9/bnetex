import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./pipes/validation.pipe";

async function  start() {
    const PORT = process.env.PORT || 5000;
    const app  = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Bnetex client API')
        .setDescription('API for connection between Bnetex terminal and DB')
        .setVersion('0.0.1')
        // .addTag('bnetex')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document, {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        }
    });

    app.useGlobalPipes(new ValidationPipe());

    app.enableCors();

    await app.listen(PORT, () => console.log(`server started on ${PORT} port`));
}

start();