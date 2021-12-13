const supertest = require('supertest')
const api = supertest(BASE_URL)

it('Should return response 200 and delete a bin', async () => {
  let binId

  const bin = {sample: 'Hello World'}

  await api.post('/b')
    .send(bin)
    .set(STANDARD_HEADERS)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(200)
    .then(response => {
      binId = response.body.metadata.id
    })

  await api.delete('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(200)
    .then(response => {
      expect(response.body.metadata.id).toBe(binId)
      expect(response.body.message).toBe('Bin deleted successfully')
    })

  await api.get('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(404)
})

it('Should return response 401 when not unauthorized', async () => {
  let binId

  const bin = {sample: 'Hello World'}

  await api.post('/b')
    .send(bin)
    .set(STANDARD_HEADERS)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(200)
    .then(response => {
      binId = response.body.metadata.id
    })

  await api.delete('/b/' + binId)
    .set(STANDARD_HEADERS)
    .set('X-Master-Key', '')
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(401)
    .then(response => {
      expect(response.body.message).toBe('You need to pass X-Master-Key in the header')
    })

  // cleanup
  await api.delete('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect(200)
})

it('Should return response 422 when invalid bin id is provided', async () => {
  await api.delete('/b/1')
    .set(STANDARD_HEADERS)
    .expect(422)
    .then(response => {
      expect(response.body.message).toBe('Invalid Record ID')
    })
})
