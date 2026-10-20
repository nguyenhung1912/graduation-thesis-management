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

  it('should call httpClient.post for create() with registration payload', async () => {
    const newReg = { studentId: 'SV02', thesisId: 'DT02', status: 'REGISTERED' };
    vi.spyOn(httpClient, 'post').mockResolvedValue({ id: 2, ...newReg });

    const result = await registrationApi.create(newReg);

    expect(httpClient.post).toHaveBeenCalledWith(API_BASE.REGISTRATION, newReg);
    expect(result.id).toBe(2);
  });

  it('should call httpClient.patch for updateStatus() with status payload', async () => {
    const updatedItem = { id: 1, studentId: 'SV01', thesisId: 'DT01', status: 'Đã duyệt' };
    vi.spyOn(httpClient, 'patch').mockResolvedValue(updatedItem);

    const result = await registrationApi.updateStatus(1, 'Đã duyệt');

    expect(httpClient.patch).toHaveBeenCalledWith(
      `${API_BASE.REGISTRATION}/1/status`,
      { status: 'Đã duyệt' }
    );
    expect(result).toEqual(updatedItem);
  });

  it('should call httpClient.delete for delete() with encoded ID', async () => {
    vi.spyOn(httpClient, 'delete').mockResolvedValue(null);

    const result = await registrationApi.delete(1);

    expect(httpClient.delete).toHaveBeenCalledWith(`${API_BASE.REGISTRATION}/1`);
    expect(result).toBeNull();
  });
});
