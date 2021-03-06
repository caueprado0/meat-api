import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

test('retornar status HTTP 200 (GET) ao buscar todos os reviews', () => {
  return request(address)
    .get('/reviews')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    })
    .catch(fail)
})