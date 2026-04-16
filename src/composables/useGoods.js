import { ref } from "vue";

const STORAGE_KEY = "otradnoe_goods";

const defaultGoods = [
  {
    id: 1,
    name: "Завтрак в номер",
    description:
      "Континентальный завтрак с доставкой в номер. Включает кофе, выпечку, фрукты и йогурты.",
    price: 1500,
    category: "Питание",
    image: "/src/assets/img/breakfast.jpg",
    available: true,
  },
  {
    id: 2,
    name: "Аренда велосипеда",
    description:
      "Горный или прогулочный велосипед на весь день. Шлем и замок в комплекте.",
    price: 800,
    category: "Развлечения",
    image: "/src/assets/img/bike.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Экскурсия в Херсонес",
    description:
      "Групповая экскурсия с гидом на автобусе комплекса. Включает входные билеты.",
    price: 2500,
    category: "Экскурсии",
    image: "/src/assets/img/excursion.jpg",
    available: true,
  },
];

export function useGoods() {
  const goods = ref([]);

  const loadGoods = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!stored || stored.length === 0) {
      goods.value = defaultGoods;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGoods));
    } else {
      goods.value = stored;
    }
  };

  const getAllGoods = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!stored || stored.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGoods));
      return defaultGoods;
    }
    return stored;
  };

  const getGoodById = (id) => {
    const allGoods = getAllGoods();
    return allGoods.find((g) => g.id === id) || null;
  };

  const addGood = (goodData) => {
    const allGoods = getAllGoods();
    const newGood = {
      ...goodData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    allGoods.push(newGood);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allGoods));
    loadGoods();
    return { success: true, message: "Товар успешно добавлен", good: newGood };
  };

  const editGood = (id, goodData) => {
    const allGoods = getAllGoods();
    const index = allGoods.findIndex((g) => g.id === id);
    if (index === -1) return { success: false, message: "Товар не найден" };

    allGoods[index] = {
      ...allGoods[index],
      ...goodData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allGoods));
    loadGoods();
    return {
      success: true,
      message: "Товар успешно обновлен",
      good: allGoods[index],
    };
  };

  const deleteGood = (id) => {
    const allGoods = getAllGoods();
    const filtered = allGoods.filter((g) => g.id !== id);
    if (filtered.length === allGoods.length)
      return { success: false, message: "Товар не найден" };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    loadGoods();
    return { success: true, message: "Товар успешно удален" };
  };

  loadGoods();

  return {
    goods,
    loadGoods,
    getAllGoods,
    getGoodById,
    addGood,
    editGood,
    deleteGood,
  };
}
