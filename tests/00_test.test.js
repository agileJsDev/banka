import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';

chai.use(chaiHttp);

describe('Default API Route', () => {
  it('should return 200 HTTP success code when pointed to the default route', async () => {
    const res = await chai.request(app).get('/');
    expect(res).to.have.status(200);
  });
});
