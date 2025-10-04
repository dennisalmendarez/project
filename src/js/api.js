const API_URL = import.meta.env.VITE_API_URL;

async function fetchTopAnime(page = 1, perPage = 100) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: TRENDING_DESC) {
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
      `,
      variables: {
        page: page,
        perPage: perPage,
      },
    }),
  };

  try {
    const response = await fetch(API_URL, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonResponse = await response.json();
    return jsonResponse.data.Page.media;
  } catch (error) {
    console.error("API Fetch Error:", error);
    alert("Error fetching top anime list. Check the console for details.");
    return [];
  }
}

export { fetchTopAnime };
