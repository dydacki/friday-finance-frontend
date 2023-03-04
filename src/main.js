import { createApp, h, provide } from 'vue';
import App from './App.vue';
import router from './router';
import ApolloClicent from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DefaultApolloClient } from '@vue/apollo-composable';
import './assets/main.css';
const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
});
const apolloClicent = new ApolloClicent({
    link: httpLink,
    cache: new InMemoryCache()
});
const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClicent);
    },
    render: () => h(App)
})
    .use(router)
    .mount('#app');
//# sourceMappingURL=main.js.map