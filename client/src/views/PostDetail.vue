<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostById, recommendTopic } from '../api/post';
import { useUserStore } from '../stores/user';
import { showLoadingToast, closeToast, Button } from 'vant';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const post = ref(null);
const recommendedTopic = ref('');

const isAuthor = computed(() => {
    if (!post.value || !userStore.user || !userStore.user.id) return false;
    // Use loose comparison or string conversion to be safe
    return String(post.value.userId) === String(userStore.user.id);
});

onMounted(async () => {
  showLoadingToast({ forbidClick: true });
  try {
    const res = await getPostById(route.params.id);
    post.value = res.data;
    
    // Debug logs
    console.log('Post:', post.value);
    console.log('User:', userStore.user);
    console.log('Is Author:', isAuthor.value);

    closeToast(); // Show content immediately

    // Get AI recommendation in background
    if (post.value.content) {
        try {
            // Strip HTML for client-side check (optional, but good for logging)
            const topicRes = await recommendTopic(post.value.content);
            if (topicRes.data && topicRes.data.topic) {
                recommendedTopic.value = topicRes.data.topic;
            }
        } catch (e) {
            console.error('AI topic failed:', e);
        }
    }
  } catch (error) {
    closeToast();
    // error
  }
});

const goToEditorWithTopic = () => {
    router.push({ path: '/editor', query: { topic: recommendedTopic.value } });
};

const handleEdit = () => {
    router.push({ path: '/editor', query: { id: post.value.id } });
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString();
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
</script>

<template>
  <div class="detail-container">
    <van-nav-bar
      left-arrow
      fixed
      placeholder
      @click-left="router.back()"
    >
        <template #title>
            <div class="nav-title">头条资讯</div>
        </template>
        <template #right>
            <van-icon 
                v-if="isAuthor" 
                name="edit" 
                size="18" 
                color="#333" 
                @click="handleEdit" 
            />
        </template>
    </van-nav-bar>
    
    <div v-if="post" class="content-wrapper">
      <h1 class="article-title">{{ post.title }}</h1>

      <div class="author-card">
        <div class="avatar">{{ post.User?.username?.charAt(0).toUpperCase() }}</div>
        <div class="info">
            <div class="name">{{ post.User?.username }}</div>
            <div class="meta">
                <span class="time">{{ formatDate(post.createdAt) }}</span>
            </div>
        </div>
        <van-button type="primary" size="small" class="follow-btn">关注</van-button>
      </div>
      
      <div class="text-content rich-text" v-html="post.content"></div>
      
      <div class="image-list" v-if="post.images && post.images.length">
        <van-image
          v-for="(img, index) in post.images"
          :key="index"
          width="100%"
          fit="contain"
          :src="img"
          class="detail-image"
        />
      </div>
      
      <div class="tags" v-if="post.tags && post.tags.length">
        <div class="tag-item" v-for="tag in post.tags" :key="tag">
            {{ tag }}
        </div>
      </div>

      <div class="ai-recommendation" v-if="recommendedTopic">
        <div class="ai-title">AI 推荐话题</div>
        <div class="topic-btn" @click="goToEditorWithTopic">
            # {{ recommendedTopic }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  background: #fff;
  min-height: 100vh;
}
.nav-title {
    font-weight: bold;
}
.content-wrapper {
  padding: 20px 16px;
}
.article-title {
    font-size: 22px;
    font-weight: bold;
    line-height: 1.4;
    margin: 0 0 20px 0;
    color: #222;
}

/* Author Card */
.author-card {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}
.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #eee;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
}
.info {
    flex: 1;
}
.name {
    font-size: 14px;
    color: #222;
    font-weight: bold;
}
.meta {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
}
.follow-btn {
    background-color: #d43d3d;
    border-color: #d43d3d;
    height: 28px;
    padding: 0 16px;
    border-radius: 14px;
}

.text-content {
  font-size: 17px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}
.rich-text :deep(p) {
    margin-bottom: 1.5em;
    text-align: justify;
}
.rich-text :deep(img) {
    max-width: 100%;
    border-radius: 4px;
    margin: 10px 0;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
}
.tag-item {
    background: #f5f5f5;
    color: #666;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 13px;
}

.ai-recommendation {
    margin-top: 30px;
    padding: 16px;
    background-color: #f8f8f8;
    border-radius: 8px;
    border-left: 4px solid #d43d3d;
}
.ai-title {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}
.topic-btn {
    color: #d43d3d;
    font-weight: bold;
    font-size: 15px;
}

/* Detail Images */
.detail-image {
  margin-bottom: 16px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
