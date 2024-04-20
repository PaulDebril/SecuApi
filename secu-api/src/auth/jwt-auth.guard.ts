import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private httpService: HttpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization token provided');
        }
        const token = authHeader.split(' ')[1];
        return this.validateToken(token);

        
    }

    private async validateToken(token: string): Promise<boolean> {
        try {
            const decoded = jwt.decode(token, { complete: true });
            if (!decoded) {
                throw new BadRequestException('Invalid token format');
            }

            if (decoded['exp'] && Date.now() >= decoded['exp'] * 1000) {
                throw new UnauthorizedException('Token has expired');
            }

            const response = await firstValueFrom(
                this.httpService.get(`http://localhost:4500/introspect?token=${token}`)
            );

            if (!response.data.success) {
                throw new UnauthorizedException('Invalid token according to introspection');
            }
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else if (error.response && error.response.data && error.response.data.message) {
                throw new UnauthorizedException(`Introspection error: ${error.response.data.message}`);
            } else {
                throw new UnauthorizedException(`Token validation error: ${error.message || 'Unknown error'}`);
            }
        }
    }
}
