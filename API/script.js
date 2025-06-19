const searchInput = document.getElementById("searchInput");
const aliveStatus = document.getElementById("aliveStatus");
const deadStatus = document.getElementById("deadStatus");
const unknownStatus = document.getElementById("unknownStatus");
const usersContainer = document.getElementById("usersContainer");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
// const errorMessage = document.getElementById("errorMessage");
const formContainer = document.getElementById("formContainer");
const noUsersMessage = document.getElementById("noUsersMessage");

const API = "https://rickandmortyapi.com/api/character";

let currentPage = 1;
let maxPage;
let statusUser = "alive";
let tmieline;

async function loadUsers() {
    const searchValue = searchInput.value.trim().toLowerCase();
    usersContainer.innerHTML="";
    noUsersMessage.classList.add("hiddenElement");
    try {
    const response = await fetch(`${API}/?page=${currentPage}&status=${statusUser}&name=${searchValue}`);
    const responseUsers20 = await fetch(`${API}/?page=1`);
    if (!response.ok) {
      throw new Error("FAILED TO FETCH USERS");
    }
    const dataUsers = await response.json();
    const dataUsers20 = await responseUsers20.json();
    maxPage = dataUsers.info.pages;
    totalUsers = dataUsers.info.count;
    console.log(maxPage);
    console.log(totalUsers);
    console.log(dataUsers20);
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
    // errorMessage.textContent = `FAILED TO LOAD USER :( ${error}`;
    console.error(error);
    noUsersMessage.classList.remove("hiddenElement");
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

searchInput.addEventListener("input", () => {
    clearTimeout(tmieline);
    tmieline = setTimeout( () => {
        currentPage = 1;
        loadUsers();
    },1000)
});

loadUsers();
