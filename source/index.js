/// <reference path="data.js" />
/// <reference path="utils.js" />

class TableContext
{
    /** @type {String    } */
    ID;
    /** @type {Object    } */
    Tab;
    /** @type {Object    } */
    Table;
    /** @type {Object[]  } */
    Columns;
    /** @type {Object[]  } */
    Dataset;

    toggleTab()
    {
        $(`a[href='#${this.ID}Tab']`).tab('show');
    }
}

const context = {
    /** @type {TableContext    } */
    Artists: new TableContext(),
    /** @type {TableContext    } */
    Albums: new TableContext(),
    /** @type {TableContext    } */
    Tracks: new TableContext(),
    /** @type {TableContext    } */
    SelectedAlbums: new TableContext(),
    /** @type {TableContext    } */
    SelectedTracks: new TableContext(),

    /** @type {TableContext[]  } */
    List: []
}

async function Setup()
{
    await LoadLibraryData();
    InitializeDataTables();
}

function InitializeDataTables()
{
    context.List.push(context.Artists);
    context.List.push(context.Albums);
    context.List.push(context.Tracks);
    context.List.push(context.SelectedAlbums);
    context.List.push(context.SelectedTracks);

    context.Artists.ID = "artists";
    context.Albums.ID = "albums";
    context.Tracks.ID = "tracks";
    context.SelectedAlbums.ID = "selectedAlbums";
    context.SelectedTracks.ID = "selectedTracks";

    for (let item of context.List)
    {
        item.Dataset = [];
        item.Tab = $("#" + item.ID + "Tab");
        item.Table = $("#" + item.ID + "Table");
        item.Table.addClass("display table-bordered row-border order-column table-striped nowrap");
    }

    const defaultSettings = 
    {
        scrollX: false,
        sPaginationType: "full_numbers",
        select: null, //"single"
        responsive: true,
        altEditor: true,
        search: {
            return: false // return key to start search
        },
        pageLength: 20,
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, 'All']],
        deferRender: true,
        autoWidth: false,
        stateSave: true,
        stateDuration: -1,
        rowId: function(data)
        {
            return data[0];
        },
        pagingType: "bootstrap_input",
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-sm-6 col-md-4'B><'col-sm-6 col-md-4 text-center'i><'col-sm-12 col-md-4'p>>",
        buttons: [ 'copy', 'csv', 'excel', 'pdf' ],
    }

    context.Artists.Columns = [
        { title: "ID"     , searchable: false, visible: false, orderable: false, type: "num"     , width: "0%" , className: "text-center", render: render_default },
        { title: "Rated"  , searchable: false, visible: false, orderable: false, type: "string"  , width: "0%" , className: "text-center", render: render_default },
        { title: "Average", searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "Best"   , searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "Artist" , searchable: true , visible: true , orderable: true , type: "html"    , width: "69%", className: "text-left fw-bold", render: render_artistRef },
        { title: "Albums" , searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selAlbums },
        { title: "Tracks" , searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selTracs },
        { title: "Starred", searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selTracs },
    ];
    context.Artists.Table.DataTable({
        ...defaultSettings,
        columns: context.Artists.Columns,
        order: [ 
            [4, 'asc']
        ],
        data: [],
    });

    context.Albums.Columns = [
        { title: "ID"     , searchable: false, visible: false, orderable: false, type: "num"     , width: "0%" , className: "text-center", render: render_default },
        { title: "Rated"  , searchable: false, visible: false, orderable: false, type: "string"  , width: "0%" , className: "text-center", render: render_default },
        { title: "Average", searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "Best"   , searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "Year"   , searchable: true , visible: true , orderable: true , type: "num"     , width: "6%" , className: "text-center", render: render_default },
        { title: "Album"  , searchable: true , visible: true , orderable: true , type: "html"    , width: "35%", className: "text-left fw-bold", render: render_albumRef },
        { title: "Artist" , searchable: true , visible: true , orderable: true , type: "html"    , width: "35%", className: "text-left"  , render: render_artistRef },
        { title: "Tracks" , searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selTracs },
        { title: "Starred", searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selTracs },
    ];
    context.Albums.Table.DataTable({
        ...defaultSettings,
        columns: context.Albums.Columns,
        order: [ 
            [6, 'asc']
        ],
        data: [],
    });

    context.Tracks.Columns = [
        { title: "ID"      , searchable: false, visible: false, orderable: false, type: "num"     , width: "0%" , className: "text-center", render: render_default },
        { title: "Rated"   , searchable: false, visible: false, orderable: false, type: "string"  , width: "0%" , className: "text-center", render: render_default },
        { title: "Rating"  , searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "#"       , searchable: false, visible: false, orderable: false, type: "num"     , width: "4%" , className: "text-center", render: render_2digits },
        { title: "Title"   , searchable: true , visible: true , orderable: true , type: "html"    , width: "30%", className: "text-left fw-bold", render: render_ytlink },
        { title: "Duration", searchable: false, visible: true , orderable: true , type: "string"  , width: "7%" , className: "text-center", render: render_duration },
        { title: "Album"   , searchable: true , visible: true , orderable: true , type: "html"    , width: "27%", className: "text-left"  , render: render_albumRef },
        { title: "Artist"  , searchable: true , visible: true , orderable: true , type: "html"    , width: "27%", className: "text-left"  , render: render_artistRef },
    ];
    context.Tracks.Table.DataTable({
        ...defaultSettings,
        columns: context.Tracks.Columns,
        data: [],
        order: [ 
            [4, 'asc']
        ],
        orderFixed:
        {
            post: [ 3, 'asc' ],
        },
    });

    context.SelectedAlbums.Columns = [
        { title: "ID"     , searchable: false, visible: false, orderable: false, type: "num"     , width: "0%" , className: "text-center", render: render_default },
        { title: "Rated"  , searchable: false, visible: false, orderable: false, type: "string"  , width: "0%" , className: "text-center", render: render_default },
        { title: "Average", searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "Best"   , searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "Year"   , searchable: true , visible: true , orderable: true , type: "num"     , width: "6%" , className: "text-center", render: render_default },
        { title: "Album"  , searchable: true , visible: true , orderable: true , type: "html"    , width: "35%", className: "text-left fw-bold", render: render_albumRef },
        { title: "Artist" , searchable: true , visible: true , orderable: true , type: "html"    , width: "35%", className: "text-left"  , render: render_default },
        { title: "Tracks" , searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selTracs },
        { title: "Starred", searchable: false, visible: true , orderable: true , type: "html-num", width: "7%" , className: "text-center", render: render_selTracs },
    ];
    context.SelectedAlbums.Table.DataTable({
        ...defaultSettings,
        columns: context.SelectedAlbums.Columns,
        data: [],
        order: [ 
            [6, 'asc']
        ],
    });

    context.SelectedTracks.Columns = [
        { title: "ID"      , searchable: false, visible: false, orderable: false, type: "num"     , width: "0%" , className: "text-center", render: render_default },
        { title: "Rated"   , searchable: false, visible: false, orderable: false, type: "string"  , width: "0%" , className: "text-center", render: render_default },
        { title: "Rating"  , searchable: false, visible: true , orderable: true , type: "html-num", width: "5%" , className: "text-center", render: render_1to10 },
        { title: "#"       , searchable: false, visible: true , orderable: false, type: "num"     , width: "4%" , className: "text-center", render: render_2digits },
        { title: "Title"   , searchable: true , visible: true , orderable: true , type: "html"    , width: "30%", className: "text-left fw-bold", render: render_ytlink },
        { title: "Duration", searchable: false, visible: true , orderable: true , type: "string"  , width: "7%" , className: "text-center", render: render_duration },
        { title: "Album"   , searchable: true , visible: true , orderable: true , type: "html"    , width: "27%", className: "text-left"  , render: render_albumRef },
        { title: "Artist"  , searchable: true , visible: true , orderable: true , type: "html"    , width: "27%", className: "text-left"  , render: render_artistRef },
    ];
    context.SelectedTracks.Table.DataTable({
        ...defaultSettings,
        columns: context.SelectedTracks.Columns,
        data: [],
        order: [ 
            [6, 'asc']
        ],
        orderFixed:
        {
            post: [ 3, 'asc' ],
        },
    });
}

