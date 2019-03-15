import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import TodoPage from '@/components/TodoPage.vue';
import BaseInputItem from '@/components/BaseInputItem.vue';
import TodoListItem from '@/components/TodoListItem.vue';

const createComponent = propsData => mount(TodoPage, { propsData });

describe('TodoPage.vue', () => {
  let component;
  const mock = new MockAdapter(axios);

  // todos 테스트용 데이터
  const todos = [{
    todo_id: 0,
    text: 'test_todo',
    is_complete: 0,
  },
  {
    todo_id: 1,
    text: 'test_todo2',
    is_complete: 0,
  },
  {
    todo_id: 2,
    text: 'test_todo3',
    is_complete: 1,
  }];

  describe('REST API', () => {
    beforeEach(() => {
      mock.onGet('/api/todos').reply(200, todos);
    });
    afterEach(() => {
      mock.reset();
    });
    it('created hook의 axios request', (done) => {
      component = createComponent();
      setTimeout(() => {
        expect(mock.history.get.length).to.equal(1);
        expect(mock.history.get[0].url).to.equal('/api/todos');
        done();
      });
    });
    it('created hook의 axios reponse', (done) => {
      component = createComponent();
      setTimeout(() => {
        expect(component.vm.todos.length).to.equal(todos.length);
        component.vm.todos.forEach((todo, idx) => {
          expect(todo).to.contain(todos[idx]);
        });
        done();
      });
    });
    it('addTodo() axios request', (done) => {
      const newText = 'new_todo4';
      const responseData = { insertId: 3 };
      mock.onPost('/api/todos').reply(200, responseData);

      component = createComponent();
      // created에 axios 요청 처리 후에 불러짐.
      setTimeout(() => {
        component.vm.newTodoText = newText;
        component.vm.addTodo();
      });

      // addTodo() 의 axios 요청 처리 후에 불러짐.
      setTimeout(() => {
        expect(mock.history.post.length).to.equal(1);
        expect(mock.history.post[0].url).to.equal('/api/todos');
        const requestData = JSON.parse(mock.history.post[0].data);
        expect(requestData.text).to.equal(newText);
        done();
      });
    });
    it('addTodo() axios response', (done) => {
      const insertId = 3;
      const newText = 'test_todo4';

      mock.onPost('/api/todos').reply(200, { insertId });

      component = createComponent();

      // created hook 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        component.vm.newTodoText = newText;
        component.vm.addTodo();
      });

      // addTodo() 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        expect(component.vm.todos.length).to.equal(todos.length + 1);
        expect(component.vm.newTodoText).to.equal('');
        const newTodo = component.vm.todos.find(todo => todo.todo_id === insertId);
        expect(newTodo).to.not.equal(undefined);
        expect(newTodo.todo_id).to.equal(insertId);
        expect(newTodo.text).to.equal(newText);
        done();
      });
    });
    it('removeTodo() axios request', (done) => {
      const targetId = 0;
      mock.onDelete(/\/api\/todos\/\d+/).reply(200, {});

      component = createComponent();

      // created hook 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        component.vm.removeTodo(targetId);
      });

      // removeTodo() 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        expect(mock.history.delete.length).to.equal(1);
        expect(mock.history.delete[0].url).to.equal(`/api/todos/${targetId}`);
        done();
      });
    });
    it('removeTodo() axios response', (done) => {
      const targetId = 0;

      mock.onDelete(/\/api\/todos\/\d+/).reply(200, {});

      component = createComponent();
      // created hook 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        component.vm.removeTodo(targetId);
      });

      // removeTodo() 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        expect(component.vm.todos.length).to.equal(todos.length - 1);
        component.vm.todos.forEach((todo) => {
          expect(todo.todo_id).to.not.equal(targetId);
        });

        done();
      });
    });
    it('editTodo() axios request', (done) => {
      const editId = 0;
      const edited = {
        text: 'edit_new_todo',
        is_complete: 1,
      };

      mock.onPut(/\/api\/todos\/\d+/).reply(200, {});

      component = createComponent();
      // created hook 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        component.vm.editTodo(editId, edited.text, edited.is_complete);
      });

      // editTodo() 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        expect(mock.history.put.length).to.equal(1);
        expect(mock.history.put[0].url).to.equal(`/api/todos/${editId}`);
        const data = JSON.parse(mock.history.put[0].data);
        expect(data).to.deep.equal(edited);
        done();
      });
    });
    it('editTodo() axios response', (done) => {
      const editId = 0;
      const edited = {
        text: 'edit_new_todo',
        is_complete: 1,
      };

      mock.onPut(/\/api\/todos\/\d+/).reply(200, {});

      component = createComponent();

      // created hook 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        component.vm.editTodo(editId, edited.text, edited.is_complete);
      });

      // editTodo() 의 axios promise 호출 후 실행됨
      setTimeout(() => {
        expect(component.vm.todos.length).to.equal(todos.length);
        const after = component.vm.todos.find(todo => todo.todo_id === editId);
        expect(after).to.not.equal(undefined);
        expect(after).to.contain(edited);
        done();
      });
    });
  });
  describe('html 렌더링', () => {
    beforeEach(() => {
      mock.onGet('/api/todos').reply(200, todos);
      component = createComponent();
    });
    afterEach(() => {
      mock.reset();
    });
    it('render the correct markup', (done) => {
      setTimeout(() => {
        expect(component.find(BaseInputItem).exists()).to.be.true;
        expect(component.find(TodoListItem).exists()).to.be.true;
        done();
      });
    });
    it('todos 과 ListTodoItem 개수 같아야 함', (done) => {
      setTimeout(() => {
        expect(component.findAll(TodoListItem).length).to.equal(todos.length);
        done();
      });
    });
  });
  describe('child 컴포넌트 이벤트', () => {
    beforeEach(() => {
      mock.onGet('/api/todos').reply(200, todos);
      component = createComponent();
    });
    afterEach(() => {
      mock.reset();
    });
    it('BaseInputItem의 input input emit', (done) => {
      setTimeout(() => {
        const inputText = 'test2';
        expect(component.vm.newTodoText).to.equal('');

        // BaseInputItem 의 input에 입력 및 이벤트 트리거
        const baseInputItem = component.find(BaseInputItem);
        baseInputItem.find('input').element.value = inputText;
        baseInputItem.find('input').trigger('input');

        expect(component.vm.newTodoText).to.equal(inputText);
        done();
      });
    });
    it('BaseInputItem의 input keyup.enter', (done) => {
      // addTodo() 호출했는지 확인하기 위한 스텁
      // 내부의 기능은 동작할 필요가 없기 때문에 스텁을 이용.
      const stub = sinon.stub(component.vm, 'addTodo');

      setTimeout(() => {
        expect(stub.called).to.be.false;

        // BaseInputItem 의 input에 keyup.enter 이벤트 트리거
        const baseInputItem = component.find(BaseInputItem);
        baseInputItem.find('input').trigger('keyup.enter');
        expect(stub.called).to.be.true;
        stub.restore();
        done();
      });
    });
    it('TodoListItem의 edit', (done) => {
      // editTodo() 호출했는지 확인하기 위한 스텁
      // 내부의 기능은 동작할 필요가 없기 때문에 스텁을 이용.
      const stub = sinon.stub(component.vm, 'editTodo');

      setTimeout(() => {
        expect(stub.called).to.be.false;

        // complete button 클릭. edit emit 발생.
        const todoListItem = component.find(TodoListItem);
        todoListItem.find('button').trigger('click');

        expect(stub.called).to.be.true;
        stub.restore();
        done();
      });
    });
    it('TodoListItem의 remove', (done) => {
      // removeTodo() 호출했는지 확인하기 위한 스텁
      // 내부의 기능은 동작할 필요가 없기 때문에 스텁을 이용.
      const stub = sinon.stub(component.vm, 'removeTodo');

      setTimeout(() => {
        expect(stub.called).to.be.false;

        // remove button 클릭. remove emit 발생.
        const todoListItem = component.find(TodoListItem);
        todoListItem.findAll('button').at(2).trigger('click');
        expect(stub.called).to.be.true;
        stub.restore();
        done();
      });
    });
  });
});
