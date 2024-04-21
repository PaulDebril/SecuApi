import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { WorkerDTO } from './WorkerDTO';
import { ClassTransformOptions, instanceToPlain } from 'class-transformer';

@Injectable()
export class WorkerService {

    getWorkerData(workerInstance: any, roles: string[]): WorkerDTO {
        const workerDTO = new WorkerDTO();
        Object.assign(workerDTO, workerInstance);
    
        const options: ClassTransformOptions = { groups: roles };
        console.log('Object to be serialized (DTO instance):', workerDTO);
        return instanceToPlain(workerDTO, options) as WorkerDTO;
    }
    
    
    private readonly workersPath = path.join(__dirname, '../../worker.json');

    private readWorkersFile() {
        const jsonData = fs.readFileSync(this.workersPath, 'utf-8');
        return JSON.parse(jsonData);
    }

    private writeWorkersFile(data: any) {
        fs.writeFileSync(this.workersPath, JSON.stringify(data, null, 2), 'utf-8');
    }

    

    findAll(req: any) {
        console.log('Roles actuels:', req.userRoles);
        const workers = this.readWorkersFile();
        const filteredWorkers = workers.map(worker => this.getWorkerData(worker, req.userRoles));
        console.log('Données filtrées:', filteredWorkers);
        return filteredWorkers;
    }
    
    
    getById(employee_id: string, req: any) {
        const workers = this.readWorkersFile();
        const worker = workers.find(w => w.employee_id === employee_id);
        if (!worker) {
            throw new NotFoundException('Worker not found');
        }
        return this.getWorkerData(worker, req.userRoles);
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

    testSerialization() {
        const workerInstance = new WorkerDTO();
        workerInstance.first_name = 'Test';
        workerInstance.last_name = 'User';
        workerInstance.employee_id = 'W12345';
        workerInstance.bank_account_number = 'GB99TEST123456789';
        workerInstance.monthly_salary = 5000;
        workerInstance.national_id_number = '1234567890';
    
        const roles = ['payroll'];
        const options: ClassTransformOptions = { groups: roles };
        const result = instanceToPlain(workerInstance, options);
        console.log('Test Serialized Data:', result);
    }
    
}
