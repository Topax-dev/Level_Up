import jwt from 'jsonwebtoken'
import { response } from '../response/response.js';

export function verityToken(req, res, next) {
  const token = req.cookies.access_token
  if (!token) {
    return response(401, 'Not Logged In Yet', 'Login Failed', res)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return response(403, 'Credential Invalid', 'Login Failed', res)
    }

    req.user = decoded;
    next();
  });
}

export function verityTokenAdmin(req, res, next) {
  const token = req.cookies.vip_access_token
  if (!token) {
    return response(401, 'Not Logged In Yet', 'Login Failed', res)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return response(403, 'Credential Invalid', 'Login Failed', res)
    }

    req.admin = decoded;
    next();
  });
}
