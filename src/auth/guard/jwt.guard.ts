import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

export class JwtLogoutGuard extends AuthGuard('jwt-logout') {
  constructor() {
    super();
  }
}
