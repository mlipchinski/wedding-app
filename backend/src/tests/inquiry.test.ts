import request from 'supertest';
import { initApp } from '../app';
import { prisma } from '../db/client';

const app = initApp();

describe('POST /api/inquiries', () => {
    it('creates inquiry', async () => {
        const res = await request(app)
            .post('/api/inquiries')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                guestCount: 50
            });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe('test@example.com');
    });

    it('validates body', async () => {
        const res = await request(app)
            .post('/api/inquiries')
            .send({ name: '', email: 'bad', guestCount: 0 });
        expect(res.status).toBe(400);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
