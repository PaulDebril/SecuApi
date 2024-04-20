import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { WorkerDTO } from './WorkerDTO';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class WorkerService {

    getWorkerData(workerInstance): WorkerDTO {
        const requestRoles = workerInstance.request.roles; // Assurez-vous que les rôles sont disponibles dans l'instance

        return instanceToPlain(workerInstance, { groups: requestRoles }) as WorkerDTO;
    }
    
    private readonly workersPath = path.join(__dirname, '../../worker.json');

    private readWorkersFile() {
        const jsonData = fs.readFileSync(this.workersPath, 'utf-8');
        return JSON.parse(jsonData);
    }

    private writeWorkersFile(data: any) {
        fs.writeFileSync(this.workersPath, JSON.stringify(data, null, 2), 'utf-8');
    }

    
    findAll() {
        return this.readWorkersFile();
    }

    getById(employee_id: string) {
        const workers = this.readWorkersFile();
        const worker = workers.find(w => w.employee_id === employee_id);
        if (!worker) {
            throw new NotFoundException('Worker not found');
        }
        return worker;
    }

    create(workerData: any) {
        const workers = this.readWorkersFile();
        workers.push(workerData);
        this.writeWorkersFile(workers);
        return workerData;
    }

    update(employee_id: string, updateData: any) {
        const workers = this.readWorkersFile();
        const workerIndex = workers.findIndex(w => w.employee_id === employee_id);
        if (workerIndex === -1) {
            throw new NotFoundException('Worker not found');
        }
        workers[workerIndex] = { ...workers[workerIndex], ...updateData };
        this.writeWorkersFile(workers);
        return workers[workerIndex];
    }

    delete(employee_id: string) {
        const workers = this.readWorkersFile();
        const index = workers.findIndex(w => w.employee_id === employee_id);
        if (index === -1) {
            throw new NotFoundException('Worker not found');
        }
        workers.splice(index, 1);
        this.writeWorkersFile(workers);
        return { deleted: true };
    }
}
