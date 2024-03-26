import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    //用户主页
    path: "/",
    component: () => import("../views/client.vue"),
    children: [
      {
        //查单词面板
        path: "/",
        component: () => import("../components/client/Home.vue"),
        children: [
          {
            //单词详情
            path: "/",
            component: () => import("../components/client/WordDetail.vue"),
          },
        ],
      },
      {
        path: "/newWord",
        component: () => import("../components/client/NewWord.vue"),
      },
      {
        path: "/mark",
        component: () => import("../components/client/Mark.vue"),
      },
      {
        path: "/history",
        component: () => import("../components/client/History.vue"),
      },
    ],
  },
  {
    path: "/mgr",
    component: () => import("../views/mgr.vue"),
    children: [
      {
        path: "/",
        component: () => import("../components/mgr/UserList.vue"),
      },
      {
        path: "/wordList",
        component: () => import("../components/mgr/WordList.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
