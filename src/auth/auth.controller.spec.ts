import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            signup: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct dto', async () => {
      const dto: AuthDto = { name: 'test@example.com', password: 'password' };
      const expectedResult = { accessToken: 'token' };

      (authService.login as jest.Mock).mockResolvedValue(expectedResult);

      const result = await authController.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signup', () => {
    it('should call authService.signup with correct dto', async () => {
      const dto: AuthDto = { name: 'test@example.com', password: 'password' };
      const expectedResult = { id: 1, name: 'test@example.com' };

      (authService.signup as jest.Mock).mockResolvedValue(expectedResult);

      const result = await authController.signup(dto);

      expect(authService.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
