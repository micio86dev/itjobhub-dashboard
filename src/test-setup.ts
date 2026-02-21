import { setupServer } from 'msw/node';
import { beforeAll, afterAll, afterEach } from 'vitest';

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
