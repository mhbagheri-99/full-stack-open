const totalLikes = (blogs) => ((blogs.length === 0)
  ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0));

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs.find((blog) => blog.likes === maxLikes);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = blogs.map((blog) => blog.author);
  const authorWithMostBlogs = authors.sort((x) => authors.filter((author) => author === x).length)
    .pop();
  const authorWithMostBlogsObject = {
    author: authorWithMostBlogs,
    blogs: authors.filter((author) => author === authorWithMostBlogs).length + 1,
  };

  return authorWithMostBlogsObject;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = blogs.map((blog) => blog.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorsWithLikes = uniqueAuthors.map((author) => ({
    author,
    likes: blogs.filter((blog) => blog.author === author)
      .reduce((sum, blog) => sum + blog.likes, 0),
  }));
  console.log(authorsWithLikes);
  const authorWithMostLikes = authorsWithLikes.sort((a, b) => b.likes - a.likes).at(0);
  console.log(authorWithMostLikes);

  return authorWithMostLikes;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
