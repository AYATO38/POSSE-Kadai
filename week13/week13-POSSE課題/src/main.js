import './style.css';

document.querySelector('#app').innerHTML = `
  <h1>カウンター</h1>
  <p id="count">0</p>
  <div>
    <button id="increase-btn">増やす</button>
    <button id="reset-btn">リセット</button>
    <button id="decrease-btn">減らす</button>
  </div>
`;

const countEl = document.querySelector('#count');
const increaseBtn = document.querySelector('#increase-btn');
const resetBtn = document.querySelector('#reset-btn');
const decreaseBtn = document.querySelector('#decrease-btn');
let count = 0;

increaseBtn.addEventListener('click', () => {
  count += 1;
  countEl.textContent = count;
});

resetBtn.addEventListener('click', () => {
  count = 0;
  countEl.textContent = count;
});

decreaseBtn.addEventListener('click', () => {
  count -= 1;
  countEl.textContent = count;
});