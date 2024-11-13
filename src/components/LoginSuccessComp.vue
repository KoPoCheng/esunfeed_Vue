<template>
    <div :class="$style.modal">
      <div :class="$style.modal_content">
        <!-- Success checkmark animation icon -->
        <div :class="$style.checkmark">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l5 5L19 7" />
          </svg>
        </div>
        <!-- Success message -->
        <p>{{ message }} {{ dots }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  
  export default {
    props: {
      message: {
        type: String,
        required: true,
      },
    },
    setup() {
      const dots = ref("...");
  
      onMounted(() => {
        const timer = setInterval(() => {
          dots.value = dots.value.length < 3 ? dots.value + "." : ".";
        }, 500);
  
        // Clear the interval when component is unmounted
        onUnmounted(() => clearInterval(timer));
      });
  
      return {
        dots,
      };
    },
  };
  </script>
  
  <style module>
  .modal {
    /* Styles for modal */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal_content {
    /* Styles for modal content */    
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    position: relative;
    width: 300px;
  }
  .modal_content p {
    margin: 10px 0;
    padding-top: 100px;
    font-size: 20px;
    color: black;
    font-weight: bold;
  }
  .checkmark svg {
    width: 30px;
    height: 30px;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    animation: checkmark-path-animation 0.5s ease-in-out;
  }
  .checkmark {
    /* Styles for checkmark icon */
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #86C573;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    animation: checkmark-animation 0.5s ease-in-out;
  }
  @keyframes checkmark-path-animation {
    0% {
        stroke-dasharray: 80;
        stroke-dashoffset: 80;
    }

    100% {
        stroke-dasharray: 80;
        stroke-dashoffset: 0;
    }
  }
  @keyframes checkmark-animation {
      0% {
          transform: scale(0) translate(-50%, -50%) translateY(20px);
          opacity: 0;
      }

      50% {
          transform: scale(1.1) translate(-50%, -50%) translateY(0);
          opacity: 1;
      }

      100% {
          transform: scale(1) translate(-50%, -50%) translateY(0);
          opacity: 1;
      }
  }
  </style>
  