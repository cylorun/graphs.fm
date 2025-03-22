const ID = window.location.pathname.split("/")[2]; // user urls are /u/{id} or /user/{id}


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

const getUserData = async () => {
    const response = await fetch(`/api/users/${ID}`);
    return response.json();
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

    $('#recent-tracks').on('click', 'li.track-item .play-btn', function (event) {
        event.stopPropagation();
        const spotifyId = $(this).closest('li').data('spotify-id');
        window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
    });
}

const createGraphDataSection = async () => {
    const $statssection = $('#stats-intro');
}

const createTopSection = async () => {
    const $topsection = $('#top-section');

    const userData = await getUserData();
    if (!userData) {
        throw new Error(response.statusText);
    }

    $('#user-info-name').text(userData.displayName);
    $('#user-info-joined').text("Joined " + new Date(userData.createdAt).toLocaleString())
    $('#user-info-followers').text(userData.followers || 0 + " followers");
    $('#profile-div-pfp').attr('src', userData.profileImage);

}

// section being overview | reports | top | following
const getCurrentSection = () => {
    return window.location.pathname.split("/")[3] || "overview"; // cause overview is the default
}

$(document).ready(async () => {
    if (!(await userExists())) {
        $(document.body).append(
            $("<h1>").text("User not found")
        )
        return;
    }

    switch (getCurrentSection()) {
        case 'overview': {
            await createTopSection();
            await createRecentTracksSection();
            await createGraphDataSection();
        }
    }
});