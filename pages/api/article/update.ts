import { NextApiRequest, NextApiResponse } from 'next';
import AppDataSource from 'db/index';
import { Article } from 'db/entities';
import { EXCEPTION_ARTICLE } from '../config/code';

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title = '', content = '', articleId } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const articleRepo = AppDataSource.getRepository(Article);

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
  });
  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();

    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({
        code: 0,
        msg: '更新成功',
        data: resArticle,
      });
    } else {
      res.status(200).json(EXCEPTION_ARTICLE.UPDATE_FAILED);
    }
  } else {
    res.status(200).json(EXCEPTION_ARTICLE.NOT_FOUND);
  }
}
