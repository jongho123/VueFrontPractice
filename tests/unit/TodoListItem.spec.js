import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import TodoListItem from '@/components/TodoListItem.vue';

const createComponent = propsData => mount(TodoListItem, { propsData });

describe('TodoListItem', () => {
  let component;
  let todo;

  beforeEach(() => {
    todo = {
      id: 0,
      todo_id: 0,
      text: 'test_todo',
      is_complete: 0,
    };
  });
  describe('html 렌더링', () => {
    it('render the correct markup', () => {
      component = createComponent({ todo });
      expect(component.html()).to.contain('input');
      expect(component.find('input').attributes()).to.have.property('readonly');

      expect(component.contains('button')).to.be.true;
      expect(component.findAll('button').length).to.equal(3);
    });
    it('아이콘 렌더링', () => {
      component = createComponent({ todo });
      const icons = component.findAll('i');

      // star outline, edit, close icon
      expect(icons.length).to.equal(3);
      expect(icons.at(0).classes()).to.deep.equal(['star', 'outline', 'icon']);
      expect(icons.at(1).classes()).to.deep.equal(['edit', 'icon']);
      expect(icons.at(2).classes()).to.deep.equal(['close', 'icon']);

      // star icon 변경 확인
      component.props().todo.is_complete = 1;
      component.vm.$forceUpdate();
      expect(icons.at(0).classes()).to.deep.equal(['star', 'icon']);

      // edit icon 변경 확인
      component.vm.isEdit = true;
      component.vm.$forceUpdate();
      expect(icons.at(1).classes()).to.deep.equal(['spinner', 'loading', 'icon']);
    });
  });
  describe('props 데이터 렌더링', () => {
    it('일반적인 데이터', () => {
      component = createComponent({ todo });
      expect(component.props()).to.have.property('todo');
      expect(component.props().todo).to.have.property('text');
      expect(component.props().todo).to.have.property('is_complete');

      expect(component.find('input').element.value).to.equal(todo.text);
    });
  });
  describe('이벤트 함수', () => {
    it('input tag input 이벤트', () => {
      const listenerStub = sinon.stub(TodoListItem.computed, 'inputListeners');
      let spy;
      listenerStub.callsFake(() => {
        const listener = {
          input: (event) => {
            component.vm.newText = event.target.value;
          },
        };
        spy = sinon.spy(listener, 'input');
        return listener;
      });

      component = createComponent({ todo });

      // input 이벤트 함수가 아직 호출되지 않음.
      expect(spy.called).to.be.false;

      // edit 상태 변경 후 readonly 가 사라졌는지 체크
      component.vm.isEdit = true;
      component.vm.$forceUpdate();
      expect(component.find('input').attributes()).to.not.have.property('readonly');

      // input에 새로운 값 입력 및 이벤트 발생
      component.find('input').element.value = 'new_text';
      component.find('input').trigger('input');

      // input 이벤트 함수 호출됐는지 확인
      expect(spy.called).to.be.true;

      // 함수 호출 후 newText 데이터가 변경됐는지 확인
      expect(component.vm.newText).to.equal('new_text');

      spy.restore();
      listenerStub.restore();
    });
    it('input tag keyup 이벤트', () => {
      component = createComponent({ todo });
      const spy = sinon.spy(component.vm, 'editTodo');

      // edit 상태가 아닐 때는 editTodo가 호출되지 않음.
      component.find('input').trigger('keyup.enter');
      expect(spy.called).to.be.false;

      component.vm.isEdit = true;
      component.find('input').trigger('keyup.enter');
      expect(spy.called).to.be.true;

      spy.restore();
    });
    it('complete button(star icon) click 이벤트', () => {
      const spy = sinon.spy(TodoListItem.methods, 'toggleCompleteTodo');
      component = createComponent({ todo });

      // click 이벤트가 호출되기 전의 상태 확인
      expect(spy.called).to.be.false;
      expect(component.props().todo.is_complete).to.equal(0);

      // click 이벤트 호출 후 상태 확인
      component.findAll('button').at(0).trigger('click');
      expect(spy.called).to.be.true;
      expect(component.emitted().edit[0][2]).to.equal(!component.props().todo.is_complete);

      // is_complete를 바꾸고 클릭 이벤트 실행
      component.props().todo.is_complete = !component.props().todo.is_complete;
      component.findAll('button').at(0).trigger('click');
      expect(component.emitted().edit[1][2]).to.equal(!component.props().todo.is_complete);

      spy.restore();
    });
    it('edit button click 이벤트', () => {
      const spy = sinon.spy(TodoListItem.methods, 'editTodo');
      component = createComponent({ todo });

      // click 이벤트가 호출되기 전의 상태 확인
      expect(spy.called).to.be.false;
      expect(component.vm.isEdit).to.be.false;

      // click 이벤트가 호출되면 edit 가능한 상태로 바뀜
      component.findAll('button').at(1).trigger('click');
      expect(spy.called).to.be.true;
      expect(component.vm.isEdit).to.be.true;

      // edit 가능한 상태로 바뀌었을 때는 emit 하지 않음
      expect(component.emitted().edit).to.equal(undefined);

      // edit 상태에서 새로 입력된 텍스트와 todo 의 텍스트가 같은 경우에는
      // edit 불가능한 상태로 바꾸고 emit 하지 않음.
      component.vm.newText = component.props().todo.text;
      component.findAll('button').at(1).trigger('click');
      expect(component.emitted().edit).to.equal(undefined);

      // edit 가능한 상태에서 새로운 텍스트가 입력됐으면 emit 함.
      const testText = `new ${component.props().todo.text}`;
      component.vm.isEdit = true;
      component.vm.newText = testText;
      component.findAll('button').at(1).trigger('click');
      expect(component.emitted().edit.length).to.equal(1);
      expect(component.emitted().edit[0][1]).to.equal(testText);
    });
    it('delete button click event', () => {
      component = createComponent({ todo });

      // 버튼 클릭 전에는 emit 된 것이 없어야 함
      expect(component.emitted().remove).to.equal(undefined);

      // 버튼 클릭 후 remove emit 에 id가 있어야 함.
      const currentId = component.props().todo.id;
      component.findAll('button').at(2).trigger('click');
      expect(component.emitted().remove.length).to.equal(1);
      expect(component.emitted().remove[0][0]).to.equal(currentId);
    });
  });
});
