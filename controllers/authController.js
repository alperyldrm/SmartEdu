const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
  } catch (error) {
    const result = validationResult(req);
    console.log(result);
    console.log(result.array()[0].msg);
    for (let i = 0; i < result.array().length; i++) {
      req.flash('error', `${result.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
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
        req.session.userID = user._id;
        res.status(200).redirect('/users/dashboard');
      } else {
        req.flash('error', 'Your password is not correct!');
        res.status(400).redirect('/login');
      }
    } else {
      req.flash('error', 'User not found!');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users,
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role === 'admin') {
      req.flash('error', `Admin Kullanicisini Silemezsin`);
      return res.status(200).redirect('/users/dashboard');
    }
    const courses = await Course.find({ user: user._id });
    for (const course of courses) {
      await User.updateMany(
        { courses: course._id },
        { $pull: { courses: course._id } }
      );
    }
    await Course.deleteMany({ user: user._id });
    await User.findOneAndDelete(user._id);

    req.flash('error', `${user.name} has been deleted succesfully`);
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
