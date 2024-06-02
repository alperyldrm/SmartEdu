const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    req.flash('success', `${course.name} has been created`);
    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash('error', 'Something happened!');
    res.status(400).redirect('/courses');
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;
    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }
    if (query) {
      filter.name = { $regex: '.*' + query + '.*', $options: 'i' };
    }
    const courses = await Course.find(filter)
      .sort('-createdAt')
      .populate('user');
    const categories = await Category.find();

    // AJAX request to get courses dynamically
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.status(200).render('partials/_courses', { courses });
    }

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const categories = await Category.find();
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );
    const user = await User.findById(req.session.userID);
    res.status(200).render('course', {
      course,
      user,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    // Kursun zaten kayıtlı olup olmadığını kontrol edin
    const courseId = req.body.course_id;
    if (user.courses.includes(courseId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already enrolled in this course',
      });
    }
    await user.courses.push(courseId);
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.leaveCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const courseId = req.body.course_id;
    await user.courses.pull(courseId);
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ slug: req.params.slug });

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found',
      });
    }

    // Kullanıcıların courses listesinden kursu çıkarın
    await User.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );
    req.flash('error', `${course.name} has been deleted succesfully`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    // Kurs bilgilerini güncelle
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    
    if (course.slug !== req.body.slug) {
      const existingCourse = await Course.findOne({ slug: req.body.slug });
      if (existingCourse) {
        return res.status(400).json({
          status: 'fail',
          message: 'Bu slug başka bir kurs tarafından kullanılıyor',
        });
      }
      course.slug = req.body.slug;
    }

    await course.save();

    // Başarılı olursa kullanıcıyı dashboard'a yönlendir
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    // Hata durumunda hata mesajını döndür
    console.error('Hata:', error); // Hata detaylarını loglayın
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
