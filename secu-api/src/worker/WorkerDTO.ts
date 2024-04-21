import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WorkerDTO {
    @Expose({ groups: ['basic', 'identity','payroll'] })
    employee_id: string;

    @Expose({ groups: ['basic', 'identity','payroll']})
    first_name: string;

    @Expose({ groups: ['basic', 'identity','payroll'] })
    last_name: string;

    @Expose({ groups: ['payroll'] })
    bank_account_number: string;

    @Expose({ groups: ['payroll'] })
    monthly_salary: number;

    @Expose({ groups: ['identity'] })
    national_id_number: string;
}
