// eslint-disable-next-line object-curly-newline
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
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
      .send(newBlog)
      .expect(400);

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  });
});

describe('blog properties and defaults', () => {
  test('blog has an id property', async () => {
    const response = await api.get('/api/blogs');
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
