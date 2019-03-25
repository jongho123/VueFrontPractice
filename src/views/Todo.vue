<template>
  <div class="ui container text">
    <h1 class="ui header">My Todo Page</h1>
    <TodoPage @update:is_auth="(value) => $emit('update:is_auth', value)"/>
  </div>
</template>

<script>
import TodoPage from '@/components/TodoPage.vue';

export default {
  name: 'home',
  components: {
    TodoPage,
  },
  props: {
    is_auth: {
      type: Boolean,
      defulat: false,
      required: true,
    },
  },
  methods: {
    alertMessage(message) {
      alert(message);
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.is_auth) {
        vm.alertMessage('로그인해주세요');
        next({ path: '/login' });
      }
    });
  },
};
</script>
