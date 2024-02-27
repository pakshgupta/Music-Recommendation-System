// Load the similarity matrix
const similarity = 'similarity.pkl'; // Replace with the path to your similarity matrix file

// Attach the recommend function to the button click event
document.getElementById('recommendBtn').addEventListener('click', recommend);

// Function to make a recommendation based on the selected song
async function recommend() {
  const selectedSong = document.getElementById('song').value;

  // Load the DataFrame
  const response = await fetch('df(1).pkl'); // Replace with the path to your DataFrame file
  const arrayBuffer = await response.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);
  const dfString = String.fromCharCode.apply(null, byteArray);
  const df = JSON.parse(dfString);

  // Perform recommendation locally using the similarity matrix and DataFrame

  // Replace this section with your recommendation algorithm
  const songIndex = getSongIndex(selectedSong, df);
  const recommendedSongs = getRecommendedSongs(songIndex, similarity, df);

  displayRecommendedSongs(recommendedSongs);
}

// Function to get the index of the selected song from the DataFrame
function getSongIndex(selectedSong, df) {
  // Retrieve the song names from the DataFrame
  const songs = df['song'];

  // Find the index of the selected song in the song names array
  const songIndex = songs.findIndex(song => song === selectedSong);

  return songIndex;
}

// Function to get the recommended songs based on the selected song index
function getRecommendedSongs(songIndex, similarity, df) {
  // Retrieve the similarity scores for the selected song index from the similarity matrix
  const similarityScores = similarity[songIndex];

  // Sort the similarity scores and get the indices of the most similar songs
  const sortedIndices = similarityScores
    .map((score, index) => [score, index])
    .sort((a, b) => b[0] - a[0])
    .map(pair => pair[1]);

  // Get the corresponding song names for the recommended song indices
  const recommendedSongs = sortedIndices
    .slice(0, 3) // Get the top 3 recommended songs
    .map(index => df['song'][index]);

  return recommendedSongs;
}

// Function to display the recommended songs on the webpage
function displayRecommendedSongs(songs) {
  const recommendedSongsElement = document.getElementById('recommendedSongs');
  recommendedSongsElement.innerHTML = '';

  songs.forEach(function (song) {
    const listItem = document.createElement('li');
    listItem.innerText = song;
    recommendedSongsElement.appendChild(listItem);
  });
}
