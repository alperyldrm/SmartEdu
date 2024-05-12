const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'successed',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (same) {
        // USER SESSION
        res.status(200).send('YOU ARE LOGGED IN');
      } else {
        res.status(401).send('Password is incorrect');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
