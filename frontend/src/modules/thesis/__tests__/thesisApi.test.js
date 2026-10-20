import { describe, it, expect, vi, beforeEach } from 'vitest';
import { thesisApi } from '../api/thesisApi.js';
import { httpClient } from '../../../core/http/httpClient.js';
import { API_BASE } from '../../../core/gateway/config.js';

describe('thesisApi (Service Consumer Unit Tests)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call httpClient.get for getAll()', async () => {
    const mockList = [
      { id: 'DT01', title: 'SOA Spring', instructor: 'TS. A', maxStudents: 3, currentStudents: 1 },
    ];
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockList);

    const result = await thesisApi.getAll();

    expect(httpClient.get).toHaveBeenCalledWith(API_BASE.THESIS);
    expect(result).toEqual(mockList);
  });

  it('should call httpClient.post for create() with payload', async () => {
    const newThesis = { id: 'DT04', title: 'AI in Cloud', instructor: 'TS. D', maxStudents: 2 };
    vi.spyOn(httpClient, 'post').mockResolvedValue({ ...newThesis, currentStudents: 0 });

    const result = await thesisApi.create(newThesis);

    expect(httpClient.post).toHaveBeenCalledWith(API_BASE.THESIS, newThesis);
    expect(result.id).toBe('DT04');
  });

  it('should call httpClient.put for update() with ID and payload', async () => {
    const updatePayload = { title: 'AI in Cloud Updated', instructor: 'TS. D', maxStudents: 3 };
    vi.spyOn(httpClient, 'put').mockResolvedValue({ id: 'DT04', ...updatePayload, currentStudents: 0 });

    const result = await thesisApi.update('DT04', updatePayload);

    expect(httpClient.put).toHaveBeenCalledWith(`${API_BASE.THESIS}/DT04`, updatePayload);
    expect(result.title).toBe('AI in Cloud Updated');
  });

  it('should call httpClient.delete for delete()', async () => {
    vi.spyOn(httpClient, 'delete').mockResolvedValue({ message: 'Đã xoá đề tài thành công' });

    const result = await thesisApi.delete('DT04');

    expect(httpClient.delete).toHaveBeenCalledWith(`${API_BASE.THESIS}/DT04`);
    expect(result.message).toContain('Đã xoá');
  });
});
