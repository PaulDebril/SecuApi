import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('workers')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) {}

    @Get()
    findAll() {
        return this.workerService.findAll();
    }

    @Get(':employee_id')
    getById(@Param('employee_id') employee_id: string) {
        return this.workerService.getById(employee_id);
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

    @Get()
    getWorker() {
        const worker = { nom: 'John', prenom: 'Doe', salaire: 50000, request: { roles: ['basic'] } }; // Exemple d'objet worker
        return this.workerService.getWorkerData(worker);
    }
}
