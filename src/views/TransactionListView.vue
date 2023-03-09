<template>
  <ComponentLoader
    :z-index="19"
    v-if="loading"/>
    <div class="flex justify-center mt-24 mb-32">
      <TableLite 
      class="self-center w-3/5"
      :columns="transactionColumns"
      :loading="loading"
      :rows="frontendTransactions"
      :rowClasses="rowClasses"
      @rowClicked="editTransaction"
      @get-now-page="nowPage" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';
import { Account } from '../assets/interfaces/backend/Account';
import { Category } from '../assets/interfaces/backend/Category';
import { Transaction } from '../assets/interfaces/backend/Transaction';
import { Account as FrontendAccount } from '../assets/interfaces/frontend/Account';
import { Category as FrontendCategory } from '../assets/interfaces/frontend/Category';
import { Transaction as FrontendTransaction } from '../assets/interfaces/frontend/Transaction';
import { toFrontendAccount, toFrontendCategory, toFrontendTransaction } from '../assets/ModelTransforms';
import ComponentLoader from '../components/ComponentLoader.vue';
import TableLite from 'vue3-table-lite/ts';

const router = useRouter();
const loading: Ref<Boolean> = ref(false);
const accounts: Ref<Account[]> = ref([]);
const categories: Ref<Category[]> = ref([]);
const frontendAccounts: Ref<FrontendAccount[]> = ref([]);
const frontendCategories: Ref<FrontendCategory[]> = ref([]);
const frontendTransactions: Ref<FrontendTransaction[]> = ref([]);
const graphQlClient = useApolloClient().resolveClient();
const pageNo: Ref<number> = ref(1);

const rowClasses = ['cursor-pointer'];
const transactionColumns = [
  {
    label: "Account",
    field: "account",
    width: "30%",
  },
  {
    label: "Category",
    field: "category",
    width: "40%",
  },
  {
    label: "Reference",
    field: "reference",
    width: "20%",
  },
  {
    label: "Amount",
    field: "amount",
    width: "5%",
  },
  {
    label: "Currency",
    field: "currency",
    width: "5%",
  }
];

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
    query GetTransactions($pageNo: Int!){
      getTransactions(pageNo: $pageNo) {
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
      query: transactionsQuery,
      variables: {
        pageNo: pageNo.value
    }
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
    frontendAccounts.value = results[0].map(a => toFrontendAccount(a));
    frontendCategories.value = results[1].map(c => toFrontendCategory(c));
    frontendTransactions.value = results[2].map(t => toFrontendTransaction(t, accounts.value, categories.value));
  }).catch(error => {
    console.log(error)
  }).finally(() => loading.value = false);
};

const editTransaction = (transaction: FrontendTransaction) => {
  router.push(`/transactions/${transaction.id}`);
}

const nowPage = (pageNumber: number) => {
  console.log('Page number:', pageNumber);
} 

onMounted(async () => {
  loading.value = true;
  loadData();
});
</script>

<style scoped>
.table {
  max-width: 1200px;
}
</style>
