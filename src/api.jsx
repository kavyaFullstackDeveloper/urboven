import propertiesData from "./data/properties.json";

export function searchProperties(query) {
  if (!query) return propertiesData;
  return propertiesData.filter(
    (p) =>
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.title.toLowerCase().includes(query.toLowerCase())
  );
}

export function getPropertyById(id) {
  return propertiesData.find((p) => p.id === Number(id));
}

export function getProperties() {
  return propertiesData;
}
