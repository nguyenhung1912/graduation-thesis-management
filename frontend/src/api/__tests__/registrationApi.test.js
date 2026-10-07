import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registrationApi } from '../registrationApi.js';
import { httpClient } from '../httpClient.js';
import { API_BASE } from '../config.js';

describe('registrationApi (Service Consumer Unit Tests)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call httpClient.get for getAll()', async () => {
    const mockList = [
      { id: 'DK01', studentId: 'SV01', thesisId: 'DT01', registrationDate: '2026-10-05' },
    ];
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockList);

    const result = await registrationApi.getAll();

    expect(httpClient.get).toHaveBeenCalledWith(API_BASE.REGISTRATION);
    expect(result).toEqual(mockList);
  });

  it('should call httpClient.get with encoded ID for getById()', async () => {
    const mockItem = { id: 'DK01', studentId: 'SV01', thesisId: 'DT01' };
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockItem);

    const result = await registrationApi.getById('DK01');

    expect(httpClient.get).toHaveBeenCalledWith(`${API_BASE.REGISTRATION}/DK01`);
    expect(result).toEqual(mockItem);
  });

  it('should call httpClient.post for create() with registration payload', async () => {
    const newReg = { studentId: 'SV02', thesisId: 'DT02' };
    vi.spyOn(httpClient, 'post').mockResolvedValue({ id: 'DK02', ...newReg });

    const result = await registrationApi.create(newReg);

    expect(httpClient.post).toHaveBeenCalledWith(API_BASE.REGISTRATION, newReg);
    expect(result.id).toBe('DK02');
  });

  it('should call httpClient.put on /scores for updateScores()', async () => {
    const scorePayload = { advisorScore: 8.5, reviewerScore: 8.0, defenseScore: 9.0, totalScore: 8.6 };
    vi.spyOn(httpClient, 'put').mockResolvedValue({ id: 'DK01', ...scorePayload });

    const result = await registrationApi.updateScores('DK01', scorePayload);

    expect(httpClient.put).toHaveBeenCalledWith(
      `${API_BASE.REGISTRATION}/DK01/scores`,
      scorePayload
    );
    expect(result.totalScore).toBe(8.6);
  });

  it('should call httpClient.delete for delete()', async () => {
    vi.spyOn(httpClient, 'delete').mockResolvedValue({ message: 'Đã hủy đăng ký thành công' });

    const result = await registrationApi.delete('DK01');

    expect(httpClient.delete).toHaveBeenCalledWith(`${API_BASE.REGISTRATION}/DK01`);
    expect(result.message).toContain('Đã hủy đăng ký');
  });
});
