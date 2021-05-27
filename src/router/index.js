/*
  Copyright (c) 2020 classmate-sun
  [Software Name] is licensed under Mulan PSL v2.
  You can use this software according to the terms and conditions of the Mulan PSL v2.
  You may obtain a copy of Mulan PSL v2 at:
          http://license.coscl.org.cn/MulanPSL2
  THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
  MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
  See the Mulan PSL v2 for more details.
*/

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About')
  },
  {
    path: '/blog/:id',
    name: 'Blog',
    component: () => import('../views/Blog')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('../views/Message')
  },
  {
    path: '/Game',
    name: 'Play',
    component: () => import('../views/Game')
  },
  {
    path: '/play/扫雷',
    name: 'Play',
    component: () => import('../views/Play/扫雷.vue')
  },
  {
    path: '/play/圈猫猫',
    name: 'Play',
    component: () => import('../views/Play/cat.vue')
  },
  {
    path: '/play/俄罗斯方块',
    name: 'Play',
    component: () => import('../views/Play/tetris.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/Vid')
  },
  {
    path: '/watch/:id',
    name: 'Video',
    component: () => import('../views/watch')
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('../views/Diary')
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('../views/Links')
  },
  {
    path: '/Article/:id',
    name: 'Article',
    component: () => import('../views/Article')
  },
  {
    path: '/user/:id',
    name: 'About',
    component: () => import('../views/user')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/404')
  }
]

const router = new VueRouter({
  routes
})

export default router
