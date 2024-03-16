const BlogForm = ({addBlog, newBlog, handleBlogChange}) => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          Title
          <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleBlogChange}
          />
        </div>
        <div>
          Author
          <input
              type="text"
              name="author"
              value={newBlog.author}
              onChange={handleBlogChange}
          />
        </div>
        <div>
          URL
          <input
              type="text"
              name="url"
              value={newBlog.url}
              onChange={handleBlogChange}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
)

export default BlogForm