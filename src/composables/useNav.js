import { ref } from "vue";

export function useNav() {
  const navItems = ref([
    { id: 1, name: "Главная", route: "home" },
    { id: 2, name: "Номера", route: "rooms-list" },
    { id: 3, name: "Услуги", route: "goods-list" },
    { id: 4, name: "Галерея", route: "home", hash: "#gallery" },
    { id: 5, name: "Контакты", route: "contacts" },
  ]);

  const adminNavItems = ref([
    { id: 1, label: "Список товаров", route: "admin-goods-list", icon: "📦" },
    { id: 2, label: "Добавить товар", route: "admin-goods-add", icon: "➕" },
  ]);

  return { navItems, adminNavItems };
}
