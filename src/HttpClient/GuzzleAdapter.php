<?php

namespace SpotifyArtistSearch\HttpClient;

use GuzzleHttp\ClientInterface;

class GuzzleAdapter implements HttpClientInterface
{
    protected $client;

    public function __construct(ClientInterface $guzzleClient)
    {
        $this->client = $guzzleClient;
    }
    public function getResponseAsArray(string $uri, array $queryParameters = []): array
    {
        $response = $this->client->request(
            'GET',
            'https://api.spotify.com/v1/search',
            ['query' => $queryParameters]
        );
        $data = \GuzzleHttp\json_decode($response->getBody(), true);

        return $data;
    }
}