<template>
  <div
    :style="zIndex ? `z-index: ${zIndex}` : ''"
    class="animation absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 rounded-sm">
    <div class="animation-container flex flex-col items-center justify-center min-w-ful p-4 rounded-xl">
      <div class="flex justify-center">
        <div class="animation-dot w-5 h-5 rounded-full"/>
        <div class="animation-dot w-5 h-5 rounded-full"/>
        <div class="animation-dot w-5 h-5 rounded-full"/>
      </div>
      <div
        v-if="text"
        class="loading-text opacity-90">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  defineProps({
    text: {
      type: String,
      required: false,
      default: 'Loading',
    },
    zIndex: {
      type: Number,
      required: false,
      default: 0,
    },
  });
</script>

<style scoped>
.animation {
  background-color: rgba(0,0,0,0.2);
}

.animation-container {
  background-color: rgba(var(--color-woodsmoke-rgb), 0.8);
  border: 2px solid var(--color-tuna);
  -webkit-box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.85);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.85);
  box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.85);
}

.animation-dot {
  margin: 1rem 0.3rem 0rem 0.3rem;
  background: var(--color-dodger-blue);
  animation: 0.9s bounce infinite alternate;
}

.animation-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.animation-dot:nth-child(3) {
  animation-delay: 0.6s;
}

.loading-text {
  margin-top: 5px;
  font-size: 21px;
  color: var(--color-alto);
}

@keyframes bounce {
  to {
    opacity: 0.6;
    height: 1.3rem;
    transform: translate3d(0, -1rem, 0);
  }
}
</style>
