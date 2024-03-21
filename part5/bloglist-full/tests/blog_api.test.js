// eslint-disable-next-line object-curly-newline
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

let token = null;

beforeEach(async () => {
  await User.deleteMany({});

  const newUser = new User({
    username: 'root',
    name: 'superuser',
    passwordHash: await bcrypt.hash('pass', 10),
  });

  await newUser.save();
});

test('user can log in with correct credentials', async () => {
  const userLogin = {
    username: 'root',
    password: 'pass',
  };

  const loginResponse = await api.post('/api/login')
    .send(userLogin)
    .expect(200);

  token = `Bearer ${loginResponse.body.token}`;
  assert(token);
});

describe('when there is initially some blogs saved', () => {
  test('inserting initial blogs', async () => {
    await Blog.deleteMany({});
    await api.post('/api/blogs')
      .set('Authorization', `${token}`)
      .send(helper.initialBlogs[0])
      .expect(201)
      .expect('Content-Type', /application\/json/);

    await api.post('/api/blogs')
      .set('Authorization', `${token}`)
      .send(helper.initialBlogs[1])
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();

    assert.strictEqual(blogs.length, helper.initialBlogs.length);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are #n (initial) blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `${token}`);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('one blog is about a crisis', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `${token}`);

    const contents = response.body.map((e) => e.title);
    assert.strictEqual(contents.includes('Housing Crisis in the World of Medicine.'), true);
  });
});

describe('adding a blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'The Great Escape',
      author: 'Steve McQueen',
      url: 'url.com',
      likes: 8,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `${token}`)
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
      .set('Authorization', `${token}`)
      .send(newBlog)
      .expect(400);

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  });

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'The Great Escape',
      author: 'Steve McQueen',
      likes: 8,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `${token}`)
      .send(newBlog)
      .expect(400);

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  });
});

describe('blog properties and defaults', () => {
  test('blog has an id property', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `${token}`);
    assert.ok(response.body[0].id);
  });

  test('blog without likes is added with 0 likes', async () => {
    const newBlog = {
      title: 'No one likes me',
      author: 'Steve McQueen',
      url: 'url.com',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();
    const addedBlog = blogs.find((blog) => blog.title === 'No one likes me');
    assert.strictEqual(addedBlog.likes, 0);
  });
});

describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const ids = blogsAtEnd.map((r) => r.id);
    assert(!ids.includes(blogToDelete.id));
  });
});

describe('updating a blog', () => {
  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `${token}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updated = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
    assert.strictEqual(updated.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
