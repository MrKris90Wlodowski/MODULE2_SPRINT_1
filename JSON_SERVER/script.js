const searchInput = document.getElementById("searchInput");
const aliveStatus = document.getElementById("aliveStatus");
const deadStatus = document.getElementById("deadStatus");
const unknownStatus = document.getElementById("unknownStatus");
const usersContainer = document.getElementById("usersContainer");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const formContainer = document.getElementById("formContainer");
const noUsersMessage = document.getElementById("noUsersMessage");

const createUserButton = document.getElementById("createUserButton");
const nameUserInput = document.getElementById("nameUserInput");
const speciesUserInput = document.getElementById("speciesUserInput");
const statusInput = document.getElementById("statusInput");
const addFormContainer = document.getElementById("addFormContainer");

const API = "http://localhost:3000/users";

let currentPage = 1;
let maxPage;
let statusUser = "Alive";
let tmieline;

async function loadUsers() {
  const searchValue = searchInput.value.trim().toLowerCase();
  usersContainer.innerHTML = "";
  noUsersMessage.classList.add("hiddenElement");
  try {
    const response = await fetch(
      `${API}/?_page=${currentPage}&_limit=5&status=${statusUser}&q=${searchValue}`
    );
    if (!response.ok) {
      throw new Error("FAILED TO FETCH USERS");
    }
    const totalUsers = response.headers.get("X-Total-Count");
    if (Number(totalUsers) === 0) {
      noUsersMessage.classList.remove("hiddenElement");
    }
    maxPage = Math.ceil(totalUsers / 5);
    const dataUsers = await response.json();
    dataUsers.forEach((user) => {
      const newUser = document.createElement("div");
      newUser.classList.add("userContainer");
      const userImage = document.createElement("div");
      userImage.classList.add("imageContainer");
      userImage.style.backgroundImage = `url(${user.image})`;
      const userName = document.createElement("p");
      userName.classList.add("userName", "displayFlex");
      userName.textContent = `${user.name}`;
      const userStatus = document.createElement("p");
      userStatus.classList.add("userStatus");
      userStatus.textContent = `Status: ${user.status}`;
      const userGender = document.createElement("p");
      userGender.classList.add("userGender");
      userGender.textContent = `Species: ${user.species}`;
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("buttonDelete");
      deleteButton.textContent = "DELETE";
      deleteButton.dataset.id=`${user.id}`;
      deleteButton.addEventListener("click", deleteUser);
      newUser.appendChild(userImage);
      newUser.appendChild(userName);
      newUser.appendChild(userStatus);
      newUser.appendChild(userGender);
      newUser.appendChild(deleteButton);
      usersContainer.appendChild(newUser);
      prevButton.disabled = false;
      nextButton.disabled = false;
    });
  } catch (error) {
    console.error(error);
  }
}

async function addUser(event) {
  event.preventDefault();
  const nameUserInputValue = nameUserInput.value.trim();
  const speciesUserInputValue = speciesUserInput.value.trim();
  const statusInputValue = statusInput.value;
  const randomNumber = Math.floor(Math.random() * 826 + 1);
  try {
    if (nameUserInputValue !== 0 && speciesUserInputValue !== 0) {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameUserInputValue,
          status: statusInputValue,
          species: speciesUserInputValue,
          image: `http://rickandmortyapi.com/api/character/avatar/${randomNumber}.jpeg`,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      addFormContainer.reset();
      currentPage = 1;
      loadUsers();
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(event) {
  const eventDelete = event.target.classList.contains("buttonDelete");
  if (!eventDelete) {
    return;
  }
  const eventID = event.target.dataset.id;
  try {
    const response = await fetch(`${API}/${eventID}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    currentPage = 1;
    loadUsers();
  } catch (error) {
    console.error(error);
  }
}

formContainer.addEventListener("change", (event) => {
  const status = event.target.dataset.status;
  if (status === "Alive") {
    statusUser = "Alive";
  } else if (status === "Dead") {
    statusUser = "Dead";
  } else if (status === "unknown") {
    statusUser = "unknown";
  } else {
    return;
  }
  currentPage = 1;
  loadUsers();
});

prevButton.addEventListener("click", () => {
  if (currentPage === 1) {
    prevButton.disabled = true;
  } else {
    nextButton.disabled = false;
    currentPage--;
    loadUsers();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage === maxPage) {
    nextButton.disabled = true;
  } else {
    prevButton.disabled = false;
    currentPage++;
    loadUsers();
  }
});

searchInput.addEventListener("input", () => {
  clearTimeout(tmieline);
  tmieline = setTimeout(() => {
    currentPage = 1;
    loadUsers();
  }, 1000);
});

createUserButton.addEventListener("click", addUser);

loadUsers();
