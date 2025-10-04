const API_URL = import.meta.env.VITE_API_URL

async function fetchAnimeById(id) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          Media (id: $id, type: ANIME) {
            id
            title { romaji }
            description(asHtml: false)
            startDate { year }
            endDate { year }
            status
            episodes
            genres
            averageScore
            popularity
            source
            coverImage { large }
          }
        }
      `,
      variables: { id: id },
    }),
  };

  try {
    const response = await fetch(API_URL, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok for ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    alert("Error fetching data. Check the console for details.");
  }
}

export { fetchAnimeById };