import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import BaseAuthForm from '@/components/BaseAuthForm.vue';
import BaseInputItem from '@/components/BaseInputItem.vue';

const createComponent = propsData => mount(BaseAuthForm, { propsData });

describe('BaseAuthForm.vue', () => {
  let component;

  describe('HTML 렌더링', () => {
    it('username input', () => {
      component = createComponent({ username: 'test' });

      expect(component.findAll('label').at(0).text()).to.equal('Username');
      expect(component.findAll(BaseInputItem).length).to.equal(2);
      expect(component.findAll(BaseInputItem).at(0).vm.value).to.equal('test');
    });
    it('password input', () => {
      component = createComponent({ password: 'test2' });

      expect(component.findAll('label').at(1).text()).to.equal('Password');
      expect(component.findAll(BaseInputItem).length).to.equal(2);
      expect(component.findAll(BaseInputItem).at(1).vm.value).to.equal('test2');
    });
    it('button', () => {
      component = createComponent({ button: 'test3' });

      expect(component.find('button').exists()).to.be.true;
      expect(component.find('button').text()).to.equal('test3');
    });
  });

  describe('데이터', () => {
    it('props datas', () => {
      component = createComponent({
        username: 'username',
        password: 'password',
        button: 'button',
      });

      expect(component.props().username).to.equal('username');
      expect(component.props().password).to.equal('password');
      expect(component.props().button).to.equal('button');
    });
  });

  describe('이벤트', () => {
    it('username 업데이트 이벤트', () => {
      component = createComponent({});

      component.findAll(BaseInputItem).at(0).vm.$emit('input', 'new1');

      expect(component.emitted()).to.have.property('update:username');
      expect(component.emitted()['update:username'][0]).to.include('new1');
    });
    it('password 업데이트 이벤트', () => {
      component = createComponent({});

      component.findAll(BaseInputItem).at(1).vm.$emit('input', 'new2');

      expect(component.emitted()).to.have.property('update:password');
      expect(component.emitted()['update:password'][0]).to.include('new2');
    });
  });
});
