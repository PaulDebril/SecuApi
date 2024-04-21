import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private httpService: HttpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        //console.log('Authorization Header:', req.headers.authorization); // Log de l'en-tête d'autorisation

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization token provided');
        }

        const token = authHeader.split(' ')[1];
        //console.log('JWT Token:', token); // Log du token JWT extrait

        try {
            const tokenRoles = await this.getTokenRoles(token);
            //console.log('Token Roles:', tokenRoles); // Log des rôles extraits du token

            if (tokenRoles && tokenRoles.length > 0) {
                req.userRoles = tokenRoles;
                return true;
            } else {
                throw new UnauthorizedException('No roles found in token');
            }
        } catch (error) {
            //console.error('Error in canActivate:', error); // Log des erreurs survenues
            throw error;
        }
    }

    private async getTokenRoles(token: string): Promise<string[]> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`http://localhost:4500/introspect?token=${token}`)
            );
            //console.log('Introspection Response:', response.data); // Log de la réponse de l'endpoint d'introspection
            return response.data.data.roles; // Ajout de .data avant .roles
        } catch (error) {
            //console.error('Error in getTokenRoles:', error); // Log des erreurs dans la récupération des rôles
            throw new UnauthorizedException('Token validation error');
        }
    }
}
