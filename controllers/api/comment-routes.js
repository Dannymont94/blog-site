const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll();
    res.status(200).json(dbCommentData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { comment_text, post_id } = req.body;
    const { user_id } = req.session;
    if (!comment_text || !post_id || !user_id) {
      res.status(400).json({ message: `Needs values for comment_text, post_id, and user_id` });
      return;
    }

    const dbCommentData = await Comment.create({
      comment_text,
      post_id,
      user_id
    });

    res.status(200).json(dbCommentData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;