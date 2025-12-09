const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes here require authentication
router.get('/', auth, postController.getPosts);
router.get('/:id', auth, postController.getPostById);
router.post('/', auth, postController.createPost);
router.put('/:id', auth, postController.updatePost);
router.post('/upload', auth, upload.single('image'), postController.uploadImage);
router.post('/recommend-topic', auth, aiController.recommendTopic);

module.exports = router;
