<template>
    <div id="app">
        <div class="post-form">
            <h1 class="title">Esunfeed</h1>
            <h2 class="topic">發文</h2>
            <textarea v-model="postContent" placeholder="寫下你的心情..."></textarea>
            <input class="image-input" type="file" @change="handleImageUpload" />
            <!-- Preview Image -->
            <img v-if="imagePreview" :src="imagePreview" alt="Image preview" class="image-preview" />
            <button @click="submitPost">送出發文</button>
        </div>
        <div class="post-list">
            <div v-for="post in posts" :key="post.id" class="post-item">
                <p class="post-content">{{ post.content }}</p>
                <small>{{ post.createdAt }}</small>
                <img v-if="post.image" :src="post.image" alt="Post image" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import { defineComponent } from 'vue';
import Compressor from 'compressorjs'; // Import the compressor

interface Post {
    id: number;
    content: string;
    createdAt: string;
    image?: string;
}

export default defineComponent({
    data() {
        return {
            userId: localStorage.getItem("userId") || '',
            token: localStorage.getItem("token") || '',
            postContent: '',
            postImage: null as File | null,
            imagePreview: '', // Preview image data
            posts: [] as Post[]
        };
    },
    created() {
        if (!this.userId) {
            alert("請先登入");
        } else {
            this.fetchUserPosts();
        }
    },
    methods: {
        async submitPost() {
            const createdAt = new Date().toISOString();

            const formData = new FormData();
            formData.append("userId", this.userId);
            formData.append("content", this.postContent);
            formData.append("createdAt", createdAt);
            if (this.imagePreview) {
                formData.append("image", this.imagePreview); // Send the base64 string
            }

            try {
                const response = await axios.post('http://localhost:8080/api/v1/user/post', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                console.log('發文成功', response.data);
                alert('發文成功！');
                this.postContent = '';
                this.postImage = null;
                this.imagePreview = ''; // Clear preview after submission
                this.fetchUserPosts();
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error('發文失敗', axiosError);
                alert(`發文失敗，請稍後再試。\n錯誤訊息：${axiosError.message}\n狀態：${axiosError.response?.status || '無狀態'}\n回應：${axiosError.response?.data || '無回應資料'}`);
            }
        },

        handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            this.postImage = file;
            // Compress the image before converting to base64
            new Compressor(file, {
                quality: 0.7, // Set compression quality (0-1)
                maxWidth: 800, // Maximum width of the image
                maxHeight: 800, // Maximum height of the image
                success: (compressedResult: Blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(compressedResult);
                    reader.onload = () => {
                        this.imagePreview = reader.result as string; // Set base64 string for preview
                    };
                    reader.onerror = (error) => {
                        console.error('Image load error:', error);
                        alert('圖片加載失敗，請重新選擇圖片');
                    };
                },
                error: (err: Error) => {  // Specify the type of error as 'Error'
                    console.error('Image compression failed:', err);
                    alert('圖片壓縮失敗，請重新選擇圖片');
                }
            });
            }
        },


        async fetchUserPosts() {
            if (!this.userId) return;
            try {
                const response = await axios.get<Post[]>(`http://localhost:8080/api/v1/user/getuserpost/${this.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.posts = response.data;
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error("獲取發文失敗", axiosError);
                alert(`獲取發文失敗，請稍後再試。\n錯誤訊息：${axiosError.message}\n狀態：${axiosError.response?.status || '無狀態'}\n回應：${axiosError.response?.data || '無回應資料'}`);
            }
        }
    }
});
</script>

<style>
html, body {
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}

#app {
    position: relative;
    font-family: Arial, sans-serif;
    display: block;
    top:10px;
}
.title {
    position: relative;
    text-align: center;
    color: black;
    margin-bottom: 20px;
}
.topic{
    position: relative;
    text-align: center;
    color: black;
}

.image-preview {
    max-width: 100%;
    max-height: 200px;
    margin-top: 10px;
}
.image-input{
    color:black;
}
.post-form{
    position: relative;
    margin-bottom: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
}
.post-list {
    position: relative;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
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
.post-content {
    color:black;
}
.post-item img {
    max-width: 100%;
    margin-top: 10px;
}
</style>
