<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { login } from '../../api/auth';
import { showSuccessToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');

const onSubmit = async (values) => {
  try {
    const res = await login(values);
    userStore.setToken(res.data.token);
    userStore.setUser(res.data.user);
    showSuccessToast('Login successful');
    router.push('/');
  } catch (error) {
    // Error handled in interceptor
  }
};
</script>

<template>
  <div class="login-container">
    <div class="header">
        <van-icon name="cross" size="24" color="#333" @click="router.push('/')" />
        <span class="register-link" @click="router.push('/register')">注册账号</span>
    </div>

    <div class="logo-section">
        <div class="logo-text">欢迎登录</div>
        <div class="sub-text">头条资讯，懂你所想</div>
    </div>

    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group :border="false">
        <van-field
          v-model="username"
          name="username"
          placeholder="请输入账号/手机号"
          :rules="[{ required: true, message: '请输入账号' }]"
          class="custom-field"
        >
            <template #left-icon>
                <span class="field-label">账号</span>
            </template>
        </van-field>
        <van-field
          v-model="password"
          type="password"
          name="password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
          class="custom-field"
        >
            <template #left-icon>
                <span class="field-label">密码</span>
            </template>
        </van-field>
      </van-cell-group>
      
      <div class="action-area">
        <span class="forgot-pwd" @click="router.push('/reset-password')">忘记密码？</span>
      </div>

      <div class="btn-area">
        <van-button round block type="primary" native-type="submit" color="linear-gradient(to right, #FF8C00, #FF6633)">
          登录
        </van-button>
      </div>

      <div class="agreement">
        登录即代表您已同意 <span class="link">《用户服务协议》</span> 和 <span class="link">《隐私政策》</span>
      </div>
    </van-form>

    <div class="third-party-login">
        <div class="divider">
            <span>第三方登录</span>
        </div>
        <div class="icons">
            <div class="icon-item"><van-icon name="wechat" color="#07c160" size="32" /></div>
            <div class="icon-item"><van-icon name="qq" color="#1296db" size="32" /></div>
            <div class="icon-item"><van-icon name="weibo" color="#d81e06" size="32" /></div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #fff;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}
.register-link {
    font-size: 14px;
    color: #333;
}

.logo-section {
    margin-bottom: 40px;
}
.logo-text {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}
.sub-text {
    font-size: 14px;
    color: #999;
}

.login-form {
    flex: 1;
}

.custom-field {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    background: transparent;
}
.custom-field::after {
    display: none;
}
.field-label {
    width: 50px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
}

.action-area {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    margin-bottom: 30px;
}
.forgot-pwd {
    font-size: 12px;
    color: #666;
}

.btn-area {
    margin-bottom: 20px;
}

.agreement {
    font-size: 11px;
    color: #999;
    text-align: center;
    line-height: 1.5;
}
.link {
    color: #576b95;
}

.third-party-login {
    margin-top: auto;
    padding-bottom: 20px;
}
.divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}
.divider span {
    font-size: 12px;
    color: #ccc;
    padding: 0 10px;
    position: relative;
}
.divider span::before, .divider span::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40px;
    height: 1px;
    background: #eee;
}
.divider span::before { right: 100%; }
.divider span::after { left: 100%; }

.icons {
    display: flex;
    justify-content: center;
    gap: 40px;
}
.icon-item {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
