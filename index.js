let currentTurn = ["X", "O"][Math.round(Math.random() * 1)];
var squares = ["", "", "", "", "", "", "", "", ""];

const setUp = async () => {
  currentTurn = ["X", "O"][Math.round(Math.random() * 1)];
  squares = ["", "", "", "", "", "", "", "", ""];
  $("#status").text("");
  for (let i = 0; i < 9; i++) {
    $(`button:input[value="${i}"]`).html("");
  }

  if (currentTurn == "O") {
    $("#turn").text(`${currentTurn}'s Turn`);
    await aiTurn();
    swapTurn();
    return;
  }

  $("#turn").text(`Your Turn`);
};

const detectWin = (board) => {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < wins.length; i++) {
    const [x, y, z] = wins[i];
    if (board[x] && board[x] === board[y] && board[y] === board[z]) {
      return board[x];
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] == "") {
      return "";
    }
  }

  return "tie";
};

const swapTurn = () => {
  if (currentTurn == "X") {
    currentTurn = "O";
    $("#turn").text(`${currentTurn}'s Turn`);
  } else {
    currentTurn = "X";
    $("#turn").text(`Your Turn`);
  }
};

const handleClick = async (value) => {
  const button = $(`button:input[value="${value}"]`);
  if (currentTurn !== "X") return;
  if (squares[value] !== "") return;

  button.html('<i class="fa-solid fa-xmark"></i>');
  button.attr("content", "");
  squares[value] = currentTurn;
  swapTurn();

  let state = detectWin(squares);
  if (state == "tie") {
    $("#status").text("Tie!");
  } else if (state) {
    $("#status").text(`${state} has won the game!`);
  }
  if (state) {
    $("#turn").text("Game Over");
    return;
  }

  await aiTurn();
  swapTurn();

  state = detectWin(squares);
  if (state == "tie") {
    $("#status").text("Tie!");
  } else if (state) {
    $("#status").text(`${state} has won the game!`);
  }
  if (state) {
    $("#turn").text("Game Over");
    currentTurn = -1;
  }
};

const aiTurn = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  var bestScore = -Infinity;
  var bestMove = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== "") continue;
    let tempBoard = [...squares];
    tempBoard[i] = currentTurn;
    let score = minimax(tempBoard, 0, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  if (squares.filter((x) => x == "").length == 9) {
    for (let i = 0; i < 100; i++) {
      let random = Math.round(Math.random() * 8);
      if (squares[random] == "") bestMove = random;
    }
  }

  squares[bestMove] = currentTurn;
  $(`button:input[value="${bestMove}"]`).html('<i class="fa-solid fa-o"></i>');
};

const minimax = (board, depth, isMax) => {
  let win = detectWin(board);
  if (win === "tie") return 0;
  if (win) return win === currentTurn ? 1 : -1;
  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== "") continue;
      let tempBoard = [...board];
      tempBoard[i] = currentTurn;
      score = minimax(tempBoard, depth + 1, false);
      if (score > bestScore) {
        bestScore = score;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== "") continue;
      tempBoard = [...board];
      tempBoard[i] = currentTurn === "X" ? "O" : "X";
      score = minimax(tempBoard, depth + 1, true);
      if (score < bestScore) {
        bestScore = score;
      }
    }
    return bestScore;
  }
};

const toggleSettings = () => {
  if ($(".settingsMenu").attr("showing") === "true") {
    $(".settingsMenu").removeAttr("showing");
  } else {
    $(".settingsMenu").attr("showing", "true");
  }
};

window.onload = async () => {
  if (currentTurn == "O") {
    $("#turn").text(`${currentTurn}'s Turn`);
    await aiTurn();
    swapTurn();
    return;
  }

  $("#turn").text(`Your Turn`);
};
