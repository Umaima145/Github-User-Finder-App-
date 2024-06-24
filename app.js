const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
const searchBox = document.querySelector("#search");

const showSpinner = () => {
  const spinnerHTML = `
   
  <div class="loader">
    <span class="loader-text">loading</span>
      <span class="load"></span>
  </div>
`;
  main.innerHTML = spinnerHTML;
};

const getUser = async (username) => {
  showSpinner();

  const response = await fetch(APIURL + username);

  if (response.status === 404) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "User Not Found!",
    });
    main.innerHTML = "";
  } else {
    const data = await response.json();
    console.log(data);
    const card = `
      <div class="card">
        <div>
          <img class="avatar" src="${data.avatar_url}" alt="${data.name}">
        </div>
        
        <div class="user-info">
          <h2>${data.name}</h2>
          <br><br>
          <p>${data.bio}</p>
          <br><br>
          <ul class="info">
            <li>${data.followers}<strong>Followers</strong></li>
            <li>${data.following}<strong>Following</strong></li>
            <li>${data.public_repos}<strong>Repos</strong></li>
          </ul>
          <br><br>
          <h2>Repos</h2>
          <br>
          <div id="repos"></div>
        </div>
      </div>
    `;
    main.innerHTML = card;
    getRepos(username);
  }
};

const getRepos = async (username) => {
  const reposContainer = document.querySelector("#repos");
  reposContainer.innerHTML = `
    
  <div class="loader">
    <span class="loader-text">loading</span>
      <span class="load"></span>
  </div>
`;

  const response = await fetch(APIURL + username + "/repos");
  const data = await response.json();
  
  reposContainer.innerHTML = ""; // Clear the spinner
  
  data.forEach((item) => {
    const elem = document.createElement("a");
    elem.classList.add("repo");
    elem.href = item.html_url;
    elem.innerText = item.name;
    elem.target = "_blank";
    reposContainer.appendChild(elem);
  });
};

const displayError = (message) => {
  const errorHTML = `<p class="error">${message}</p>`;
  main.innerHTML = errorHTML;
};

const formSubmit = () => {
  if (searchBox.value !== "") {
    getUser(searchBox.value);
    searchBox.value = "";
  }
  return false;
};

searchBox.addEventListener("focusout", function() {
  formSubmit();
});
