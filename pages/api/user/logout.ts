import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';

import { ISession } from '../index';
import { ironOptions } from 'config';
import { clearCookie } from 'utils';

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookie = Cookie.fromApiRoute(req, res);

  await session.destroy();
  clearCookie(cookie);

  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  });
}
