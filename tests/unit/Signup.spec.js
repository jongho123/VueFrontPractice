import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import Signup from '@/views/Signup.vue';
import BaseAuthForm from '@/components/BaseAuthForm.vue';

// Vue 세팅
const localVue = createLocalVue();
localVue.prototype.$http = axios;

const createComponent = propsData => mount(Signup, { localVue, propsData });

describe('Signup.vue', () => {
  let component;
  let alertMessage = '';
  const mock = new MockAdapter(axios);

  before(() => {
    // alert 메세지 확인을 위한 스텁 처리
    sinon.stub(Signup.methods, 'alertMessage').callsFake((message) => {
      alertMessage = message;
    });
  });

  afterEach(() => {
    mock.reset();
  });

  describe('HTML 렌더링', () => {
    it('헤더 텍스트', () => {
      const text = 'Signup Page';
      component = createComponent({ is_auth: false });

      expect(component.find('h1').exists()).to.be.true;
      expect(component.find('h1').text()).to.equal(text);
    });
    it('폼', () => {
      component = createComponent({ is_auth: false });
      expect(component.find(BaseAuthForm).exists()).to.be.true;
    });
  });

  describe('이벤트', () => {
    const signupUrl = '/api/auth/create';

    const nothing = {
      preventDefault: () => {},
    };

    beforeEach(() => {
      alertMessage = '';
    });

    afterEach(() => {
      mock.reset();
    });

    it('회원가입 성공, 로그인 페이지로 라우팅', (done) => {
      mock.onPost(signupUrl).reply(200);
      component = createComponent({ is_auth: false });

      const pushSpy = sinon.spy();
      component.vm.$router = { push: pushSpy };

      component.vm.signup(nothing);
      setTimeout(() => {
        expect(pushSpy.called).to.be.true;
        expect(pushSpy.args[0][0]).to.equal('/login');
        done();
      });
    });
    it('회원가입 실패, 에러 코드 400', (done) => {
      mock.onPost(signupUrl).reply(400);
      component = createComponent({ is_auth: false });

      const pushSpy = sinon.spy();
      component.vm.$router = { push: pushSpy };

      component.vm.signup(nothing);
      setTimeout(() => {
        expect(pushSpy.called).to.be.false;
        expect(alertMessage).to.equal('잘못된 입력이 있습니다.');
        done();
      });
    });
    it('회원가입 실패, 에러 코드 500', (done) => {
      mock.onPost(signupUrl).reply(500);
      component = createComponent({ is_auth: false });

      const pushSpy = sinon.spy();
      component.vm.$router = { push: pushSpy };

      component.vm.signup(nothing);
      setTimeout(() => {
        expect(pushSpy.called).to.be.false;
        expect(alertMessage).to.equal('다른 아이디를 입력해주세요');
        done();
      });
    });
  });
});
