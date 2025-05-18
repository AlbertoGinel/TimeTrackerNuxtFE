<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const username = ref("");
const password = ref("");
const error = ref("");
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });
    await navigateTo("/dashboard");
  } catch (err) {
    error.value = "Invalid credentials";
  }
};
</script>
