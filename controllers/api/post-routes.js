const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ['id', 'title', 'post_text', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title', 'post_text', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    if (!dbPostData) {
      res.status(400).json({ message: `No post found with this id` });
      return;
    }

    res.status(200).json(err);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, post_text } = req.body;
    const { user_id } = req.session;
    if (!title || !post_text || !user_id) {
      res.status(400).json({ message: 'Needs values for title, post_text, and user_id' });
      return;
    }

    const dbPostData = await Post.create({
      title,
      post_text,
      user_id
    });

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ message: `Needs title value` });
      return;
    }

    const dbPostData = await Post.update(
      {
        title
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    if (!dbPostData) {
      res.status(404).json({ message: `No post found with that id` });
      return;
    }

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!dbPostData) {
      res.status(404).json({ message: `No post found with that id` });
      return;
    }

    res.status(200).json(dbPostData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;