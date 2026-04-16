<template>
  <Modal :is-visible="isVisible" title="Как добраться" @close="close">
    <div class="transfer-modal">
      <div class="transport-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'plane'" class="transport-info">
          <h4>Ближайшие аэропорты</h4>
          <div class="option">
            <div class="option-header">
              <span class="option-name">Аэропорт Симферополь (SIP)</span>
              <span class="option-distance">~100 км</span>
            </div>
            <p>Трансфер: 2500 ₽ | Такси: от 3000 ₽ | Автобус: 350 ₽</p>
          </div>
          <div class="option">
            <div class="option-header">
              <span class="option-name">Аэропорт Бельбек (UKBB)</span>
              <span class="option-distance">~30 км</span>
            </div>
            <p>Трансфер: 1500 ₽ | Такси: от 2000 ₽ | Маршрутки: 150 ₽</p>
          </div>
          <div class="tip">
            💡 Закажите трансфер при бронировании — скидка 20%
          </div>
        </div>

        <div v-else-if="activeTab === 'train'" class="transport-info">
          <h4>Железнодорожные станции</h4>
          <div class="option">
            <div class="option-header">
              <span class="option-name">Вокзал Симферополь</span>
              <span class="option-distance">~95 км</span>
            </div>
            <p>Трансфер: 2300 ₽ | Автобус: 400 ₽</p>
          </div>
          <div class="option">
            <div class="option-header">
              <span class="option-name">Станция Евпатория</span>
              <span class="option-distance">~25 км</span>
            </div>
            <p>Трансфер: 1200 ₽ | Маршрутки: 100 ₽ | Такси: от 800 ₽</p>
          </div>
        </div>

        <div v-else-if="activeTab === 'car'" class="transport-info">
          <h4>На автомобиле</h4>
          <div class="option">
            <div class="option-header">Из Москвы</div>
            <p>
              М4 "Дон" → М18 "Крым" → мост → Симферополь → Евпатория → Оленевка
              <br />~1600 км, ~20 часов
            </p>
          </div>
          <div class="option">
            <div class="option-header">Из Краснодара</div>
            <p>~500 км, ~7 часов</p>
          </div>
          <div class="parking-info">
            <strong>Парковка: </strong> Бесплатная охраняемая, крытая (по
            записи), зарядка для электромобилей
          </div>
        </div>

        <div v-else-if="activeTab === 'bus'" class="transport-info">
          <h4>Междугородние автобусы</h4>
          <div class="option">
            <div class="option-header">Автовокзал Евпатория</div>
            <p>
              Из Москвы: 1800-2500 ₽ | Из Краснодара: 1200 ₽ | Из Симферополя:
              350 ₽
            </p>
          </div>
          <div class="option">
            <div class="option-header">Автостанция Оленевка</div>
            <p>
              Из Евпатории: каждые 2 часа, 100 ₽ | Такси до комплекса: 200-300 ₽
            </p>
          </div>
        </div>
      </div>

      <div class="transfer-actions">
        <button class="order-btn" @click="orderTransfer">
          Заказать трансфер
        </button>
        <p class="note">Для заказа укажите даты и рейс при бронировании</p>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "./Modal.vue";
import { useNotification } from "../../composables/useNotification";

const props = defineProps({
  isVisible: Boolean,
});

const emit = defineEmits(["close", "order-transfer"]);

const { info } = useNotification();

const activeTab = ref("plane");

const tabs = [
  { id: "plane", label: "Самолет", icon: "✈️" },
  { id: "train", label: "Поезд", icon: "🚆" },
  { id: "car", label: "Автомобиль", icon: "🚗" },
  { id: "bus", label: "Автобус", icon: "🚌" },
];

const close = () => {
  emit("close");
};

const orderTransfer = () => {
  emit("close");
  info("Для заказа трансфера перейдите в раздел бронирования", "Информация");
  emit("order-transfer");
};
</script>

<style scoped>
.transfer-modal {
  padding: 1rem 0;
}

.transport-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1;
  padding: 0.8rem;
  background: var(--color-cream);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  min-width: 100px;
}

.tab-btn.active {
  background: var(--color-seafoam);
  border-color: var(--color-seafoam);
}

.transport-info h4 {
  margin-bottom: 1rem;
}

.option {
  background: var(--color-cream);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
}

.option-header {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.option-distance {
  color: var(--color-seafoam);
  font-weight: 600;
}

.tip,
.parking-info {
  background: rgba(184, 225, 221, 0.1);
  border: 1px solid var(--color-seafoam);
  border-radius: var(--radius-sm);
  padding: 0.8rem;
  margin-top: 1rem;
}

.transfer-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.order-btn {
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  padding: 1rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 1rem;
}

.order-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.note {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .transport-tabs {
    flex-direction: column;
  }
  .tab-btn {
    width: 100%;
  }
  .option-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
