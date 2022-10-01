import React, { createContext, ReactElement, useContext } from "react";
import {useLocalObservable,enableStaticRendering} from 'mobx-react-lite';// eslint-disable-line
import createStore, { IStore } from "./rootStore";

interface IProps {
  initialValue: Record<any,any>
  children: ReactElement
}

// * 只有 在非浏览器 状况 不会去 监听更新 只第一遍刷新
enableStaticRendering(!process.browser)

const StoreContext = createContext({})

export const StoreProvider = ({initialValue,children}: IProps) => {
  const store: IStore  = useLocalObservable(createStore(initialValue))
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore
  if (!store) {
    throw new Error('数据不存在')
  }
  return store
}