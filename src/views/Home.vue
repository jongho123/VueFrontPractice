<template>
  <div>
    <h1>My Todo Page</h1>
    <TodoPage />
  </div>
</template>

<script>
// @ is an alias to /src
import TodoPage from '@/components/TodoPage.vue';

export default {
  name: 'home',
  components: {
    TodoPage,
  },
};
</script>
