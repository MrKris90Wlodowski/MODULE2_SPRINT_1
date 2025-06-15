const searchInput = document.getElementById("searchInput");
const aliveStatus = document.getElementById("aliveStatus");
const deadStatus = document.getElementById("deadStatus");
const unknownStatus = document.getElementById("unknownStatus");
const usersContainer = document.getElementById("usersContainer");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const errorMessage = document.getElementById("errorMessage");
const formContainer = document.getElementById("formContainer");

const API = "https://rickandmortyapi.com/api/character";

let currentPage = 1;
let maxPage;
let statusUser = "alive";

async function loadUsers() {
    usersContainer.innerHTML="";
    try {
    const response = await fetch(`${API}/?page=${currentPage}&status=${statusUser}`);
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
      const userName = document.createElement("p");
      userName.classList.add("userName", "displayFlex");
      userName.textContent=`${user.name}`;
      const userStatus = document.createElement("p");
      userStatus.textContent=`Gender: ${user.gender}`;
      userStatus.classList.add("userStatus");
      userStatus.textContent=`Status: ${user.status}`
      const userGender = document.createElement("p");
      userGender.classList.add("userGender");
      userGender.textContent=`Gender: ${user.gender}`;
      newUser.appendChild(userImage);
      newUser.appendChild(userName);
      newUser.appendChild(userStatus);
      newUser.appendChild(userGender);
      usersContainer.appendChild(newUser);
    });
  } catch (error) {
    errorMessage.textContent = `FAILED TO LOAD USER :( ${error}`;
  }
}

formContainer.addEventListener("change", (event) => {
    const status = event.target.dataset.status;
    if (status === "alive") {
            statusUser = "alive";
        } else if (status === "dead") {
            statusUser = "dead";
        } else if (status === "unknown") {
           statusUser = "unknown"; 
        } else {
            return
        }
    currentPage = 1;
    loadUsers()
});

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
