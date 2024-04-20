import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  providers: [WorkerService],
  controllers: [WorkerController]
})
export class WorkerModule {}
