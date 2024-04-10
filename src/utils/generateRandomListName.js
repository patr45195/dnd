export const generateRandomShoppingListName = () => {
  const adjectives = [
    "Свежий",
    "Вкусный",
    "Ароматный",
    "Сладкий",
    "Пикантный",
    "Здоровый",
    "Экзотический",
    "Быстрый",
    "Легкий",
    "Нежный",
  ];
  const nouns = [
    "Фруктовый",
    "Овощной",
    "Завтрак",
    "Ланч",
    "Ужин",
    "Закуска",
    "Десерт",
    "Коктейль",
    "Салат",
    "Закуска",
    "Напиток",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
};
