const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are #n (initial) blogs', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('one blog is about a crisis', async () => {
  const response = await api.get('/api/blogs');

  const contents = response.body.map((e) => e.title);
  assert.strictEqual(contents.includes('Housing Crisis in the World of Medicine.'), true);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'The Great Escape',
    author: 'Steve McQueen',
    url: 'url.com',
    likes: 8,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await helper.blogsInDb();
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  const contents = blogs.map((r) => r.title);
  assert.strictEqual(contents.includes('The Great Escape'), true);
});

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Steve McQueen',
    url: 'url.com',
    likes: 8,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogs = await helper.blogsInDb();
  assert.strictEqual(blogs.length, helper.initialBlogs.length);
});

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'The Great Escape',
    author: 'Steve McQueen',
    likes: 8,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogs = await helper.blogsInDb();
  assert.strictEqual(blogs.length, helper.initialBlogs.length);
});

test('blog has an id property', async () => {
  const response = await api.get('/api/blogs');
  assert.ok(response.body[0].id);
});

test('blog without likes is added with 0 likes', async () => {
  const newBlog = {
    title: 'The Great Escape',
    author: 'Steve McQueen',
    url: 'url.com',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await helper.blogsInDb();
  const addedBlog = blogs.find((blog) => blog.title === 'The Great Escape');
  assert.strictEqual(addedBlog.likes, 0);
});

after(async () => {
  await mongoose.connection.close();
});
