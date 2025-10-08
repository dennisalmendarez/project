const API_URL = import.meta.env.VITE_API_URL;

async function fetchAnime(
  page = 1,
  perPage = 100,
  sort = "TRENDING_DESC",
  search = null,
  genres = [],
) {
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $search: String, $genre_in: [String]) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: $sort, search: $search, genre_in: $genre_in) {
          id
          title { romaji }
          description(asHtml: false)
          status
          episodes
          genres
          averageScore
          coverImage { large }
          externalLinks {
            id
            url
            site
            icon
          }
        }
      }
    }
  `;

  const variables = {
    page,
    perPage,
    sort: [sort],
  };

  if (search) {
    variables.search = search;
  }
  if (genres.length > 0) {
    variables.genre_in = genres;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await fetch(API_URL, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse.data.Page.media;
  } catch (error) {
    alert("Error fetching anime list. Check the console for details.");
    return [];
  }
}

async function fetchAllGenres() {
  const query = `
    query {
      GenreCollection
    }
  `;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  };
  try {
    const response = await fetch(API_URL, options);
    const json = await response.json();
    return json.data.GenreCollection;
  } catch (error) {
    return [];
  }
}

export { fetchAnime, fetchAllGenres };
