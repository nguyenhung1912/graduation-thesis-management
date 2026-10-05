import { describe, it, expect, vi, beforeEach } from 'vitest';
import { studentApi } from '../studentApi.js';
import { httpClient } from '../httpClient.js';
import { API_BASE } from '../config.js';

describe('studentApi (Service Consumer Unit Tests)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call httpClient.get for getAll()', async () => {
    const mockList = [
      { id: 'SV01', fullName: 'Nguyễn Văn Nam', className: 'CNTT01', email: 'nam@soa.edu.vn', gpa: 3.5, eligible: true },
    ];
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockList);

    const result = await studentApi.getAll();

    expect(httpClient.get).toHaveBeenCalledWith(API_BASE.STUDENT);
    expect(result).toEqual(mockList);
  });

  it('should call httpClient.get with encoded ID for getById()', async () => {
    const mockStudent = { id: 'SV01', fullName: 'Nguyễn Văn Nam', className: 'CNTT01', email: 'nam@soa.edu.vn', gpa: 3.5 };
    vi.spyOn(httpClient, 'get').mockResolvedValue(mockStudent);

    const result = await studentApi.getById('SV01');

    expect(httpClient.get).toHaveBeenCalledWith(`${API_BASE.STUDENT}/SV01`);
    expect(result).toEqual(mockStudent);
  });

  it('should call httpClient.post for create() with student payload', async () => {
    const newStudent = { id: 'SV02', fullName: 'Lê Thị Mai', className: 'CNTT02', email: 'mai@soa.edu.vn', gpa: 3.8 };
    vi.spyOn(httpClient, 'post').mockResolvedValue({ ...newStudent, eligible: true });

    const result = await studentApi.create(newStudent);

    expect(httpClient.post).toHaveBeenCalledWith(API_BASE.STUDENT, newStudent);
    expect(result.id).toBe('SV02');
  });

  it('should call httpClient.put for update() with ID and payload', async () => {
    const updatePayload = { fullName: 'Lê Thị Mai Hương', className: 'CNTT02', email: 'mai@soa.edu.vn', gpa: 3.9 };
    vi.spyOn(httpClient, 'put').mockResolvedValue({ id: 'SV02', ...updatePayload, eligible: true });

    const result = await studentApi.update('SV02', updatePayload);

    expect(httpClient.put).toHaveBeenCalledWith(`${API_BASE.STUDENT}/SV02`, updatePayload);
    expect(result.fullName).toBe('Lê Thị Mai Hương');
  });

  it('should call httpClient.delete for delete()', async () => {
    vi.spyOn(httpClient, 'delete').mockResolvedValue({ message: 'Đã xóa sinh viên thành công' });

    const result = await studentApi.delete('SV02');

    expect(httpClient.delete).toHaveBeenCalledWith(`${API_BASE.STUDENT}/SV02`);
    expect(result.message).toContain('Đã xóa');
  });

  it('should call httpClient.get on /eligibility for checkEligibility()', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ studentId: 'SV01', eligible: true });

    const result = await studentApi.checkEligibility('SV01');

    expect(httpClient.get).toHaveBeenCalledWith(`${API_BASE.STUDENT}/SV01/eligibility`);
    expect(result.eligible).toBe(true);
  });
});
