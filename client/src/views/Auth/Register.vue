<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../../api/auth';
import { showSuccessToast } from 'vant';

const router = useRouter();

const username = ref('');
const password = ref('');

const onSubmit = async (values) => {
  try {
    await register(values);
    showSuccessToast('Registration successful');
    router.push('/login');
  } catch (error) {
    // Error handled in interceptor
  }
};
</script>

<template>
  <div class="register-container">
    <div class="header">
        <van-icon name="arrow-left" size="24" color="#333" @click="router.back()" />
    </div>

    <div class="logo-section">
        <div class="logo-text">注册账号</div>
        <div class="sub-text">加入头条，发现更多精彩</div>
    </div>

    <van-form @submit="onSubmit" class="register-form">
      <van-cell-group :border="false">
        <van-field
          v-model="username"
          name="username"
          placeholder="请输入账号 (2-10位)"
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
          placeholder="设置登录密码 (6位以上)"
          :rules="[{ required: true, message: '请输入密码' }]"
          class="custom-field"
        >
            <template #left-icon>
                <span class="field-label">密码</span>
            </template>
        </van-field>
      </van-cell-group>
      
      <div class="btn-area">
        <van-button round block type="primary" native-type="submit" color="linear-gradient(to right, #FF8C00, #FF6633)">
          立即注册
        </van-button>
      </div>

      <div class="agreement">
        注册即代表您已同意 <span class="link">《用户服务协议》</span> 和 <span class="link">《隐私政策》</span>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #fff;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
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

.register-form {
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

.btn-area {
    margin-top: 40px;
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
</style>
