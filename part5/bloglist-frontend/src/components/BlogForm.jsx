import { useState } from 'react'

const initialValues = {
  title: '',
  author: '',
  url: '',
}

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState(initialValues)

  const handleBlogChange = (e) => {
    const { name, value } = e.target

    setNewBlog({
      ...newBlog,
      [name]: value,
    })
  }

  const createBlog = (event) => {
    event.preventDefault()
    addBlog(newBlog)
    setNewBlog(initialValues)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
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
}

export default BlogForm