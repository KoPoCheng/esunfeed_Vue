<template>
    <div>
      <Login />
    </div>
  </template>
  
  <script lang="ts">
  import { onMounted } from "vue";
  import { useRouter } from "vue-router";
  import Login from "../components/LoginComp.vue";
  
  export default {
    components: {
      Login,
    },
    setup() {
      const router = useRouter();
  
      // 在组件挂载时检查是否已经有 token
      onMounted(() => {
        const token = localStorage.getItem("token"); // 从 localStorage 中获取 token
        const role = localStorage.getItem("role"); // 获取角色信息
        if (token) {
          if (role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/home");
          }
        }
      });
    },
  };
  </script>
  