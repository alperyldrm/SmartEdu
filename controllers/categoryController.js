const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    await Course.updateMany({ category: category._id }, { $set: { category: null } });
    await Category.findOneAndDelete(category._id);
    req.flash('error', `${category.name} has been deleted succesfully`);
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(400).json({
      status: 'fail',
      error,
    });
  }
};