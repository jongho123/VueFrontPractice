import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import Logout from '@/views/Logout.vue';

// Vue 세팅
const localVue = createLocalVue();
localVue.prototype.$http = axios;

const createComponent = propsData => mount(Logout, { localVue, propsData });

describe('Logout.vue', () => {
  let component;
  let alertMessage = '';
  const mock = new MockAdapter(axios);

  before(() => {
    // alert 메세지 확인을 위한 스텁
    sinon.stub(Logout.methods, 'alertMessage').callsFake((message) => {
      alertMessage = message;
    });
  });

  afterEach(() => {
    mock.reset();
  });

  // 라우팅 가드에서 vm 인스턴스 생성 후
  // 콜백을 통해 vm을 받아 is_auth를 확인하고 다시 라우팅 함.
  // 콜백 함수에 vm을 넘겨줌.
  describe('라우팅 가드', () => {
    before(() => {
      mock.onGet('/api/auth/logout').reply(200);
    });
    beforeEach(() => {
      alertMessage = '';
    });
    it('로그인 안되어있을 때, alert와 홈으로 라우팅', () => {
      const nextSpy = sinon.spy();

      component = createComponent({ is_auth: false });
      Logout.beforeRouteEnter(undefined, undefined, nextSpy);

      // 콜백 함수에 생성된 vm 넘겨 줌.
      nextSpy.args[0][0](component.vm);

      // vm 생성을 위해 호출된 next 와 홈으로 라우팅을 위한 next
      expect(nextSpy.callCount).to.equal(2);

      // 홈('/')으로 라우팅을 요청했는지 확인.
      expect(nextSpy.args[1][0].path).to.equal('/');

      // alert 메세지 확인
      expect(alertMessage).to.equal('로그인 되어있지 않습니다');
    });
    it('로그인 되어있을 때, 로그아웃 요청 후 라우팅', (done) => {
      const nextSpy = sinon.spy();

      component = createComponent({ is_auth: true });
      Logout.beforeRouteEnter(undefined, undefined, nextSpy);

      nextSpy.args[0][0](component.vm);
      setTimeout(() => {
        expect(nextSpy.callCount).to.equal(2);
        expect(nextSpy.args[1][0].path).to.equal('/');
        done();
      });
    });
  });
  describe('이벤트', () => {
    beforeEach(() => {
      alertMessage = '';
    });
    afterEach(() => {
      mock.reset();
    });
    it('로그아웃 성공, is_auth 업데이트 이벤트', (done) => {
      mock.onGet('/api/auth/logout').reply(200);
      component = createComponent({ is_auth: true });

      const nextSpy = sinon.spy();
      Logout.beforeRouteEnter(undefined, undefined, nextSpy);
      nextSpy.args[0][0](component.vm);

      setTimeout(() => {
        expect(component.emitted()).to.have.property('update:is_auth');
        expect(component.emitted()['update:is_auth'][0]).to.include(false);
        done();
      });
    });
    it('로그아웃 실패, 400 에러, is_auth 업데이트 ', (done) => {
      mock.onGet('/api/auth/logout').reply(400);
      component = createComponent({ is_auth: true });

      const nextSpy = sinon.spy();
      Logout.beforeRouteEnter(undefined, undefined, nextSpy);
      nextSpy.args[0][0](component.vm);

      setTimeout(() => {
        expect(component.emitted()).to.have.property('update:is_auth');
        expect(component.emitted()['update:is_auth'][0]).to.include(false);
        expect(alertMessage).to.equal('로그인 정보가 없습니다');
        done();
      });
    });
  });
});
