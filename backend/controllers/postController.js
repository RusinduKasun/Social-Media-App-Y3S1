const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required.' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const post = Post.create({
      userId: req.user.id,
      username: req.user.username,
      content: content.trim(),
      image,
    });

    res.status(201).json({ message: 'Post created successfully.', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get all posts (paginated)
// @route   GET /api/posts
exports.getPosts = (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = Post.getPaginated(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
exports.getPostById = (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
exports.getPostsByUser = (req, res) => {
  try {
    const posts = Post.findByUserId(req.params.userId);
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
exports.updatePost = (req, res) => {
  try {
    const post = Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post.' });
    }

    const { content } = req.body;
    const updates = {};

    if (content) updates.content = content.trim();
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updatedPost = Post.update(req.params.id, updates);
    res.json({ message: 'Post updated successfully.', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = (req, res) => {
  try {
    const post = Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    Post.delete(req.params.id);
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Like/unlike a post
// @route   POST /api/posts/:id/like
exports.toggleLike = (req, res) => {
  try {
    const post = Post.toggleLike(req.params.id, req.user.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json({ message: 'Like toggled.', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
exports.addComment = (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = Post.addComment(req.params.id, {
      userId: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(201).json({ message: 'Comment added.', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
