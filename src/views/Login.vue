<template>
  <div class="ui container text">
    <h1 class="ui header">Login Page</h1>
    <BaseAuthForm class='ui form'
                  @submit='login'
                  :username.sync='username'
                  :password.sync='password'
                  button='Login'/>
  </div>
</template>

<script>
import BaseAuthForm from '@/components/BaseAuthForm.vue';

export default {
  components: {
    BaseAuthForm,
  },
  props: {
    is_auth: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login(event) {
      event.preventDefault();
      this.$http
        .post('/api/auth/login', {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 200) {
            this.$emit('update:is_auth', true);
            this.$router.push('/');
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            this.alertMessage('아이디와 비밀번호를 확인해주세요');
          } else {
            this.alertMessage('서버에 문제가 있습니다');
          }
        });
    },
    alertMessage(message) {
      alert(message);
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.is_auth) {
        vm.alertMessage('logined already');
        next({
          path: '/',
        });
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
