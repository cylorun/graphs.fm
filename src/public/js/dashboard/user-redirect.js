function userRedirect(section) {
    let path = window.location.pathname;

    // user path
    let userBase = path.split('/').slice(0, 3).join('/');

    let newUrl = `${userBase}/${section}`;

    if (section === "overview" || section === "") {
        newUrl = userBase;
    }

    // redirect
    window.location.href = newUrl;
}
