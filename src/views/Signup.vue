<template>
  <div class="ui container text">
    <h1 class="ui header">Signup Page</h1>
    <BaseAuthForm class='ui form'
                  @submit='signup'
                  :username.sync='username'
                  :password.sync='password'
                  button='Signup'/>
  </div>
</template>

<script>
import BaseAuthForm from '@/components/BaseAuthForm.vue';

export default {
  components: {
    BaseAuthForm,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    signup(event) {
      event.preventDefault();
      this.$http
        .post('/api/auth/create', {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 200) {
            this.$router.push('/login');
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            this.alertMessage('잘못된 입력이 있습니다.');
          } else if (err.response.status === 500) {
            this.alertMessage('다른 아이디를 입력해주세요');
          } else {
            this.alertMessage('서버에 문제가 있습니다');
          }
        });
    },
    alertMessage(message) {
      alert(message);
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
}
</style>
