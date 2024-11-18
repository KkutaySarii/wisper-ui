export function isValidMinaAddress(address: string): boolean {
  // Mina addresses should start with "B62" and have exactly 55 characters
  const minaAddressRegex = /^B62[1-9A-HJ-NP-Za-km-z]{52}$/;

  return minaAddressRegex.test(address);
}
