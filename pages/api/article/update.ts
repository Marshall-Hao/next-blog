import { NextApiRequest, NextApiResponse } from 'next';
import AppDataSource from 'db/index';
import { Article, Tag } from 'db/entities';
import { In } from 'typeorm';
import { EXCEPTION_ARTICLE } from '../config/code';

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title = '', content = '', articleId = 0, tagIds = [] } = req.body;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const articleRepo = AppDataSource.getRepository(Article);
  const tagRepo = AppDataSource.getRepository(Tag);

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
  });

  const tags = await tagRepo.findBy({
    id: In(tagIds),
  });

  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();
    if (tags) {
      const newTags = tags?.map((tag) => {
        tag.article_count = tag?.article_count + 1;
        return tag;
      });
      article.tags = newTags;
    }

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
