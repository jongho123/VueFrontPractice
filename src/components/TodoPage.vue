<template>
  <div class="ui two column centered stackable grid container">
    <div class="column">
      <div class="ui black segment">
        <div class="ui fluid input">
          <BaseInputItem v-model="newTodoText" placeholder="new Todo" @keyup.enter="addTodo"/>
        </div>
        <div v-if="todos.length">
          <TodoListItem v-for="todo in todos" :key="todo.id" :todo="todo" v-on="itemListeners"/>
        </div>
        <p v-else>
          Nothing left in the list. Add a new Todo
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import BaseInputItem from './BaseInputItem.vue';
import TodoListItem from './TodoListItem.vue';

let nextTodoId = 0;

export default {
  data() {
    return {
      newTodoText: '',
      todos: [],
    };
  },
  created() {
    // rest api로 TodoItem 데이터 얻어오기.
    this.$http
      .get('/api/todos')
      .then((response) => {
        if (response.status === 200) {
          this.todos = response.data.map((todo) => {
            const addedId = JSON.parse(JSON.stringify(todo));
            addedId.id = nextTodoId;
            nextTodoId += 1;
            return addedId;
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.expireAuth();
        }
      });
  },
  components: {
    BaseInputItem,
    TodoListItem,
  },
  computed: {
    itemListeners() {
      return {
        edit: this.editTodo,
        remove: this.removeTodo,
      };
    },
  },
  methods: {
    addTodo() {
      if (this.newTodoText.trim() === '') {
        return;
      }
      const newTodo = {
        id: nextTodoId,
        text: this.newTodoText.trim(),
        is_complete: 0,
      };

      // 서버에 todoItem 추가 후 Vue 데이터에 추가
      this.$http
        .post('/api/todos', newTodo)
        .then((response) => {
          if (response.status === 200) {
            newTodo.todo_id = response.data.insertId;
            this.todos.push(newTodo);
            nextTodoId += 1;
            this.newTodoText = '';
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.expireAuth();
          }
        });
    },
    removeTodo(removeId) {
      // 서버에서 삭제 후 Vue 데이터 삭제
      this.$http
        .delete(`/api/todos/${removeId}`)
        .then((response) => {
          if (response.status === 200) {
            this.todos = this.todos.filter(todo => todo.todo_id !== removeId);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.expireAuth();
          }
        });
    },
    editTodo(editId, newText, newComplete) {
      const editedTodo = {};
      editedTodo.text = newText;
      editedTodo.is_complete = newComplete;

      // 서버에서 수정 후 Vue 데이터 수정
      this.$http
        .put(`/api/todos/${editId}`, editedTodo)
        .then((response) => {
          if (response.status === 200) {
            const target = this.todos.find(todo => todo.todo_id === editId);
            target.text = newText;
            target.is_complete = newComplete;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.expireAuth();
          }
        });
    },
    expireAuth() {
      this.$emit('update:is_auth', false);
      this.$router.push('/login');
    },
    alertMessage(message) {
      alert(message);
    },
  },
};

</script>

<style scoped>
p {
  text-align: center;
}
</style>
