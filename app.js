let eyel, eyer, mouth;
let standardInterval;
let currentMood = "dead";
const faceEl = document.querySelector(".face");
moods(currentMood);

function cycleChar(eid, charPairs) {
  const element = document.getElementById(eid);
  if (!element) return;
  if (element.timeoutId) {
    clearTimeout(element.timeoutId);
  }
  if (!element.generation) {
    element.generation = 0;
  }
  element.generation++;
  const generation = element.generation;
  let index = 0;

  function updateChar() {
    if (element.generation !== generation) return;
    const [char, duration] = charPairs[index];
    element.textContent = char;
    index = (index + 1) % charPairs.length;
    if (duration != 0) {
      element.timeoutId = setTimeout(updateChar, duration * 1000);
    } else {
      element.timeoutId = null;
    }
  }
  updateChar();
}

function clearCharCycles() {
  ["eyel", "eyer", "mouth"].forEach((id) => {
    const element = document.getElementById(id);
    if (element && element.timeoutId) {
      clearTimeout(element.timeoutId);
      element.timeoutId = null;
    }
    if (element && element.generation) {
      element.generation++;
    }
  });
}

function moods(mood) {
  clearCharCycles();

  if (mood === "dead") {
    eyel = [["x", 0]];
    eyer = [["x", 0]];
    mouth = [["-", 0]];
  }
  if (mood === "awake") {
    eyel = [
      [".", 4],
      ["", 0.3],
      ["\u{2027}", 7],
      ["", 0.3],
    ];
    eyer = [
      [".", 4],
      ["", 0.3],
      ["\u{2027}", 7],
      ["", 0.3],
    ];
    mouth = [[".", 0]];
  }
  if (mood === "happy") {
    eyel = [
      [".", 4],
      ["", 0.3],
      ["\u{2027}", 7],
      ["", 0.3],
    ];
    eyer = [
      [".", 4],
      ["", 0.3],
      ["\u{2027}", 7],
      ["", 0.3],
    ];
    mouth = [["\u{02d8}", 0]];
  }
  if (mood === "excited") {
    eyel = [
      ["O", 3],
      ["\u{002a}", 0.4],
      ["O", 1.6],
      [">", 2],
    ];
    eyer = [
      ["O", 5],
      ["<", 2],
    ];
    mouth = [
      ["\u{02d8}", 5],
      ["\u{25bd}", 2],
    ];
  }
  if (mood === "concerned") {
    eyel = [
      [".", 4],
      ["", 0.3],
      ["\u{2027}", 7],
      ["", 0.3],
    ];
    eyer = [
      [".", 4],
      ["", 0.3],
      ["\u{2027}", 7],
      ["", 0.3],
    ];
    mouth = [["\u{00ba}", 0]];
  }
  if (mood === "sleeping") {
    eyel = [["-", 4]];
    eyer = [["-", 4]];
    mouth = [
      ["\u{2027}", 4],
      ["\u{00ba}", 1],
    ];
    faceEl.classList.add("sleeping");
  } else if (faceEl.classList.contains("sleeping")) {
    faceEl.classList.remove("sleeping");
  }

  cycleChar("eyel", eyel);
  cycleChar("eyer", eyer);
  cycleChar("mouth", mouth);
}

let power = 0;
const maxPower = 100;
const decayRate = 1;
const increment = 2;
const holdDuration = 16180;
let isHolding = false;
let isDropping = false;
let lastPower = power;
let accumulatedDrop = 0;
const powerBtn = document.querySelector(".pwr-btn");

function updatePower() {
  if (!isHolding) {
    power = Math.max(0, power - decayRate);
    checkPowerDrop();
    updatePowerHeight();
  }
  let newMood = currentMood;

  if (power === 0) {
    powerBtn.classList.add("empty");
    powerBtn.classList.remove("full");
    powerBtn.innerHTML = "Generate";
  } else if (power >= 100) {
    powerBtn.innerHTML = "~ FULL ~";
    powerBtn.classList.add("full");
    powerBtn.classList.remove("empty");
  } else {
    powerBtn.classList.remove("full");
    powerBtn.classList.remove("empty");
    powerBtn.innerHTML = "Generate";
  }

  if (power === 0) {
    newMood = "dead";
  } else if (power > 0 && power < 20) {
    newMood = "concerned";
  } else if (isDropping && power > 30 && power < 70) {
    newMood = "sleeping";
  } else if (power >= 20 && power < 50) {
    newMood = "awake";
  } else if (power >= 50 && power < 90) {
    newMood = "happy";
  } else if (power >= 90 && power <= 100) {
    newMood = "excited";
  }

  const moodList = [
    "dead",
    "excited",
    "awake",
    "concerned",
    "happy",
    "sleeping",
  ];
  if (newMood !== currentMood) {
    currentMood = newMood;
    if (moodList.includes(newMood)) {
      moods(newMood);
    } else {
      clearCharCycles();
    }
  }
}

function checkPowerDrop() {
  if (power < lastPower) {
    accumulatedDrop += lastPower - power;
  } else if (power > lastPower) {
    accumulatedDrop = 0;
  }
  if (accumulatedDrop >= 20) {
    isDropping = true;
  } else {
    isDropping = false;
  }
  lastPower = power;
}

function increasePower() {
  accumulatedDrop = 0;
  if (!isHolding) {
    power = Math.min(maxPower, power + increment);
    if (power === maxPower && !isHolding) {
      startHold();
    }
    updatePowerHeight();
  }
}

function updatePowerHeight() {
  powerBtn.style.setProperty("--power", power);
}

function startHold() {
  isHolding = true;
  powerBtn.classList.add("full");
  powerBtn.innerHTML = "~ FULL ~";
  setTimeout(() => {
    isHolding = false;
  }, holdDuration);
}

powerBtn.addEventListener("click", increasePower);
standardInterval = setInterval(updatePower, 1000);
updatePowerHeight();

const ct = document.querySelector(".face");
ct.addEventListener("mousemove", function (e) {
  const rect = ct.getBoundingClientRect();
  const se = 42;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateX = (y / rect.height - 0.5) * -se;
  const rotateY = (x / rect.width - 0.5) * se;
  ct.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  ct.style.setProperty("--xv", rotateX);
  ct.style.setProperty("--yv", rotateY);
});
ct.addEventListener("mouseleave", function () {
  ct.style.transform = "rotateX(0deg) rotateY(0deg)";
  ct.style.setProperty("--xv", 0);
  ct.style.setProperty("--yv", 0);
});
