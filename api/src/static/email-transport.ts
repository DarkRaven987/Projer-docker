import * as nodemailer from 'nodemailer';
import * as config from 'config';

const {service, port, auth} = config.get('mail')

const mailOptions = {
  service,
  port,
  auth,
};

const transport = nodemailer.createTransport(mailOptions);

export default transport;
