const title = document.getElementById('title');
const gameText = document.getElementById('gameText');
const textInput = document.getElementById('textInput');
const startBtn = document.getElementById('startBtn');

const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');

const minuteEl = document.getElementById('minute');
const secondEl = document.getElementById('second');

textInput.onpaste = (e) => e.preventDefault(); // prevents pasting into input
// textInput.disabled = true;

const text = `His palms are sweaty, knees weak, arms are heavy
There's vomit on his sweater already, mom's spaghetti
He's nervous, but on the surface he looks calm and ready
To drop bombs, but he keeps on forgetting
What he wrote down, the whole crowd goes so loud
He opens his mouth, but the words won't come out
He's choking, how? Everybody's joking now
The clock's run out, time's up, over-blaow!`;

let wordIndex;
let charIndex;
let inputLength;

let words;
let chars;

let correctPressCount;
let incorrectPressCount;
let wordCount; // completed words

let timer;
let seconds;

prepareGame(text);

function prepareGame(text) {
  charIndex = 0;
  gameText.innerHTML = text
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(' ')
        .map(
          (word) =>
            `<span class="word">${word
              .trim()
              .split('')
              .map(
                (char) =>
                  `<span class="char" index="${charIndex++}">${char}</span>`
              )
              .join(
                ''
              )}<span class="char" index="${charIndex++}"> </span></span>`
        )
        .join('')
    )
    .join('<br/>');

  words = gameText.querySelectorAll('.word');
  chars = gameText.querySelectorAll('.char');

  wordIndex = 0;
  charIndex = 0;
  inputLength = 0;
  correctPressCount = 0;
  incorrectPressCount = 0;
  wordCount = 0;

  toggleUnderLine(words[wordIndex]);
  chars[charIndex].classList.toggle('active');
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  let count = 3;

  startBtn.innerText = count;
  title.innerText = `Start typing in ${count}`;
  let interval = setInterval(() => {
    if (count > 1) {
      console.log(count);
      startBtn.innerText = --count;
      title.innerText = `Start typing in ${count}`;
    } else {
      clearInterval(interval);
      textInput.disabled = false;
      title.innerText = 'Type Racer';
      startBtn.innerText = 'Type!';
      textInput.focus();
      startTimer();
    }
  }, 1000);
});

textInput.addEventListener('keydown', (e) => {
  setTimeout(() => {
    // Add space if enter is pressed
    if (e.code === 'Enter') textInput.value += ' ';
    let word = words[wordIndex];
    // console.log(word.textContent + ' vs ' + textInput.value);
    // console.log(word.textContent.length + ' vs ' + textInput.value.length);
    updateAccuracy();

    // check if word is written
    if (word.textContent === textInput.value) {
      word.classList = 'word done';
      toggleUnderLine(word);
      wordCount++;
      word = words[++wordIndex];
      toggleUnderLine(word);
      textInput.value = '';
    } else {
      updateWord(word);
    }
    updateCharIndex();
  }, 1);
});

function toggleUnderLine(word) {
  // You need to underline each character instead of the whole word to not underline the spaces
  word
    .querySelectorAll('.char')
    .forEach(
      (char) => char.innerText === ' ' || char.classList.toggle('underline')
    );
}

function updateCharIndex() {
  chars[charIndex].classList.remove('active');

  charIndex =
    parseInt(words[wordIndex].querySelector('.char').getAttribute('index')) +
    textInput.value.length;
  chars[charIndex].classList.add('active');
}

function updateWord(word) {
  gameText
    .querySelectorAll('.incorrect')
    .forEach((char) => char.classList.remove('incorrect'));
  gameText
    .querySelectorAll('.correct')
    .forEach((char) => char.classList.remove('correct'));
  const n = textInput.value.length;
  const start = parseInt(word.querySelector('.char').getAttribute('index'));
  let flag = true;
  for (let i = 0; i < n; i++) {
    const char = chars[start + i];
    if (flag && textInput.value[i] === char.innerText) {
      char.classList.add('correct');
    } else {
      flag = false;
      char.classList.add('incorrect');
    }
  }
}

function updateAccuracy() {
  if (inputLength < textInput.value.length) {
    // a new character is typed
    if (
      chars[charIndex].innerText === textInput.value[textInput.value.length - 1]
    ) {
      correctPressCount++;
    } else {
      incorrectPressCount++;
    }
  }
  inputLength = textInput.value.length;
}

function startTimer() {
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    const second = seconds % 60;

    minuteEl.innerText = parseInt(seconds / 60);
    secondEl.innerText = second < 10 ? `0${second}` : second;

    wpmEl.innerText = Math.round((wordCount * 60) / seconds); // word per minute
    if (correctPressCount + incorrectPressCount > 0) {
      accuracyEl.innerText =
        parseInt(
          (correctPressCount * 100) / (correctPressCount + incorrectPressCount)
        ) + '%';
    }
  }, 1000);
}

console.log('k2335121p'[0]);
