export function getFavorites() {
  const favs = localStorage.getItem("favorites");
  return favs ? JSON.parse(favs) : [];
}

export function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  return favs;
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}
