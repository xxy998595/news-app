const Post = require('../models/Post');
const User = require('../models/User');
const aiController = require('./aiController');

exports.createPost = async (req, res) => {
  try {
    const { title, content, images } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!content && (!images || images.length === 0)) {
      return res.status(400).json({ message: 'Post must contain text or images' });
    }

    // AI Tag Analysis
    let tags = [];
    if (content) {
        tags = await aiController.analyzeTags(title + ' ' + content);
    }

    const newPost = await Post.create({
      userId: req.user.id,
      title,
      content,
      images: images || [],
      tags: tags
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, images } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title !== undefined ? title : post.title;
    post.content = content !== undefined ? content : post.content;
    post.images = images !== undefined ? images : post.images;
    
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['updatedAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the URL of the uploaded file
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
};
