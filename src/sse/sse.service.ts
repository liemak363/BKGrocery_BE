import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { BadRequestException } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class SseService {
  private clients: Map<number, Subject<MessageEvent>> = new Map();

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.eventEmitter.on(
      'products.updated',
      ({ userId, products }: { userId: number; products: unknown }) => {
        this.sendToUser(userId, {
          event: 'products.updated',
          data: products,
        });
      },
    );
  }

  testSse(userId: number) {
    this.eventEmitter.emit('products.updated', { userId, products: 'ok' });
  }

  addClient(userId: number) {
    if (this.clients.has(userId)) {
      return this.clients.get(userId);
    }
    const subject = new Subject<MessageEvent>();
    this.clients.set(userId, subject);
    return subject;
  }

  removeClient(userId: number) {
    this.clients.delete(userId);
  }

  sendToUser(userId: number, data: any) {
    const subject = this.clients.get(userId);
    if (subject) {
      subject.next({ data: JSON.stringify(data) } as MessageEvent);
    }
  }

  // getTempToken(userId: number): string {
  //   const payload = { sub: userId };
  //   const jwtSecret = this.config.get<string>('JWT_SECRET_TEMP');
  //   if (!jwtSecret) {
  //     throw new Error('JWT_SECRET_TEMP is not defined in the configuration');
  //   }
  //   return this.jwt.sign(payload, {
  //     secret: jwtSecret,
  //     expiresIn: '5m', // Set the expiration time as needed
  //   });
  // }

  // getUserIdFromTempToken(tempToken: string): number {
  //   const secret = this.config.get<string>('JWT_SECRET_TEMP');
  //   if (!secret) {
  //     throw new Error('JWT_SECRET_TEMP is not defined in the configuration');
  //   }
  //   try {
  //     const payload = jwt.verify(tempToken, secret) as { sub: string | number };
  //     const userId = payload.sub;
  //     if (typeof userId === 'number') {
  //       return userId;
  //     }
  //     if (typeof userId === 'string' && !isNaN(Number(userId))) {
  //       return Number(userId);
  //     }
  //     throw new Error('Invalid or missing sub in token payload');
  //   } catch (error) {
  //     if (error instanceof jwt.JsonWebTokenError) {
  //       throw new BadRequestException('Invalid or expired temporary token');
  //     }
  //     throw error;
  //   }
  // }
}
