<template>
  <ComponentLoader
    :z-index="19"
    v-if="loading"/>
  <div class="flex flex-col mt-24 items-center">
    <div class="w-3/5">
      <div class="flex flex-row mb-4 justify-between">
        <div>
          <input
          v-model="searchString"
          class="friday-input-field search-field"
          placeholder="Search transactions"
          :disabled="loading"
          @keyup="debouceFiltering" />
        </div>
        <div class="flex gap-4">
          <select
            v-model="accountId"
            class="friday-select"
            :disabled="loading"
            @change="applyFiltering">
            <option
              value="">Search by account</option>
            <option
              v-for="account in frontendAccounts"
              :key="account.id"
              :value="account.id">{{ account.description }}</option>
          </select>
          <select
            v-model="categoryId"
            class="friday-select"
            :disabled="loading"
            @change="applyFiltering">
            <option
              value="">Search by category</option>
            <option
              v-for="category in frontendCategories"
              :key="category.id"
              :value="category.id">{{ category.description }}</option>
          </select>
        </div>
      </div>
      <TableLite
        :columns="transactionColumns"
        :loading="loading"
        :rows="filteredTransactions"
        :rowClasses="rowClasses"
        @rowClicked="editTransaction" />
      <TablePaginator
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
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';
import { Account } from '../assets/interfaces/backend/Account';
import { Category } from '../assets/interfaces/backend/Category';
import { Transaction, TransactionPage } from '../assets/interfaces/backend/Transaction';
import { Account as FrontendAccount } from '../assets/interfaces/frontend/Account';
import { Category as FrontendCategory } from '../assets/interfaces/frontend/Category';
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
const filteredTransactions: Ref<Transaction[]> = ref([]);
const graphQlClient = useApolloClient().resolveClient();

const pageNo: Ref<number> = ref(1);
const totalPages: Ref<number> = ref(0);
const startItem: Ref<number> = ref(0);
const endItem: Ref<number> = ref(0);
const displayedItems: ComputedRef<number> = computed(() => filteredTransactions.value.length);
const totalTransactions: Ref<number> = ref(0);

const accountId: Ref<string> = ref('');
const categoryId: Ref<string> = ref('');
const searchString: Ref<string> = ref('');
const searchTimeout = ref(); 

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
  fetchTransactions(pageNo.value)]
  ).then(results => {
    accounts.value = results[0];
    categories.value = results[1];
    frontendAccounts.value = results[0].map(a => toFrontendAccount(a));
    frontendCategories.value = results[1].map(c => toFrontendCategory(c));
    assign(results[2]);
  }).catch(error => console.log(error))
  .finally(() => loading.value = false);
};

const debouceFiltering = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => applyFiltering(), 300);
}

const applyFiltering = () => {
  filteredTransactions.value = filterTransactions(transactions.value);
}

const filterTransactions = (transactionList: Transaction[]) => {
  return filterByCategory(
          filterByAccount( 
            filterBySearchString(transactionList, searchString.value), accountId.value), categoryId.value);
}

const filterBySearchString = (transactions: Transaction[], searchString: string): Transaction[] => {
  let result: Transaction[] = transactions;
  if (searchString) {
    result = result.filter(t => 
      t.account.name.toLowerCase().includes(searchString)
      || t.category.name.toLowerCase().includes(searchString)
      || t.currency.toLowerCase().includes(searchString)
      || t.date.includes(searchString)
      || t.reference?.toLowerCase().includes(searchString));
  }

  return result;
};

const filterByAccount = (transactions: Transaction[], accountId: string): Transaction[] => {
  let result: Transaction[] = transactions;
  if (accountId) {
    result = result.filter(t => t.account.id === accountId);
  }

  return result;
};

const filterByCategory = (transactions: Transaction[], categoryId: string): Transaction[] => {
  let result: Transaction[] = transactions;
  if (categoryId) {
    result = result.filter(t => t.category.id === categoryId);
  }

  return result;
};

const editTransaction = (transaction: Transaction) => {
  router.push(`/transactions/${transaction.id}`);
};

onMounted(async () => {
  loading.value = true;
  loadData();
});

const loadTransactionsAsync = async() => {
  fetchTransactions(pageNo.value)
  .then(result => assign(result))
  .catch(error => console.log(error))
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
  loading.value = true;
  setTimeout(loadTransactionsAsync, 400);
};

const assign = (transactionPage: TransactionPage | null) => {
  if (transactionPage) {
    transactions.value = transactionPage.transactions;
    filteredTransactions.value = filterTransactions(transactionPage.transactions);
    startItem.value = transactionPage.fromTransaction;
    endItem.value = transactionPage.toTransaction;
    totalTransactions.value = transactionPage.totalTransactions;
    totalPages.value = Math.ceil(totalTransactions.value / 15);
  }
};
</script>
