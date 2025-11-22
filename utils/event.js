export const wishlistEvent = {
  emit() {
    window.dispatchEvent(new Event("wishlist-updated"));
  },
  listen(callback) {
    window.addEventListener("wishlist-updated", callback);
  }
};
