export type IUserInfo = {
  userId?: number | null,
  nickname?: string,
  avatar?: string,
  id?: number | null,
};

export interface IUserStore {
  userInfo: IUserInfo;
  setUserInfo: (value: IUserInfo) => void; // eslint-disable-line
}

const userStore = (): IUserStore => {
  return {
    userInfo: {},
    setUserInfo: function (value) {
      this.userInfo = value;
    },
  };
};

export default userStore;
