import { Test, TestingModule } from '@nestjs/testing';
import { LmsProxyService } from './lms_proxy.service';

describe('LmsProxyService', () => {
  let service: LmsProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LmsProxyService],
    }).compile();

    service = module.get<LmsProxyService>(LmsProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
