"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const request = require("supertest");
const server_1 = require("../src/server/server");
const environment_1 = require("../src/common/environment");
const user_router_1 = require("../src/user/user-router");
const user_model_1 = require("../src/user/user-model");
let address;
let server;
beforeAll(() => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://githubtest:loja200test@ds018268.mlab.com:18268/meatdb-test';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    address = `http://localhost:${environment_1.environment.server.port}`;
    server = new server_1.Server();
    return server
        .bootstrap([user_router_1.userRouter])
        .then(() => user_model_1.User.remove({}).exec())
        .catch(console.error);
});
test('retornar status HTTP 200 (GET) para buscar todos os usuarios', () => {
    return request(address)
        .get('/users')
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
    }).catch(fail);
});
test('retornar status HTTP 200 (POST) ao cadastrar novo usuario - usuario1', () => {
    return request(address)
        .post('/users')
        .send({
        name: 'usuario1',
        email: 'usuario1@gmail.com',
        password: '1234567',
        cpf: '13242418450'
    })
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('usuario1');
        expect(response.body.email).toBe('usuario1@gmail.com');
        //expect(response.body.password).toBeUndefined()
        expect(response.body.cpf).toBe('13242418450');
    }).catch(fail);
});
test('retornar status HTTP 200 (POST) ao cadastrar novo usuario - usuario2', () => {
    return request(address)
        .post('/users')
        .send({
        name: 'usuario2',
        email: 'usuario2@gmail.com',
        password: '1234567',
        cpf: '13242418450'
    })
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('usuario2');
        expect(response.body.email).toBe('usuario2@gmail.com');
        //expect(response.body.password).toBeUndefined()
        expect(response.body.cpf).toBe('13242418450');
    }).catch(fail);
});
test('retornar status HTTP 404 (GET) ao buscar um usuario inexistente', () => {
    return request(address)
        .get('/users/aaaaaaa')
        .then(response => {
        expect(response.status).toBe(404);
    }).catch(fail);
});
test('retornar status HTTP 200 (PATCH) ao atualizar dados de um usuario', () => {
    return request(address)
        .post('/users')
        .send({
        name: 'usuario3',
        email: 'usuario3@gmail.com',
        password: '1234567'
    })
        .then(response => request(address)
        .patch(`/users/${response.body._id}`)
        .send({
        name: 'usuario4 - patch'
    }))
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('usuario4 - patch');
        expect(response.body.email).toBe('usuario3@gmail.com');
    })
        .catch(fail);
});
afterAll(() => {
    return server.shutdown();
});