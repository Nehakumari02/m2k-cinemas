export const normalizeImage = (image) => {
  if (!image) return '/images/movie.png';

  let src = image;

  // Handle strings with localhost:8080
  if (typeof src === 'string' && src.includes('localhost:8080')) {
    src = src.replace(/https?:\/\/localhost:8080/i, '');
  }

  // If it's already a full external URL, return encoded
  if (/^https?:\/\//i.test(src)) return encodeURI(src);

  // Ensure it starts with /
  if (typeof src === 'string') {
    src = src.startsWith('/') ? src : `/${src}`;
  }

  // Final check: if it's a relative path, we return it as is so the browser 
  // requests it from the current origin (ngrok or localhost). 
  // The dev server proxy (or production server) should handle /uploads.
  return encodeURI(src);
};
