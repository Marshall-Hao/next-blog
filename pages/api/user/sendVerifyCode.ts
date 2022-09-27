import { NextApiRequest, NextApiResponse } from 'next';

import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import { withIronSessionApiRoute } from 'iron-session/next';

import request from 'services/fetch';
import { ISession } from '../index';
import { ironOptions } from 'config';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { to = '', templateId = 1 } = req.body;
  const appId = '8a216da882f1f59401837f2eabc21baf';
  const accountId = process.env.ACCOUNT_ID;
  const authToken = process.env.AUTH_TOKEN;
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameters = md5(`${accountId}${authToken}${NowDate}`);
  const Authorization = encode(`${accountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireTime = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountId}/SMS/TemplateSMS?sig=${SigParameters}`;

  const respond = await request.post(
    url,
    {
      to,
      templateId,
      appId,
      datas: [verifyCode, expireTime],
    },
    {
      headers: {
        Authorization,
      },
    }
  );

  console.log(respond)
  const { statusCode, statusMsg,templateSMS } = respond as any;

  if (statusCode === '000000') {
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
      code: 0,
      data: {
        templateSMS
      }
    })
  } else {
    res.status(200).json({
      code: 0,
      msg: statusMsg
    })
  }

}
