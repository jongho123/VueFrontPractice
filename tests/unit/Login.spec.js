import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import Login from '@/views/Login.vue';
import BaseAuthForm from '@/components/BaseAuthForm.vue';

// Vue 세팅
const localVue = createLocalVue();
localVue.prototype.$http = axios;

const createComponent = propsData => mount(Login, { localVue, propsData });

describe('Login.vue', () => {
  let component;
  const mock = new MockAdapter(axios);

  before(() => {
    // alert 동작하지 않도록 스텁처리
    sinon.stub(Login.methods, 'alertMessage');
  });

  afterEach(() => {
    mock.reset();
  });

  describe('HTML 렌더링', () => {
    it('헤더 텍스트', () => {
      const text = 'Login Page';
      component = createComponent({ is_auth: false });

      expect(component.find('h1').exists()).to.be.true;
      expect(component.find('h1').text()).to.equal(text);
    });
    it('폼', () => {
      component = createComponent({ is_auth: false });
      expect(component.find(BaseAuthForm).exists()).to.be.true;
    });
  });

  describe('데이터', () => {
    it('props is_auth', () => {
      component = createComponent({ is_auth: false });
      expect(component.vm.is_auth).to.be.false;
    });
  });

  // 라우팅 가드에서 vm 인스턴스 생성 후
  // 콜백을 통해 vm을 받아 is_auth를 확인하고 다시 라우팅 함.
  // 콜백 함수에 vm을 넘겨줌.
  describe('라우팅 가드', () => {
    it('로그인 안되었을 때, 정상적인 라우팅', () => {
      const nextSpy = sinon.spy();

      component = createComponent({ is_auth: false });
      Login.beforeRouteEnter(undefined, undefined, nextSpy);

      // 콜백 함수에 생성된 vm 넘겨 줌.
      nextSpy.args[0][0](component.vm);

      // vm 생성을 위해 호출된 next
      expect(nextSpy.callCount).to.equal(1);
    });
    it('로그인 되어있을 때, 라우팅 거부', () => {
      const nextSpy = sinon.spy();

      component = createComponent({ is_auth: true });
      Login.beforeRouteEnter(undefined, undefined, nextSpy);

      nextSpy.args[0][0](component.vm);

      // 로그인이 되어있을 때 라우팅을 거부.
      // 다른 곳으로 라우팅하기위해 next 호출하여 총 2번 호출
      expect(nextSpy.callCount).to.equal(2);

      // 거부한 뒤 홈('/')으로 라우팅을 요청했는지 확인.
      expect(nextSpy.args[1][0].path).to.equal('/');
    });
  });
  describe('이벤트', () => {
    const nothing = {
      preventDefault: () => {},
    };
    it('로그인 성공, is_auth 업데이트 이벤트', (done) => {
      mock.onPost('/api/auth/login').reply(200);
      component = createComponent({ is_auth: false });

      const pushSpy = sinon.spy();
      component.vm.$router = { push: pushSpy };

      component.vm.login(nothing);
      setTimeout(() => {
        expect(component.emitted()).to.have.property('update:is_auth');
        expect(component.emitted()['update:is_auth'][0]).to.include(true);
        expect(pushSpy.called).to.be.true;
        expect(pushSpy.args[0][0]).to.equal('/');
        done();
      });
    });
    it('로그인 실패', (done) => {
      mock.onPost('/api/auth/login').reply(400);
      component = createComponent({ is_auth: false });

      const pushSpy = sinon.spy();
      component.vm.$router = { push: pushSpy };

      component.vm.login(nothing);
      setTimeout(() => {
        expect(component.emitted()).to.not.have.property('update:is_auth');
        expect(pushSpy.called).to.be.false;
        done();
      });
    });
  });
});
