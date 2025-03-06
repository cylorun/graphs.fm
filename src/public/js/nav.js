const useMobileLayout = () => window.screen.width < 700;

$(document).ready(() => {

    const loadNavPfp = () => {
        const $profileLink = $('#profile-link');

        const $img = $('<img>').attr({
            src: 'http://localhost:5004/assets/logo.png',
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
            // $('<li>').append($('.dropdown-btn')).appendTo('#right-side');
            // $('.dropdown').on('mouseenter', (e) => {
            //     console.log('enter')
            //     $('.dropdown-content').css("display", "flex");
            // }).on('mouseleave', (e) => {
            //     console.log('leeave')
            //     $('.dropdown-content').css("display", "none");
            // });
        }
    }

    loadNavPfp();
});