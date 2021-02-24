"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q= ${term}`);
  let data = response.data;
  let result = [];
  for (let { show } of data) {
    let id = show.id;
    let name = show.name;
    let summary = show.summary;
    let image = show.image?.original;
    result.push({ id, name, summary, image })
  }
  return result;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
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

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  //check that data is empty array if no episodes
  return response.data.map((ep) => ({
    id: ep.id,
    name: ep.name,
    season: ep.season,
    number: ep.number
  }));
}

/** appends episode information to episode area in html */
function populateEpisodes(episodes) {
  let $episodesList = $('#episodesList');
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(`<li>
      name ${episode.name}, season ${episode.season}, number ${episode.number} 
    </li>`);
    $episodesList.append($item);
  }
  $episodesArea.show();
}

$showsList.on('click', '.btn', async function (evt) {
  let id = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
})


