const getTracks = async () => {
    const response = await fetch('/api/users/tracks?count=20');
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

const getCurrentTrack = async () => {
    const response = await fetch('/api/now-playing');

    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

const getUserPlayCount = async () => {
    const response = await fetch('/api/users/playcount');
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

$(document).ready(async () => {
    const recentTracksContainer = $('#recent-tracks ul');

    const currentTrackData = await getCurrentTrack();
    if (currentTrackData) {
        const currTrack = $(`
                        <li class="currently-listening">
                            <span class="track-name">${currentTrackData.trackName}</span>
                            <span class="artist-name">${currentTrackData.artists.map(a => a.artistName).join(', ')}</span>
                            <span>Currently listening</span>
                        </li>
        `);

        recentTracksContainer.append(currTrack);
    }

    const recentTracks = await getTracks();
    recentTracks.forEach(t => {
        const trackItem = $(
            `<li class="track-item" data-spotify-id="${t.spotifyId}">
                <div class="recent-left">
                    <div class="recent-left-top">
                        <div class="tooltip">
                            <button class="play-btn"><img src="/assets/icons/spotify-icon.png" alt=""></button>
                            <span class="tooltiptext">Open in Spotify</span>
                        </div>
                        <span class="track-name">${t.trackName}</span>
                    </div>
                    <div class="recent-left-bottom">
                        <span class="artist-name">${t.artists.map(a => a.artistName).join(', ')}</span>
                    </div>
                </div>
                <div class="recent-right">
                    <img class="track-icon" src="${t.imageUrl}" alt="Track Image">
                    <p id="played-at">${t.spotifyId === currentTrackData.spotifyId ? "Now playing" : moment(t.playedAt).fromNow()}</p>
                </div>
            </li>`
        );

        recentTracksContainer.append(trackItem);
    });


    const playCountData = await getUserPlayCount();
    const $topsection = $('#top-section');

    $topsection.append([
            $('<p>').text(`Listens today: ${playCountData.day}`),
            $('<p>').text(`Listens past week: ${playCountData.week}`),
            $('<p>').text(`Listens past month: ${playCountData.month}`)
        ]
    );


    $('#recent-tracks').on('click', 'li.track-item .play-btn', function (event) {
        event.stopPropagation();
        const spotifyId = $(this).closest('li').data('spotify-id');
        window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
    });
});