// time conversion functions (11:08 PM)
export const getCurrentTime = (): {
  timeStr: string;
  timestamp: number;
} => {
  const now = new Date();

  const timestamp = now.getTime();

  let hours: number = now.getHours();
  const minutes: number = now.getMinutes();

  const ampm: string = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Saat 0 olduğunda 12'ye çevrilir
  const minutesStr: string = minutes < 10 ? `0${minutes}` : minutes.toString(); // Dakikayı iki basamaklı yap

  const timeStr: string = `${hours}:${minutesStr} ${ampm}`;
  return { timeStr, timestamp };
};