function RebuildTable(table, dataset)
{
    let dt = table.DataTable();
    dt.clear().draw(false);
    dt.rows.add(dataset);
    dt.draw(false);
}

function ReloadData(filter)
{
    for (let item of context.List)
    {
        item.Dataset.length = 0;
    }

    for (let artist of LibraryData.Artists)
    {
        if ((filter == "All") || (filter == "Rated" && artist.Rated) || (filter == "Unrated" && (artist.Albums.find(a => !a.Rated)) != null))
        {
            registerArtist(context.Artists, artist);
        }
    }
    
    for (let album of LibraryData.Albums)
    {
        if ((filter == "All") || (filter == "Rated" && album.Rated) || (filter == "Unrated" && !album.Rated))
        {
            registerAlbum(context.Albums, album);
        }
    }

    for (let track of LibraryData.Tracks)
    {
        if ((filter == "All") || (filter == "Rated" && track.Rated) || (filter == "Unrated" && !track.Rated))
        {
            registerTrack(context.Tracks, track);   
        }   
    }

    for (let item of context.List)
    {
        RebuildTable(item.Table, item.Dataset);
    }
}

function registerArtist(targetContext, artist)
{
    targetContext.Dataset.push([
        artist.ID,
        artist.Rated,
        artist.AverageRating,
        artist.BestRating,
        artist.Name,
        artist.Albums.length,
        artist.TotalTracks,
        artist.TotalStarredTracks,
    ]);
}

