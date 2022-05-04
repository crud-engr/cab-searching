import app from '../app';
import request from 'supertest';

describe('CABS API', () => {
  it('should register driver', () => {
    return request(app)
      .post('/api/drivers')
      .expect('Content-Type', 'application/json')
      .expect(201)
      .then((response) => {
        console.log(response);
        expect(response).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            phone_number: expect.any(String),
            license_number: expect.any(String),
            car_number: expect.any(String),
          })
        );
      });
  });
});
