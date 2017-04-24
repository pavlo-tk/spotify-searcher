<?php

namespace SpotifyArtistSearch\HttpClient;

interface HttpClientInterface
{
    public function getResponseAsArray(string $uri, array $queryParameters = []): array;
}