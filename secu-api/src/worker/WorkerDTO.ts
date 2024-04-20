import { Expose } from 'class-transformer';

export class WorkerDTO {
    @Expose({ groups: ['basic'] })
    nom: string;

    @Expose({ groups: ['basic'] })
    prenom: string;

    @Expose({ groups: ['admin'] })
    salaire: number;
}
