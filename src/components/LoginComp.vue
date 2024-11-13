<template>
  <div :class="$style.container">
    <div :class="[$style.row, 'row']">
      <div :class="[$style.login_container, 'col-12 col-md-6']">
        <form @submit.prevent="handleLogin">
          <input
            :class="$style.input"
            type="email"
            id="email"
            name="email"
            placeholder="請輸入電子郵件地址"
            v-model="email"
            required
          />
          <input
            :class="$style.input"
            type="password"
            id="password"
            name="password"
            placeholder="請輸入密碼"
            v-model="password"
            required
          />
          <button type="submit" :class="$style.lbt">登入</button>
        </form>
        <div v-if="errorMessage" :class="$style.error_message">{{ errorMessage }}</div>
        <hr />
        <button type="button" @click="openRegister" :class="$style.rbt">建立新帳號</button>
      </div>
    </div>

    <Register v-if="showRegister" @close="closeRegister" />
    <LoginSuccessModal v-if="showSuccessModal" message="登入成功！跳至主頁中" />
  </div>
</template>

<script lang="ts">
import Register from "./RegisterComp.vue";
import LoginSuccessModal from "./LoginSuccessComp.vue";

export default {
  components: {
    Register,
    LoginSuccessModal,
  },
  data() {
    return {
      showRegister: false,
      email: "",
      password: "",
      errorMessage: "",
      showSuccessModal: false,
    };
  },
  methods: {
    openRegister() {
      this.showRegister = true;
    },
    closeRegister() {
      this.showRegister = false;
    },
    async handleLogin() {
      this.errorMessage = ""; // Clear error message
      try {
        const response = await fetch("http://localhost:8080/api/v1/guest/loginaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail: this.email, userPassword: this.password }),
        });
        const data = await response.json();

        if (response.ok && data.status) {
          console.log("登入成功:", data);
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.userRole);
          localStorage.setItem("userId", data.user.userId);
          localStorage.setItem("userName", data.user.userName);
          this.showSuccessModal = true;

          // Delay navigation by 4 seconds
          setTimeout(() => {
            this.showSuccessModal = false; // Hide modal before navigation
            if (data.user.userRole === "ADMIN") {
              console.log("Navigating to AdminPage...");
              this.$router.push("/admin");
            } else {
              console.log("Navigating to HomePage...");
              this.$router.push("/home");
            }
          }, 4000);
        } else {
          this.errorMessage = data.message || "登入失敗，請檢查帳號或密碼。";
        }
      } catch (error) {
        this.errorMessage = "登入過程中發生錯誤，請重試。";
        console.error("Login error:", error);
      }
    },
  },
};
</script>

<style module>

html, body {
    background-color: #ffffff; /* Set background color to white */
    margin: 0;
    padding: 0;
    height: 100%;
}
.container {
    position: relative;
    width: 100%;
    height: 100vh;
    /* 讓容器填滿整個螢幕高度 */
}

.row {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    /* 讓內容在小螢幕上換行 */
}

.login_container {
    position: absolute;
    background: white;
    display: flex;
    left: 70%;
    top: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    width: 300px;
    min-width: 300px;
    height: auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.1);
    margin: 20px;
}

.input {
    padding: 10px;
    margin: 10px 0 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
}

.lbt {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    margin-top: 10px;
    background-color: #0E3E39;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.lbt:hover {
    background-color: #156158;
}

.gbt {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    margin-top: 10px;
    background-color: white;
    color: #0E3E39;
    border: 1px solid #0E3E39;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.gbt:hover {
    background-color: rgb(204, 203, 203);
}

.rbt {
    background-color: #86C573;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.rbt:hover {
    background-color: #45a049;
}

.rtext {
    margin-top: 14px;
    text-align: center;
    font-size: 14px;
}

.ratext {
    color: #0E3E39;
    font-weight: bold;
}
.error_message {
    position: absolute;
    top: 64%;
    font-size: 14px;
    color: red;
}
.left_text {
    position: absolute;
    /* 改為相對定位 */
    left: 30%;
    top: 45%;
    transform: translate(-50%, -50%);
    width: auto;
    /* 根據內容自動調整寬度 */
    height: auto;
    /* 根據內容自動調整高度 */
    margin: 20px;
}

</style>
