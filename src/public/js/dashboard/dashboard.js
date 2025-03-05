$(document).ready(() => {
    $('#recent-tracks').find('li.track-item .play-btn').on('click', function(event) {
        event.stopPropagation();

        const spotifyId = $(this).closest('li').data('spotify-id');

        window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
    });
});
