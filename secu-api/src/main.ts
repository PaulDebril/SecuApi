import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WorkerService } from './worker/worker.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const workerService = app.get(WorkerService);
    workerService.testSerialization();
    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000`);
}

bootstrap();
