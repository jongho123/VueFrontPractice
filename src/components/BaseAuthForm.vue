<template>
  <form v-on="listeners">
    <label>Username</label>
    <BaseInputItem :value="username"
                   @input="updateName"
                   type="text"
                   name="username"
                   placeholder="username"
                   required autofocus/> <br/>
    <label>Password</label>
    <BaseInputItem :value='password'
                   @input="updatePassword"
                   type="password"
                   name="password"
                   placeholder="password"
                   required/> <br/>
    <button class="ui submit fluid button" type="submit">{{button}}</button>
  </form>
</template>

<script>
import BaseInputItem from './BaseInputItem.vue';

export default {
  components: {
    BaseInputItem,
  },
  props: ['button', 'username', 'password'],
  computed: {
    listeners() {
      return {
        ...this.$listeners,
      };
    },
  },
  methods: {
    updateName(value) {
      this.$emit('update:username', value);
    },
    updatePassword(value) {
      this.$emit('update:password', value);
    },
  },
};
</script>

<style scoped>
form.form {
  text-align: left;
  max-width: 300px;
  margin: auto;
}
button.ui {
  margin-top: 10px;
}
</style>
