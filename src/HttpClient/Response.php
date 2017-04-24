<?php

namespace SpotifyArtistSearch\HttpClient;

class Response
{
    private $statusCode;
    private $data;

    public function __construct(int $statusCode, array $data)
    {
        $this->statusCode = $statusCode;
        $this->data = $data;
    }
    public function getStatusCode()
    {
        return $this->statusCode;
    }
    public function getData()
    {
        return $this->data;
    }
}