


$(document).ready(async () => {
    const url = new URL(window.location.href);
    const id = url.pathname.split("/").pop();

    const res = await fetch(`/api/artists/${id}`);

    const $main = $('main');
    $main.empty();

    if (res.status === 404) {
        $main.append(
            $('h2').text("Artist not found."),
        );
        return;
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch data`);
    }


    const data = await res.json();


    $main.append(
        [
            $('<img>').attr('src', data.imageUrl),
            $('<p>').text(data.artistName),
            $('<p>').text(`Top genres: ${data.genres.map(g => g.genreName).join(', ')}`),
        ]
    )
});
