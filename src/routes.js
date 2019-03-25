import Todo from '@/views/Todo.vue';
import Login from '@/views/Login.vue';
import Logout from '@/views/Logout.vue';
import Signup from '@/views/Signup.vue';
import NotFound from '@/components/NotFound.vue';

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/todo',
    name: 'todo',
    component: Todo,
  },
  {
    path: '*',
    component: NotFound,
  },
];
