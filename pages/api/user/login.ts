import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

// import request from 'services/fetch';
import { ISession } from '../index';
import { ironOptions } from 'config';
import AppDataSource from 'db/index';
import { User, UserAuth } from 'db/entities';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  try {
    const userRepo = AppDataSource.getRepository(User);
    const userAuthRepo = AppDataSource.getRepository(UserAuth);
    const allUsers = await userRepo.find();
    console.log(await userAuthRepo.find());
    if (String(session.verifyCode) === String(verify)) {
      // * code correct, find it in the user_auths table by type
      console.log('--------------');
      const userAuth = await userAuthRepo.find({
        where: {
          identifier: phone,
        },
      });
      console.log('--------------');
      if (userAuth.length) {
        // * exist
        console.log('find');
      } else {
        console.log('--------------');
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
        console.log(resUserAuth);
        // await userAuthRepo.save(resUserAuth);
      }
    }
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    code: 0,
    phone,
    verify,
  });
}
