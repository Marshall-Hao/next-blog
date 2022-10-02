import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { ISession } from '../index';
import { ironOptions } from 'config';
import AppDataSource from 'db/index';
import { User, Article, Comment } from 'db/entities';
import { EXCEPTION_COMMENT } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { articleId = 0, content = '' } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const articleRepo = AppDataSource.getRepository(Article);
  const commentRepo = AppDataSource.getRepository(Comment);

  const user = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
  });

  const comment = new Comment();
  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }

  const resComment = await commentRepo.save(comment);

  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: '评论成功',
      data: resComment,
    });
  } else {
    res.status(200).json(EXCEPTION_COMMENT.COMMENT_FAILED);
  }
}
