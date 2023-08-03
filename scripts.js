// Function to fetch XML data from tasks.xml and create cards
function fetchAndParseXML() {
  fetch('tasks.xml')
    .then((response) => response.text())
    .then((xml) => {
      parseXML(xml);
    })
    .catch((error) => {
      console.error('Error fetching tasks:', error);
    });
}

// Function to parse the XML data and create cards
function parseXML(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  const urls = xmlDoc.getElementsByTagName('url');
  const cardContainer = document.getElementById('card-container');

  for (const url of urls) {
    const loc = url.getElementsByTagName('loc')[0].textContent;
    const textAfterTask = extractTextAfterTask(loc);
    const card = createCard(textAfterTask);
    cardContainer.appendChild(card);
  }
}

// Call the parseXML function with the sample XML data
fetchAndParseXML();

// Function to create a card
function createCard(title) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("m-3");
  card.classList.add("shadow-lg");
  card.innerHTML = `
    <div class="card-image img-thumbnail shadow-sm"></div>
    <div class="card-title">${title}</div>
  `;

  card.querySelector(".card-image").style.background = getRandomGradient();

  card.addEventListener("click", function () {
    window.location.href = `https://paperswithcode.com/task/${title.toLowerCase().replace(/\s+/g, '-')}`;
  });

  return card;
}

// Function to extract text after 'task/' in the URL
function extractTextAfterTask(url) {
  const taskIndex = url.indexOf("/task/") + "/task/".length;
  let textAfterTask = url.slice(taskIndex);
  textAfterTask = textAfterTask.replace(/-/g, ' ');
  textAfterTask = textAfterTask.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  return textAfterTask;
}

// Function to generate a random gradient
function getRandomGradient() {
  const colors = ["#2D4030", "#49684C", "#5D7F61", "#6B8E6E", "#97B299", 
  "#5A2555", "#5D2A7B", "#7948A2", "#A063C8", "#BE8CE5"];
  const startColor = colors[Math.floor(Math.random() * colors.length)];
  const endColor = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(to bottom right, ${startColor}, ${endColor})`;
}

// Function to filter the cards based on the search term
function filterCards(searchTerm) {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    const isVisible = title.includes(searchTerm.toLowerCase());
    card.style.display = isVisible ? "block" : "none";
  });
}

// Function to handle the search input event
function handleSearchInput() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.trim();
  filterCards(searchTerm);
}

// Add event listener for the search input
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", handleSearchInput);