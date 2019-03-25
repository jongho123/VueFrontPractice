<template>
  <div class="ui fluid action input">
    <input type="text" :value="todo.text" :readonly="!isEdit" v-on="inputListeners">
    <button class="ui icon mini button" @click="toggleCompleteTodo">
      <i v-if="todo.is_complete" class="star icon"></i>
      <i v-else class="star outline icon"></i>
    </button>
    <button class="ui icon mini button" @click="editTodo">
      <i v-if="isEdit" class="spinner loading icon"></i>
      <i v-else class="edit icon"></i>
    </button>
    <button class="ui icon mini button" @click="$emit('remove', todo.todo_id)">
      <i class="close icon"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newText: this.todo.text,
      isEdit: false,
    };
  },
  computed: {
    // input tag에 들어갈 이벤트리스너들
    inputListeners() {
      return {
        input: this.updateText,
        keyup: (e) => {
          if (e.keyCode === 13 && this.isEdit) {
            this.editTodo();
          }
        },
      };
    },
  },
  methods: {
    // input 창에 text를 입력하면 새로운 변수에 저장
    updateText(event) {
      this.newText = event.target.value;
    },
    // TodoItem의 수정된 내용을 상위 엘리먼트에 알려줌.
    editTodo() {
      this.isEdit = !this.isEdit;

      if (this.isEdit) {
        return;
      }

      if (this.todo.text === this.newText) {
        return;
      }

      // TodoItem edit event call
      this.$emit('edit', this.todo.todo_id, this.newText, this.todo.is_complete);
    },
    toggleCompleteTodo() {
      this.$emit('edit', this.todo.todo_id, this.todo.text, !this.todo.is_complete);
    },
  },
};
</script>
