<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { createPost, getPostById, updatePost } from '../api/post';
import ImageUploader from '../components/ImageUploader.vue';
import { showSuccessToast, showLoadingToast, closeToast, showNotify } from 'vant';

const router = useRouter();
const route = useRoute();

const title = ref('');
const content = ref('');
const images = ref([]);
const isEditMode = ref(false);
const postId = ref(null);
let autoSaveTimer = null;

// Load draft or route query
onMounted(async () => {
  // Check if edit mode
  if (route.query.id) {
    isEditMode.value = true;
    postId.value = route.query.id;
    await loadPostData(postId.value);
    return; // Don't load draft in edit mode
  }

  // Check for topic from route (AI recommendation jump)
  if (route.query.topic) {
    content.value = `#${route.query.topic} `;
  } else {
    // Load draft
    const draft = localStorage.getItem('post_draft');
    if (draft) {
      try {
        const { title: draftTitle, content: draftContent, images: draftImages } = JSON.parse(draft);
        title.value = draftTitle || '';
        content.value = draftContent || '';
        images.value = draftImages || [];
        showNotify({ type: 'primary', message: '已恢复上次的草稿' });
      } catch (e) {}
    }
  }

  // Auto save every 30s
  autoSaveTimer = setInterval(() => {
    saveDraft();
  }, 30000);
});

const loadPostData = async (id) => {
    showLoadingToast({ message: '加载中...', forbidClick: true });
    try {
        const res = await getPostById(id);
        const post = res.data;
        title.value = post.title;
        content.value = post.content;
        images.value = post.images || [];
        closeToast();
    } catch (error) {
        closeToast();
        showNotify({ type: 'danger', message: '加载文章失败' });
        router.back();
    }
};

onUnmounted(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
});

const saveDraft = () => {
  if (isEditMode.value) return; // Don't save draft in edit mode
  if (title.value || content.value || images.value.length) {
    localStorage.setItem('post_draft', JSON.stringify({
      title: title.value,
      content: content.value,
      images: images.value
    }));
  }
};

// Save draft on change as well (optional, but good for UX)
watch([title, content, images], () => {
  // Debounce could be added here
  saveDraft();
}, { deep: true });

const onSubmit = async () => {
  if (!title.value.trim()) {
    showNotify({ type: 'warning', message: '请输入标题' });
    return;
  }
  if (!content.value.trim() && images.value.length === 0) {
    showNotify({ type: 'warning', message: '请输入正文内容' });
    return;
  }

  showLoadingToast({
    message: isEditMode.value ? '更新中...' : '发布中...',
    forbidClick: true,
  });

  try {
    if (isEditMode.value) {
        await updatePost(postId.value, {
            title: title.value,
            content: content.value,
            images: images.value
        });
        showSuccessToast('更新成功!');
        router.push(`/post/${postId.value}`);
    } else {
        await createPost({
            title: title.value,
            content: content.value,
            images: images.value
        });
        // Clear draft
        localStorage.removeItem('post_draft');
        showSuccessToast('发布成功!');
        router.push('/');
    }
    
    closeToast();
  } catch (error) {
    closeToast();
    // Error handled by interceptor
  }
};
</script>

<template>
  <div class="editor-container">
    <div class="editor-header">
        <div class="cancel-btn" @click="router.push('/')">取消</div>
        <div class="header-title">{{ isEditMode ? '编辑文章' : '发布文章' }}</div>
        <van-button 
            type="primary" 
            size="small" 
            class="publish-btn"
            :disabled="!title.trim() && !content.trim()"
            @click="onSubmit"
        >
            {{ isEditMode ? '更新' : '发布' }}
        </van-button>
    </div>
    
    <div class="editor-content">
      <input
        v-model="title"
        type="text"
        class="native-title-input"
        placeholder="请输入标题 (6-30字)"
        maxlength="30"
      />
      
      <div class="quill-wrapper">
        <QuillEditor 
            v-model:content="content" 
            contentType="html" 
            theme="snow" 
            toolbar="minimal" 
            placeholder="分享你此刻的想法..."
        />
      </div>
      
      <div class="uploader-wrapper">
        <ImageUploader v-model="images" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}
.cancel-btn {
    font-size: 16px;
    color: #333;
}
.header-title {
    font-size: 17px;
    font-weight: bold;
    color: #333;
}
.publish-btn {
    padding: 0 20px;
    border-radius: 4px;
    background-color: #d43d3d;
    border-color: #d43d3d;
    font-weight: bold;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.native-title-input {
    width: 100%;
    border: none;
    font-size: 22px;
    font-weight: bold;
    padding: 10px 0;
    margin-bottom: 10px;
    outline: none;
    color: #222;
}
.native-title-input::placeholder {
    color: #999;
    font-weight: normal;
}

.quill-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
:deep(.ql-container) {
  flex: 1;
  font-size: 17px;
  border: none !important;
}
:deep(.ql-toolbar) {
  border: none !important;
  border-top: 1px solid #f5f5f5 !important;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 99;
  padding: 10px;
}
:deep(.ql-editor) {
    padding: 0;
    min-height: 150px;
}
:deep(.ql-editor.ql-blank::before) {
    font-style: normal;
    color: #999;
}

.uploader-wrapper {
    margin-bottom: 60px; /* Space for fixed toolbar */
}
</style>
