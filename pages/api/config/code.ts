export const EXCEPTION_USER = {
  NOT_LOGIN: {
    code: 1001,
    msg: '用户未登录',
  },
  NOT_FOUND: {
    code: 1002,
    msg: '用户未找到',
  },
};

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布错误',
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新失败',
  },
  NOT_FOUND: {
    code: 2003,
    msg: '未找到',
  },
};

export const EXCEPTION_TAG = {
  FOLLOW_FAILED: {
    code: 3001,
    msg: '操作失败',
  },
};

export const EXCEPTION_COMMENT = {
  COMMENT_FAILED: {
    code: 4001,
    msg: '评论错误',
  },
};
