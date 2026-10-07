import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { httpClient, ApiError } from '../httpClient.js';

describe('httpClient (SRP Unit Tests)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should perform GET request and parse JSON successfully', async () => {
    const mockData = [{ id: 'DT01', title: 'SOA Project' }];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData,
    });

    const result = await httpClient.get('http://localhost:8082/api/theses');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8082/api/theses',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it('should handle 204 No Content returning null', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    });

    const result = await httpClient.delete('http://localhost:8082/api/theses/DT01');
    expect(result).toBeNull();
  });

  it('should perform POST request with JSON stringified body', async () => {
    const payload = { title: 'New Thesis' };
    const responseData = { id: 'DT02', ...payload };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => responseData,
    });

    const result = await httpClient.post('http://localhost:8082/api/theses', payload);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8082/api/theses',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
    expect(result).toEqual(responseData);
  });

  it('should perform PUT request with JSON stringified body', async () => {
    const payload = { title: 'Updated Thesis' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ id: 'DT01', ...payload }),
    });

    const result = await httpClient.put('http://localhost:8082/api/theses/DT01', payload);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8082/api/theses/DT01',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    );
    expect(result.title).toBe('Updated Thesis');
  });

  it('should throw ApiError with status and server error message on 400/404/500', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Không tìm thấy đề tài mã: DT99' }),
    });

    await expect(httpClient.get('http://localhost:8082/api/theses/DT99')).rejects.toThrow(
      ApiError
    );

    try {
      await httpClient.get('http://localhost:8082/api/theses/DT99');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(404);
      expect(err.message).toBe('Không tìm thấy đề tài mã: DT99');
    }
  });

  it('should throw ApiError with status 0 on network disconnect/failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(httpClient.get('http://localhost:8082/api/theses')).rejects.toThrow(
      ApiError
    );

    try {
      await httpClient.get('http://localhost:8082/api/theses');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(0);
      expect(err.message).toContain('Không thể kết nối đến máy chủ');
    }
  });

  it('should throw ApiError with timeout message when request is aborted', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);

    try {
      await httpClient.get('http://localhost:8082/api/theses', { timeout: 100 });
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(0);
      expect(err.message).toContain('hết thời gian chờ');
    }
  });
});
