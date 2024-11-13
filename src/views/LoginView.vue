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
      
      onMounted(() => {
        const token = localStorage.getItem("token"); 
        const role = localStorage.getItem("role"); 
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
  