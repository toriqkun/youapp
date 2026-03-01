import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../../schemas/user.schema';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let model: any;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'mockId',
    email: 'test@example.com',
    username: 'tester',
    password: 'hashedPassword',
    save: jest.fn().mockResolvedValue({
      _id: 'mockId',
      email: 'test@example.com',
      username: 'tester',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            new: jest.fn().mockImplementation(() => mockUser),
            constructor: jest.fn().mockReturnValue(mockUser),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if email exists', async () => {
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(true) });
      await expect(service.register({ email: 'test@example.com', username: 'u', password: 'p' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.login({ email: 'wrong@e.com', password: 'p' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
