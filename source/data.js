class PersistentData
{
    /** @type {Set<String>  } */ 
	VisitedLink;

    Load()
    {
        const keys = localStorage.getItem("AppData-v1");
        if (keys != null)
        {
            this.VisitedLink = new Set(keys.split('\u001f'));
        }
        else
        {
            this.VisitedLink = new Set();
        }
    }

    Save()
    {
        const array = Array.from(this.VisitedLink);
        localStorage.setItem("AppData-v1", array.join('\u001f'));
    }
}

class MusicLibrary
{
    /** @type {Artist[]  } */
	Artists;
    /** @type {Album[]  } */
	Albums;
    /** @type {Track[]  } */
	Tracks;

    IsVisited(track)
    {
        return persistentData.VisitedLink.has(this.CreateSearchKey(track, false));
    }

    ExternalSearch(item, type)
    {
        if (type != Artist && type != Album && type != Track)
        {
            throw "Invalid type";
        }

        // TODO: https://www.allmusic.com/search/{type}/{query}
    }

    CreateSearchKey(track, visiting)
    {
        if (track.SearchKey == null)
        {
            var s1 = track.Name;
            var s2 = track.Artist.Name.replace(" (Various Artists)", "");
            var s3 = track.Album.Name;
            var key = s1;
            if (s2 != s1)
            {
                key += " " + s2;
            }
            if (s3 != s2)
            {
                key += " " + s3;
            }

            track.SearchKey = key;
        }

        if (visiting && !persistentData.VisitedLink.has(track.SearchKey))
        {
            persistentData.VisitedLink.add(track.SearchKey);
            persistentData.Save();
        }

        return track.SearchKey;
    }
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

	/** @type {String  } */ 
	SearchKey;
}

/** @type {MusicLibrary } */
let LibraryData = null;
/** @type {PersistentData } */
const persistentData = new PersistentData();

async function LoadLibraryData()
{
    persistentData.Load();

    const downloadURL = "https://dl.dropboxusercontent.com/s/p2ged3o798viyz2kw9ax5/MusicReport.json?rlkey=5yp8xs39at749s5p5ymc3gj30&raw=1";
    await fetch(downloadURL)
    .then(response => response.json())
    .then(data => LibraryData = Object.assign(new MusicLibrary, data))
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