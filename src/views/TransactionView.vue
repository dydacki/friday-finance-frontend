<template>
  <div class="flex flex-wrap w-full">
    <fieldset class="section w-full border rounded mt-4 ml-6 mr-6 mb-4">
      <legend class="text-xl ml-4 mr-4 pl-2 pr-2">
          {{ transactionReference() }}
        </legend>
        <div class="flex flex-wrap">
          <div class="column mb-4 p-2 w-1/2">
            <label>Reference</label>
            <input
              v-model="transaction.reference"
              class="friday-input-field w-full mt-1"
              placeholder="Transaction reference"
              :disabled="loading">
          </div>
          <div class=" column mb-4 p-2 w-1/2">
            <label>Date</label>
            <input
              v-model="transaction.date"
              class="friday-input-field w-full mt-1"
              placeholder="Transaction amount"
              disabled>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="column mb-4 p-2 w-1/2">
            <label>Amount</label>
            <input
              v-model="transaction.amount"
              class="friday-input-field w-full mt-1 text-right"
              placeholder="Transaction reference"
              :disabled="loading">
          </div>
          <div class=" column mb-4 p-2 w-1/2">
            <label>Currency</label>
            <input
              v-model="transaction.date"
              class="friday-input-field w-full mt-1"
              placeholder="Transaction amount"
              disabled>
          </div>
        </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import {useRoute} from 'vue-router';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';
import { dateTimeNow } from '../assets/DateTime';
import { Account as BackendAccount } from '../assets/interfaces/backend/Account';
import { Account as FrontendAccount } from '../assets/interfaces/frontend/Account';
import { Category as BackendCategory } from '../assets/interfaces/backend/Category';
import { Category as FrontendCategory } from '../assets/interfaces/frontend/Category';
import { Transaction as BackendTransaction } from '../assets/interfaces/backend/Transaction';
import { Transaction as FrontendTransaction } from '../assets/interfaces/frontend/Transaction';
import { toFrontendAccount, toFrontendCategory, toFrontendTransaction } from '../assets/ModelTransforms';

const graphQlClient = useApolloClient().resolveClient();
const transactionId: string = useRoute().params.transactionId.toString();
const loading = ref(false);
const frontendAccounts: Ref<FrontendAccount[]> = ref([]);
const frontendCategories: Ref<FrontendCategory[]> = ref([]);
const transaction: Ref<FrontendTransaction> = ref({
  id: '',
  account: '',
  category: '',
  amount: 0,
  currency: '',
  date: dateTimeNow(),
  reference: ''
});

const transactionReference = (): string => {
  if (transaction.value.reference !== '') {
    transaction.value.reference
  }
  return 'No transaction reference';
}

const fetchAccounts = async(): Promise<BackendAccount[]> => {
  const accountsQuery = gql`
    query {
      getAccounts {
        id
        bank
        name
      }
    }
  `;
  
  try {
    const result = await graphQlClient.query({
      query: accountsQuery
    });
    return result.data?.getAccounts as BackendAccount[] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const fetchCategories = async(): Promise<BackendCategory[]> => {
  const categoriesQuery = gql`
    query {
      getCategories {
        id
        color
        name
      }
    }
  `;
  
  try {
    const result = await graphQlClient.query({
      query: categoriesQuery
    });
    return result.data?.getCategories as BackendCategory[] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const fetchTransaction = async(transactionId: string): Promise<BackendTransaction |null> => {
  const transactionQuery = gql`
    query {
      getTransaction(id: "${transactionId}") {
        id
        accountId
        categoryId
        reference
        amount
        currency
        date
      }
    }
  `;
  
  try {
    const result = await graphQlClient.query({
      query: transactionQuery
    });
    return result.data?.getTransaction as BackendTransaction;
  } catch (error) {
    console.error(error);
    return null;
  }
}

onMounted(async () => {
  Promise.all([
  fetchAccounts(),
  fetchCategories(),
  fetchTransaction(transactionId)]
  ).then(results => {
    frontendAccounts.value = results[0].map(a => toFrontendAccount(a));
    frontendCategories.value = results[1].map(c => toFrontendCategory(c));
    const backendTransaction = results[2];
    if (backendTransaction) {
      transaction.value = toFrontendTransaction(backendTransaction, results[0], results[1]);
    }
    }).catch(error => {
      console.log(error)
    }).finally(() => loading.value = false);
});
</script>

<style scoped>
.section {
  min-width: 800px;
}

.column {
  flex: 0 0 auto;
}
</style>
