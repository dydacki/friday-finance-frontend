<template>
  <div class="text-xl p-12">
    <div class="mb-6">Release notes</div>
  </div>
  <div class="pl-12">
    <div
      v-for="log in changelog"
      :key="log.version"
      class="log-item pl-4">
      <div class="log-date">{{ log.date }}</div>

      <div
        v-for="(items, key) in log.changes"
        :key="key">
        <div v-if="log.changes[key]">
          <div class="mt-2 mb-1">
            <div
              class="circle"
              :class="key"/>
            <span>{{ keyTitles[key] }}</span>
          </div>
          <ul class="log-changes">
            <li
              v-for="(text, index) in items"
              :key="index"
              class="log-change"
              :class="key">
              {{ text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import changelog from '../assets/json/changelog.json';
const keyTitles = {
        new: 'new',
        changed: 'changed',
        fixed: 'fixed',
      }
</script>

<style scoped>
.log-item {
  border-left: 3px solid var(--color-trout);
}

.log-date {
  color: var(--color-sail);
}

.circle {
  display: inline-block;
  margin-right: 9px;
  margin-left: -3px;
  height: 10px;
  width: 10px;
  background-color: grey;
  border-radius: 50%;
}

.circle.new {
  background-color: var(--color-mantis);
}

.circle.changed {
  background-color: var(--color-lightning-yellow);
}

.circle.fixed {
  background-color: var(--color-mojo);
}

.log-change::before {
  content: "\2022";
  display: inline-block;
  width: 13px;
}

.log-change.new::before {
  color: var(--color-mantis);
}

.log-change.changed::before {
  color: var(--color-lightning-yellow);
}

.log-change.fixed::before {
  color: var(--color-mojo);
}
</style>
