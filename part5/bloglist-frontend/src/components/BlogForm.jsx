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
    <div className="formDiv">
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          Title
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
            placeholder='TITLE'
            id='titleInput'
          />
        </div>
        <div>
          Author
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
            placeholder='AUTHOR'
            id='authorInput'
          />
        </div>
        <div>
          URL
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleBlogChange}
            placeholder='URL'
            id='urlInput'
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm