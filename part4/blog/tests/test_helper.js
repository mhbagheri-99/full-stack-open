const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Who is coming.',
    author: 'Dr. Who',
    url: 'url.com',
    likes: 8,
  },
  {
    title: 'Housing Crisis in the World of Medicine.',
    author: 'Dr. House',
    url: 'princeton.com',
    likes: 93,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'will remove this soon', author: 'Dr. Who', url: 'url.com', likes: 8,
  });
  await blog.save();
  await blog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb,
};
