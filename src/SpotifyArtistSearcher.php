<?php

namespace SpotifyArtistSearch;

use SpotifyArtistSearch\Exception\SpotifyResponseException;
use SpotifyArtistSearch\HttpClient\HttpClientInterface;

class SpotifyArtistSearcher
{
    protected $httpClient;
    protected $uri;

    public function __construct(HttpClientInterface $httpClient, string $uri)
    {
        $this->httpClient = $httpClient;
        $this->uri = $uri;
    }
    /**
     * Searches artists by name on Spotify.
     * Spotify API documentation: https://developer.spotify.com/web-api/search-item/
     *
     * @param string $name
     * @param int    $limit
     *
     * @return array
     * @throws SpotifyResponseException
     */
    public function searchArtistsByName(string $name, int $limit = 50): array
    {
        $query = [
            'q' => $name,
            'type' => 'artist',
            'limit' => $limit
        ];
        $data = $this->httpClient->getResponseAsArray($this->uri, $query);

        return $this->processResponse($data);
    }
    protected function processResponse(array $data): array
    {
        $searchResult = [];
        $genres = [];

        // Response is OK.
        if (isset($data['artists'])) {
            $artists = $data['artists'];

            if ($artists['total'] > 0) {
                foreach ($artists['items'] as $artist) {
                    $artistItem = [
                        'imageUrl' => array_shift($artist['images'])['url'],
                        'name' => $artist['name'],
                        'popularity' => $artist['popularity'],
                        'spotifyUrl' => $artist['external_urls']['spotify'] ?? null,
                    ];

                    array_push($searchResult, $artistItem);
                    $genres = array_merge($genres, $artist['genres']);
                }

                $artistNames = array_column($searchResult, 'name');
                $artistPopularity = array_column($searchResult, 'popularity');
                array_multisort(
                    $artistNames, SORT_ASC, SORT_NATURAL,
                    $artistPopularity, SORT_DESC,
                    $searchResult
                );
            }
        }

        // Response with ERROR.
        else if (isset($data['error']))  {
            throw new SpotifyResponseException($data['error']['message']);
        }
        else {
            throw new SpotifyResponseException('Unexpected response structure');
        }

        return [
            'artists' => $searchResult,
            'genres' => array_count_values($genres)
        ];
    }
}