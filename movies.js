// movies.js
// База фильмов онлайн-кинотеатра.
// Чтобы добавить свой фильм — скопируйте объект и заполните поля.
// poster: используется CSS-градиент (реальная картинка не нужна),
//         но если хотите — положите файл в /images и укажите его в поле "image".
// video:  путь к файлу в /videos (или прямая ссылка). Пока стоит демо-ролик.

const DEMO_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const MOVIES = [
  {
    id: 1,
    title: "Полночный экспресс",
    year: 2023,
    genre: ["Триллер", "Драма"],
    duration: 118,
    rating: 8.2,
    country: "Россия",
    description: "Проводник ночного поезда становится случайным свидетелем преступления и вынужден решить, кому можно доверять на борту, пока состав несётся сквозь зимнюю ночь.",
    poster: { from: "#6B1E23", to: "#2B0E12", icon: "🚂" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 2,
    title: "Голоса тишины",
    year: 2022,
    genre: ["Драма"],
    duration: 104,
    rating: 7.6,
    country: "Франция",
    description: "История учительницы для глухих детей, которая заново открывает для себя мир звуков и молчания после потери близкого человека.",
    poster: { from: "#3B4A6B", to: "#12172B", icon: "🎭" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 3,
    title: "Красная орбита",
    year: 2024,
    genre: ["Фантастика", "Боевик"],
    duration: 132,
    rating: 7.9,
    country: "США",
    description: "Экипаж исследовательской станции обнаруживает сигнал, который не должен существовать — и должен решить, стоит ли лететь к его источнику.",
    poster: { from: "#8A2E1E", to: "#241009", icon: "🛰️" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 4,
    title: "Кофе на двоих",
    year: 2021,
    genre: ["Комедия", "Мелодрама"],
    duration: 96,
    rating: 7.1,
    country: "Италия",
    description: "Владелец маленькой кофейни и его новый конкурент через дорогу невольно становятся частью жизни друг друга.",
    poster: { from: "#B07A2E", to: "#2B1A08", icon: "☕" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 5,
    title: "Тень Карпат",
    year: 2020,
    genre: ["Ужасы", "Триллер"],
    duration: 101,
    rating: 6.9,
    country: "Румыния",
    description: "Группа студентов-этнографов отправляется в заброшенную деревню в горах и обнаруживает, что местные легенды — не просто легенды.",
    poster: { from: "#1E3B2E", to: "#0A140F", icon: "🌲" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 6,
    title: "Архив №9",
    year: 2023,
    genre: ["Фантастика", "Детектив"],
    duration: 124,
    rating: 8.0,
    country: "Германия",
    description: "Архивариус городской базы данных находит запись о человеке, которого официально никогда не существовало.",
    poster: { from: "#4A3B6B", to: "#160F26", icon: "🗄️" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 7,
    title: "Летние огни",
    year: 2019,
    genre: ["Мелодрама"],
    duration: 108,
    rating: 7.3,
    country: "Испания",
    description: "Последнее лето перед расставанием двух друзей детства, каждый из которых скрывает свои настоящие чувства.",
    poster: { from: "#C9A227", to: "#3A2A08", icon: "🌅" },
    image: null,
    video: DEMO_VIDEO
  },
  {
    id: 8,
    title: "Периметр",
    year: 2024,
    genre: ["Боевик", "Триллер"],
    duration: 115,
    rating: 7.7,
    country: "Россия",
    description: "Бывший сапёр возвращается на службу, чтобы разминировать периметр завода за одну ночь — прежде чем он взлетит на воздух вместе с городом.",
    poster: { from: "#6B1E23", to: "#12100E", icon: "💣" },
    image: null,
    video: DEMO_VIDEO
  }
];
