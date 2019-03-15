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

import axios from 'axios';
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
    axios
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
      .catch(error => console.log(error));
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
      axios
        .post('/api/todos', newTodo)
        .then((response) => {
          if (response.status === 200) {
            newTodo.todo_id = response.data.insertId;
            this.todos.push(newTodo);
            nextTodoId += 1;
            this.newTodoText = '';
          }
        })
        .catch(error => console.log(error));
    },
    removeTodo(removeId) {
      // 서버에서 삭제 후 Vue 데이터 삭제
      axios
        .delete(`/api/todos/${removeId}`)
        .then((response) => {
          if (response.status === 200) {
            this.todos = this.todos.filter(todo => todo.todo_id !== removeId);
          }
        })
        .catch(error => console.log(error));
    },
    editTodo(editId, newText, newComplete) {
      const editedTodo = {};
      editedTodo.text = newText;
      editedTodo.is_complete = newComplete;

      // 서버에서 수정 후 Vue 데이터 수정
      axios
        .put(`/api/todos/${editId}`, editedTodo)
        .then((response) => {
          if (response.status === 200) {
            const target = this.todos.find(todo => todo.todo_id === editId);
            target.text = newText;
            target.is_complete = newComplete;
          }
        })
        .catch(error => console.log(error));
    },
  },
};

</script>

<style scoped>
p {
  text-align: center;
}
</style>
