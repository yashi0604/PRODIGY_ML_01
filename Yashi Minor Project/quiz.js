let questionBank = JSON.parse(localStorage.getItem("questionBank")) || [];
let currentQuestions = [];
let i = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userName = "";
let selectedCategory = "All";

// DOM References
const question = document.getElementById("question");
const categoryDisplay = document.getElementById("category");
const quizContainer = document.getElementById("quiz-container");
const option0 = document.getElementById("option0");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const next = document.querySelector(".next");
const points = document.getElementById("score");
const span = document.querySelectorAll(".option span");
const stat = document.getElementById("stat");
const previewList = document.getElementById("question-preview");
const questionCount = document.getElementById("question-count");
const timerDisplay = document.getElementById("time");
const userLabel = document.getElementById("user-label");
const leaderboard = document.getElementById("leaderboard");
const progressBar = document.getElementById("progress-bar");

// Add a question
function addQuestion() {
  const q = document.getElementById("input-question").value.trim();
  const o0 = document.getElementById("input-option0").value.trim();
  const o1 = document.getElementById("input-option1").value.trim();
  const o2 = document.getElementById("input-option2").value.trim();
  const o3 = document.getElementById("input-option3").value.trim();
  const ans = document.getElementById("input-answer").value.trim();
  const cat = document.getElementById("input-category").value.trim();

  if (!q || !o0 || !o1 || !o2 || !o3 || !ans || !cat) {
    alert("Please fill out all fields.");
    return;
  }

  const questionObj = {
    question: q,
    option: [o0, o1, o2, o3],
    answer: ans,
    category: cat,
  };

  questionBank.push(questionObj);
  localStorage.setItem("questionBank", JSON.stringify(questionBank));
  populatePreview();
  populateCategoryDropdown();
  clearForm();
}

// Clear form
function clearForm() {
  document.getElementById("input-question").value = "";
  document.getElementById("input-option0").value = "";
  document.getElementById("input-option1").value = "";
  document.getElementById("input-option2").value = "";
  document.getElementById("input-option3").value = "";
  document.getElementById("input-answer").value = "";
  document.getElementById("input-category").value = "";
}

// Populate preview list
function populatePreview() {
  previewList.innerHTML = "";
  questionBank.forEach((q, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${q.question} [${q.category}]`;
    previewList.appendChild(li);
  });
  questionCount.textContent = questionBank.length;
}

// Populate dropdown
function populateCategoryDropdown() {
  const dropdown = document.getElementById("category-select");
  const categories = new Set(questionBank.map(q => q.category));
  dropdown.innerHTML = '<option value="All">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });
}

// Start quiz
function startQuiz() {
  userName = document.getElementById("username").value.trim();
  selectedCategory = document.getElementById("category-select").value;

  if (!userName) {
    alert("Please enter your name.");
    return;
  }

  if (questionBank.length === 0) {
    alert("Add at least one question.");
    return;
  }

  currentQuestions = selectedCategory === "All"
    ? [...questionBank]
    : questionBank.filter(q => q.category === selectedCategory);

  if (currentQuestions.length === 0) {
    alert("No questions in this category.");
    return;
  }

  i = 0;
  score = 0;

  document.getElementById("question-form").style.display = "none";
  document.getElementById("username-form").style.display = "none";
  document.getElementById("preview-container").style.display = "none";
  quizContainer.style.display = "block";

  displayQuestion();
}

// Display question
function displayQuestion() {
  resetTimer();
  span.forEach(s => s.className = '');

  const current = currentQuestions[i];
  question.innerHTML = "Q." + (i + 1) + " " + current.question;
  option0.innerHTML = current.option[0];
  option1.innerHTML = current.option[1];
  option2.innerHTML = current.option[2];
  option3.innerHTML = current.option[3];
  categoryDisplay.innerText = current.category;
  stat.innerHTML = `Question ${i + 1} of ${currentQuestions.length}`;
  updateProgress();

  startTimer();
}

// Handle answer
function calcScore(e) {
  stopTimer();

  const current = currentQuestions[i];
  if (e.innerHTML === current.answer) {
    score++;
    e.classList.add("correct");
  } else {
    e.classList.add("wrong");
    span.forEach(s => {
      if (s.innerHTML === current.answer) s.classList.add("correct");
    });
  }

  setTimeout(nextQuestion, 800);
}

// Next
function nextQuestion() {
  if (i < currentQuestions.length - 1) {
    i++;
    displayQuestion();
  } else {
    stopTimer();
    quizContainer.style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
    points.innerHTML = `${score}/${currentQuestions.length}`;
    userLabel.innerHTML = `Well done, <strong>${userName}</strong>!`;
    updateLeaderboard();
  }
}

// Leaderboard
function updateLeaderboard() {
  const list = JSON.parse(localStorage.getItem("leaderboard")) || [];
  list.push({ name: userName, score });
  list.sort((a, b) => b.score - a.score);
  list.splice(5); // Keep top 5

  localStorage.setItem("leaderboard", JSON.stringify(list));

  leaderboard.innerHTML = "";
  list.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
    leaderboard.appendChild(li);
  });
}

// Back to quiz
function backToQuiz() {
  location.reload();
}

// Check answers
function checkAnswer() {
  const answerBank = document.getElementById("answerBank");
  const answers = document.getElementById("answers");
  answerBank.style.display = "block";
  document.getElementById("scoreboard").style.display = "none";
  answers.innerHTML = "";
  currentQuestions.forEach((q) => {
    const li = document.createElement("li");
    li.textContent = `${q.question} → ${q.answer}`;
    answers.appendChild(li);
  });
}

// Timer
function startTimer() {
  timeLeft = 15;
  timerDisplay.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      stopTimer();
      nextQuestion();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetTimer() {
  stopTimer();
  timeLeft = 15;
  timerDisplay.innerText = timeLeft;
}

// Progress Bar
function updateProgress() {
  const percent = ((i + 1) / currentQuestions.length) * 100;
  progressBar.style.setProperty('--progress', `${percent}%`);
  progressBar.style.setProperty('--width', percent + '%');
  progressBar.querySelector("::after");
  progressBar.innerHTML = `<div style="width:${percent}%; height:100%; background:#42a5f5;"></div>`;
}

// Export/Import
function exportQuiz() {
  const dataStr = JSON.stringify(questionBank, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quiz.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importQuiz() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        questionBank = importedData;
        localStorage.setItem("questionBank", JSON.stringify(questionBank));
        alert("Questions imported!");
        populatePreview();
        populateCategoryDropdown();
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error parsing file.");
    }
  };
  reader.readAsText(file);
}

// Theme Toggle
document.getElementById("theme-switch").addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

// Init
populatePreview();
populateCategoryDropdown();
