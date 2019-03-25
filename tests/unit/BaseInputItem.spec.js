import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import BaseInputItem from '@/components/BaseInputItem.vue';

const createComponent = propsData => mount(BaseInputItem, { propsData });

describe('BaseInputItem.vue', () => {
  let component;
  describe('html 렌더링', () => {
    it('render the correct markup', () => {
      component = createComponent();
      expect(component.html()).to.contain('<input type="text">');
      expect(component.contains('input')).to.be.true;
    });
  });
  describe('props 데이터 렌더링', () => {
    it('일반적인 데이터', () => {
      component = createComponent({ value: 'test' });

      expect(component.props()).to.have.property('value').that.equal('test');
    });
    it('value 없을 때 디폴트 데이터', () => {
      component = createComponent();
      expect(component.props()).to.have.property('value').that.equal('');
    });
  });
  describe('input 이벤트', () => {
    it('input 이벤트 및 emit 데이터', () => {
      const computed = sinon.stub(BaseInputItem.computed, 'listeners');
      let spy;
      // Vue 컴포넌트의 computed 에 listeners 함수 대체
      // 및 input 함수에 spy 함수 심음.
      computed.callsFake(() => {
        const listener = {
          input: (event) => {
            component.vm.$emit('input', event.target.value);
          },
        };
        spy = sinon.spy(listener, 'input');
        return listener;
      });

      component = createComponent({ value: 'test' });

      // input 함수가 콜 되기 전.
      expect(spy.called).to.be.false;

      // input에 입력하고 input 이벤트 함수 콜
      component.find('input').element.value = 'new_input';
      component.find('input').trigger('input');
      expect(spy.called).to.be.true;

      // 이벤트 함수 호출 후에 emit 이 되었는지 확인.
      expect(component.emitted().input.length).to.equal(1);
      expect(component.emitted().input[0]).to.deep.equal(['new_input']);
      // spy 와 stub 원래대로 복원
      spy.restore();
      computed.restore();
    });
  });
});
