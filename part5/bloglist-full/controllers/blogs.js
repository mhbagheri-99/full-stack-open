/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('userID', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { body } = request;
  const { user } = request;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    userID: user.id,
  });

  const savedBlog = await blog.save();
  // eslint-disable-next-line no-underscore-dangle
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;
  const blog = {
    likes: body.likes,
  };

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true });
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const { user } = request;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }
  if (user.id.toString() !== blog.userID.toString()) {
    return response.status(401).json({ error: 'not authorized' });
  }
  await Blog
    .findByIdAndDelete(request.params.id);
  console.log('deleted');
  response.status(204).end();
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { body } = request;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }
  blog.comments = blog.comments.concat(body.comment);
  const updatedBlog = await blog.save();
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
