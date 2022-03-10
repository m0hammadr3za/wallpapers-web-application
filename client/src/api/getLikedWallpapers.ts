async function getLikedWallpapers(page: number, limit: number) {
    const url = `/api/likes?page=${page}&limit=${limit}`;

    const res = await fetch(url);
    const wallpapers = await res.json();

    console.log(wallpapers);

    return wallpapers;
}

export default getLikedWallpapers;
