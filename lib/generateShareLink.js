const crypto = require('crypto');
const IV_LENGTH = 12;

function generateShareLink(userId, photoIds, expireInDays, password) {
  if (!Array.isArray(photoIds) || photoIds.length === 0) {
    throw new Error('photoIds must be a non-empty array');
  }
  if (!photoIds.every(id => typeof id === 'string')) throw new Error('photoIds must contain strings');
  if (typeof expireInDays !== 'number' || expireInDays <= 0 || !Number.isInteger(expireInDays)) {
    throw new Error('expireInDays must be a positive integer');
  }
  const expiresAt = new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000).toISOString();
  const passwordHash = password && password.length > 0 ? crypto.createHash('sha256').update(password).digest('hex') : null;
  const payload = JSON.stringify({ userId, photoIds, expiresAt, passwordHash });
  const iv = crypto.randomBytes(IV_LENGTH);
  const secret = process.env.SHARE_LINK_SECRET;
  if (!secret) throw new Error('Server secret not configured');
  const cipher = crypto.createCipheriv('aes-256-gcm', crypto.createHash('sha256').update(secret).digest(), iv);
  let encrypted = cipher.update(payload, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const token = [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted].join(':');
  const link = `https://photos.example.com/share/${encodeURIComponent(token)}`;
  return { link, token, expiresAt };
}

module.exports = { generateShareLink };
