const mongoose = require('mongoose');
const supertest = require('supertest');
const { test, describe, beforeEach, after } = require('node:test');
const app = require('../app');
const assert = require('node:assert');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

let token = '';
let testUserId = ''; // Variable para almacenar el ID del usuario creado durante las pruebas

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
    user: 'validUserId', // Este es solo un valor de ejemplo, será asignado dinámicamente
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com',
    likes: 12,
    __v: 0,
  }
];

beforeEach(async () => {
  // Limpiar los blogs de prueba en la base de datos, no afectará a los datos existentes
  await Blog.deleteMany({ title: { $in: initialBlogs.map(blog => blog.title) } });  // Limpiar solo blogs de prueba

  // Crear un usuario de prueba temporalmente
  const newUser = new User({
    username: 'testuser5',
    passwordHash: 'hashedpassword',  // Asegúrate de que el password esté correctamente hasheado
    name: 'Test User',
  });

  const savedUser = await newUser.save();
  testUserId = savedUser._id; // Guardamos el ID del usuario creado

  // Hacer login para obtener el token
  const response = await api
    .post('/api/login')
    .send({
      username: 'testuser5',
      password: 'contraseñaSegura1234',
    });
  token = response.body.token;  // Guardamos el token para usarlo en otras peticiones
});

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.length > 0, true);  // Se espera al menos un blog
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test('unique identifier property of blog is named id', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length > 0, true);  // Se espera al menos un blog

  const blog = response.body[0];
  assert.strictEqual(blog.id !== undefined, true);  // Verifica que existe un id
});

test('a new blog can be created', async () => {
  const newBlog = {
    title: 'A new blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 8,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsEnd = await Blog.find({});
  assert.strictEqual(blogsEnd.length, initialBlogs.length + 1);

  const titles = blogsEnd.map(blog => blog.title);
  assert(titles.includes(newBlog.title));
});

test('likes property defaults to zero if not provided', async () => {
  const newBlog = {
    title: 'A new blog',
    author: 'John Doe',
    url: 'https://example.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('responds with 400 bad request when title is not provided', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'https://example.com',
    likes: 8,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test('responds with 400 bad request when url is not provided', async () => {
  const newBlog = {
    title: 'A new blog',
    author: 'John Doe',
    likes: 8,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test('responds with 401 unauthorized if no token is provided', async () => {
  const newBlog = {
    title: 'Blog without token',
    author: 'Papu Chachi',
    url: 'https://example.com',
    likes: 50,
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);

  assert.strictEqual(response.body.error, 'no token provided');
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if it is valid', async () => {
    const blogStart = await Blog.find({});
    const blogDelete = blogStart[0];

    await api
      .delete(`/api/blogs/${blogDelete._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogEnd = await Blog.find({});
    assert.strictEqual(blogEnd.length, initialBlogs.length - 1);

    const titles = blogEnd.map(blog => blog.title);
    assert(!titles.includes(blogDelete.title));
  });
});

describe('update of a blog', () => {
  test('succeeds with valid data', async () => {
    const blogStart = await Blog.find({});
    const blogUpdate = blogStart[0];

    const updatedBlogData = {
      likes: 7,
    };

    const response = await api
      .put(`/api/blogs/${blogUpdate._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlogData)
      .expect(200);

    assert.strictEqual(response.body.likes, 7);
  });
});

after(async () => {
  // Limpiar solo los blogs y el usuario de prueba después de las pruebas
  await Blog.deleteMany({ title: { $in: initialBlogs.map(blog => blog.title) } });  // Solo borrar blogs de prueba
  await User.findByIdAndDelete(testUserId);  // Borrar el usuario de prueba utilizando su _id
  mongoose.connection.close();
});
