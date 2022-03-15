import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    try {
      const jwt = req.cookies['jwt'];
      return this.jwtService.verify(jwt);
    } catch (error) {
      return false;
    }
  }
}
