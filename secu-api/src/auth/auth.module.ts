import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [JwtAuthGuard],
    exports: [JwtAuthGuard]
})
export class AuthModule {}
