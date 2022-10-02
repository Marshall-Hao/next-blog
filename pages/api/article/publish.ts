import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { ISession } from '../index';
import { ironOptions } from 'config';
import AppDataSource from 'db/index';
import { User, Article } from 'db/entities';
import { EXCEPTION_ARTICLE } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '' } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const articleRepo = AppDataSource.getRepository(Article);

  const user = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });
  console.log(user);
  const article = new Article();
  article.title = title;
  article.content = content;
  article.views = 0;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;

  if (user) {
    article.user = user;
  }
  console.log(article);
  const resArticle = await articleRepo.save(article);
  console.log(resArticle);
  if (resArticle) {
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: resArticle,
    });
  } else {
    res.status(200).json(EXCEPTION_ARTICLE.PUBLISH_FAILED);
  }
}
