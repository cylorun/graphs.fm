const useMobileLayout = () => window.screen.width < 700;

$(document).ready(() => {
    const fetchUser = async () => {
        return (await fetch('/api/users')).json();
    }

    const loadNavPfp = async () => {
        const $profileLink = $('#profile-link');

        const $img = $('<img>').attr({
            src: '/assets/blank.png',
            alt: "you"
        });

        if (useMobileLayout()) {
            $profileLink.replaceWith($img);
            $('.dropdown-btn').on('click', (e) => {
                $('.dropdown-content').css("display", "flex");
            });
            $(document).on('click', (e) => {
                if (!$(e.target).closest('.dropdown').length) {
                    $('.dropdown-content').css('display', 'none');
                }
            });
        } else {
            $profileLink.append($img);
        }

        const userData = await fetchUser();
        $img.attr('src', userData.profileImage);
    }

    loadNavPfp();
});