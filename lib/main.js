// const data = [30, 86,  168, 281, 303];
//
// d3.select(".barchart")
//   .selectAll("div")
//   .data(data)
//     .enter()
//     .append("div")
//     .style("width", d => `${d}px`)
//     .text(d => `$ ${d}`);

import { displayTickingNumbers } from './ticking_numbers.js';
import { displayActiveUsers } from './active_users.js';

displayTickingNumbers();
displayActiveUsers();
