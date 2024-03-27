import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const kid = process.env.KID;

export const signAccessToken = async (payload) => {
  try {
    const token = jwt.sign(payload, accessTokenSecret, {
      expiresIn: '1h',
      header: { kid: kid },
      algorithm: 'HS256'
    });
    return await token;
  } catch (err) {
    console.log(err);
  }
};
