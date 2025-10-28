export const generateOrderCode = () => {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // 7-digit random number
  return `DH${randomNumber}`;
}