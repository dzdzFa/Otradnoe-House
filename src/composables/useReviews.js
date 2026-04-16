import { ref } from "vue";

const STORAGE_KEY = "otradnoe_reviews";

const defaultReviews = [
  {
    id: 1,
    goodId: 1,
    author: "Александр М.",
    date: "15.03.2026",
    rating: 5,
    text: "Отличная услуга! Очень понравилось, рекомендую всем.",
  },
  {
    id: 2,
    goodId: 1,
    author: "Елена К.",
    date: "10.03.2026",
    rating: 4,
    text: "Хорошее качество, но немного дороговато.",
  },
];

export function useReviews() {
  const reviews = ref([]);

  const loadReviews = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!stored || stored.length === 0) {
      reviews.value = defaultReviews;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
    } else {
      reviews.value = stored;
    }
  };

  const getReviewsByGoodId = (goodId) => {
    const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!allReviews || allReviews.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
      return defaultReviews.filter((r) => r.goodId === goodId);
    }
    return allReviews.filter((r) => r.goodId === goodId);
  };

  const addReview = (goodId, reviewData) => {
    const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newReview = {
      id: Date.now(),
      goodId: goodId,
      author: reviewData.author,
      date: new Date().toLocaleDateString("ru-RU"),
      rating: reviewData.rating,
      text: reviewData.text,
    };

    allReviews.push(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
    loadReviews();

    return {
      success: true,
      message: "Отзыв успешно добавлен",
      review: newReview,
    };
  };

  const deleteReview = (reviewId) => {
    const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = allReviews.filter((r) => r.id !== reviewId);
    if (filtered.length === allReviews.length) {
      return { success: false, message: "Отзыв не найден" };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    loadReviews();
    return { success: true, message: "Отзыв удален" };
  };

  loadReviews();

  return {
    reviews,
    loadReviews,
    getReviewsByGoodId,
    addReview,
    deleteReview,
  };
}
