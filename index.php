<?php

namespace SpotifyArtistSearch;

use GuzzleHttp\Client;
use SpotifyArtistSearch\HttpClient\GuzzleAdapter;

require 'vendor/autoload.php';

$response = [];

$artistName = $_GET['artistName'] ?? null;
if ($artistName) {
    $artistSearcher = new SpotifyArtistSearcher(new GuzzleAdapter(new Client()), 'https://api.spotify.com/v1/search');
    try {
        $response = $artistSearcher->searchArtistsByName($artistName);
    } catch (\Exception $exception) {
        $response = ['error' => 'An error occurred while searching for the artist.'];
        // An error should be logged.
    }
}

header('Content-Type: application/json');
echo json_encode($response);