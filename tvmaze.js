"use strict";

const $showsList = $("#showsList");
const $searchForm = $("#searchForm");
const $modalTitle = $('.modal-title');
const $modalBody = $('.modal-body');


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(term) {
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q= ${term}`);
  let shows = [];
  for (let { show } of response.data) {
    let id = show.id;
    let name = show.name;
    let summary = show.summary;
    let image = show.image?.original;
    shows.push({ id, name, summary, image })
  }
  return shows;
}


/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" data-show-title="${show.name}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-info">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" data-bs-toggle="modal" data-bs-target="#modal">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number, summary }
 */
async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data.map((ep) => ({
    id: ep.id,
    name: ep.name,
    season: ep.season,
    number: ep.number,
    summary: ep.summary
  }));
}

/** appends episode information to modal in html */
function populateEpisodes(episodes, title) {
  $modalBody.empty();
  $modalTitle.text(`${title}`)
  for (let episode of episodes) {
    const $item = $(
      `<div class="mb-4">
        <strong class="text-info">
          S${episode.season} E${episode.number} : <em>${episode.name}</em>
        </strong>
        ${episode.summary}
      </div>`);
    $modalBody.append($item);
  }
}

$showsList.on('click', '.btn', async function (evt) {
  const $showDiv = $(evt.target).closest(".Show");
  let id = $showDiv.data("show-id");
  let title = $showDiv.data("show-title");
  let episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes, title);
})
