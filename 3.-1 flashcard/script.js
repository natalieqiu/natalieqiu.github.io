const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;
let cards = [];
let currentCardIndex = -1;

// Initialize the card list container reference
const listCard = document.querySelector(".card-list-container");
if (!listCard) {
  console.error("Could not find card-list-container element");
}

// Load cards from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadCardsFromLocalStorage();
    renderCards();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

// Hide Create flashcard Card
closeBtn.addEventListener(
    "click",
    (hideQuestion = () => {
      container.classList.remove("hide");
      addQuestionCard.classList.add("hide");
      if (editBool) {
        editBool = false;
        submitQuestion();
      }
    })
);

// Submit Question
cardButton.addEventListener(
    "click",
    (submitQuestion = () => {
      tempQuestion = question.value.trim();
      tempAnswer = answer.value.trim();
      if (!tempQuestion || !tempAnswer) {
        errorMessage.classList.remove("hide");
      } else {
        container.classList.remove("hide");
        errorMessage.classList.add("hide");

        if (editBool) {
          // Update existing card
          cards[currentCardIndex] = {
            question: tempQuestion,
            answer: tempAnswer
          };
          editBool = false;
        } else {
          // Add new card
          cards.push({
            question: tempQuestion,
            answer: tempAnswer
          });
        }

        // Save to local storage
        saveCardsToLocalStorage();

        // Render updated cards
        renderCards();

        question.value = "";
        answer.value = "";
      }
    })
);

// Save cards to local storage
function saveCardsToLocalStorage() {
  try {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Load cards from local storage
function loadCardsFromLocalStorage() {
  try {
    const storedCards = localStorage.getItem('flashcards');
    if (storedCards) {
      cards = JSON.parse(storedCards);
    } else {
      cards = [];
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    cards = [];
  }
}

// Render all cards
function renderCards() {
  if (!listCard) return;

  // Clear existing cards
  listCard.innerHTML = '';

  // Create and append each card
  cards.forEach((card, index) => {
    const div = createCardElement(card, index);
    listCard.appendChild(div);
  });
}

// Create a card element
function createCardElement(card, index) {
  const div = document.createElement("div");
  div.classList.add("card");

  // Question
  div.innerHTML += `
  <p class="question-div">${card.question}</p>`;

  // Answer
  const displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div", "hide");
  displayAnswer.innerText = card.answer;

  // Link to show/hide answer
  const link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", (e) => {
    e.preventDefault();
    displayAnswer.classList.toggle("hide");
  });

  div.appendChild(link);
  div.appendChild(displayAnswer);

  // Edit and delete buttons container
  let buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");

  // Edit button
  const editButton = document.createElement("button");
  editButton.setAttribute("class", "edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editBool = true;
    currentCardIndex = index;
    question.value = card.question;
    answer.value = card.answer;
    addQuestionCard.classList.remove("hide");
    container.classList.add("hide");
  });
  buttonsCon.appendChild(editButton);

  // Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    cards.splice(index, 1);
    saveCardsToLocalStorage();
    renderCards();
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);
  return div;
}

// Helper function to hide the question card
function hideQuestion() {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
}