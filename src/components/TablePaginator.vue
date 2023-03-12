<template>
  <div class="flex justify-center">
    <div class="flex">
      <button class="table-page-button left-rounded">&lt;&lt;</button>
      <button class="table-page-button">&lt;</button>
    </div>
    <span class="p-2"> {{ getPaginationLabel() }} </span>
    <button class="table-page-button">&gt;</button>
    <button class="table-page-button right-rounded">&gt;&gt;</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(
  {
    page: {
      type: Number,
      required: false,
      default: 0,
    },
    totalPages: {
      type: Number,
      required: false,
      default: 0,
    }
  });

const getPaginationLabel = (): string => {
  if (props.totalPages > 0) {
    return `Page: ${props.page} of ${props.totalPages}`;
  }

  return `Page: ${props.page}`;
}
</script>
