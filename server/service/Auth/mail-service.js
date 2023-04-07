import nodemailer from "nodemailer";

class MailService {
  initTransportActivationMail() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Activation account on ${process.env.API_URL}`,
      text: "",
      html: `
      <h1>To Activate account go via link</h1>
      <a href="${link}">${link}</a>
      `,
    });
  }
}
export default new MailService();
