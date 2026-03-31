const { v4: uuidv4 } = require('uuid');

// In-memory post storage
let posts = [];

const Post = {
  findAll: () => posts,

  findById: (id) => posts.find((post) => post.id === id),

  findByUserId: (userId) => posts.filter((post) => post.userId === userId),

  getPaginated: (page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
    return {
      posts: paginatedPosts,
      currentPage: page,
      totalPages: Math.ceil(posts.length / limit),
      totalPosts: posts.length,
      hasNextPage: endIndex < posts.length,
      hasPrevPage: page > 1,
    };
  },

  create: ({ userId, username, content, image = '' }) => {
    const newPost = {
      id: uuidv4(),
      userId,
      username,
      content,
      image,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    return newPost;
  },

  update: (id, updates) => {
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) return null;
    posts[index] = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return posts[index];
  },

  delete: (id) => {
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    return true;
  },

  toggleLike: (postId, userId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }
    return post;
  },

  addComment: (postId, { userId, username, text }) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;
    const comment = {
      id: uuidv4(),
      userId,
      username,
      text,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    return post;
  },
};

module.exports = Post;
