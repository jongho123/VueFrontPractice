import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import Home from '@/views/Home.vue';

const createComponent = () => mount(Home);

describe('Home.vue', () => {
  let component;

  describe('HTML 렌더링', () => {
    it('홈페이지 렌더링', () => {
      const text = 'This is Home page';

      component = createComponent();
      expect(component.find('h1').text()).to.equal(text);
    });
  });
});
