import { Test, TestingModule } from '@nestjs/testing';
import {HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {UserController} from "../src/user/user.controller";
import {UserService} from "../src/user/user.service";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const EMAIL = 'hanghae@hanghae.com';
  const NAME = 'hanghae';
  const password = '12345678';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/user (POST)', async () => {
    return  request(app.getHttpServer()).post('/user').send({
      email: EMAIL,
      name: NAME,
      password: password
    }).expect(HttpStatus.CREATED);
  });

  it('/user (POST) email is not valid format', async () => {
    return request(app.getHttpServer()).post('/user').send({
      email: 'hanghae',
      name: NAME,
      password: password
    }).expect(HttpStatus.BAD_REQUEST);
  });

  it('/user (POST) password is empty', async () => {
    return request(app.getHttpServer()).post('/user').send({
      email: EMAIL,
      name: NAME,
    }).expect(HttpStatus.BAD_REQUEST);
  });

  it('/user (POST) find error', async () => {
    return request(app.getHttpServer()).post('/user').send({
      email: EMAIL,
      name: 'err',
      password: password
    }).expect(HttpStatus.NOT_FOUND);
  });

  it('/user (GET)', async () => {
    await request(app.getHttpServer()).post('/user').send({
      email: EMAIL,
      name: NAME,
      password: password
    }).expect(HttpStatus.CREATED);

    const { body } = await request(app.getHttpServer()).get('/user').expect(HttpStatus.OK);
    expect(body.length).toBeGreaterThanOrEqual(1);
  });
});
