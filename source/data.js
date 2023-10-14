/** @type {MusicLibrary } */
let LibraryData = null;

class MusicLibrary
{
    /** @type {Artist[]  } */
	Artists;
    /** @type {Album[]  } */
	Albums;
    /** @type {Track[]  } */
	Tracks;
}

class Artist
{
    /** @type {Number  } */
	ID;

	/** @type {String  } */ 
	Name;
    /** @type {Number  } */
    AverageRating;
    /** @type {Number  } */
    BestRating;
    /** @type {Number  } */
    TotalTracks;
    /** @type {Number  } */
    TotalRatedTracks;
    /** @type {Number  } */
    TotalStarredTracks;
    /** @type {Number[] } */
	AlbumIDs;

    /** @type {Album[] } */
	Albums;
    /** @type {Track[] } */
	Tracks;
    /** @type {Number  } */
    TotalRatedAlbums;
    /** @type {Boolean } */
	Rated;
}

class Album
{
    /** @type {Number  } */
	ID;
    /** @type {Number  } */
	ArtistID;

	/** @type {String  } */ 
	Name;
    /** @type {Number  } */
    Year;
    /** @type {Number  } */
    AverageRating;
    /** @type {Number  } */
    BestRating;
    /** @type {Number  } */
    TotalTracks;
    /** @type {Number  } */
    TotalRatedTracks;
    /** @type {Number  } */
    TotalStarredTracks;
    /** @type {Number[] } */
	TrackIDs;

    /** @type {Artist  } */
	Artist;
    /** @type {Track[] } */
	Tracks;
    /** @type {Boolean } */
	Rated;
}

class Track
{
    /** @type {Number  } */
	ID;
    /** @type {Number  } */
	ArtistID;
    /** @type {Number  } */
	AlbumID;

	/** @type {String  } */ 
	Name;
    /** @type {Number  } */
    Index;
    /** @type {Number  } */
    Duration;
    /** @type {Number  } */
    Rating;

    /** @type {Artist  } */
	Artist;
    /** @type {Album  } */
	Album;
    /** @type {Boolean } */
	Rated;
}

async function LoadLibraryData()
{
    const downloadURL = "https://dl.dropboxusercontent.com/s/p2ged3o798viyz2kw9ax5/MusicReport.json?rlkey=5yp8xs39at749s5p5ymc3gj30&raw=1";
    await fetch(downloadURL)
    .then(response => response.json())
    .then(data => LibraryData = data)
    .catch(error => {
        console.error('Error fetching and parsing JSON:', error);
    });

    for (let artist of LibraryData.Artists)
    {
        artist.Albums = [];
        artist.Tracks = [];
        artist.Rated = false;

        for (let albumID of artist.AlbumIDs)
        {
            let album = LibraryData.Albums[albumID-1];
            artist.Albums.push(album);
            album.Tracks = [];
            album.Artist = artist;    
            album.Rated = true;

            for (let trackID of album.TrackIDs)
            {
                let track = LibraryData.Tracks[trackID-1];
                track.Album = album;
                track.Artist = artist;
                album.Tracks.push(track);
                artist.Tracks.push(track);

                if (track.Rating <= 0)
                {
                    track.Rated = false;
                    album.Rated = false;
                }
                else
                {
                    track.Rated = true;
                }
            }

            if (album.Rated)
            {
                artist.TotalRatedAlbums += 1;
                artist.Rated = true;
            }
        }
    }

    return LibraryData;
}