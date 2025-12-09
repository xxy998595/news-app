<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/post/${props.post.id}`);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${y}年${m}月${d}日 ${h}:${min}:${s}`;
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
</script>

<template>
  <div class="post-item" @click="goToDetail">
    <!-- Mode 1: Single Image (Right) -->
    <div class="single-mode" v-if="post.images && post.images.length === 1">
      <div class="left-content">
        <div class="title">{{ post.title }}</div>
        <div class="footer">
            <span class="tag" v-if="post.tags && post.tags[0]">{{ post.tags[0] }}</span>
            <span class="author">{{ post.User?.username || '用户' }}</span>
            <span class="time">{{ formatDate(post.updatedAt) }}</span>
        </div>
      </div>
      <div class="right-image">
        <van-image
          width="100%"
          height="100%"
          fit="cover"
          :src="post.images[0]"
          lazy-load
        />
      </div>
    </div>

    <!-- Mode 2: Multiple Images (Grid) or No Image -->
    <div class="multi-mode" v-else>
      <div class="title">{{ post.title }}</div>
      
      <div class="image-grid" v-if="post.images && post.images.length > 1">
        <div class="grid-item" v-for="(img, index) in post.images.slice(0, 3)" :key="index">
            <van-image
                width="100%"
                height="100%"
                fit="cover"
                :src="img"
                lazy-load
            />
        </div>
      </div>

      <div class="footer">
        <span class="tag" v-if="post.tags && post.tags[0]">{{ post.tags[0] }}</span>
        <span class="author">{{ post.User?.username || '用户' }}</span>
        <span class="time">{{ formatDate(post.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-item {
  background: #fff;
  padding: 16px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  font-size: 17px;
  color: #222;
  line-height: 1.4;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  font-weight: 400;
}

/* Single Mode Layout */
.single-mode {
  display: flex;
  justify-content: space-between;
  height: 80px; /* Fixed height for consistency */
}
.single-mode .left-content {
  flex: 1;
  margin-right: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.single-mode .right-image {
  width: 110px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}
.single-mode .title {
    -webkit-line-clamp: 2; /* Limit to 2 lines in single mode */
    line-clamp: 2;
    margin-bottom: 0;
}

/* Multi Mode Layout */
.image-grid {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  margin-top: 8px;
}
.grid-item {
  flex: 1;
  aspect-ratio: 3/2; /* 3:2 aspect ratio */
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

/* Footer Styles */
.footer {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #999;
  line-height: 1;
}
.author {
  margin-right: 8px;
}
.time {
  margin-right: 8px;
}
.tag {
  color: #d43d3d;
  background: rgba(212, 61, 61, 0.05);
  padding: 2px 4px;
  border-radius: 2px;
  margin-right: 8px;
  font-size: 10px;
}
</style>
