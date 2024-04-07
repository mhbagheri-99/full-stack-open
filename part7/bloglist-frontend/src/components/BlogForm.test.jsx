import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const addBlog = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm addBlog={addBlog} />);

  // const input = screen.getAllByRole('textbox')
  // const input = screen.getByPlaceholderText('TITLE')
  const title = container.querySelector("#titleInput");
  const author = container.querySelector("#authorInput");
  const url = container.querySelector("#urlInput");
  const sendButton = screen.getByText("save");

  await user.type(title, "TITLE");
  await user.type(author, "AUTHOR");
  await user.type(url, "URL");
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);

  const newBlog = addBlog.mock.calls[0][0];
  expect(newBlog.title).toBe("TITLE");
  expect(newBlog.author).toBe("AUTHOR");
  expect(newBlog.url).toBe("URL");
});
