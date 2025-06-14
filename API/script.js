// const { createElement } = require("react");

const searchInput = document.getElementById("searchInput");
const aliveStatus = document.getElementById("aliveStatus");
const deadStatus = document.getElementById("deadStatus");
const unknownStatus = document.getElementById("unknownStatus");
const usersContainer = document.getElementById("usersContainer");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const errorMessage = document.getElementById("errorMessage");

const API = "https://rickandmortyapi.com/api/character";

let currentPage = 1;
let maxPage;

async function loadUsers() {
  try {
    const response = await fetch(`${API}/?page=${currentPage}`);
    if (!response.ok) {
      throw new Error("FAILED TO FETCH USERS");
    }
    const dataUsers = await response.json();
    maxPage = dataUsers.info.pages
    console.log(maxPage);
    dataUsers.results.forEach((user) => {
      const newUser = document.createElement("div");
      newUser.classList.add("userContainer");
      const userImage = document.createElement("div");
      userImage.classList.add("imageContainer");
      userImage.style.backgroundImage = `url(${user.image})`;
      newUser.appendChild(userImage);
      usersContainer.appendChild(newUser);
    });
  } catch (error) {
    errorMessage.textContent = `FAILED TO LOAD USER :( ${error}`;
  }
}

prevButton.addEventListener("click", () => {
  if (currentPage === 1) {
    prevButton.disabled = true;
  } else {
    usersContainer.innerHTML = "";
    nextButton.disabled = false;
    currentPage--;
    loadUsers();
  }
});
nextButton.addEventListener("click", () => {
  if (currentPage === maxPage) {
    nextButton.disabled = true;
  } else {
    usersContainer.innerHTML = "";
    prevButton.disabled = false;
    currentPage++;
    loadUsers();
  }
});

loadUsers();
