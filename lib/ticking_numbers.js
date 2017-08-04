const formatDollar = d3.format("$,.02f");
const formatNumber = d3.format(",.0f");

let monthlyRevenue = 1000000;
let monthlyDownloads = 60000;
document.getElementById('monthly-revenue').innerHTML
  = formatDollar(monthlyRevenue);
document.getElementById('monthly-downloads').innerHTML
  = formatNumber(monthlyDownloads);

const tick = (initVal) => {
  return initVal + Math.random() * (initVal / 1000);
};

export const displayTickingNumbers = () => {
  const interval = setInterval(function() {
    monthlyRevenue = tick(monthlyRevenue, 'monthly-revenue');
    document.getElementById('monthly-revenue').innerHTML
      = formatDollar(monthlyRevenue);
    monthlyDownloads = tick(monthlyDownloads, 'monthly-downloads');
    document.getElementById('monthly-downloads').innerHTML
      = formatNumber(monthlyDownloads);
  }, 1500);

  $("monthly-revenue").on("remove", () => clearInterval(interval));
};
