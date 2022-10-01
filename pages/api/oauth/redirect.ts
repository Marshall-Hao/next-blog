import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import request from 'services/fetch';
import { ISession } from '../index';
import { ironOptions } from 'config';
import { setCooKie } from 'utils';

import AppDataSource from 'db/index';
import { User, UserAuth } from 'db/entities';

export default withIronSessionApiRoute(redirect, ironOptions);

// * http://localhost:3000/api/oauth/redirect?code = xxxxx
async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const githubId = process.env.GITHUB_ID;
  const githubSecret = process.env.GITHUB_SECRET;
  const session: ISession = req.session;
  const { code } = req?.query || {};
  console.log('-----------github-----------');
  console.log(code);
  const url = `https://github.com/login/oauth/access_token?client_id=${githubId}&client_secret=${githubSecret}&code=${code}`;

  const result = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  const { access_token } = result as any;
  console.log(access_token)
  const githubUserInfo =  await request.get('https://api.github.com/user',{
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  })
  console.log(githubUserInfo)
  const {login='', avatar_url=''} = githubUserInfo as any
  const cookie = Cookie.fromApiRoute(req, res);
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const userAuthRepo = AppDataSource.getRepository(UserAuth);
  const userAuth = await userAuthRepo.findOne({
    where: {
      identifier: login,
    },
    relations: {
      user: true,
    },
  });
  
  if (userAuth) {
    const user = userAuth.user;
    const {id,nickname,avatar} = user;
    userAuth.credential = access_token;

    await userAuthRepo.save(userAuth)
    
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save()

    setCooKie(cookie,{id,nickname,avatar})


    res.writeHead(302,{
      location: '/'
    })
  } else {
    // * new user
    const user = new User()
    user.nickname = login
    user.avatar = avatar_url
    user.job = 'oops'
    user.introduce = 'yeah'

    const userAuth = new UserAuth()
    userAuth.identity_type = 'github'
    userAuth.identifier = login
    userAuth.credential = access_token
    userAuth.user = user

    const resUserAuth = await userAuthRepo.save(userAuth)
    console.log(resUserAuth)
    
    const {id,nickname,avatar} = resUserAuth.user
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save()

    setCooKie(cookie,{id,nickname,avatar})

    res.writeHead(302,{
      location: '/'
    })
  }
}
