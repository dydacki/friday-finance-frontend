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
        :start-item="startItem"
        :end-item="endItem"
        :total-items="totalTransactions"
        @first-page="fetchFirst"
        @previous-page="fetchPrevious"
        @next-page="fetchNext"
        @last-page="fetchLast" />
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
import { TransactionPage as FrontendTransactionPage } from '../assets/interfaces/frontend/TransactionPage';
import { toFrontendAccount, toFrontendCategory, toFrontendTransactionPage } from '../assets/ModelTransforms';
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
const startItem: Ref<number> = ref(0);
const endItem: Ref<number> = ref(0);
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

  const result = await graphQlClient.query({
    query: accountsQuery
  });
  return result.data?.getAccounts as Account[] ?? [];
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

  const result = await graphQlClient.query({
    query: categoriesQuery
  });
    
  return result.data?.getCategories as Category[] ?? [];
}

const fetchTransactions = async(pageNumber: number): Promise<TransactionPage | null> => {
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
      pageNo: pageNumber
  }
  });

  return result.data?.getTransactions as TransactionPage;
}

const loadData = async() => {
  Promise.all([
  fetchAccounts(),
  fetchCategories(),
  fetchAndFilterTransactionsPage()]
  ).then(results => {
    accounts.value = results[0];
    categories.value = results[1];
    frontendAccounts.value = results[0].map(a => toFrontendAccount(a));
    frontendCategories.value = results[1].map(c => toFrontendCategory(c));
    if (results[2]) {
      transactions.value = results[2].transactions;
      startItem.value = results[2].start;
      endItem.value = results[2].end;
      displayedItems.value = transactions.value.length; 
      totalTransactions.value = results[2].totalTransactions;
      totalPages.value = Math.ceil(totalTransactions.value / 15);
    }
  }).catch(error => {
    console.log(error)
  }).finally(() => loading.value = false);
};

const filterBySearchString = (transactionPage: TransactionPage, searchString: string): void => {
  if (searchString) {
    transactionPage.transactions = 
      transactionPage.transactions.filter(t => 
        t.account.name.includes(searchString)
        || t.category.name.includes(searchString)
        || t.currency.includes(searchString)
        || t.date.includes(searchString)
        || t.reference?.includes(searchString));
  }
};

const filterByAccount = (transactionPage: TransactionPage, accountId: string): void => {
  if (accountId) {
    transactionPage.transactions = transactionPage.transactions.filter(t => t.account.id === accountId);
  }
};

const filterBycategory = (transactionPage: TransactionPage, categoryId: string): void => {
  if (categoryId) {
    transactionPage.transactions = transactionPage.transactions.filter(t => t.category.id === categoryId);
  }
};

const fetchAndFilterTransactionsPage = async(): Promise<FrontendTransactionPage | null> => {
  const transactionPage = await fetchTransactions(pageNo.value);
  if (transactionPage) {
    // filterBySearchString(transactionPage, accountId.value);
    // filterByAccount(transactionPage, accountId.value);
    // filterBycategory(transactionPage, categoryId.value);
    return toFrontendTransactionPage(transactionPage);
  }

  return null;
};

const editTransaction = (transaction: Transaction) => {
  router.push(`/transactions/${transaction.id}`);
};

onMounted(async () => {
  loading.value = true;
  loadData();
});

const loadTransactionsAsync = async() => {
  fetchAndFilterTransactionsPage()
  .then(result => {
    if (result) {
      transactions.value = result.transactions;
      startItem.value = result.start;
      endItem.value = result.end;
      displayedItems.value = transactions.value.length; 
      totalTransactions.value = result.totalTransactions;
      totalPages.value = Math.ceil(totalTransactions.value / 15);
    }
  })
  .catch(error => 
  console.log(error))
  .finally(() => loading.value = false);
};

const fetchFirst = () => {
  pageNo.value = 1;
  loading.value = true;
  setTimeout(loadTransactionsAsync, 400);
};

const fetchPrevious = () => {
  pageNo.value -= 1;
  loading.value = true;
  setTimeout(loadTransactionsAsync, 400);
};

const fetchNext = () => {
  pageNo.value += 1;
  loading.value = true;
  setTimeout(loadTransactionsAsync, 400);
};

const fetchLast = () => {
  pageNo.value = totalPages.value;
  setTimeout(loadTransactionsAsync, 400);
}
</script>
