<template>
  <div>
    <input type="text" :value="todo.text" :disabled="!isEdit" v-on="inputListeners">
    <button @click="completeTodo">{{isComplete?'완료':'미완료'}}</button>
    <button @click="editTodo">Edit</button>
    <button @click="$emit('remove', todo.id)">Del</button>
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
      isComplete: false,
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
      this.$emit('edit', this.todo.id, this.newText);
    },
    // input 창에 text를 입력하면 새로운 변수에 저장
    updateText(event) {
      this.newText = event.target.value;
    },
    completeTodo() {
      this.isComplete = !this.isComplete;
    },
  },
};

</script>
