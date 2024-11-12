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
                v-model="formData.email"
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
                v-model="formData.password"
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
                v-model="formData.name"
                required
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, reactive} from "vue";
  
  export default {
    props: {
      onClose: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      const formData = reactive({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      });
      const emailError = ref("");
      const passwordError = ref("");
      const formError = ref("");
  
      const checkEmail = async () => {
        try {
          const response = await axios.post("http://localhost:8080/api/v1/guest/checkemail", formData.email, {
            headers: {
              "Content-Type": "text/plain",
            },
          });
          if (response.data.exists) {
            emailError.value = "電子郵件已存在";
          } else {
            emailError.value = "";
          }
        } catch (err) {
          console.error(err);
          emailError.value = "無法驗證電子郵件";
        }
      };
  
      const validatePassword = () => {
        if (formData.password !== formData.confirmPassword) {
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
          emailError.value = "電子郵件已存在";
          return;
        }
  
        if (formData.password !== formData.confirmPassword) {
          passwordError.value = "密碼不匹配";
          return;
        }
  
        // Handle successful form submission logic here
        console.log("Form submitted successfully");
      };
  
      return {
        formData,
        emailError,
        passwordError,
        formError,
        checkEmail,
        validatePassword,
        handleSubmit,
        onClose: props.onClose,
      };
    },
  };
  </script>
  
  <style module>
  .register_container {
    /* Add your container styles here */
  }
  
  .close_button {
    /* Add your close button styles here */
  }
  
  .register_totaltitle,
  .register_totaltitlecontent {
    /* Add title styles here */
  }
  
  .form_columns {
    /* Add form layout styles here */
  }
  
  .left_column,
  .right_column {
    /* Add column styles here */
  }
  
  .input {
    /* Add input field styles here */
  }
  
  .label_with_error {
    /* Add label and error message styles here */
  }
  
  .error_message {
    /* Add error message styles here */
  }
  </style>
  