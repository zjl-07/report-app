const sgMail = require("@sendgrid/mail");
const sendgridAPIkey =
  "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";

sgMail.setApiKey(sendgridAPIkey);

sgMail.send({
  to: `arlen.luman@binus.ac.id`,
  from: `arlen.luman@binus.ac.id`,
  subject: `This is my first Creation`,
  text: `i hope this one actualy`
});
