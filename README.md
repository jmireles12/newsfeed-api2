# NewsFeed-API

## API Documentation

This is an API for the app NewsFeed. The API provides an endpoint for the app to save Tabs to toggle between content for news.

- URL: 
    https://salty-anchorage-98947.herokuapp.com/

- Method: 
    `GET` | `POST` | `DELETE` | `PUT`

- URL Params
    Required:
    `id=[integer]`

- Data Params
    `id: integer`,
    `name: example name`

- Success Response:
    - Code: 200
    Content: `{ id: 12}`

- Error Response:
    `POST`
    Code: 400 Bad Request
    Content: `{ error: "Missing '${key}' in request body" }`

    `GET`
    Code: 404 Not Found
    Content: `{ error: "Tab doesn't exist" }`

- Sample Call
    `https://salty-anchorage-98947.herokuapp.com/api/tabs`

Tabs to specify the content of news feed.
GET: /tabs

## Live App

Link: https://salty-anchorage-98947.herokuapp.com/

## Screenshots

Tab Names: 
![tab names](Images/create_tab.png)

See Tab Results:
![tab results](Images/news.png)

## Build With
* Node.js
* Express
* JavaScript
* npm
* Git