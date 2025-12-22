const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (totalLikes, blog) => {
    return totalLikes += blog.likes 
  } 

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let max = blogs[0].likes
  let mostLikedBlog = blogs[0]

  for (const blog of blogs) {
    if (blog.likes > max) {
      max = blog.likes
      mostLikedBlog = blog
    }
  }

  return mostLikedBlog 
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}
  for (const blog of blogs) {
    if (!Object.hasOwn(authors, blog.author)) {
      authors[blog.author] = { 
        'author': blog.author, 
        blogs: 0 
      }
    }

    authors[blog.author].blogs += 1
  }

  const authorWithMostBlogs = { 
    author: null, 
    blogs: 0 
  }

  for (const author of Object.values(authors)) {
    if (authorWithMostBlogs.author === null || author.blogs > authorWithMostBlogs.blogs) {
      authorWithMostBlogs.author = author.author
      authorWithMostBlogs.blogs = author.blogs
    }
  }

  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}
  for (const blog of blogs) {
    if (!Object.hasOwn(authors, blog.author)) {
      authors[blog.author] = { 
        author: blog.author, 
        likes: 0 
      }
    }

    authors[blog.author].likes += blog.likes
  }

  const authorWithMostLikes = { 
    author: null, 
    likes: 0 
  }

  for (const author of Object.values(authors)) {
    if (authorWithMostLikes.author === null || author.likes > authorWithMostLikes.likes) {
      authorWithMostLikes.author = author.author
      authorWithMostLikes.likes = author.likes
    }
  }

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}