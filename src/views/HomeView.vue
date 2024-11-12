<template>
    <div :class="[homepage.page, { [homepage.darkBackground]: isModalOpen }]">
      <Header @iconClick="handleIconClick" />
      <div :class="homepage.container">
        <div :class="homepage.MidContent">{{ renderContent() }}</div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import PostContent from '@/components/PostComp.vue';
  import homepage from '../styles/HomePage.module.css';
  
  export default {

setup() {
    const router = useRouter();
    const isModalOpen = ref(false);
    const activeComponent = ref('home');
    const refreshKey = ref(0);
    const isAnalysisModalOpen = ref(false);

    const getUsernameFromToken = (token) => {
        if (!token) throw new Error('Token 不存在');
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const parsedToken = JSON.parse(jsonPayload);
            if (!parsedToken.sub) throw new Error('無法解析用戶名');
            return parsedToken.sub;
        } catch (error) {
            console.error('Token 解析失敗:', error);
            throw new Error('Token 解析錯誤');
        }
    };

    const checkToken = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('未找到 token');
            const username = getUsernameFromToken(token);
            if (!username) throw new Error('用戶名解析失敗');
        } catch (error) {
            console.error('Token 無效或解析失敗:', error);
            localStorage.clear();
            console.log('localStorage 已清空');
            router.push('/');
        }
    };

    onMounted(() => {
        checkToken();
        const interval = setInterval(checkToken, 10000);

        const handleError = (msg, url, lineNo, columnNo, error) => {
            localStorage.clear();
            console.log('localStorage 已清空');
            router.push('/');
        };

        const handleUnhandledRejection = (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            localStorage.clear();
            console.log('localStorage 已清空');
            router.push('/');
        };

        window.onerror = handleError;
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        onBeforeUnmount(() => {
            clearInterval(interval);
            window.onerror = null;
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        });
    });

    const handleIconClick = (icon) => {
        if (icon === 'home') {
        refreshKey.value += 1;
        }
        activeComponent.value = icon;
    };
    return {
        isModalOpen,
        activeComponent,
        refreshKey,
        isAnalysisModalOpen,
        handleIconClick,
        renderContent,
        homepage,
    };
    },
  };
</script>
  
<style scoped>
  /* Import your CSS styles here if needed */
</style>
