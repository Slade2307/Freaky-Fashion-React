function toggleHeartIcon(element) {
    const img = element.querySelector('img');  // Get the image inside the clicked element
    if (img.src.includes('heart.png')) {
        img.src = 'images/heart2.png';  // If it's heart.png, change to heart2.png
    } else {
        img.src = 'images/heart.png';  // If it's heart2.png, change back to heart.png
    }
}
