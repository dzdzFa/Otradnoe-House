import { ref } from "vue";

const STORAGE_KEY = "otradnoe_bookings";

export function useBookings() {
  const bookings = ref([]);

  const loadBookings = () => {
    bookings.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  };

  const getAllBookings = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  };

  const getUserBookings = (userId) => {
    const allBookings = getAllBookings();
    return allBookings.filter((booking) => booking.userId === userId);
  };

  const addBooking = (bookingData, userId) => {
    const allBookings = getAllBookings();
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      userId: userId,
      status: "Подтверждено",
      createdAt: new Date().toLocaleString("ru-RU"),
    };

    allBookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
    loadBookings();

    return {
      success: true,
      message: "Бронирование успешно создано",
      booking: newBooking,
    };
  };

  const cancelBooking = (bookingId, userId) => {
    const allBookings = getAllBookings();
    const index = allBookings.findIndex(
      (b) => b.id === bookingId && b.userId === userId,
    );
    if (index === -1) {
      return { success: false, message: "Бронирование не найдено" };
    }

    allBookings[index].status = "Отменено";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
    loadBookings();

    return { success: true, message: "Бронирование отменено" };
  };

  const getBookingById = (bookingId) => {
    const allBookings = getAllBookings();
    return allBookings.find((b) => b.id === bookingId) || null;
  };

  return {
    bookings,
    loadBookings,
    getAllBookings,
    getUserBookings,
    addBooking,
    cancelBooking,
    getBookingById,
  };
}
