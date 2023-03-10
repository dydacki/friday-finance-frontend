<template>
  <div class="flex">
    <div class="flex w-1/3 items-center pl-2">
      {{ getDisplayingLabel() }}
    </div>
    <div class="flex justify-center w-1/3">
      <button 
        class="table-page-button left-rounded"
        @click="firstPage"
        :disabled="props.page === 1">&lt;&lt;</button>
      <button 
        class="table-page-button"
        @click="previousPage"
        :disabled="props.page === 1">&lt;</button>
      <span class="p-2"> {{ getPaginationLabel() }} </span>
      <button 
        class="table-page-button"
        @click="nextPage"
        :disabled="props.page === props.totalPages">&gt;</button>
      <button 
        class="table-page-button right-rounded"
        @click="lastPage"
        :disabled="props.page === props.totalPages">&gt;&gt;</button>
    </div>
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
    },
    displayingItems: {
      type: Number,
      required: false,
      default: 0,
    },
    startItem: {
      type: Number,
      required: false,
      default: 0,
    },
    endItem: {
      type: Number,
      required: false,
      default: 0,
    },
    totalItems: {
      type: Number,
      required: false,
      default: 0,
    }
  });

const emit = defineEmits(['firstPage', 'previousPage', 'nextPage', 'lastPage'])

const getPaginationLabel = (): string => {
  if (props.totalPages > 0) {
    return `Page: ${props.page} of ${props.totalPages}`;
  }

  return `Page: ${props.page}`;
}

const getDisplayingLabel = (): string => {
  const pageSize = props.endItem - props.startItem + 1;

  if (props.displayingItems == pageSize) {
    return `Displaying ${props.startItem} - ${props.endItem} of ${props.totalItems} items`;  
  }

  return `Displaying ${props.displayingItems} items`;
}

const firstPage = () => {
  emit('firstPage');
}

const previousPage = () => {
  emit('previousPage');
}

const nextPage = () => {
  emit('nextPage');
}

const lastPage = () => {
  emit('lastPage');
}
</script>
