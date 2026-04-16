<template>
  <div class="restaurant-view">
    <section class="restaurant-hero">
      <div class="hero-background"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-tag">Fine dining</span>
          <h1 class="title-line">
            Ресторан <span class="accent">Lavanda</span>
          </h1>
          <p class="hero-subtitle">
            Авторская кухня от шеф-повара Дмитрия Волкова. Элитная винная карта.
            Панорамный вид на море.
          </p>
          <div class="hero-actions">
            <button class="hero-btn primary" @click="scrollToBooking">
              📅 Забронировать стол
            </button>
            <button class="hero-btn" @click="showMenuModal = true">
              📋 Посмотреть меню
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="philosophy-section section">
      <Container>
        <div class="philosophy-grid">
          <div class="philosophy-text">
            <h2 class="section-title">Наша философия</h2>
            <p class="philosophy-quote">
              "Мы создаем не просто блюда, а воспоминания. Каждый ингредиент
              имеет значение, каждый гость — особенный."
            </p>
            <p class="quote-author">— Дмитрий Волков, шеф-повар</p>
          </div>
          <div class="philosophy-image">
            <img src="/src/assets/img/chif.JPG" alt="Шеф-повар" />
          </div>
        </div>
      </Container>
    </section>

    <section class="halls-section section">
      <Container>
        <h2 class="section-title">Залы и террасы</h2>
        <div class="halls-grid">
          <div class="hall-card">
            <img src="/src/assets/img/rest1.JPG" alt="Основной зал" />
            <div class="hall-content">
              <h3>Основной зал</h3>
              <p>Панорамные окна с видом на море, живая музыка</p>
              <span class="hall-capacity">до 25 гостей</span>
            </div>
          </div>
          <div class="hall-card">
            <img src="/src/assets/img/summer_ter.JPG" alt="Летняя терраса" />
            <div class="hall-content">
              <h3>Летняя терраса</h3>
              <p>Открытая веранда с видом на сад, романтическая атмосфера</p>
              <span class="hall-capacity">до 10 гостей</span>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section id="table-booking" class="booking-section section">
      <Container>
        <h2 class="section-title">Забронировать стол</h2>
        <div class="booking-wrapper">
          <div class="booking-info">
            <h3>Правила бронирования</h3>
            <ul class="booking-rules">
              <li>Бронирование минимум за 24 часа</li>
              <li>Депозит 5000 ₽ засчитывается в счет чека</li>
              <li>Отмена за 48 часов до визита</li>
              <li>Дресс-код: smart casual</li>
            </ul>
          </div>
          <form class="booking-form" @submit.prevent="submitBooking" novalidate>
            <div class="form-row">
              <input
                type="text"
                v-model.trim="booking.name"
                placeholder="Имя *"
                required
              />
              <input
                type="email"
                v-model.trim="booking.email"
                placeholder="Email *"
                required
              />
            </div>
            <div class="form-row">
              <input
                type="tel"
                v-model.trim="booking.phone"
                placeholder="Телефон *"
                required
              />
              <input
                type="date"
                v-model="booking.date"
                :min="minDate"
                required
              />
            </div>
            <div class="form-row">
              <select v-model="booking.time" required>
                <option value="" disabled>Время</option>
                <option value="19:00">19:00</option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
                <option value="20:30">20:30</option>
                <option value="21:00">21:00</option>
              </select>
              <select v-model.number="booking.guests" required>
                <option value="" disabled>Гостей</option>
                <option :value="1">1 человек</option>
                <option :value="2">2 человека</option>
                <option :value="3">3 человека</option>
                <option :value="4">4 человека</option>
                <option :value="5">5 человек</option>
                <option :value="6">6 человек</option>
              </select>
            </div>
            <textarea
              v-model.trim="booking.notes"
              placeholder="Особые пожелания (аллергии, особые даты...)"
            ></textarea>
            <label class="checkbox">
              <input type="checkbox" v-model="booking.agreeRules" required />
              <span
                >Я согласен с правилами бронирования и обязуюсь внести
                депозит</span
              >
            </label>
            <button
              type="submit"
              class="submit-btn"
              :disabled="!booking.agreeRules"
            >
              Забронировать
            </button>
          </form>
        </div>
      </Container>
    </section>

    <Modal
      :is-visible="showMenuModal"
      title="Меню Lavanda"
      @close="showMenuModal = false"
    >
      <div class="menu-modal">
        <p class="menu-description">
          Сезонное меню от шеф-повара Дмитрия Волкова
        </p>
        <div class="menu-categories">
          <button
            v-for="cat in menuCategories"
            :key="cat.id"
            :class="['category-btn', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
        <div class="menu-items">
          <div v-for="item in filteredMenu" :key="item.id" class="menu-item">
            <div class="menu-item-header">
              <h4>{{ item.name }}</h4>
              <span class="menu-price"
                >{{ item.price.toLocaleString() }} ₽</span
              >
            </div>
            <p class="menu-item-desc">{{ item.description }}</p>
            <div class="menu-tags">
              <span v-if="item.isSignature" class="tag signature"
                >Signature</span
              >
              <span v-if="item.isNew" class="tag new">Новинка</span>
            </div>
          </div>
        </div>
        <div class="menu-footer">
          <p>Винная карта — по запросу у сомелье</p>
          <p class="menu-note">
            *Цены включают НДС. Сервисный сбор 10% не включен
          </p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Container from "../components/shared/Container.vue";
