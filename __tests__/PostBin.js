const supertest = require('supertest')
const api = supertest(BASE_URL)

it('Should return response 200 and post a bin', async () => {
  let binId

  const bin = {sample: 'Hello World'}

  await api.post('/b')
    .send(bin)
    .set(STANDARD_HEADERS)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(200)
    .then(response => {
      binId = response.body.metadata.id
      expect(response.body.record).toEqual(bin)
      expect(response.body.metadata.createdAt).toEqual(expect.anything())
      expect(response.body.metadata.private).toBe(true)
    })

  await api.get('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect(200)
    .then(response => {
      expect(response.body.record).toEqual(bin)
    })

  // cleanup
  await api.delete('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect(200)
})

it('Should return response 400 when content type is not provided', async () => {
  await api.post('/b')
    .set(STANDARD_HEADERS)
    .set('Accept', '')
    .expect(400)
    .then(response => {
      expect(response.body.message).toBe('You need to pass Content-Type set to application/json')
    })
})

it('Should return response 400 when bin body is blank', async () => {
  await api.post('/b')
    .set(STANDARD_HEADERS)
    .send({})
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(400)
    .then(response => {
      expect(response.body.message).toBe('Bin cannot be blank')
    })
})

it('Should return response 401 when not unauthorized', async () => {
  await api.post('/b')
    .set(STANDARD_HEADERS)
    .set('X-Master-Key', '')
    .send({'sample': 'Hello World'})
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(401)
    .then(response => {
      expect(response.body.message).toBe('You need to pass X-Master-Key in the header')
    })
})
