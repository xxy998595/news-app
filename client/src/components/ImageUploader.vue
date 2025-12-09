<script setup>
import { ref } from 'vue';
import { uploadImage } from '../api/post';
import { showToast } from 'vant';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const fileList = ref(props.modelValue.map(url => ({ url })));

const afterRead = async (file) => {
  file.status = 'uploading';
  file.message = '上传中...';

  try {
    const formData = new FormData();
    formData.append('image', file.file);

    const res = await uploadImage(formData);
    
    file.status = 'done';
    file.message = '已上传';
    file.url = res.data.url; // Update with server URL

    // Update parent model
    const newImages = fileList.value
      .filter(item => item.status === 'done' && item.url)
      .map(item => item.url);
    
    emit('update:modelValue', newImages);
  } catch (error) {
    file.status = 'failed';
    file.message = '失败';
    showToast('上传失败');
  }
};

const onDelete = () => {
  const newImages = fileList.value
      .filter(item => item.status === 'done' && item.url)
      .map(item => item.url);
  emit('update:modelValue', newImages);
};
</script>

<template>
  <van-uploader
    v-model="fileList"
    :after-read="afterRead"
    @delete="onDelete"
    multiple
    :max-count="9"
  />
</template>
