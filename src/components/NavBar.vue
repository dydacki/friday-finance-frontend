<template>
  <nav>
    <div class=" navbar fixed flex justify-start top-0 w-full z-500 whitespace-nowrap"
    @click.left.stop>
      <div class="flex items-center select-none">
        <div class="logo flex items-start font-bold ">
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
  margin-left: 16px;
  margin-right: 16px;
  font-size: 20px;
  margin-top: -3px;
}

.router-link {
  color: var(--color-text);
  margin: 0 10px;
}
</style>