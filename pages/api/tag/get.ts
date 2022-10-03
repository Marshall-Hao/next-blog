import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import AppDataSource from 'db';
import { Tag } from 'db/entities';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const tagRepo = AppDataSource.getRepository(Tag);

  const allTags = await tagRepo.find({
    relations: {
      users: true,
    },
  });
  console.log('-----------all--------------------');
  console.log(allTags);
  const followTags = await tagRepo
    .createQueryBuilder('tag')
    .leftJoinAndSelect('tag.users', 'user')
    .where('user_id = :id', {
      id: Number(userId),
    })
    .getMany();
  console.log('--------------follow-----------------');
  console.log(followTags);
  res?.status(200)?.json({
    code: 0,
    msg: '',
    data: {
      followTags,
      allTags,
    },
  });
}
