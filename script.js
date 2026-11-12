'use strict';

/* ---------- Завдання 1: Фаренгейт <-> Цельсій ---------- */
function round2(x) {
  return Math.round(x * 100) / 100;
}

function fahrenheitToCelsius(f) {
  return (5 / 9) * (f - 32);
}

function celsiusToFahrenheit(c) {
  return (9 / 5) * c + 32;
}

function parseNumber(str) {
  const s = str.trim().replace(',', '.');
  if (s === '' || isNaN(Number(s))) return null;
  return Number(s);
}

function onFahrenheitChange() {
  const fInput = document.getElementById('fahrenheit');
  const cInput = document.getElementById('celsius');
  const f = parseNumber(fInput.value);
  cInput.value = f === null ? '' : round2(fahrenheitToCelsius(f));
}

function onCelsiusChange() {
  const fInput = document.getElementById('fahrenheit');
  const cInput = document.getElementById('celsius');
  const c = parseNumber(cInput.value);
  fInput.value = c === null ? '' : round2(celsiusToFahrenheit(c));
}

function initTemperature() {
  document.getElementById('fahrenheit').addEventListener('input', onFahrenheitChange);
  document.getElementById('celsius').addEventListener('input', onCelsiusChange);
}

/* ---------- Допоміжні функції ---------- */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showResult(el, text, ok) {
  el.textContent = text;
  el.className = 'result ' + (ok ? 'ok' : 'bad');
}

/* ---------- Завдання 2: таблиця множення (текстове поле) ---------- */
const quiz2 = { a: 0, b: 0, correct: 0, total: 0, answered: false };

function updateScore2() {
  document.getElementById('score2').textContent =
    'Рахунок: ' + quiz2.correct + ' / ' + quiz2.total;
}

function nextTask2() {
  quiz2.a = randInt(2, 9);
  quiz2.b = randInt(2, 9);
  quiz2.answered = false;
  document.getElementById('task2').textContent = quiz2.a + ' × ' + quiz2.b + ' = ?';
  const input = document.getElementById('answer2');
  input.value = '';
  input.focus();
  const res = document.getElementById('result2');
  res.textContent = '';
  res.className = 'result';
}

function checkAnswer2() {
  const res = document.getElementById('result2');
  if (quiz2.answered) {
    showResult(res, 'Це завдання вже перевірено. Натисніть «Наступне завдання».', false);
    return;
  }
  const value = parseNumber(document.getElementById('answer2').value);
  if (value === null) {
    showResult(res, 'Введіть число!', false);
    return;
  }
  quiz2.answered = true;
  quiz2.total++;
  const right = quiz2.a * quiz2.b;
  if (value === right) {
    quiz2.correct++;
    showResult(res, 'Правильно!', true);
  } else {
    showResult(res, 'Неправильно. Правильна відповідь: ' + right, false);
  }
  updateScore2();
}

function initQuiz2() {
  document.getElementById('next2').addEventListener('click', nextTask2);
  document.getElementById('check2').addEventListener('click', checkAnswer2);
  document.getElementById('answer2').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') checkAnswer2();
  });
  updateScore2();
  nextTask2();
}

/* ---------- Завдання 3: таблиця множення (радіокнопки) ---------- */
const quiz3 = { right: 0, correct: 0, total: 0 };

function updateScore3() {
  document.getElementById('score3').textContent =
    'Рахунок: ' + quiz3.correct + ' / ' + quiz3.total;
}

function generateOptions(right) {
  const set = new Set([right]);
  while (set.size < 4) {
    const delta = randInt(1, 10) * (Math.random() < 0.5 ? -1 : 1);
    const v = right + delta;
    if (v > 0) set.add(v);
  }
  return shuffle(Array.from(set));
}

function onOptionSelected(event) {
  const res = document.getElementById('result3');
  const value = Number(event.target.value);
  quiz3.total++;
  if (value === quiz3.right) {
    quiz3.correct++;
    showResult(res, 'Правильно!', true);
  } else {
    showResult(res, 'Неправильно. Правильна відповідь: ' + quiz3.right, false);
  }
  // лише одна спроба — блокуємо всі радіокнопки
  document.querySelectorAll('#options3 input').forEach(function (r) { r.disabled = true; });
  updateScore3();
}

function nextTask3() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  quiz3.right = a * b;
  document.getElementById('task3').textContent = a + ' × ' + b + ' = ?';

  const box = document.getElementById('options3');
  box.innerHTML = '';
  generateOptions(quiz3.right).forEach(function (opt) {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'answer3';
    radio.value = opt;
    radio.addEventListener('change', onOptionSelected);
    label.appendChild(radio);
    label.appendChild(document.createTextNode(' ' + opt));
    box.appendChild(label);
  });

  const res = document.getElementById('result3');
  res.textContent = '';
  res.className = 'result';
}

