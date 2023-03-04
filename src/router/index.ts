import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TransactionListView from '../views/TransactionListView.vue';
import TransactionView  from '../views/TransactionView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/transactions',
    name: 'trsansactions',
    component: TransactionListView
  },
  {
    path: '/transactions/:transactionId',
    name: 'trsansaction',
    component: TransactionView
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
