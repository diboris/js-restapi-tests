const supertest = require('supertest')
const api = supertest(BASE_URL)

it('Should return response 200 and update bin information', async () => {
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

  const updatedBin = {sample: 'Hello World!'}

  await api.put('/b/' + binId)
    .send(updatedBin)
    .set(STANDARD_HEADERS)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(200)
    .then(response => {
      expect(response.body.record).toEqual(updatedBin)
      expect(response.body.metadata.parentId).toBe(binId)
      expect(response.body.metadata.private).toBe(true)
    })

  // cleanup
  await api.delete('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect(200)
})

it('Should return response 401 when not unauthorized', async () => {
  let binId

  const bin = {sample: 'Hello World'}

  await api.post('/b')
    .set(STANDARD_HEADERS)
    .send(bin)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(200)
    .then(response => {
      binId = response.body.metadata.id
    })

  await api.put('/b/' + binId)
    .set(STANDARD_HEADERS)
    .set('X-Master-Key', '')
    .send({'sample': 'Hello World!'})
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(401)
    .then(response => {
      expect(response.body.message).toBe('You need to pass X-Master-Key in the header to update a private bin')
    })

  // cleanup
  await api.delete('/b/' + binId)
    .set(STANDARD_HEADERS)
    .expect(200)
})

it('Should return response 422 when invalid bin id is provided', async () => {
  const bin = {sample: 'Hello World'}

  await api.put('/b/1')
    .set(STANDARD_HEADERS)
    .send(bin)
    .expect('Content-Type', JSON_CONTENT_TYPE)
    .expect(422)
    .then(response => {
      expect(response.body.message).toBe('Invalid Record ID')
    })
})
