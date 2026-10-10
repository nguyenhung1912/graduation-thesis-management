import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registrationApi } from '../api/registrationApi.js';
import { httpClient } from '../../../core/http/httpClient.js';
import { API_BASE } from '../../../core/gateway/config.js';

describe('registrationApi (Service Consumer Unit Tests)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call httpClient.get for getAll()', async () => {
    const mockList = [
      { id: 1, studentId: 'SV01', thesisId: 'DT01', status: 'REGISTERED' },
    ];
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockList);

    const result = await registrationApi.getAll();

    expect(httpClient.get).toHaveBeenCalledWith(API_BASE.REGISTRATION);
    expect(result).toEqual(mockList);
  });

  it('should call httpClient.get with encoded ID for getById()', async () => {
    const mockItem = { id: 1, studentId: 'SV01', thesisId: 'DT01', status: 'REGISTERED' };
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockItem);

    const result = await registrationApi.getById('1');

    expect(httpClient.get).toHaveBeenCalledWith(`${API_BASE.REGISTRATION}/1`);
    expect(result).toEqual(mockItem);
  });

  it('should call httpClient.post for create() with registration payload', async () => {
    const newReg = { studentId: 'SV02', thesisId: 'DT02', status: 'REGISTERED' };
    vi.spyOn(httpClient, 'post').mockResolvedValue({ id: 2, ...newReg });

    const result = await registrationApi.create(newReg);

    expect(httpClient.post).toHaveBeenCalledWith(API_BASE.REGISTRATION, newReg);
    expect(result.id).toBe(2);
  });
});