import Modal from "../components/shared/Modal.vue";
import { useNotification } from "../composables/useNotification";

const { success, info } = useNotification();

const booking = ref({
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: "",
  notes: "",
  agreeRules: false,
});

const minDate = ref("");
const showMenuModal = ref(false);
const activeCategory = ref("starters");

const menuCategories = [
  { id: "starters", name: "Закуски" },
  { id: "salads", name: "Салаты" },
  { id: "soups", name: "Супы" },
  { id: "fish", name: "Рыба" },
  { id: "meat", name: "Мясо" },
  { id: "desserts", name: "Десерты" },
];

const menuItems = [
  {
    id: 1,
    category: "starters",
    name: "Фуа-гра",
    price: 3200,
    description: "Утиная фуа-гра, трюфельный мед, бриошь",
    isSignature: true,
  },
  {
    id: 2,
    category: "starters",
    name: "Карпаччо",
    price: 2800,
    description: "Из мраморной говядины, пармезан 36 месяцев",
    isSignature: true,
  },
  {
    id: 3,
    category: "salads",
    name: "Салат с омаром",
    price: 4200,
    description: "Мясо омара, авокадо, цитрусовый соус",
    isSignature: true,
  },
  {
    id: 4,
    category: "salads",
    name: "Трюфельный салат",
    price: 3200,
    description: "Микс салатов, пармезан, груша",
    isNew: true,
  },
  {
    id: 5,
    category: "soups",
    name: "Биск из омара",
    price: 2800,
    description: "Крем-суп из омара, коньяк",
    isSignature: true,
  },
  {
    id: 6,
    category: "soups",
    name: "Тыквенный крем-суп",
    price: 1800,
    description: "С имбирем и кокосовым молоком",
  },
  {
    id: 7,
    category: "fish",
    name: "Дорада в соли",
    price: 4200,
    description: "Целая дорада, овощи-гриль",
    isSignature: true,
  },
  {
    id: 8,
    category: "fish",
    name: "Лобстер Thermidor",
    price: 8500,
    description: "Целый лобстер, сыр грюйер",
    isSignature: true,
  },
  {
    id: 9,
    category: "meat",
    name: "Стейк Ribeye",
    price: 6500,
    description: "USDA Prime, трюфельное пюре",
    isSignature: true,
  },
  {
    id: 10,
    category: "meat",
    name: "Ягненок в травах",
    price: 5800,
    description: "Каре ягненка, мятный соус",
  },
  {
    id: 11,
    category: "desserts",
    name: "Шоколадное суфле",
    price: 1800,
    description: "Горячее суфле, ванильное мороженое",
    isSignature: true,
  },
  {
    id: 12,
    category: "desserts",
    name: "Тирамису",
    price: 1600,
    description: "Классический тирамису с маскарпоне",
  },
];

const filteredMenu = computed(() =>
  menuItems.filter((i) => i.category === activeCategory.value),
);

const scrollToBooking = () => {
  const el = document.getElementById("table-booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const submitBooking = () => {
  success(
    `Столик предварительно забронирован для ${booking.value.name}. Наш менеджер свяжется с вами для подтверждения.`,
  );
  booking.value = {
    name: "",
    phone: "",
    email: "",
    date: minDate.value,
    time: "",
    guests: "",
    notes: "",
    agreeRules: false,
  };
};

onMounted(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  minDate.value = tomorrow.toISOString().split("T")[0];
  booking.value.date = minDate.value;
});
</script>