function registerAlbum(targetContext, album)
{
    targetContext.Dataset.push([
        album.ID,
        album.Rated,
        album.AverageRating,
        album.BestRating,
        album.Year,
        album.Name,
        album.Artist?.Name ?? "-",
        album.TotalTracks,
        album.TotalStarredTracks,
    ]);
}

function registerTrack(targetContext, track)
{
    targetContext.Dataset.push([
        track.ID,
        track.Rated,
        track.Rating,
        track.Index,
        track.Name,
        track.Duration,
        track.Album?.Name ?? "-",
        track.Artist?.Name ?? "-",
    ]);
}

function render_default   ( data, type, row, meta ) { return data; }
function render_2digits   ( data, type, row, meta ) { return data.toString().padStart(2, '0'); }
function render_duration  ( data, type, row, meta ) { return millisecondsToMMSS(data); }

function render_1to100    ( data, type, row, meta ) 
{
    if ( type != 'display' && type != 'filter' )
    {
        return Math.round(data * 100);
    }

    var className = "cell-rating";
    var rating = ratingTo100(data);
    if (rating == "-")
    {
        className += " rating-none";
    }
    else if (rating <= 40)
    {
        className += " rating-lowest";
    }
    else if (rating <= 50)
    {
        className += " rating-low";
    }
    else if (rating <= 60)
    {
        className += " rating-average";
    }
    else if (rating <= 70)
    {
        className += " rating-high";
    }
    else if (rating <= 80)
    {
        className += " rating-higher";
    }
    else
    {
        className += " rating-highest";
    }

    return render_span(rating, null, className);
}

function render_1to10( data, type, row, meta )
{
    if ( type != 'display' && type != 'filter' )
    {
        return ratingTo10(data, null, true);
    }

    var className = "cell-rating";
    var rating = ratingTo10(data, null, true);
    if (rating == "-")
    {
        className += " rating-none";
    }
    else if (rating < 5)
    {
        className += " rating-lowest";
    }
    else if (rating < 6)
    {
        className += " rating-low";
    }
    else if (rating < 7)
    {
        className += " rating-average";
    }
    else if (rating < 8)
    {
        className += " rating-high";
    }
    else if (rating < 9)
    {
        className += " rating-higher";
    }
    else
    {
        className += " rating-highest";
    }

/*     if (rating >= 6 && rating <= 7 && (data * 10) % 1 > 0.5)
    {
        className += " rating-plus";
    } */

    return render_span(rating, null, className);
}
 
function render_artistRef ( data, type, row, meta ) { return render_link(data, type, row, meta, "context.SelectedAlbums","cell-button"); }
function render_albumRef  ( data, type, row, meta ) { return render_link(data, type, row, meta, "context.SelectedTracks", "cell-button"); }
function render_trackRef  ( data, type, row, meta ) { return render_link(data, type, row, meta, "context.Tracks", "cell-button"); }
function render_selAlbums ( data, type, row, meta ) { return render_link(data, type, row, meta, "context.SelectedAlbums", "cell-button"); }
function render_selTracs  ( data, type, row, meta ) { return render_link(data, type, row, meta, "context.SelectedTracks", "cell-button"); }

function render_ytlink    ( data, type, row, meta )
{
    const rowID = row[0];
    const track = LibraryData.Tracks[rowID - 1];
    const className = (track != null && LibraryData.IsVisited(track)) ?  "cell-button-yt visited" : "cell-button-yt";
    return render_span(data, `navigate_switch('${meta.settings.sTableId}', ${rowID}, 'EXTERNAL_SEARCH')`, className);
}

