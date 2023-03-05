<template>
  <div class="about">
    <h1>This is a transaction list page</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { Account } from '../assets/interfaces/model/Account';
import { AccountService } from '../assets/interfaces/services/AccountService';
import { GraphQlAccountService } from '../assets/services/GraphQlAccountService';

const accounts: Ref<Account[]> = ref([]);
const accountService: AccountService = new GraphQlAccountService();


onMounted(async() => {
  accounts.value = await accountService.getAll();
})

</script>


<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
