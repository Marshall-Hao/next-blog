import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
// import request from 'services/fetch';
import { ISession } from '../index';
import { ironOptions } from 'config';
import { setCooKie } from 'utils';

import AppDataSource from 'db/index';
import { User, UserAuth } from 'db/entities';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookie = Cookie.fromApiRoute(req, res);
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  try {
    const userAuthRepo = AppDataSource.getRepository(UserAuth);
    if (String(session.verifyCode) === String(verify)) {
      // * code correct, find it in the user_auths table by type

      const userAuth = await userAuthRepo.findOne({
        where: {
          identifier: phone,
        },
        relations: {
          user: true,
        },
      });

      if (userAuth) {
        // * exist
        const { user } = userAuth;
        const { id, nickname, avatar } = user;

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();

        setCooKie(cookie, { id, nickname, avatar });
        res?.status(200).json({
          code: 0,
          msg: '登录成功',
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      } else {
        // * new
        const user = new User();
        user.nickname = `user_${Math.floor(Math.random() * 10000)}`;
        user.avatar = '/images/avatar.jpg';
        user.job = 'fuckboy';
        user.introduce = 'porn';
        const userAuth = new UserAuth();
        userAuth.identity_type = identity_type;
        userAuth.identifier = phone;
        userAuth.credential = session.verifyCode;
        userAuth.user = user;
        const resUserAuth = await userAuthRepo.save(userAuth);

        const {
          user: { id, nickname, avatar },
        } = resUserAuth;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();
        setCooKie(cookie, { id, nickname, avatar });
        res?.status(200).json({
          code: 0,
          msg: '登录成功',
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      }
    } else {
      res?.status(200).json({ code: -1, msg: '验证码错误' });
    }
  } catch (error) {
    console.log(error);
  }
}
