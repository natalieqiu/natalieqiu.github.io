// Global variables
let currentSetId = "default";
let sets = {};
let currentCardIndex = -1;
let editBool = false;

// DOM Elements
const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const listCard = document.querySelector(".card-list-container");

// New DOM elements for set management
const setSelector = document.createElement("select");
setSelector.id = "set-selector";
setSelector.classList.add("set-selector");

const setNameInput = document.createElement("input");
setNameInput.type = "text";
setNameInput.id = "new-set-name";
setNameInput.placeholder = "New set name";

const addSetButton = document.createElement("button");
addSetButton.textContent = "Create New Set";
addSetButton.id = "add-set-btn";

// Delete set button
const deleteSetButton = document.createElement("button");
deleteSetButton.textContent = "Delete Current Set";
deleteSetButton.id = "delete-set-btn";
deleteSetButton.classList.add("danger-button");

// Create a set management container
const setManagementDiv = document.createElement("div");
setManagementDiv.classList.add("set-management");

const setControls = document.createElement("div");
setControls.classList.add("set-controls");

setManagementDiv.appendChild(setSelector);
setManagementDiv.appendChild(setNameInput);
setManagementDiv.appendChild(addSetButton);
setControls.appendChild(deleteSetButton);

setManagementDiv.appendChild(setControls);

// Create delete dialog

function deleteDiallog() {
}
/*
const deleteDialog = document.createElement("div");
deleteDialog.id = "delete-set-dialog";
deleteDialog.classList.add("delete-dialog", "hide");
deleteDialog.innerHTML = `
  <div class="delete-dialog-content">
    <h3>Delete Set Confirmation</h3>
    <p>To delete this set, please type the set name: <span id="set-name-to-delete"></span></p>
    <input type="text" id="delete-confirmation-input" class="input" placeholder="Type set name to confirm">
    <div class="delete-dialog-buttons">
      <button id="confirm-delete-btn" class="danger-button">Delete Set</button>
      <button id="cancel-delete-btn" class="secondary-button">Cancel</button>
    </div>
    <p id="delete-error" class="error-message hide">Set name doesn't match</p>
  </div>
`;
*/


// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadSetsFromLocalStorage();
    updateSetSelector();
    renderCurrentSet();

    // Insert the set management div before the card list container
    if (listCard && listCard.parentNode) {
      listCard.parentNode.insertBefore(setManagementDiv, listCard);
      document.body.appendChild(deleteDialog);
    }
    document.getElementById('confirm-delete-btn').addEventListener("click", confirmDeleteSet);
    document.getElementById('cancel-delete-btn').addEventListener("click", hideDeleteDialog);
    document.getElementById('delete-confirmation-input').addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        confirmDeleteSet();
      }
    });


  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// Event Listeners
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

closeBtn.addEventListener("click", hideQuestion);

cardButton.addEventListener("click", submitQuestion);

//addSetButton.addEventListener("click", createNewSet);
deleteSetButton.addEventListener("click", showDeleteDialog);

setSelector.addEventListener("change", (e) => {
  currentSetId = e.target.value;
  renderCurrentSet();
});

// Add event listeners for delete functionality once elements are created
//document.getElementById('confirm-delete-btn').addEventListener("click", confirmDeleteSet);
//document.getElementById('cancel-delete-btn').addEventListener("click", hideDeleteDialog);
//document.getElementById('delete-confirmation-input').addEventListener("keyup", (e) => {
  //if (e.key === "Enter") {
    //confirmDeleteSet();
  //}
//});

// Functions
function createNewSet() {
  const newSetName = newSetNameInput.value.trim();
  if (newSetName) {
    currentSetId = newSetName;
    if (!sets[currentSetId]) {
      sets[currentSetId] = [];
    }
    saveSetsToLocalStorage();
    updateSetSelector();
    renderCurrentSet();
    newSetNameInput.value = "";
  }
}

