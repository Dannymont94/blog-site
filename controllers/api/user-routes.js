const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });

    res.status(200).json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id: req.params.id
      }, 
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_text', 'created_at']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: {
            model: Post,
            attributes: ['title']
          }
        }
      ]
    });

    if (!dbUserData) {
      res.status(404).json({ message: `No user found with that id` });
      return;
    }

    res.status(200).json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(404).json({ message: `Needs values for username, email, and password` });
      return;
    }

    const dbUserData = await User.create({
      username,
      email,
      password
    });

    res.status(200).json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(404).json({ message: `Needs values for email and password` });
      return;
    }

    const dbUserData = await User.findOne({
      where: {
        email
      }
    });

    if (!dbUserData) {
      res.status(404).json({ message: `No user with that email address` });
      return;
    }

    const validPassword = dbUserData.checkPassword(password);

    if (!validPassword) {
      res.status(404).json({ message: `Incorrect password` });
      return;
    }
      
    req.session.save(() => {
      req.session.user_id = dbUserData.id,
      req.session.username = dbUserData.username,
      req.session.loggedIn = true
      
      res.status(200).json({
        user: dbUserData,
        message: `You are now logged in`
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;