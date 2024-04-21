import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private httpService: HttpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        console.log('Authorization Header:', req.headers.authorization);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No authorization token provided');
            throw new UnauthorizedException('No authorization token provided');
        }

        const token = authHeader.split(' ')[1];
        console.log('JWT Token:', token);

        try {
            const tokenRoles = await this.getTokenRoles(token);
            console.log('Token Roles:', tokenRoles);

            if (tokenRoles && tokenRoles.length > 0) {
                req.userRoles = tokenRoles;
                return true;
            } else {
                console.log('No roles found in token');
                throw new UnauthorizedException('No roles found in token');
            }
        } catch (error) {
            console.error('Error in canActivate:', error);
            throw error;
        }
    }

    private async getTokenRoles(token: string): Promise<string[]> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`http://localhost:4500/introspect?token=${token}`)
            );
            console.log('Introspection Response:', response.data);
            return response.data.data.roles;
        } catch (error) {
            console.error('Error in getTokenRoles:', error);
            throw new UnauthorizedException('Token validation error');
        }
    }
}
