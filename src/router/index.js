import { createRouter, createWebHashHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

import HomeView from "../view/Home.vue";
import AuthView from "../view/Auth.vue";
import RegisterView from "../view/Register.vue";
import RestaurantView from "../view/Restaurant.vue";
import RoomDetailsView from "../view/RoomDetails.vue";
import RoomsListView from "../view/RoomsList.vue";
import ContactsView from "../view/Contacts.vue";
import MyBookingsView from "../view/MyBookings.vue";
import GoodsListView from "../view/GoodsList.vue";
import GoodsDetailsView from "../view/GoodsDetails.vue";
import NotFound from "../view/NotFound.vue";
import AdminPanelView from "../view/admin/AdminPanel.vue";
import AdminGoodsListView from "../view/admin/AdminGoodsList.vue";
import AdminGoodsAddView from "../view/admin/AdminGoodsAdd.vue";
import AdminGoodsEditView from "../view/admin/AdminGoodsEdit.vue";
import DescriptionTab from "../view/goods/Description.vue";
import SpecificationsTab from "../view/goods/Specifications.vue";
import ReviewsTab from "../view/goods/Reviews.vue";

const routes = [
  { path: "/", component: HomeView, name: "home" },
  { path: "/auth", component: AuthView, name: "auth" },
  { path: "/register", component: RegisterView, name: "register" },
  { path: "/restaurant", component: RestaurantView, name: "restaurant" },
  { path: "/rooms", component: RoomsListView, name: "rooms-list" },
  { path: "/contacts", component: ContactsView, name: "contacts" },
  { path: "/profile/bookings", component: MyBookingsView, name: "my-bookings" },
  { path: "/room/:id", component: RoomDetailsView, name: "room-details" },
  { path: "/goods", component: GoodsListView, name: "goods-list" },
  {
    path: "/goods/:id",
    component: GoodsDetailsView,
    name: "goods-details",
    children: [
      { path: "", redirect: { name: "goods-details-description" } },
      {
        path: "description",
        name: "goods-details-description",
        component: DescriptionTab,
      },
      {
        path: "specs",
        name: "goods-details-specs",
        component: SpecificationsTab,
      },
      { path: "reviews", name: "goods-details-reviews", component: ReviewsTab },
    ],
  },
  {
    path: "/admin",
    component: AdminPanelView,
    name: "admin-panel",
    meta: { requiresAdmin: true },
    children: [
      { path: "", redirect: { name: "admin-goods-list" } },
      {
        path: "goods",
        name: "admin-goods-list",
        component: AdminGoodsListView,
      },
      {
        path: "goods/add",
        name: "admin-goods-add",
        component: AdminGoodsAddView,
      },
      {
        path: "goods/edit/:id",
        name: "admin-goods-edit",
        component: AdminGoodsEditView,
      },
    ],
  },

  { path: "/:pathMatch(.*)*", component: NotFound, name: "not-found" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const { isAdmin } = useAuth();
  if (to.meta.requiresAdmin && !isAdmin.value) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
