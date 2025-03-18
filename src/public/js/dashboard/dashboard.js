const ID = window.location.pathname.split("/").pop();


// returns null if error or user not exist
const getTracks = async () => {
    const response = await fetch(`/api/users/${ID}/tracks?count=20`);
    if (!response.ok) {
        return null;
    }

    return await response.json();
}

const getCurrentTrack = async () => {
    const response = await fetch(`/api/users/${ID}/now-playing`);

    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        return null;
    }

    return await response.json();
}

const getUserPlayCount = async () => {
    const response = await fetch(`/api/users/${ID}/playcount`);
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

const userExists = async () => {
    const response = await fetch(`/api/users/${ID}/pfp`);
    return response.status !== 404;
}


const createRecentTracksSection = async () => {
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
                        <a href="/t/${t.id}" target="_blank" class="track-name">${t.trackName}</a>
                    </div>
                    <div class="recent-left-bottom">
                        <a href="/a/${t.artists[0].id}" target="_blank" class="artist-name">${t.artists.map(a => a.artistName).join(', ')}</a>
                    </div>
                </div>
                <div class="recent-right">
                    <img class="track-icon" src="${t.imageUrl}" alt="Track Image">
                    <p class="played-at">${t.spotifyId === currentTrackData?.spotifyId ? "Now playing" : moment(t.playedAt).fromNow()}</p>
                </div>
            </li>`
        );

        recentTracksContainer.append(trackItem);
    });
    const $topsection = $('#top-section');
    $topsection.append(
        $('<h1>').text('user smthh')
    )

    $('#recent-tracks').on('click', 'li.track-item .play-btn', function (event) {
        event.stopPropagation();
        const spotifyId = $(this).closest('li').data('spotify-id');
        window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
    });
}

const createGraphDataSection = async () => {
    const playCountData = await getUserPlayCount();
    const $statssection = $('#stats-intro');
    const $bubblesection = $statssection.append('<div id="bubbles-section"">');
    $bubblesection.append([
            $('<p>').text(`Listens today: ${playCountData.day}`),
            $('<p>').text(`Listens past week: ${playCountData.week}`),
            $('<p>').text(`Listens past month: ${playCountData.month}`)
        ]
    );
}

$(document).ready(async () => {
    if (!(await userExists())) {
        $(document.body).append(
            $("<h1>").text("User not found")
        )
        return;
    }

    await createRecentTracksSection();
    await createGraphDataSection();
});