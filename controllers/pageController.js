const nodemailer = require('nodemailer');
const flash = require('connect-flash');

exports.getIndexPage = (req, res) => {
  console.log(req.session.userID);
  res.status(200).render('index', {
    page_name: 'index',
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

exports.sendEmail = async (req, res) => {

  try{
  const outputMessage = `
    <h1>Mail Details</h1>
    <ul>
      <li> Name: ${req.body.name} </li>
      <li> email: ${req.body.email} </li>
    </ul>
    <h2>Message Details</h2>
    <p>${req.body.message} </p>
  `;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'amy.hilpert@ethereal.email',
      pass: 'mExYuMV6fwZDNpMzxw1111',
    },
  });
    const info = await transporter.sendMail({
      from: '"Smart EDU Contact Form" <amy.hilpert@ethereal.email>', // sender address
      to: 'alperyldrm96@gmail.com', // list of receivers
      subject: 'Smart EDU Contact Form New Message', // Subject line
      html: outputMessage, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  
  req.flash('success', 'We received your message successfully');

  res.status(200).redirect('/contact');
  main().catch(console.error);
}catch(err){
  req.flash("error", `Something happened! ${err}`);
  res.status(200).redirect('/contact');
  }
};
