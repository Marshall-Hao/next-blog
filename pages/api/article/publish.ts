import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { ISession } from '../index';
import { ironOptions } from 'config';
import AppDataSource from 'db/index';
import { In } from 'typeorm';
import { User, Article, Tag } from 'db/entities';
import { EXCEPTION_ARTICLE } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '', tagIds = [] } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const articleRepo = AppDataSource.getRepository(Article);
  const tagRepo = AppDataSource.getRepository(Tag);

  const user = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });

  const tags = await tagRepo.findBy({
    id: In(tagIds),
  });
  console.log(tags);

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

  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag?.article_count + 1;
      return tag;
    });
    article.tags = newTags;
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
