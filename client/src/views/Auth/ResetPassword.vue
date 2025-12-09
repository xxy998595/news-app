<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { resetPassword } from '../../api/auth';
import { showSuccessToast, showNotify } from 'vant';

const router = useRouter();

const username = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const onSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showNotify({ type: 'warning', message: '两次输入的密码不一致' });
    return;
  }

  try {
    await resetPassword({
      username: username.value,
      newPassword: newPassword.value
    });
    showSuccessToast('密码重置成功，请重新登录');
    router.push('/login');
  } catch (error) {
    // Error handled in interceptor
  }
};
</script>

<template>
  <div class="reset-container">
    <div class="header">
        <van-icon name="arrow-left" size="24" color="#333" @click="router.back()" />
    </div>

    <div class="logo-section">
        <div class="logo-text">重置密码</div>
        <div class="sub-text">请设置您的新密码</div>
    </div>

    <van-form @submit="onSubmit" class="reset-form">
      <van-cell-group :border="false">
        <van-field
          v-model="username"
          name="username"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
          class="custom-field"
        >
            <template #left-icon>
                <span class="field-label">账号</span>
            </template>
        </van-field>
        <van-field
          v-model="newPassword"
          type="password"
          name="newPassword"
          placeholder="请输入新密码 (6位以上)"
          :rules="[{ required: true, message: '请输入新密码' }]"
          class="custom-field"
        >
            <template #left-icon>
                <span class="field-label">新密码</span>
            </template>
        </van-field>
        <van-field
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="请再次输入新密码"
          :rules="[{ required: true, message: '请再次输入新密码' }]"
          class="custom-field"
        >
            <template #left-icon>
                <span class="field-label">确认</span>
            </template>
        </van-field>
      </van-cell-group>
      
      <div class="btn-area">
        <van-button round block type="primary" native-type="submit" color="linear-gradient(to right, #FF8C00, #FF6633)">
          确认修改
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
.reset-container {
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

.reset-form {
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
    width: 60px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
}

.btn-area {
    margin-top: 40px;
    margin-bottom: 20px;
}
</style>