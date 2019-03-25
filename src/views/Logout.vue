<template>
</template>

<script>
export default {
  props: {
    is_auth: {
      type: Boolean,
      default: false,
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
      if (vm.is_auth) {
        vm.$http
          .get('/api/auth/logout')
          .then((response) => {
            if (response.status === 200) {
              vm.$emit('update:is_auth', false);
            }
            next({ path: '/' });
          })
          .catch((err) => {
            if (err.response.status === 400) {
              vm.alertMessage('로그인 정보가 없습니다');
              vm.$emit('update:is_auth', false);
            } else {
              vm.alertMessage('서버에 문제가 있습니다');
            }

            next({ path: '/' });
          });
      } else {
        vm.alertMessage('로그인 되어있지 않습니다');
        next({ path: '/' });
      }
    });
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
}
</style>
