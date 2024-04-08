import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect } from "vitest";

test("renders blog", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "www.test.com",
    likes: 10,
    userID: {
      username: "testuser",
      name: "Test User",
    },
  };

  const currentUser = {
    username: "testuser",
    name: "Test User",
  };

  const { container } = render(<Blog blog={blog} currentUser={currentUser} />);

  // screen.debug()

  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library",
  );

  // const element = screen.getByText('Component testing is done with react-testing-library')
  // expect(element).toBeDefined() - not necessary
});

test("renders only title and author by default", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "www.test.com",
    likes: 10,
    userID: {
      username: "testuser",
      name: "Test User",
    },
  };

  const currentUser = {
    username: "testuser",
    name: "Test User",
  };

  const { container } = render(<Blog blog={blog} currentUser={currentUser} />);

  const title = container.querySelector(".title");
  expect(title).toHaveTextContent(
    "Component testing is done with react-testing-library",
  );

  const author = container.querySelector(".author");
  expect(author).toHaveTextContent("Test Author");

  const likes = container.querySelector(".likes");
  expect(likes).toBeNull();

  const url = container.querySelector(".url");
  expect(url).toBeNull();
});

test("expands blog and shows its #likes and url", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "www.test.com",
    likes: 10,
    userID: {
      username: "testuser",
      name: "Test User",
    },
  };

  const currentUser = {
    username: "testuser",
    name: "Test User",
  };

  const { container } = render(<Blog blog={blog} currentUser={currentUser} />);

  const user = userEvent.setup();

  const expandButton = screen.getByText("Show More");
  await user.click(expandButton);

  const title = container.querySelector(".title");
  expect(title).toHaveTextContent(
    "Component testing is done with react-testing-library",
  );

  const author = container.querySelector(".author");
  expect(author).toHaveTextContent("Test Author");

  const likes = container.querySelector(".likes");
  expect(likes).toHaveTextContent("Likes: 10");

  const url = container.querySelector(".url");
  expect(url).toHaveTextContent("URL: \"www.test.com\"");
});

test("expands blog and likes it twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "www.test.com",
    likes: 10,
    userID: {
      username: "testuser",
      name: "Test User",
    },
  };

  const currentUser = {
    username: "testuser",
    name: "Test User",
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} currentUser={currentUser} addLike={mockHandler} />);

  const user = userEvent.setup();

  const expandButton = screen.getByText("Show More");
  await user.click(expandButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
