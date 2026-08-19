const SERVER_URL = "http://localhost:5000";

export function getImageUrl(image) {
  if (!image) {
    return "/placeholder-flower.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SERVER_URL}${image}`;
  }

  return `${SERVER_URL}/${image}`;
}