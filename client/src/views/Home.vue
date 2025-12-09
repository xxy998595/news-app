<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { getPosts } from '../api/post';
import PostItem from '../components/PostItem.vue';
import TabBar from '../components/TabBar.vue';

const router = useRouter();
const userStore = useUserStore();

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const page = ref(1);

const onLoad = async () => {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
  }

  try {
    const res = await getPosts(page.value);
    const newPosts = res.data.posts;
    
    if (newPosts.length === 0) {
      finished.value = true;
    } else {
      list.value.push(...newPosts);
      page.value++;
    }
  } catch (error) {
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

const onRefresh = () => {
  // Reset state
  finished.value = false;
  loading.value = true;
  page.value = 1;
  onLoad();
};

const handleLogin = () => {
  router.push('/login');
};

const handleLogout = () => {
  userStore.logout();
  // Refresh page or list to reflect logout state if needed, 
  // but for now just staying on home is fine.
};
</script>

<template>
  <div class="home-container">
    <van-nav-bar fixed placeholder z-index="99">
      <template #title>
        <div class="app-title">头条资讯</div>
      </template>
      <template #right>
        <span v-if="!userStore.token" @click="handleLogin" class="nav-btn login-btn">登录</span>
        <span v-else @click="handleLogout" class="nav-btn logout-btn">退出</span>
      </template>
    </van-nav-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 80vh">
      <van-list
        :loading="loading"
        @update:loading="loading = $event"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <PostItem v-for="post in list" :key="post.id" :post="post" />
      </van-list>
    </van-pull-refresh>

    <TabBar />
  </div>
</template>

<style scoped>
.home-container {
  padding-bottom: 50px;
  background: #fff;
  min-height: 100vh;
}
.app-title {
  font-weight: 900;
  font-size: 18px;
  color: #d43d3d;
  letter-spacing: 1px;
}
.nav-btn {
  font-size: 14px;
  font-weight: 500;
}
.login-btn {
  color: #d43d3d;
}
.logout-btn {
  color: #999;
}
:deep(.van-nav-bar__content) {
    background-color: #fff;
}
</style>
