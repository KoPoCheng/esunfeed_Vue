import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';  // Assuming this is your private component
import LoginView from '@/views/LoginView.vue';  // Your login page if token is invalid

// Function to extract username from token
const getUsernameFromToken = (token: string): string => { 
    if (!token) throw new Error('Token 不存在');
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return (
                        '%' +
                        ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join(''),
        );
        const parsedToken = JSON.parse(jsonPayload);
        if (!parsedToken.sub) throw new Error('無法解析用戶名');
        return parsedToken.sub;
    } catch (error) {
        console.error('Token 解析失敗:', error);
        throw new Error('Token 解析錯誤');
    }
};

// Define routes with type annotation for better type safety
import type { RouteRecordRaw } from 'vue-router';  // Type-only import for RouteRecordRaw

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('未找到 token');
            next('/'); // Redirect to login if no token
            return;
        }

        try {
            getUsernameFromToken(token);  // Check if token is valid
            next();  // Allow navigation to HomeView if token is valid
        } catch (error) {
            console.error('Token 無效或解析失敗:', error);
            localStorage.clear(); // Clear localStorage on token error
            next('/');  // Redirect to login page if token is invalid
        }
    }
  },
  {
    path: '/',
    name: 'Login',
    component: LoginView,  // Login view if token is invalid
  }
];

// Create the router instance with type annotations
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
