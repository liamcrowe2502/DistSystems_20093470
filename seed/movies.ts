import {Movie, MovieCast, Reviews} from '../shared/types'

export const movies : Movie[] = [
  {
    adult: false,
    backdrop_path: '/sRLC052ieEzkQs9dEtPMfFxYkej.jpg',
    genre_ids: [ 878 ],
    id: 848326,
    original_language: 'en',
    original_title: 'Rebel Moon - Part One: A Child of Fire',
    overview: 'When a peaceful colony on the edge of the galaxy finds itself threatened by the armies of the tyrannical Regent Balisarius, they dispatch Kora, a young woman with a mysterious past, to seek out warriors from neighboring planets to help them take a stand.',
    popularity: 2136.3,
    poster_path: '/6epeijccmJlnfvFitfGyfT7njav.jpg',
    release_date: '2023-12-15',
    title: 'Rebel Moon - Part One: A Child of Fire',
    video: false,
    vote_average: 6.4,
    vote_count: 750,
    movieId: 2000
  }
]

export const movieCasts: MovieCast[] = [
  {
    movieId: 1234,
    actorName: "Joe Bloggs",
    roleName: "Male Character 1",
    roleDescription: "description of character 1",
  },
  {
    movieId: 1234,
    actorName: "Alice Broggs",
    roleName: "Female Character 1",
    roleDescription: "description of character 2",
  },
  {
    movieId: 1234,
    actorName: "Joe Cloggs",
    roleName: "Male Character 2",
    roleDescription: "description of character 3",
  },
  {
    movieId: 2345,
    actorName: "Joe Bloggs",
    roleName: "Male Character 1",
    roleDescription: "description of character 3",
  },
];

export const movieReview: Reviews[] = [
  {
    movieId: 2000,
    movieName: "Five Nights at Freddy's",
    reviewerName: "Liam Crowe",
    reviewDate: "2023-10-20",
    reviewStar: 3,
    Comment: "This movie was okay but nothing to write home about",
  },
  {
    movieId: 2001,
    movieName: "Rebel Moon",
    reviewerName: "Liam Crowe",
    reviewDate: "2024-03-14",
    reviewStar: 5,
    Comment: "This movie was good.",
  }
];

//Add review, change ID
/*
  {
    "adult": false,
    "backdrop_path": "/1X7vow16X7CnCoexXh4H4F2yDJv.jpg",
    "genre_ids": [ 80, 18, 36 ],
    "id": 4666666,
    "original_language": "en",
    "original_title": "Killers of the Flower Moon",
    "overview": "When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one—until the FBI steps in to unravel the mystery.",
    "popularity": 612.671,
    "poster_path": "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    "release_date": "2023-10-18",
    "title": "Killers of the Flower Moon",
    "video": false,
    "vote_average": 7.5,
    "vote_count": 1647,
    "movieId": 2002
  }
*/

//Add review, change ID
/*
{
    "movieId": 2002,
    "movieName": "Killers of the Flower Moon",
    "reviewerName": "Jim",
    "reviewDate": "2023-11-20",
    "reviewStar": 2,
    "Comment": "This movie was long"
  }
*/

