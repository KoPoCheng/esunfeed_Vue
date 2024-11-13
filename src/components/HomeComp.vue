<template>
    <div id="app">
    <h1 class="$style.title">社群介面</h1>

    <div class="post-form">
        <h2>發文</h2>
        <textarea v-model="postContent" placeholder="寫下你的心情..."></textarea>
        <input type="text" v-model="postImage" placeholder="圖片 URL (可選)" />
        <button @click="submitPost">送出發文</button>
    </div>

    <div class="post-list">
        <h2>使用者的發文</h2>
        <div v-if="posts.length > 0">
        <div v-for="(post, index) in posts" :key="index" class="post-item">
            <p>{{ post.content }}</p>
            <small>{{ post.createdAt }}</small>
            <img v-if="post.image" :src="post.image" alt="Post Image" />
        </div>
        </div>
        <div v-else>
        <p>沒有發現任何發文。</p>
        </div>
    </div>
    </div>
</template>
    
<script lang="ts">
import axios from 'axios';

export default {
    data() {
        return {
            userId: '',
            postContent: '',
            postImage: '',
            fetchUserId: '',
            posts: []
        };
    },
    methods: {
    async submitPost() {
        if (!this.userId.trim() || !this.postContent.trim()) {
        alert('請輸入使用者 ID 和發文內容');
        return;
        }

        const currentTime = new Date();
        const createdAt = new Date(currentTime.getTime() + 8 * 60 * 60 * 1000); // 加上8小時的時區調整

        try {
        const response = await axios.post('http://localhost:8080/api/v1/user/post', {
            userId: this.userId,
            content: this.postContent,
            image: this.postImage || null,
            createdAt: createdAt.toISOString()
        });
        console.log('發文成功', response.data);
        alert('發文成功！');
        this.postContent = '';
        this.postImage = '';
        } catch (error) {
        console.error('發文失敗', error);
        alert('發文失敗，請稍後再試');
        }
    },

    async fetchUserPosts() {
        const storedUserId = localStorage.getItem("userId"); // 從 localStorage 獲取 userId

        if (!storedUserId) {
        alert("請先登入以取得使用者 ID");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/v1/user/post/getuserpost/${storedUserId}`);
            this.posts = response.data;
        } catch (error) {
            console.error("獲取發文失敗", error);
            alert("獲取發文失敗，請稍後再試");
        } 
    }

    }
};
</script>

<style>
html, body {
    background-color: #ffffff; /* Set background color to white */
    margin: 0;
    padding: 0;
    height: 100%;
}

#app {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
}
.title {
    text-align: center;
    color:black;
}

.post-form, .post-list {
    margin-bottom: 20px;
}

textarea {
    width: 100%;
    min-height: 80px;
    margin-bottom: 10px;
}

button {
    padding: 10px 15px;
    cursor: pointer;
}

.post-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
}

.post-item small {
    color: #888;
}

.post-item img {
    max-width: 100%;
    margin-top: 10px;
}
</style>
