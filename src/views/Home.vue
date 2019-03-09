<template>
  <div class="ui container text">
    <h1 class="ui header">My Todo Page</h1>
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