function showDeleteDialog() {
  if (currentSetId === "default") {
    alert("Cannot delete the default set");
    return;
  }

  if (Object.keys(sets).length <= 1) {
    alert("Cannot delete the only remaining set");
    return;
  }

  const deleteDialog = document.getElementById('delete-set-dialog');
  const setNameToDelete = document.getElementById('set-name-to-delete');
  const deleteConfirmationInput = document.getElementById('delete-confirmation-input');
  const deleteError = document.getElementById('delete-error');

  deleteDialog.classList.remove("hide");
  setNameToDelete.textContent = currentSetId;
  deleteConfirmationInput.value = "";
  deleteError.classList.add("hide");
}

function hideDeleteDialog() {
  const deleteDialog = document.getElementById('delete-set-dialog');
  const deleteConfirmationInput = document.getElementById('delete-confirmation-input');
  const deleteError = document.getElementById('delete-error');

  deleteDialog.classList.add("hide");
  deleteConfirmationInput.value = "";
  deleteError.classList.add("hide");
}

function confirmDeleteSet() {
  const deleteConfirmationInput = document.getElementById('delete-confirmation-input');
  const deleteError = document.getElementById('delete-error');
  const confirmationText = deleteConfirmationInput.value.trim();

  if (confirmationText === currentSetId) {
    // Delete the set
    delete sets[currentSetId];

    // Set current set to the first available set
    currentSetId = Object.keys(sets)[0] || "default";

    // Save to localStorage
    saveSetsToLocalStorage();

    // Update UI
    updateSetSelector();
    renderCurrentSet();

    // Hide dialog
    hideDeleteDialog();
  } else {
    deleteError.classList.remove("hide");
  }
}

// Functions before delete set functionality was added
function hideQuestion() {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editBool) {
    editBool = false;
    submitQuestion();
  }
}

function submitQuestion() {
  const tempQuestion = question.value.trim();
  const tempAnswer = answer.value.trim();

  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    container.classList.remove("hide");
    errorMessage.classList.add("hide");

    // Initialize current set if it doesn't exist
    if (!sets[currentSetId]) {
      sets[currentSetId] = [];
    }

    if (editBool) {
      // Update existing card
      sets[currentSetId][currentCardIndex] = {
        question: tempQuestion,
        answer: tempAnswer
      };
      editBool = false;
    } else {
      // Add new card
      sets[currentSetId].push({
        question: tempQuestion,
        answer: tempAnswer
      });
    }

    // Save to local storage
    saveSetsToLocalStorage();

    // Render updated cards
    renderCurrentSet();

    question.value = "";
    answer.value = "";
  }
}


function updateSetSelector() {
  // Clear existing options
  setSelector.innerHTML = "";

  // Add options for each set
  Object.keys(sets).forEach(setId => {
    const option = document.createElement("option");
    option.value = setId;
    option.textContent = setId;
    if (setId === currentSetId) {
      option.selected = true;
    }
    setSelector.appendChild(option);
  });

  // If no sets exist, create default set
  if (Object.keys(sets).length === 0) {
    sets["default"] = [];
    currentSetId = "default";
    saveSetsToLocalStorage();
    updateSetSelector();
  }
}

function saveSetsToLocalStorage() {
  try {
    localStorage.setItem('flashcardSets', JSON.stringify(sets));
  } catch (error) {
    console.error("Error saving sets to localStorage:", error);
  }
}

function loadSetsFromLocalStorage() {
  try {
    const storedSets = localStorage.getItem('flashcardSets');
    if (storedSets) {
      sets = JSON.parse(storedSets);

      // If sets is empty or invalid, initialize with default
      if (!sets || Object.keys(sets).length === 0) {
        sets = { "default": [] };
      }
    } else {
      sets = { "default": [] };
    }

    // Make sure currentSetId exists
    if (!sets[currentSetId]) {
      currentSetId = Object.keys(sets)[0] || "default";
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    sets = { "default": [] };
  }
}

function renderCurrentSet() {
  if (!listCard) return;

  // Clear existing cards
  listCard.innerHTML = '';

  // Make sure the current set exists
  if (!sets[currentSetId]) {
    sets[currentSetId] = [];
  }

  // Create and append each card
  sets[currentSetId].forEach((card, index) => {
    const div = createCardElement(card, index);
    listCard.appendChild(div);
  });
}

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
    sets[currentSetId].splice(index, 1);
    saveSetsToLocalStorage();
    renderCurrentSet();
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);
  return div;
}

// Add this HTML structure for the delete confirmation dialog