import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import mjml from 'mjml';
import User from '../model/User.js';
import sendMail from '../util/mail.js';

export const signup = async (req, res) => {
  const {
    email,
    name,
    role,
    sendMail,
  } = req.body;

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return res.status(400)
      .json({ errors: ['Email already exists'] });
  }

  // Generate random password
  const generatePassword = (length) => randomBytes(length)
    .toString('base64')
    .slice(0, length);

  const password = generatePassword(10);

  // Hash the password
  const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    vCardOptions: {}, // TODO it should be possible without this..
  });

  if (sendMail) {
    // TODO send mail
  }

  try {
    const savedUser = await user.save();
    res.json({ data: { userId: savedUser.uuid } });
  } catch (err) {
    res.status(400)
      .json({ errors: [err] });
  }
};

export const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = await User.findOne({ email });

  const loginError = 'A user with this combination of credentials was not found.';

  if (!user) {
    return res.status(400)
      .json({ errors: [loginError] });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400)
      .json({ errors: [loginError] });
  }

  // create token
  const token = jwt.sign(
    {
      id: user.uuid,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: +process.env.JWT_EXPIRATION_INTERVAL },
  );

  res
    .header('Authorization', token)
    .json({
      data: {
        name: user.name,
        email: user.email,
        uuid: user.uuid,
        token,
        createdAt: user._id.getTimestamp(),
        role: user.role,
        themeId: user.themeId,
      },
    });
};

export const recover = async (req, res) => {
  const { uuid } = req.body;

  const user = await User.findOne({ uuid });

  if (!user) {
    return res.status(400)
      .json({ errors: ['User does not exist'] });
  }

  const token = createHash('sha256')
    .update(user.password)
    .digest('hex');

  const resetLink = `${process.env.BASE_URL_FRONT}/reset?uuid=${user.uuid}&token=${token}&email=${user.email}`;

  const mjmlContent = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text color="#183b56"></mj-text>
      <mj-font name="Work Sans" href="https://fonts.googleapis.com/css?family=Work+Sans:400,300,600"></mj-font>
      <mj-all font-size="14px" line-height="26px" font-family="Work Sans,sans-serif,Arial"></mj-all>
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#ebf2fa">
    <mj-section></mj-section>
    <mj-section full-width="full-width">
      <mj-column background-color="#ffffff" css-class="body-section" border-top="4px solid #1c4e80" padding="15px">
        <mj-text font-size="24px" align="left">Hello ${user.name}</mj-text>
        <mj-text>Welcome! Your account has been created. To complete your registration, please create a password by following the link below:</mj-text>
        <mj-button href="${resetLink}" background-color="#1c4e80" color="#ffffff">Create Password</mj-button>
        <mj-divider border-width="1px" border-color="#1c4e80" border-style="dashed"></mj-divider>
        <mj-text>Best regards,<br />
          The CardMesh Team</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

  const htmlOutput = mjml(mjmlContent).html;

  try {
    const mail = await sendMail(user.email, 'Reset password', htmlOutput);
    res.json({ data: { mail } });
  } catch (err) {
    res.status(404)
      .json({ errors: [err] });
  }
};

export const reset = async (req, res) => {
  const {
    email,
    token,
    password,
  } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400)
      .json({ errors: ['Email does not exist'] });
    return;
  }

  const hashedToken = createHash('sha256')
    .update(user.password)
    .digest('hex');

  if (token !== hashedToken) {
    return res
      .status(400)
      .json({ errors: ['The token is invalid'] });
  }

  const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.findOneAndUpdate(
    { email: user.email },
    { password: hashedPassword },
    { new: true },
  );

  res.json({ data: newUser });
};
