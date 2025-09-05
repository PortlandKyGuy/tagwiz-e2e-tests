import { randomUUID } from 'crypto';

export function createTestUser(seed) {
  const suffix = seed || randomUUID().slice(0, 8);
  const email = `tagwiz+${Date.now()}.${suffix}@example.com`;
  const password = 'Twz!Test12345';
  return { email, password };
}
