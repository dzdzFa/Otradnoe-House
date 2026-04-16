import { ref } from "vue";

const STORAGE_KEY = "otradnoe_rooms";

const defaultRooms = [
  {
    id: 1,
    name: "Стандарт",
    description:
      "Уютный номер с видом на сад, идеально подходит для пар. Просторная комната с современным ремонтом, большая кровать размера king-size, рабочий стол, телевизор с плоским экраном и мини-бар.",
    price: "3 500",
    badge: "Популярный",
    badgeColor: "var(--color-seafoam)",
    image: "/src/assets/img/stand_num.jpg",
    features: [
      "Кондиционер",
      "Wi-Fi",
      "Сейф",
      "Санузел",
      "Телевизор",
      "Мини-бар",
      "Фен",
    ],
  },
  {
    id: 2,
    name: "Семейный люкс",
    description:
      "Просторный двухкомнатный номер для семьи с детьми. Гостиная с диваном-кроватью и спальня с двуспальной кроватью. Полностью оборудованная мини-кухня, обеденная зона, два телевизора.",
    price: "5 500",
    badge: "Для семьи",
    badgeColor: "var(--color-lavender)",
    image: "/src/assets/img/family_num.jpg",
    features: [
      "2 комнаты",
      "Кухня",
      "Балкон",
      "Детская кроватка",
      "2 телевизора",
      "Диван-кровать",
    ],
  },
  {
    id: 3,
    name: "Премиум с видом на море",
    description:
      "Номер с панорамными окнами, террасой и джакузи. Люкс категории с отдельной гостиной, спальней и просторной ванной комнатой с джакузи. Вид на море с террасы.",
    price: "8 500",
    badge: "Люкс",
    badgeColor: "var(--color-coral)",
    image: "/src/assets/img/lux_num.jpg",
    features: [
      "Вид на море",
      "Терраса",
      "Джакузи",
      "Мини-бар",
      "Халаты",
      "Тапочки",
      "Премиум косметика",
    ],
  },
];

export function useRooms() {
  const rooms = ref([]);

  const init = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!stored || stored.length === 0) {
      rooms.value = defaultRooms;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRooms));
    } else {
      rooms.value = stored;
    }
  };

  init();

  const getAllRooms = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return stored ? stored : defaultRooms;
  };

  const getRoomById = (id) => {
    const all = getAllRooms();
    return all.find((room) => room.id === id) || null;
  };

  return {
    rooms,
    getAllRooms,
    getRoomById,
  };
}
