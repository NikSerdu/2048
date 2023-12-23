let fieldData = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const initRandomData = () => {
  for (let i = 0; i < 3; i++) {
    let a = randomInteger(0, fieldData.length - 1);
    let b = randomInteger(0, fieldData[0].length - 1);
    fieldData[a][b] = 2;
  }
};

initRandomData();

const field = document.querySelector(".field");

const colors = {
  2: "#eee4da",
  4: "#eee1c9",
  8: "#f3b27a",
  16: "#f69664",
  32: "#f77c5f",
  64: "#f66340",
  128: "#edd073",
  256: "#edcc62",
  512: "#725700",
  1024: "#9a7c1c",
  2048: "#d7a500",
};

const initField = (fieldData) => {
  let html = "";
  fieldData.forEach((line, i) => {
    let temp = "";
    line.forEach((item, j) => {
      temp += `<div class="fieldItem" style="background-color:${colors[item]}">${item}</div>`;
    });
    html += `<div class='fieldLine'>${temp}</div>`;
  });
  field.innerHTML = html;
};

window.addEventListener("load", () => {
  initField(fieldData);
});

const summarize = (line) => {
  let newLine = line;
  let zeroCount = 0;
  for (let i = 0; i < newLine.length - 1; i++) {
    if (newLine[i] === newLine[i + 1]) {
      zeroCount++;
      newLine[i] += newLine[i + 1];
      newLine[i + 1] = 0;
    }
  }
  newLine = newLine.filter((item) => item !== 0);
  while (newLine.length !== line.length) {
    newLine.push(0);
  }
  return newLine;
};

const getForDown = () => {
  const lines = [];
  for (let i = 0; i < fieldData.length; i++) {
    lines.push([]);
    for (let j = 0; j < fieldData[0].length; j++) {
      lines[i].push(fieldData[fieldData.length - j - 1][i]);
    }
  }
  return lines;
};

const rotate = (matrix, k) => {
  let copyMatrix = matrix;
  for (let n = 0; n < k; n++) {
    const newMatrix = createZeroMatrix(matrix.length, matrix[0].length);
    for (let i = 0; i < copyMatrix.length; i++) {
      for (let j = 0; j < copyMatrix[0].length; j++) {
        newMatrix[i][j] = copyMatrix[copyMatrix.length - j - 1][i];
      }
    }
    copyMatrix = newMatrix;
  }
  return copyMatrix;
};

function createZeroMatrix(n, k) {
  var matrix = new Array(n).fill(0).map(function () {
    return new Array(k).fill(0);
  });

  return matrix;
}

const reverse = (matrix) => {
  return matrix.map((item) => item.reverse());
};

const getMax = () => {
  let max = 0;
  fieldData.forEach((item) => {
    max = Math.max(...item);
  });
  return max;
};

const getRandomNumber = () => {
  const numbers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
  const max = numbers.indexOf(getMax());
  let rand = Math.floor(0 + Math.random() * max + 1);
  return numbers[rand];
};

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const pushRandomNumber = () => {
  const zeros = [];
  for (let i = 0; i < fieldData.length; i++) {
    for (let j = 0; j < fieldData[0].length; j++) {
      if (fieldData[i][j] === 0) zeros.push([i, j]);
    }
  }
  if (zeros.length === 0) return;
  const rand = randomInteger(0, zeros.length - 1);
  fieldData[zeros[rand][0]][zeros[rand][1]] = getRandomNumber();
};

const down = () => {
  const lines = rotate(fieldData, 1);
  const sumLines = [];
  lines.forEach((item) => {
    sumLines.push(summarize(item));
  });
  fieldData = rotate(sumLines, 3);
};

const up = () => {
  const lines = rotate(fieldData, 3);
  const sumLines = [];
  lines.forEach((item) => {
    sumLines.push(summarize(item));
  });
  fieldData = rotate(sumLines, 1);
};

const left = () => {
  const lines = rotate(fieldData, 0);
  const sumLines = [];
  lines.forEach((item) => {
    sumLines.push(summarize(item));
  });
  fieldData = rotate(sumLines, 0);
};

const right = () => {
  const lines = reverse(fieldData);
  const sumLines = [];
  lines.forEach((item) => {
    sumLines.push(summarize(item));
  });
  fieldData = reverse(sumLines);
};

const checkIsWin = () => {
  for (let i = 0; i < fieldData.length; i++) {
    for (let j = 0; j < fieldData[0].length; j++) {
      if (fieldData[i][j] === 2048) return true;
    }
  }
  return false;
};

function checkIsGameOver() {
  // Проверка на наличие свободных ячеек
  for (let i = 0; i < fieldData.length; i++) {
    for (let j = 0; j < fieldData[i].length; j++) {
      if (fieldData[i][j] === 0) {
        return false; // Есть свободная ячейка, игра не окончена
      }
    }
  }

  // Проверка на возможность объединения соседних клеток по горизонтали
  for (let i = 0; i < fieldData.length; i++) {
    for (let j = 0; j < fieldData[i].length - 1; j++) {
      if (fieldData[i][j] === fieldData[i][j + 1]) {
        return false; // Можно объединить соседние клетки по горизонтали
      }
    }
  }

  // Проверка на возможность объединения соседних клеток по вертикали
  for (let i = 0; i < fieldData.length - 1; i++) {
    for (let j = 0; j < fieldData[i].length; j++) {
      if (fieldData[i][j] === fieldData[i + 1][j]) {
        return false; // Можно объединить соседние клетки по вертикали
      }
    }
  }

  // Если не выполнилось ни одно из условий, игра окончена
  return true;
}

document.body.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      up();
      break;
    case "ArrowDown":
      down();
      break;
    case "ArrowLeft":
      left();
      break;
    case "ArrowRight":
      right();
      break;
    default:
      break;
  }
  if ("Arrow".includes(e.key.slice(0, 5))) {
    checkIsWin() && alert("Вы выиграли!");
    checkIsGameOver() && alert("Вы проиграли!");
    pushRandomNumber();
    initField(fieldData);
  }
});

let startX, startY, endX, endY;

document.body.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.body.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  handleSwipe();
});

function handleSwipe() {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Горизонтальный свайп
    if (deltaX > 0) {
      right();
    } else {
      left();
    }
  } else {
    // Вертикальный свайп
    if (deltaY > 0) {
      down();
    } else {
      up();
    }
  }

  checkIsWin() && alert("Вы выиграли!");
  checkIsGameOver() && alert("Вы проиграли!");
  pushRandomNumber();
  initField(fieldData);
}
