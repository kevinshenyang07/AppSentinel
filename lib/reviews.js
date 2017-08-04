const sampleReviews = [
  {user: 'Andrew M.', body: "The text <b class='attention-high'>broke</b> out of the box, is it because I use bigger <b class='attention-low'>font</b> size?"},
  {user: 'Elliot H.', body: "The <b class='attention-medium'>hamburger menu</b> does not respond to me, can't change my name!!"},
  {user: 'Jules C.', body: "The app <b class='attention-high'>crashed</b> after I clicked the <b class='attention-low'>sumbit</b> button, what happened?"},
  {user: 'Munyo F.', body: "I like it but it's kinda <b class='attention-medium'>slow</b> when I don't have WIFI."},
  {user: 'Aaron W.', body: "The <b class='attention-low'>start</b> button should be on the bottom of the screen."},
  {user: 'Chuck N.', body: "The animation is fancy, but I don't want to <b class='attention-medium'>wait</b> for it :P"},
  {user: 'Louis C.', body: "There seems to be a <b class='attention-medium'>hiccup</b> when I was tapping on the <b class='attention-low'>carousel</b>."},
];

const createReviews = reviews => {
  $(document).ready(() => {
    for (let i = 0; i < 5; i++) {
      const pEle = `<p id="review-${i}"></p><hr>`;
      $("#reviews-container").append(pEle);
    }
    updateReviews(sampleReviews);
  });
};

const updateReviews = reviews => {
  reviews.push(reviews.shift());
  for (let i = 0; i < 5; i++) {
    const content = `${reviews[i].user}: "${reviews[i].body}"`;
    document.getElementById(`review-${i}`).innerHTML = content;
  }
};

export const displayReviews = () => {
  createReviews(sampleReviews);
  const interval = setInterval(() => updateReviews(sampleReviews), 4000);
  $("#reviews-container").on("remove", () => clearInterval(interval));
};
