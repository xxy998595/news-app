import api from './index'

export const createPost = (data) => {
  return api.post('/posts', data)
}

export const updatePost = (id, data) => {
  return api.put(`/posts/${id}`, data)
}

export const uploadImage = (formData) => {
  return api.post('/posts/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getPosts = (page = 1, limit = 10) => {
  return api.get('/posts', { params: { page, limit } })
}

export const getPostById = (id) => {
  return api.get(`/posts/${id}`)
}

export const recommendTopic = (content) => {
  return api.post('/posts/recommend-topic', { content })
}
