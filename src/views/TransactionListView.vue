<template>
  <ComponentLoader
    :z-index="19" />
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';
import { Account } from '../assets/interfaces/backend/Account';
import { Category } from '../assets/interfaces/backend/Category';
import { Transaction } from '../assets/interfaces/backend/Transaction';
import ComponentLoader from '../components/ComponentLoader.vue';

const loading: Ref<Boolean> = ref(false);
const accounts: Ref<Account[]> = ref([]);
const categories: Ref<Category[]> = ref([]);
const transactions: Ref<Transaction[]> = ref([]);
const graphQlClient = useApolloClient().resolveClient();

const fetchAccounts = async(): Promise<Account[]> => {
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
    return result.data?.getAccounts as Account[] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const fetchCategories = async(): Promise<Category[]> => {
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
    return result.data?.getCategories as Category[] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const fetchTransactions = async(): Promise<Transaction[]> => {
  const transactionsQuery = gql`
    query {
      getTransactions {
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
      query: transactionsQuery
    });
    return result.data?.getTransactions as Transaction[] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
const loadData = async () => {
  Promise.all([
  fetchAccounts(),
  fetchCategories(),
  fetchTransactions()]
  ).then(results => {
    accounts.value = results[0];
    categories.value = results[1];
    transactions.value = results[2];
  }).catch(error => {
    console.log(error)})
    .finally(() => loading.value = false);
};

onMounted(async () => {
  loading.value = true;
  await loadData();
  loading.value = false;
});
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
