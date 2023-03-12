<template>
  <ComponentLoader
    :z-index="19"
    v-if="loading"/>
    <div class="flex flex-col mt-24 mb-32">
      <div class="flex flex-row self-center w-3/5 mb-4 justify-between">
        <div>
          <input
          v-model="searchString"
          class="friday-input-field search-field"
          placeholder="Search transactions"
          :disabled="loading" />
        </div>
        <div class="flex gap-4">
          <select
            v-model="accountId"
            class="friday-select"
            :disabled="loading">
            <option
              value="">Filter by account</option>
            <option
              v-for="account in frontendAccounts"
              :key="account.id"
              :value="account.id">{{ account.description }}</option>
          </select>
          <select
            v-model="categoryId"
            class="friday-select"
            :disabled="loading">
            <option
              value="">Filter by category</option>
            <option
              v-for="category in frontendCategories"
              :key="category.id"
              :value="category.id">{{ category.description }}</option>
          </select>
        </div>
      </div>
      <TableLite 
      class="self-center w-3/5"
      :columns="transactionColumns"
      :loading="loading"
      :rows="transactions"
      :rowClasses="rowClasses"
      @rowClicked="editTransaction" />
      <TablePaginator
        class="self-center w-3/5"
        :page="pageNo"
        :displaying-items="displayedItems"
        :total-pages="totalPages"
        :total-items="totalTransactions" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';
import { Account } from '../assets/interfaces/backend/Account';
import { Category } from '../assets/interfaces/backend/Category';
import { Transaction, TransactionPage } from '../assets/interfaces/backend/Transaction';
import { Account as FrontendAccount } from '../assets/interfaces/frontend/Account';
import { Category as FrontendCategory } from '../assets/interfaces/frontend/Category';
import { Transaction as FrontendTransaction } from '../assets/interfaces/frontend/Transaction';
import { toFrontendAccount, toFrontendCategory } from '../assets/ModelTransforms';
import ComponentLoader from '../components/ComponentLoader.vue';
import TablePaginator from '../components/TablePaginator.vue';
import TableLite from 'vue3-table-lite/ts';

const router = useRouter();
const loading = ref(false);
const accounts: Ref<Account[]> = ref([]);
const categories: Ref<Category[]> = ref([]);
const frontendAccounts: Ref<FrontendAccount[]> = ref([]);
const frontendCategories: Ref<FrontendCategory[]> = ref([]);
const transactions: Ref<Transaction[]> = ref([]);
const graphQlClient = useApolloClient().resolveClient();

const pageNo: Ref<number> = ref(1);
const totalPages: Ref<number> = ref(0);
const fromTransaction: Ref<number> = ref(0);
const toTransaction: Ref<number> = ref(0);
const displayedItems: Ref<number> = ref(0);
const totalTransactions: Ref<number> = ref(0);

const accountId: Ref<string> = ref('');
const categoryId: Ref<string> = ref('');
const searchString: Ref<string> = ref('');

const rowClasses: string[] = ['cursor-pointer', 'table-row'];
const transactionColumns = [
  {
    label: "Account",
    field: "account",
    width: "30%",
    display: (row: Transaction) => row.account?.name ?? ''
  },
  {
    label: "Category",
    field: "category",
    width: "40%",
    display: (row: Transaction) => row.category?.name ?? ''
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

const fetchTransactions = async(): Promise<TransactionPage | null> => {
  const transactionsQuery = gql`
    query getTransactions($pageNo: Int!) {
      getTransactions(pageNo: $pageNo) {
        transactions {
          account {
            id
            name
          }
          amount
          category {
            id
            name
          }
          currency
          date
          id
        }
        totalTransactions
        fromTransaction
        toTransaction
      }
    }
  `;
  
  const result = await graphQlClient.query({
    query: transactionsQuery,
    variables: {
      pageNo: pageNo.value
  }
  });

  return result.data?.getTransactions as TransactionPage;
}

const loadData = async() => {
  Promise.all([
  fetchAccounts(),
  fetchCategories(),
  fetchTransactions()]
  ).then(results => {
    accounts.value = results[0];
    categories.value = results[1];
    frontendAccounts.value = results[0].map(a => toFrontendAccount(a));
    frontendCategories.value = results[1].map(c => toFrontendCategory(c));
    if (results[2]) {
      transactions.value = results[2].transactions;
      displayedItems.value = transactions.value.length; 
      fromTransaction.value = results[2].fromTransaction;
      toTransaction.value = results[2].totalTransactions;
      totalTransactions.value = results[2].totalTransactions;
      totalPages.value = Math.floor(totalTransactions.value / 15);
    }
  }).catch(error => {
    console.log(error)
  }).finally(() => loading.value = false);
};

const editTransaction = (transaction: FrontendTransaction) => {
  router.push(`/transactions/${transaction.id}`);
}

onMounted(async () => {
  loading.value = true;
  loadData();
});
</script>
