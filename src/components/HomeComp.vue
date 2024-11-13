<template>
    <div id="app">
        <button @click="logout" class="logout-btn">登出</button>
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
            <div v-for="post in posts" :key="post.postId" class="post-item">
                <div class="post-header">
                    <h3 class="post-user">{{ post.user.userName }}</h3>
                    <p class="post-content">{{ post.content }}</p>
                    <!-- Hamburger Menu for Edit and Delete -->
                    <div class="hamburger-menu" @click="toggleMenu(post.postId)">
                        <span class="menu-line"></span>
                        <span class="menu-line"></span>
                        <span class="menu-line"></span>
                    </div>
                    <div v-if="post.showMenu" class="menu-options">
                        <button @click="editPost(post)">編輯</button>
                        <button @click="deletePost(post.postId)">刪除</button>
                    </div>
                </div>
                <small>{{ post.createdAt }}</small>
                <img v-if="post.image" :src="post.image" alt="Post image" />
                
                <!-- 留言區域 -->
                <div class="comments">
                    <button @click="toggleComments(post.postId)">查看留言</button>
                    <div v-if="post.showComments">
                        <ul>
                            <li class="comment-item" v-for="comment in post.comments" :key="comment.id">{{ comment.content }}</li>
                        </ul>
                        <textarea v-model="post.newCommentContent" placeholder="新增留言..."></textarea>
                        <button @click="submitComment(post.postId)">送出留言</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>




<script lang="ts">
import axios, { AxiosError } from 'axios';
interface CommentDTO {
    id: number;
    content: string;
    createdAt: string;
}
interface User {
    userId: number;
    userName: string;
}

interface Post {
    postId: number;
    user:User;
    userName: string;
    content: string;
    createdAt: string;
    image?: string;
    showComments: boolean;
    comments: CommentDTO[];
    newCommentContent: string;
    showMenu: boolean;
}

export default {
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
        // Method to handle image file selection
        handleImageUpload(event: Event) {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files[0]) {
                const file = input.files[0];
                this.postImage = file;
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        this.imagePreview = reader.result as string; // Store the base64 image preview
                    }
                };
                reader.readAsDataURL(file); // Read the file as a base64 string
            }
        },
        logout() {
            localStorage.clear();  // Clear all data from localStorage
            alert('已登出！');
            // Optionally redirect to login or home page
            this.$router.push('/');
        },

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

        async fetchUserPosts() {
        if (!this.userId) return;
        try {
            const response = await axios.get<Post[]>(`http://localhost:8080/api/v1/user/getuserpost/${this.userId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            // Log the response to ensure postId is used correctly
            console.log("Fetched posts:", response.data);
            
            this.posts = response.data.map(post => ({
                ...post,
                showComments: false,  // Hide comments initially
                comments: [],
                newCommentContent: ''
            }));
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Failed to fetch posts", axiosError);
            alert(`Failed to fetch posts. Please try again later.\nError: ${axiosError.message}`);
        }
        },

        toggleComments(postId: number) {
    const post = this.posts.find(post => post.postId === postId); // Use post.postId instead of post.id
    if (post) {
        post.showComments = !post.showComments;  // Toggle comment visibility
        if (post.showComments && post.comments.length === 0) {
            this.fetchComments(postId);  // Fetch comments if they are empty
        }
    }
}
,  


async fetchComments(postId: number) {
    console.log("Fetching comments for post ID:", postId);
    try {
        const response = await axios.get<CommentDTO[]>(`http://localhost:8080/api/v1/user/comments/post/${postId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        const post = this.posts.find(post => post.postId === postId); // Use post.postId here
        
        if (post) {
            post.comments = response.data;  // Update comments for the post
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Failed to fetch comments", axiosError);
        alert(`Failed to fetch comments. Please try again later.\nError: ${axiosError.message}`);
    }
},

async submitComment(postId: number) {
    const post = this.posts.find(post => post.postId === postId); // Use post.postId here
    if (!post || !post.newCommentContent) return;

    const commentDTO = {
        content: post.newCommentContent,
        postId: postId,  // Pass postId from the argument
        userId: this.userId
    };

    try {
        const response = await axios.post<CommentDTO>('http://localhost:8080/api/v1/user/comments/create', commentDTO, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        console.log('Comment posted successfully', response.data);
        post.newCommentContent = '';  // Clear the comment input
        this.fetchComments(postId);  // Fetch updated comments
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Failed to post comment', axiosError);
        alert(`Failed to post comment. Please try again later.\nError: ${axiosError.message}`);
    }
},
    toggleMenu(postId : number) {
                const post = this.posts.find(post => post.postId === postId);
                if (post) {
                    post.showMenu = !post.showMenu; // Toggle the visibility of the menu
                }
        },
        editPost(post: Post) {
            const updatedContent = prompt("編輯貼文內容", post.content);
            if (updatedContent !== null) {
                const updatedPostDTO = { content: updatedContent };

                const apiUrl = `http://localhost:8080/api/v1/user/post/${post.postId}/editpost`;
                fetch(apiUrl, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedPostDTO),
                })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        post.content = data.content; // Update the content in the UI
                        post.showMenu = false; // Hide the menu after editing
                    } else {
                        alert("更新失敗！");
                    }
                })
                .catch(error => {
                    console.error("Error editing post:", error);
                });
            }
        },
deletePost(postId: number) {
            const apiUrl = `http://localhost:8080/api/v1/user/post/${postId}/delete`;
            fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                if (response.ok) {
                    // Remove the post from the local list
                    this.posts = this.posts.filter(post => post.postId !== postId);
                } else {
                    console.error("Failed to delete post");
                }
            })
            .catch(error => {
                console.error("Error deleting post:", error);
            });
        },

    }
}

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
    bottom: 10px;
    width: 100%;
    height: 100%;
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
    margin: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
}
.post-list {
    position: relative;
    margin: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
}
.post-user{
    color: #000;
}
.comment-item{
    color:black;
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
.post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.delete-button {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: darkred;
}
.post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.hamburger-menu {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 20px;
    height: 15px;
}

.menu-line {
    background-color: black;
    height: 3px;
    width: 100%;
}

.menu-options {
    position: absolute;
    top:25px;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
    padding: 10px;
    z-index: 1;
}

.menu-options button {
    display: block;
    width: 100%;
    padding: 5px;
    margin: 5px 0;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
}

.menu-options button:hover {
    background-color: #e0e0e0;
}
.logout-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 12px;
    cursor: pointer;
    position: fixed;
    top: 20px;
    right: 20px;
    border-radius: 5px;
}
</style>
