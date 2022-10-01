import userStore, { IUserInfo, IUserStore } from './userStore'; // eslint-disable-line

export interface IStore {
  user: IUserStore;
}

export default function createStore(initialValue: any): () => IStore {
  return () => {
    return {
      user: { ...userStore(), ...initialValue },
    };
  };
}
