"use strict";

class SpotifyArtistSearcher {
    /**
     * @param {string} apiUri
     * @param {HTMLElement} resultsContainerElement
     * @param {HTMLElement} genresContainerElement
     * @param {HTMLElement} errorContainerElement
     * @param {Button} searchButton
     */
    constructor(apiUri, resultsContainerElement, genresContainerElement, errorContainerElement, searchButton) {
        this.apiUri = apiUri;
        this.resultsContainerElement = resultsContainerElement;
        this.genresContainerElement = genresContainerElement;
        this.errorContainerElement = errorContainerElement;
        this.searchButton = searchButton;
    }
    
    /**
     * An entry point of the Spotify Artist Searcher.
     * Searches for artists on Spotify and populates DOM with results.
     *
     * @param {string} searchString
     */
    searchArtists(searchString) {
        if (!searchString) {
            this._showError('Please specify artist name for search');
            return;
        }
        
        this.searchButton.setLoading();
        this._hideError();
        this.resultsContainerElement.innerHTML = '';
        this.genresContainerElement.innerHTML = '';
        let $request = $.get(this.apiUri, {artistName: searchString});
        $request
            .done(response => { this._proccessResponse(response) })
            .fail((jqXHR, textStatus) => { this._showError(textStatus) })
            .always(() => { this.searchButton.clearLoading() });
    }
    /**
     * Processes response from the server and populates DOM with either results or an error.
     *
     * @param {object} response An ajax response
     * @private
     */
    _proccessResponse(response) {
        if (response.artists !== undefined) {
            if (response.artists.length >= 1) {
                let artists = '';
                response.artists.forEach(artistData => {
                    artists += this._renderArtistCard(artistData);
                });
                
                let genres = '';
                if (response.genres) {
                    for (let genre in response.genres) {
                        if (!response.genres.hasOwnProperty(genre)) continue;
            
                        let frequency = response.genres[genre];
                        genres += this._renderGenre(genre, frequency);
                    }
                }
    
                this.resultsContainerElement.innerHTML = artists;
                this.genresContainerElement.innerHTML = genres;
            }
            else {
                this._showError('No artists found');
            }
        }
        else if (response.error) {
            this._showError(response.error);
        }
        else {
            this._showError('An error occurred while searching for the artist.'); // Unexpected response structure.
        }
    }
    
    /**
     * Renders an single genre in form of Bootstrap badge.
     *
     * @param {string} genre
     * @param {number} frequency
     * @returns {string} HTML
     * @private
     */
    _renderGenre(genre, frequency) {
        let frequencyTemplate = '';
        if (frequency > 1) {
            frequencyTemplate = ` (${frequency})`;
        }
        
        return `<span class="badge badge-primary">${genre}${frequencyTemplate}</span>\n`;
    }
    /**
     * Renders an artist's card.
     *
     * @param {array} artistData
     * @returns {string} HTML
     * @private
     */
    _renderArtistCard(artistData) {
        let image;
        if (!artistData['imageUrl']) {
            image = '<div class="noImage">No image</div>';
        }
        else {
            image = `<img class="media-object" src="${artistData['imageUrl']}" alt="${artistData['name']}">`;
        }
        
        return `
            <div class="card">
                <div class="media">
                    <div class="media-left">
                        <a href="${artistData['spotifyUrl']}">
                            ${image}
                        </a>
                    </div>
                    <div class="media-body">
                        <a href="${artistData['spotifyUrl']}">${artistData['name']}</a>
                        <p class="card-text">
                            Popularity: ${artistData['popularity']}<br>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * @param {string} message
     * @private
     */
    _showError(message) {
        this.errorContainerElement.style.display = 'block';
        this.errorContainerElement.innerHTML = message;
    }
    _hideError() {
        this.errorContainerElement.style.display = 'none';
    }
}