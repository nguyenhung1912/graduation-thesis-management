import { describe, it, expect } from 'vitest';
import { reportApi } from '../api/reportApi.js';
import { API_BASE } from '../../../core/gateway/config.js';

describe('reportApi (SOA Report Service Client Unit Tests)', () => {
  it('generates correct individual thesis PDF URL', () => {
    const url = reportApi.getThesisPdfUrl('DT01');
    expect(url).toBe(`${API_BASE.REPORT}/theses/DT01/pdf`);
  });

  it('escapes special characters in thesis ID', () => {
    const url = reportApi.getThesisPdfUrl('DT/01#A');
    expect(url).toBe(`${API_BASE.REPORT}/theses/DT%2F01%23A/pdf`);
  });

  it('generates correct summary PDF URL', () => {
    const url = reportApi.getSummaryPdfUrl();
    expect(url).toBe(`${API_BASE.REPORT}/theses/summary/pdf`);
  });

  it('generates correct health check URL', () => {
    const url = reportApi.getHealthUrl();
    expect(url).toBe(`${API_BASE.REPORT}/health`);
  });
});
