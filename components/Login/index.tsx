import { ChangeEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {message} from 'antd'

import { useStore } from 'store';

import styles from './index.module.scss'
import CountDown from 'components/CountDown'
import request from 'services/fetch'
interface IProps {
    isShow: boolean
    onClose: Function
}

const Login = (props: IProps) => {
  const {isShow,onClose} = props

  const [isShowVerifyCode,setIsShowVerifyCode] = useState(false)
  const [form,setForm] = useState({
    phone:'',
    verify: ''
  })
  const store = useStore()

  console.log(store)
  const handleClose = () => {
    onClose()
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleGetVerifyCode = () => {
    if (!form?.phone) {
      message.warning('请输入手机号')
    }

    request.post('/api/user/sendVerifyCode',{
      to: form?.phone,
      templateId:1
    }).then((res:any) => {
      if (res?.code === 0) {
        setIsShowVerifyCode(true)
      } else {
        message.error(res?.msg || '未知错误')
      }
    })
  }

  const handleLogin = () => {
    request.post('/api/user/login',{
      ...form,
      identity_type:'phone'
    }).then((res:any) =>{
      if (res?.code === 0) {
        // success
        store.user.setUserInfo(res.data)
        onClose && onClose()
      } else {
        message.error(res?.msg || '未知错误')
      }
    })
  }

  const handleOAuthGithub = () => {

  }

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false)
  }

  return isShow? (
    <div className={styles.loginArea}>
       <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
            <div>手机号登入</div>
            <div className={styles.close} onClick={handleClose}>x</div>
        </div>
        <input 
          name="phone" 
          type="text" 
          placeholder='请输入手机号' 
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input 
            name="verify" 
            type="text" 
            placeholder='请输入验证码' 
            value={form.verify} 
            onChange={handleFormChange}
          /> 
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd}/> : '获取验证码'}
          </span>   
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>登录</div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>使用github登录</div>
        <div className={styles.loginPrivacy}>
          注册即表示同意
          <a href="https://moco.imooc.com/privacy.html"
            target="_blank"
            rel="noreferrer">
            隐私政策
          </a>
        </div>
        </div>
    </div>
  ): null;
};

export default observer(Login);