function initQuiz3() {
  document.getElementById('next3').addEventListener('click', nextTask3);
  updateScore3();
  nextTask3();
}

/* ---------- Завдання 4: ротатор зображень (тематика: ноутбуки) ---------- */
let imagesArray = [
  {
    path: 'images/001.jfif',      
    title: ' Vinga Iron S151',   
    description: 'Ноутбук для для навчання/роботи'   
  },
  {
    path: 'images/002.jfif',
    title: 'MSI GL65 Leopard 10SCSR',
    description: 'Бюджетний ігровий ноутбук'
  },
  {
    path: 'images/003.jfif',
    title: 'MSI Katana 15 HX B14WGK-293US',
    description: 'Топовий ігровий ноутбук'
  }
];

function initPhotoRotator(containerId, images) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  let current = 0;

  const root = document.createElement('div');
  root.className = 'rotator';

  const counter = document.createElement('div');
  counter.className = 'counter';

  const frame = document.createElement('div');
  frame.className = 'frame';
  const img = document.createElement('img');
  frame.appendChild(img);

  const nav = document.createElement('div');
  nav.className = 'nav';
  const back = document.createElement('a');
  back.textContent = '« Назад';
  const forward = document.createElement('a');
  forward.textContent = 'Вперед »';
  nav.appendChild(back);
  nav.appendChild(forward);

  const info = document.createElement('div');
  info.className = 'info';
  const title = document.createElement('div');
  title.className = 'title';
  const description = document.createElement('div');
  description.className = 'description';
  info.appendChild(title);
  info.appendChild(description);

  root.appendChild(counter);
  root.appendChild(frame);
  root.appendChild(nav);
  root.appendChild(info);
  container.appendChild(root);

  function render() {
    const item = images[current];
    counter.textContent = 'Зображення ' + (current + 1) + ' з ' + images.length;
    img.src = item.path;
    img.alt = item.title;
    title.textContent = item.title;
    description.textContent = item.description;
    // visibility, а не display — щоб не було «стрибків» сторінки
    back.style.visibility = current === 0 ? 'hidden' : 'visible';
    forward.style.visibility = current === images.length - 1 ? 'hidden' : 'visible';
  }

  back.addEventListener('click', function () {
    if (current > 0) { current--; render(); }
  });
  forward.addEventListener('click', function () {
    if (current < images.length - 1) { current++; render(); }
  });

  render();
}

/* ---------- Завдання 5: captcha ---------- */
// Цифри у вигляді матриці 5×7 пікселів
const DIGIT_FONT = {
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100']
};

function generateCaptchaNumber(length) {
  let s = '';
  for (let i = 0; i < length; i++) s += randInt(0, 9);
  return s;
}

function drawCaptchaDigit(digit) {
  const box = document.createElement('div');
  box.className = 'captcha-digit';
  DIGIT_FONT[digit].forEach(function (row) {
    for (const bit of row) {
      const px = document.createElement('span');
      if (bit === '1') px.className = 'on';
      box.appendChild(px);
    }
  });
  return box;
}

function initCaptcha(containerId, length) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.classList.add('captcha');
  let code = '';

  const digitsBox = document.createElement('div');
  digitsBox.className = 'captcha-digits';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = length;
  input.placeholder = 'Введіть число';
  input.autocomplete = 'off';

  const checkBtn = document.createElement('button');
  checkBtn.textContent = 'Перевірити';

  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'Оновити';

  const msg = document.createElement('div');
  msg.className = 'msg';

  function generate() {
    code = generateCaptchaNumber(length);
    digitsBox.innerHTML = '';
    for (const d of code) digitsBox.appendChild(drawCaptchaDigit(d));
    input.value = '';
  }

  function check() {
    if (input.value.trim() === code) {
      msg.textContent = 'Captcha введено правильно!';
      msg.className = 'msg ok';
    } else {
      msg.textContent = 'Неправильно, спробуйте ще раз.';
      msg.className = 'msg bad';
      generate();
    }
  }

  checkBtn.addEventListener('click', check);
  refreshBtn.addEventListener('click', function () {
    msg.textContent = '';
    msg.className = 'msg';
    generate();
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') check();
  });

  container.appendChild(digitsBox);
  container.appendChild(input);
  container.appendChild(checkBtn);
  container.appendChild(refreshBtn);
  container.appendChild(msg);
  generate();
}

/* ---------- Запуск ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initTemperature();
  initQuiz2();
  initQuiz3();
  initPhotoRotator('rotator', imagesArray);
  initCaptcha('captcha', 5);
});
