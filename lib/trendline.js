const minutes = ['10:01', '10:02', '10:03', '10:04',
  '10:05', '10:06', '10:07', '10:08', '10:09'];

const activeUsersBase = 50000;

const data = minutes.map(m => {
  const datum = {};
  datum['time'] = m;
  datum['DAU'] = activeUsersBase * (1 + (Math.random() - 0.5) * 2);
  datum['MAU'] = activeUsersBase * 3 * (1 + (Math.random() - 0.5) * 2);
  return datum;
});

const categories = ['DAU', 'MAU'];

const hAxis = 10;
const mAxis = 10;
