import { useBookings } from "./useBookings";
import { useNotification } from "./useNotification";

export function useActions() {
  const { addBooking } = useBookings();
  const { success, error, info } = useNotification();

  const handleBooking = (bookingData, userId = null) => {
    console.log("Данные бронирования:", bookingData);
    const result = addBooking(bookingData, userId);

    if (result.success) {
      success(result.message);
    } else {
      error(result.message);
    }

    return result;
  };

  const handleNewsletter = (email) => {
    console.log("Подписка на рассылку:", email);
    const subscribers = JSON.parse(
      localStorage.getItem("otradnoe_subscribers") || "[]",
    );

    if (subscribers.includes(email)) {
      info("Вы уже подписаны на рассылку");
      return { success: false, message: "Вы уже подписаны" };
    }

    subscribers.push(email);
    localStorage.setItem("otradnoe_subscribers", JSON.stringify(subscribers));

    success("Вы успешно подписались на рассылку!");
    return { success: true, message: "Подписка оформлена" };
  };

  const toggleFavorite = (roomId) => {
    const favorites = JSON.parse(
      localStorage.getItem("otradnoe_favorites") || "[]",
    );
    const index = favorites.indexOf(roomId);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem("otradnoe_favorites", JSON.stringify(favorites));
      info("Удалено из избранного");
      return {
        success: true,
        message: "Удалено из избранного",
        isFavorite: false,
      };
    } else {
      favorites.push(roomId);
      localStorage.setItem("otradnoe_favorites", JSON.stringify(favorites));
      success("Добавлено в избранное");
      return {
        success: true,
        message: "Добавлено в избранное",
        isFavorite: true,
      };
    }
  };

  const isFavorite = (roomId) => {
    const favorites = JSON.parse(
      localStorage.getItem("otradnoe_favorites") || "[]",
    );
    return favorites.includes(roomId);
  };

  const sendContactForm = (formData) => {
    console.log("Контактная форма:", formData);
    const contacts = JSON.parse(
      localStorage.getItem("otradnoe_contacts") || "[]",
    );
    contacts.push({
      ...formData,
      id: Date.now(),
      date: new Date().toISOString(),
      status: "new",
    });

    localStorage.setItem("otradnoe_contacts", JSON.stringify(contacts));

    success("Ваше сообщение отправлено! Мы ответим в течение 24 часов.");
    return { success: true, message: "Сообщение отправлено" };
  };

  return {
    handleBooking,
    handleNewsletter,
    toggleFavorite,
    isFavorite,
    sendContactForm,
  };
}
