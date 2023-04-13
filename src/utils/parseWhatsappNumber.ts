export function parseWhatsappNumber(number: string) {
  const ddd = number.slice(2, 4);
  const phoneNumber = number.slice(-8);

  return `${ddd}9${phoneNumber}`;
}
