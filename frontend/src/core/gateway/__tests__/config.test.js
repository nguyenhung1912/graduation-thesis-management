import { describe, it, expect } from 'vitest';
import { API_BASE } from '../config.js';

describe('config.js (SOA Unified Gateway & Service Resolution Tests)', () => {
  it('exposes API_BASE with all required microservice endpoints', () => {
    expect(API_BASE).toBeDefined();
    expect(API_BASE.STUDENT).toBeDefined();
    expect(API_BASE.THESIS).toBeDefined();
    expect(API_BASE.REGISTRATION).toBeDefined();
    expect(API_BASE.REPORT).toBeDefined();
  });

  it('routes endpoints under gateway or fallback port', () => {
    expect(API_BASE.STUDENT).toMatch(/\/students$/);
    expect(API_BASE.THESIS).toMatch(/\/theses$/);
    expect(API_BASE.REGISTRATION).toMatch(/\/registrations$/);
    expect(API_BASE.REPORT).toMatch(/\/reports$/);
  });
});
