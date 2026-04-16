import { ref } from "vue";

const notifications = ref([]);

export function useNotification() {
  const showNotification = (options) => {
    const id = Date.now();
    const notification = {
      id,
      type: options.type || "info",
      title: options.title,
      message: options.message,
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false,
    };
    notifications.value.push(notification);

    if (notification.autoClose) {
      setTimeout(() => {
        closeNotification(id);
      }, notification.duration);
    }
    return id;
  };

  const closeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (message, title = "Успешно!") => {
    return showNotification({ type: "success", message, title });
  };
  const error = (message, title = "Ошибка") => {
    return showNotification({ type: "error", message, title });
  };
  const warning = (message, title = "Внимание") => {
    return showNotification({ type: "warning", message, title });
  };
  const info = (message, title = "Информация") => {
    return showNotification({ type: "info", message, title });
  };
  const clearAll = () => {
    notifications.value = [];
  };

  return {
    notifications,
    showNotification,
    closeNotification,
    success,
    error,
    warning,
    info,
    clearAll,
  };
}
