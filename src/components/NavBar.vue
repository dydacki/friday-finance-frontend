<template>
  <nav>
    <div class=" navbar fixed flex justify-start top-0 w-full z-500 whitespace-nowrap"
    @click.left.stop>
      <div class="flex items-center select-none">
        <div class="logo flex items-start font-bold ml-4 mr-4">
          FRIDAY FINANCE
        </div>
        <div class="router-link flex items-center cursor-pointer">
          <RouterLink to="/">
            <span>Home</span>
          </RouterLink>
        </div>
        <div class="router-link flex items-center cursor-pointer">
          <RouterLink to="/transactions">
            <span>Transactions</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--color-tuna);
  box-shadow: 0 2px 8px #00000086;
  height: 46px;
}

.logo {
  color: var(--color-text);
  font-size: 20px;
}

.router-link {
  color: var(--color-text);
  margin: 0 10px;
}
</style>