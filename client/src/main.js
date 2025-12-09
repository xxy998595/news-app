import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Vant styles
import 'vant/lib/index.css';
import { Button, Field, CellGroup, Form, Toast, Tabbar, TabbarItem, NavBar, Uploader, List, Image as VanImage, PullRefresh, Tag, Notify, Lazyload, Icon } from 'vant';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Register Global Component
app.component('QuillEditor', QuillEditor)

// Register Vant components
app.use(Button);
app.use(Field);
app.use(CellGroup);
app.use(Form);
app.use(Toast);
app.use(Tabbar);
app.use(TabbarItem);
app.use(NavBar);
app.use(Uploader);
app.use(List);
app.use(VanImage);
app.use(PullRefresh);
app.use(Tag);
app.use(Notify);
app.use(Lazyload);
app.use(Icon);

app.mount('#app')
