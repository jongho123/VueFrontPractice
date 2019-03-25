import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '@/App.vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import routes from '@/routes';

// Vue 세팅
const localVue = createLocalVue();
localVue.prototype.$http = axios;
localVue.use(VueRouter);

const createComponent = () => {
  // TODO
  // history 모드에서 base를 "/" 주는데도 
  // 왜 처음에 context.html 을 라우팅?
  const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes,
  });
  return mount(App, { localVue, router });
};

describe('App.vue', () => {
  let component;
  const mock = new MockAdapter(axios);

  describe('HTML 렌더링', () => {
    afterEach(() => {
      mock.reset();
    });

    it('홈페이지 렌더링', (done) => {
      mock.onPost('/api/auth/login').reply(400);

      component = createComponent();
      component.vm.$router.push('/');

      setTimeout(() => {
        expect(component.vm.$route.path).to.equal('/');
        expect(component.find(Home).exists()).to.be.true;
        done();
      });
    });
    it('로그인 안 했을 때 네비게이션', (done) => {
      const navData = [
        { path: '/', text: 'Home' },
        { path: '/login', text: 'Login' },
        { path: '/signup', text: 'Signup' },
      ];

      mock.onPost('/api/auth/login').reply(400);

      component = createComponent();
      component.vm.$router.push('/');

      setTimeout(() => {
        expect(component.vm.is_auth).to.be.false;

        // 네비게이션 wrapper 가져옴.
        const nav = component.findAll('div').filter(wrap => wrap.attributes().id === 'nav').at(0);

        // 메뉴 개수(a 태그)와 링크 확인
        expect(nav.findAll('a').length).to.equal(navData.length);

        nav.findAll('a').wrappers.forEach((wrap, idx) => {
          expect(wrap.attributes().href).to.equal(navData[idx].path);
          expect(wrap.text()).to.equal(navData[idx].text);
        });

        done();
      });
    });
    it('로그인 했을 때 네비게이션', (done) => {
      const navData = [
        { path: '/', text: 'Home' },
        { path: '/todo', text: 'Todo' },
        { path: '/logout', text: 'Logout' },
      ];

      // 로그인 처리.
      mock.onPost('/api/auth/login').reply(200);

      component = createComponent();
      component.vm.$router.push('/');

      setTimeout(() => {
        expect(component.vm.is_auth).to.be.true;

        // 네비게이션 wrapper 가져옴.
        const nav = component.findAll('div').filter(wrap => wrap.attributes().id === 'nav').at(0);

        // 메뉴 개수(a 태그)와 링크 확인
        expect(nav.findAll('a').length).to.equal(navData.length);

        nav.findAll('a').wrappers.forEach((wrap, idx) => {
          expect(wrap.attributes().href).to.equal(navData[idx].path);
          expect(wrap.text()).to.equal(navData[idx].text);
        });

        done();
      });
    });
  });
});
