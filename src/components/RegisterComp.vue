
<template>
  <div>
    <div :class="$style.register_container">
      <button :class="$style.close_button" @click="onClose">✕</button>
      <label :class="$style.register_totaltitle">註冊</label>
      <label :class="$style.register_totaltitlecontent">趕快加入我們吧!</label>
      <hr />
      <form @submit.prevent="handleSubmit">
        <div :class="$style.form_columns">
          <div :class="$style.left_column">
            <div :class="$style.label_with_error">
              <label :class="$style.register_title">電子郵件：</label>
              <p v-if="emailError" :class="$style.error_message">{{ emailError }}</p>
            </div>
            <input
              :class="$style.input"
              type="email"
              id="email"
              name="email"
              placeholder="請輸入電子郵件地址"
              v-model="formData.userEmail"
              @change="checkEmail"
              required
            />

            <div :class="$style.label_with_error">
              <label :class="$style.register_title">密碼：</label>
            </div>
            <input
              :class="$style.input"
              type="password"
              id="password"
              name="password"
              placeholder="請輸入密碼"
              v-model="formData.userPassword"
              @change="validatePassword"
              required
            />

            <div :class="$style.label_with_error">
              <label :class="$style.register_title">再次輸入密碼：</label>
              <p v-if="passwordError" :class="$style.error_message">{{ passwordError }}</p>
            </div>
            <input
              :class="$style.input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="請再次輸入密碼"
              v-model="formData.confirmPassword"
              @change="validatePassword"
              required
            />
          </div>

          <div :class="$style.right_column">
            <label :class="$style.register_title">姓名：</label>
            <input
              :class="$style.input"
              type="text"
              id="name"
              name="name"
              placeholder="請輸入您的姓名"
              v-model="formData.userName"
              required
            />
          </div>
        </div>
      </form>
      <button type="submit" :class="$style.rbt" @click="handleSubmit">註冊</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import axios from "axios";

export default defineComponent({
  setup(props, { emit }) {
    const formData = reactive({
      userEmail: "",
      userPassword: "",
      confirmPassword: "",
      userName: "",
    });
    const emailError = ref("");
    const passwordError = ref("");
    const formError = ref("");

    const onClose = () => {
      emit("close");
    };

    const checkEmail = async (): Promise<boolean> => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/guest/checkemail",
          formData.userEmail,
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
        if (response.data.exists) {
          emailError.value = "電子郵件已存在";
          return true;
        } else {
          emailError.value = "";
          return false;
        }
      } catch (err) {
        console.error(err);
        emailError.value = "無法驗證電子郵件";
        return true;
      }
    };

    const validatePassword = () => {
      if (formData.userPassword !== formData.confirmPassword) {
        passwordError.value = "密碼不匹配";
      } else {
        passwordError.value = "";
      }
    };

    const handleSubmit = async () => {
      emailError.value = "";
      passwordError.value = "";
      formError.value = "";

      const emailExists = await checkEmail();
      if (emailExists) {
        return;
      }

      if (formData.userPassword !== formData.confirmPassword) {
        passwordError.value = "密碼不匹配";
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/guest/register",
          {
            userEmail: formData.userEmail,
            userName: formData.userName,
            userPassword: formData.userPassword,
          }
        );
        console.log("Form submitted successfully", response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // Handle Axios-specific error
          if (error.response?.data?.message === "電子郵件已被註冊") {
            emailError.value = "電子郵件已被註冊";
          } else {
            console.error("Failed to register", error);
            formError.value = "註冊失敗，請稍後再試";
          }
        } else {
          // Handle non-Axios errors
          console.error("An unexpected error occurred", error);
          formError.value = "註冊失敗，請稍後再試";
        }
      }
    };

    return {
      formData,
      emailError,
      passwordError,
      formError,
      checkEmail,
      validatePassword,
      handleSubmit,
      onClose,
    };
  },
});
</script>

  <style module>
  .register_container {
    /* Add your container styles here */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    display: flex;
    flex-direction: column;
    width: 600px;
    /* 擴大寬度 */
    height: auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.1);
  }
  
  .close_button {
    /* Add your close button styles here */
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
    color: black;
    background: none;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  .register_title{
    color:black;
  }
  .register_totaltitle,
  .register_totaltitlecontent {
    /* Add title styles here */
    text-align: left;
    font-size: 24px;
    margin-left: 10px;
    font-weight: bold;
    color:black;
  }
  
  .form_columns {
    /* Add form layout styles here */
    display: flex;
    justify-content: space-between;
  }
  
  .left_column,
  .right_column {
    /* Add column styles here */
    flex: 1;
    margin: 0 10px;
  }
  
  .input {
    /* Add input field styles here */
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 40px;
  }
  
  .label_with_error {
    /* Add label and error message styles here */
    display: flex;
    align-items: center;

  }
  
  .error_message {
    /* Add error message styles here */
    color: red;
    margin-left: 40px;
    font-size: 14px;
    margin-bottom: 0;

  }
  </style>
  