<style scoped>
.restaurant-view {
  background: var(--color-cream);
}
.restaurant-hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  background: #000;
}
.hero-background {
  position: absolute;
  inset: 0;
  background-image: url("/src/assets/img/hero_rest.JPG");
  background-size: cover;
  background-position: center;
  opacity: 0.6;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  color: white;
}
.hero-text {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}
.hero-tag {
  display: inline-block;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 0.5rem;
}
.title-line {
  display: block;
  font-size: 5rem;
  font-weight: 300;
  line-height: 1.1;
}
.title-line.accent {
  color: #b5a7c2;
  font-size: 6rem;
  font-weight: 400;
}
.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}
.hero-actions {
  display: flex;
  gap: 2rem;
  justify-content: center;
}
.hero-btn {
  padding: 1.2rem 3rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  background: transparent;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: 0.3s;
}
.hero-btn.primary {
  background: white;
  color: black;
}
.hero-btn:hover {
  background: var(--color-seafoam);
  border-color: var(--color-seafoam);
  color: black;
}

.philosophy-section {
  padding: 6rem 0;
}
.philosophy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}
.philosophy-quote {
  font-size: 2rem;
  line-height: 1.4;
  font-style: italic;
  margin-bottom: 2rem;
}
.philosophy-image img {
  width: 100%;
  height: 600px;
  object-fit: cover;
}

.wine-section {
  background: var(--color-white);
  padding: 6rem 0;
}
.wine-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 4rem 0;
}
.wine-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--color-border);
}
.wine-region {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.wine-count {
  color: var(--color-text-light);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.sommelier-note {
  text-align: center;
  max-width: 600px;
  margin: 4rem auto 0;
  padding: 3rem;
  background: var(--color-cream);
}
.sommelier-btn {
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background: transparent;
  border: 1px solid var(--color-text-dark);
  cursor: pointer;
  transition: 0.3s;
}
.sommelier-btn:hover {
  background: var(--color-text-dark);
  color: white;
}

.halls-section {
  padding: 6rem 0;
}
.halls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}
.hall-card {
  background: var(--color-white);
}
.hall-card img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}
.hall-content {
  padding: 2rem;
}
.hall-content h3 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
}
.hall-capacity {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-seafoam);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.booking-section {
  background: var(--color-white);
  padding: 6rem 0;
}
.booking-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
}
.booking-info h3 {
  margin-bottom: 2rem;
}
.booking-rules {
  list-style: none;
  padding: 0;
}
.booking-rules li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}
.booking-rules li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: var(--color-seafoam);
}
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.booking-form input,
.booking-form select,
.booking-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  font-family: inherit;
}
.booking-form input:focus,
.booking-form select:focus,
.booking-form textarea:focus {
  outline: none;
  border-color: var(--color-seafoam);
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text-light);
}
.checkbox input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-seafoam);
  cursor: pointer;
  flex-shrink: 0;
}
.submit-btn {
  padding: 1.2rem;
  background: var(--color-text-dark);
  color: white;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: 0.3s;
}
.submit-btn:hover:not(:disabled) {
  background: var(--color-seafoam);
  color: black;
}
.submit-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.menu-modal {
  padding: 1rem 0;
}
.menu-categories {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.category-btn {
  background: none;
  border: none;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
}
.category-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-seafoam);
  transition: 0.3s;
}
.category-btn:hover::after,
.category-btn.active::after {
  width: 100%;
}
.category-btn.active {
  color: var(--color-text-dark);
}
.menu-items {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 1rem;
}
.menu-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px dashed var(--color-border);
}
.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}
.menu-item-header h4 {
  margin: 0;
  font-size: 1.3rem;
}
.menu-price {
  font-size: 1.2rem;
  color: var(--color-seafoam);
}
.menu-item-desc {
  color: var(--color-text-light);
  margin: 0.5rem 0;
}
.menu-tags {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.tag {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.tag.signature {
  color: var(--color-seafoam);
}
.tag.new {
  color: var(--color-lavender);
}
.menu-footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .title-line {
    font-size: 4rem;
  }
  .title-line.accent {
    font-size: 5rem;
  }
  .philosophy-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .wine-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .halls-grid {
    grid-template-columns: 1fr;
  }
  .booking-wrapper {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .title-line {
    font-size: 3rem;
  }
  .title-line.accent {
    font-size: 4rem;
  }
  .hero-actions {
    flex-direction: column;
    gap: 1rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .wine-grid {
    grid-template-columns: 1fr;
  }
}
</style>