function render_link      ( data, type, row, meta, targetContext, className ) 
{
    return render_span(data, `navigate_switch('${meta.settings.sTableId}', ${row[0]}, ${targetContext})`, className);
}

function render_span    ( data, onclick, className ) 
{
    return `<span class="${className}"${onclick == null ? "" : " onclick=\"" + onclick + "\""}>${data}</span>`; 
}

/** @param {TableContext } targetContext */
function navigate_switch(sourceTableID, rowID, targetContext)
{    
    if (window.getSelection().toString() != "")
    {
        return;
    }

    var sourceContext = context.List.find(c => (c.ID + "Table") == sourceTableID);
    if (sourceContext == context.Artists)
    {
        let artist = LibraryData.Artists[rowID - 1];
        if (targetContext == context.SelectedAlbums)
        {
            targetContext.Dataset.length = 0;
            for (let album of artist.Albums)
            {
                registerAlbum(targetContext, album);
            }

            RebuildTable(targetContext.Table, targetContext.Dataset);
            targetContext.toggleTab();
            return;
        }
        else if (targetContext == context.SelectedTracks)
        {
            targetContext.Dataset.length = 0;
            for (let track of artist.Tracks)
            {
                registerTrack(targetContext, track);
            }
            
            RebuildTable(targetContext.Table, targetContext.Dataset);
            targetContext.toggleTab();
            return;
        }
    }
    else if (sourceContext == context.Albums || sourceContext == context.SelectedAlbums)
    {
        let album = LibraryData.Albums[rowID - 1];
        if (targetContext == context.Artists)
        {
            if (jumpToData(targetContext, album.ArtistID, 0) < 0)
            {
                registerArtist(targetContext, album.Artist);
                RebuildTable(targetContext.Table, targetContext.Dataset);
                jumpToData(targetContext, album.ArtistID, 0);
            }
            return;
        }
        else if (targetContext == context.SelectedTracks)
        {
            targetContext.Dataset.length = 0;
            for (let track of album.Tracks)
            {
                registerTrack(targetContext, track);
            }
            
            RebuildTable(targetContext.Table, targetContext.Dataset);
            targetContext.toggleTab();
            return;
        }
        else if (targetContext == context.SelectedAlbums && sourceContext != targetContext)
        {
            targetContext.Dataset.length = 0;
            for (let item of album.Artist.Albums)
            {
                registerAlbum(targetContext, item);
            }
            
            RebuildTable(targetContext.Table, targetContext.Dataset);
            targetContext.toggleTab();
            return;
        }
    }
    else if (sourceContext == context.Tracks || sourceContext == context.SelectedTracks)
    {
        let track = LibraryData.Tracks[rowID - 1];
        if (targetContext == context.Artists)
        {
            jumpToData(targetContext, track.ArtistID, 0);
            return;
        }
        else if (targetContext == context.Albums)
        {
            if (jumpToData(targetContext, track.AlbumID, 0) < 0)
            {
                registerAlbum(targetContext, track.Album);
                RebuildTable(targetContext.Table, targetContext.Dataset);
                jumpToData(targetContext, track.AlbumID, 0);
            }
            return;
        }
        else if (targetContext == context.SelectedAlbums)
        {
            targetContext.Dataset.length = 0;
            for (let album of track.Artist.Albums)
            {
                registerAlbum(targetContext, album);
            }
            
            RebuildTable(targetContext.Table, targetContext.Dataset);
            targetContext.toggleTab();
            return;
        }
        else if (targetContext == context.SelectedTracks)
        {
            targetContext.Dataset.length = 0;
            for (let item of track.Album.Tracks)
            {
                registerTrack(targetContext, item);
            }
            
            RebuildTable(targetContext.Table, targetContext.Dataset);
            targetContext.toggleTab();
            return;
        }
        else if (targetContext == "EXTERNAL_SEARCH")
        {
            const query = LibraryData.CreateSearchKey(track, true);
            const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
            return;
        }
    }

    throw `Switching from ${sourceContext.ID} to ${targetContext.ID} not supported`;
}

function jumpToData(context, data, column) 
{
    var table = context.Table.DataTable();
    var pos = table.column(column, { order: 'current' }).data().indexOf(data);
    if (pos >= 0) 
    {
        var page = Math.floor(pos / table.page.info().length);
        table.page(page).draw(false);
        context.toggleTab();
        return pos;
    }

    return -1;
}