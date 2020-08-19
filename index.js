const API_URL = "https://api.codewithguruji.com/superhero";

// if the above api url is not working, kindly see the description of video named "SuperHero World"

const cardContainer = document.getElementsByClassName('cardContainer')[0];
const findBtn = document.getElementById('findBtn');
const inputBox = document.getElementById('inputBox');
const loaderBtn = document.getElementById('loaderBtn');

const modal = document.getElementsByClassName('modal')[0];
const modalCloseBtn = document.getElementsByClassName('closeBtn')[0];
const powerStats = document.getElementsByClassName('powerStats')[0];

function showLoaderBtn() {
  loaderBtn.classList.add('loader');
  findBtn.style.display = 'none';
}

function hideLoaderBtn() {
  loaderBtn.classList.remove('loader');
  findBtn.style.display = 'block';
}

function handleModalTop() {
  const pageYOffset = window.pageYOffset;
  const currentHeight = window.innerHeight * 0.1;

  modal.style.top = pageYOffset + currentHeight + 'px';
}

function handleModalOpen(data) {
  powerStats.innerHTML = '';

  const imageUrl = data.image.url;
  modal.style.backgroundImage = `url(${imageUrl})`;

  const statsKeys = Object.keys(data.powerstats);

  for (let i = 0; i < statsKeys.length; i++) {
    let value = data.powerstats[statsKeys[i]];
    if (value === null || value === 'null') value = 0;

    const div = document.createElement('div');

    const stats = document.createElement('div');
    stats.setAttribute('class', 'stats');
    stats.innerText = value;

    const power = document.createElement('div');
    power.setAttribute('class', 'power');
    power.innerText = statsKeys[i];

    div.append(stats, power);
    powerStats.append(div);
  }
  handleModalTop();

  modal.classList.toggle('modalVisible');
}

modalCloseBtn.addEventListener('click', function () {
  modal.classList.toggle('modalVisible');
  modal.style.top = '0vh';
});

function createCard(data) {
  const imageUrl = data.image.url;

  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.style.backgroundImage = `url(${imageUrl})`;
  card.addEventListener('click', function () {
    handleModalOpen(data);
  });

  const details = document.createElement('div');
  details.setAttribute('class', 'details');
  details.innerText = data.name;

  card.append(details);
  cardContainer.append(card);
}

function clearCards() {
  cardContainer.innerHTML = '';
}

async function fetchData() {
  showLoaderBtn();
  const inputValue = inputBox.value;
  if (inputValue.replace(/[\s+]/g, '').length === 0) {
    hideLoaderBtn();
    return alert('Please enter valid Superhero name...');
  }

  try {
    let response = await fetch(`${API_URL}/name/${inputValue}`);
    if (response.status !== 200)
      return alert("Not found! or Something went wrong!");

    clearCards();

    response = await response.json();
    for (index in response) {
      createCard(response[index]);
    }
  } catch (ex) {
    console.log(ex.message);
  } finally {
    hideLoaderBtn();
  }
}

function handleKeyPress(e) {
  if (e.keyCode === 13) return fetchData();
}

document.addEventListener('scroll', handleModalTop);
findBtn.addEventListener('click', fetchData);
inputBox.addEventListener('keypress', handleKeyPress);

// [
//   {
//     id: '346',
//     name: 'Iron Man',
//     powerstats: {
//       intelligence: '100',
//       strength: '85',
//       speed: '58',
//       durability: '85',
//       power: '100',
//       combat: '64',
//     },
//     image: {
//       url: 'https://www.superherodb.com/pictures2/portraits/10/100/85.jpg',
//     },
//   },
// ];
