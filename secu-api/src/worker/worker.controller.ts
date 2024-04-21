import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/RolesGuards';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('workers')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) {}

    @Get()
    findAll(@Req() req: any) {
        return this.workerService.findAll(req);
    }

    @Get(':employee_id')
    getById(@Param('employee_id') employee_id: string, @Req() req: any) {
        return this.workerService.getById(employee_id, req);
    }

    @Post()
    create(@Body() workerData: any) {
        return this.workerService.create(workerData);
    }

    @Put(':employee_id')
    update(@Param('employee_id') employee_id: string, @Body() updateData: any) {
        return this.workerService.update(employee_id, updateData);
    }

    @Delete(':employee_id')
    delete(@Param('employee_id') employee_id: string) {
        return this.workerService.delete(employee_id);
    }
}
