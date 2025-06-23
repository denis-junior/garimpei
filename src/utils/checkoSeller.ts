export const checkSeller = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user && user.seller) {
    return true;
  }
  return false;
};
