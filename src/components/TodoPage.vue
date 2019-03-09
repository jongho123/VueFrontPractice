<template>
  <div>
    <BaseInputItem v-model="newTodoText" placeholder="new Todo" @keyup.enter="addTodo"/>
    <div v-if="todos.length">
      <TodoListItem v-for="todo in todos" :key="todo.id" :todo="todo" v-on="itemListeners"/>
    </div>
    <p v-else>
      Nothing left in the list. Add a new Todo
    </p>
  </div>
</template>

<script>

import BaseInputItem from './BaseInputItem.vue';
import TodoListItem from './TodoListItem.vue';

let nextTodoId = 1;

export default {
  data() {
    return {
      newTodoText: '',
      todos: [],
    };
  },
  created() {
    // rest api로 TodoItem 데이터 얻어오기.
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
      // add rest api 실행 후 변경
      this.todos.push({
        id: nextTodoId,
        text: this.newTodoText.trim(),
      });
      nextTodoId += 1;
    },
    removeTodo(removeId) {
      // delete rest api 실행 후 변경
      this.todos = this.todos.filter(todo => todo.id !== removeId);
    },
    editTodo(editId, newText) {
      const target = this.todos.findIndex(todo => todo.id === editId);

      // todoItem edit rest api 실행 후 변경
      this.todos[target].text = newText;
    },
  },
};
</script>
