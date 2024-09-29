export async function delay(ms: number) {
  return new Promise(ok => setTimeout(ok, ms))
}

export function randomBetweenNumber(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

const lastNames = [
  'Nguyễn',
  'Trần',
  'Lê',
  'Phạm',
  'Hoàng',
  'Huỳnh',
  'Mai',
  'Phan',
  'Vũ',
  'Võ',
  'Đặng',
  'Bùi',
  'Đỗ',
  'Hồ',
  'Ngô',
  'Dương',
  'Lý',
  'Đào',
  'Trương',
]
const middleNames1 = ['Văn', 'Tuấn', 'Bảo', 'Đình', 'Gia', 'Minh', 'Xuân', 'Sỹ', 'Sĩ'];
const middleNames2 = ['Thị', 'Thu', 'Ngọc', 'Hương', 'Thảo', 'Vũ Thanh', 'Phạm Mỹ', 'Bùi Ngọc', 'Phương'];
const firstNames1 = ['Hùng', 'Cường', 'Huy', 'Tuấn', 'Hải', 'Đức', 'Lượng', 'Quang', 'Duy', 'Tài', 'Long', 'Duy'];
const firstNames2 = ['Huyên', 'My', 'Trang', 'Nhung', 'Thư', 'Xuân', 'Yến', 'Hà', 'Ngọc', 'Phương', 'Anh', 'Linh', 'Duyên', 'Thu', 'Hân', 'Ánh'];

export function randomNameStudent(isMale: boolean): string {
  const l = lastNames[randomBetweenNumber(0, lastNames.length - 1)];
  const m = isMale ? middleNames1[randomBetweenNumber(0, middleNames1.length - 1)] : middleNames2[randomBetweenNumber(0, middleNames2.length - 1)];
  const f = isMale ? firstNames1[randomBetweenNumber(0, firstNames1.length - 1)] : firstNames2[randomBetweenNumber(0, firstNames2.length - 1)];
  return `${l} ${m} ${f}`
}

export function randomMsv() {
  const city = ['HN', 'DN', 'HCM'];
  const randomcity = city[randomBetweenNumber(0, city.length - 1)];
  const randomMsv = randomBetweenNumber(11111111, 99999999);
  return randomcity + randomMsv;
}

export function randomBirthDay(): string {
  const d = randomBetweenNumber(1, 29);
  const m = randomBetweenNumber(1, 12);
  const y = randomBetweenNumber(1995, 2005);
  return `${d}/${m}/${y}`
}

export function randomPhoneNumber(): string {
  return '0' + randomBetweenNumber(200000000, 998998998)
}

export function convertDateToString(d?: Date) {
  const dv = d ? new Date() : d;
  const dd = dv?.getDate();
  const mm = (dv?.getMonth() || 0) + 1;
  const yy = dv?.getFullYear();
  return `${dd}/${mm}/${yy}`
}
