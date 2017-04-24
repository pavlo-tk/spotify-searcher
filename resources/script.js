"use strict";

let spotifyArtistSearch = () => {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        let searchString = document.getElementById('searchInput').value.trim();
        let spotifyArtistSearcher = new SpotifyArtistSearcher(
            'index.php',
            document.getElementById('results'),
            document.getElementById('genres'),
            document.getElementById('error'),
            new Button(this.querySelector('button[type="submit"]'))
        );
        
        spotifyArtistSearcher.searchArtists(searchString);
    });
};

spotifyArtistSearch();