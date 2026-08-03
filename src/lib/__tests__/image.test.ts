import { describe, it, expect } from 'vitest';
import { resolveImage, DEFAULT_POSTER_FALLBACK, CDN_BASE_URL } from '../image';

describe('resolveImage() utility', () => {
  it('should return fallback image SVG for empty, null, or undefined inputs', () => {
    expect(resolveImage('')).toBe(DEFAULT_POSTER_FALLBACK);
    expect(resolveImage(null as any)).toBe(DEFAULT_POSTER_FALLBACK);
    expect(resolveImage(undefined)).toBe(DEFAULT_POSTER_FALLBACK);
    expect(resolveImage('   ')).toBe(DEFAULT_POSTER_FALLBACK);
  });

  it('should return absolute HTTP/HTTPS URLs as-is', () => {
    const httpUrl = 'http://example.com/images/poster.jpg';
    const httpsUrl = 'https://phimimg.com/uploads/movies/thumb.jpg';

    expect(resolveImage(httpUrl)).toBe(httpUrl);
    expect(resolveImage(httpsUrl)).toBe(httpsUrl);
  });

  it('should convert protocol-relative URLs (//) to https://', () => {
    const protocolRelative = '//cdn.phimimg.com/poster.webp';
    expect(resolveImage(protocolRelative)).toBe('https://cdn.phimimg.com/poster.webp');
  });

  it('should prepend CDN base domain for relative image paths', () => {
    const relativeLeadingSlash = '/uploads/movies/avatar.jpg';
    const relativeNoLeadingSlash = 'uploads/movies/poster.jpg';

    expect(resolveImage(relativeLeadingSlash)).toBe(`${CDN_BASE_URL}/uploads/movies/avatar.jpg`);
    expect(resolveImage(relativeNoLeadingSlash)).toBe(`${CDN_BASE_URL}/uploads/movies/poster.jpg`);
  });
});
