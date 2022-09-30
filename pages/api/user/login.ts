import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

// import request from 'services/fetch';
// import { ISession } from '../index';
import { ironOptions } from 'config';
import AppDataSource from 'db/index';
import { User } from 'db/entities';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  console.log('----------------------');
  const { phone = '', verify = '' } = req.body;
  try {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository(User);
    const allUsers = await userRepo.find();
    console.log(allUsers);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    code: 0,
    phone,
    verify,
  });
}
