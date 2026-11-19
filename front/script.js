const countryElement = document.querySelector('.country');

function countryCodeToFlag(countryCode) {
    return countryCode
        .toUpperCase()
        .split('')
        .map((character) => String.fromCodePoint(character.charCodeAt(0) + 127397))
        .join('');
}

async function loadCountryFromLoginLocation() {
    if (!countryElement) {
        return;
    }

    try {
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error(`Location service returned ${response.status}`);
        }

        const location = await response.json();
        const countryCode = location.country_code;
        const countryName = location.country_name;

        if (!/^[A-Za-z]{2}$/.test(countryCode) || !countryName) {
            throw new Error('Location service returned an invalid country');
        }

        countryElement.textContent = `${countryCodeToFlag(countryCode)} ${countryName}`;
        countryElement.setAttribute('aria-label', `Country: ${countryName}`);
    } catch (error) {
        countryElement.textContent = 'Global';
        countryElement.setAttribute('aria-label', 'Global');
        console.error('Unable to determine the login location:', error);
    }
}
loadCountryFromLoginLocation();

window.onload = async function () {
    const response = await fetch('http://localhost:3000/api/board');
    if (response.ok) {
        const pixelData = await response.json();
        console.log(pixelData);
        const board = document.getElementById('board');
        const BOARD_SIZE = pixelData.size;
        let pixels = BOARD_SIZE * BOARD_SIZE;
        let i = 0;
        while (i < pixels) {
            const pixel = document.createElement('button');
            pixel.className = 'pixel pixel-off';
            pixel.id = `pixel-${i}`;
            let x = i % BOARD_SIZE;
            let y = Math.floor(i / BOARD_SIZE);
            const pixelInfo = pixelData.pixels.find(p => p.x === x && p.y === y);
            pixel.setAttribute('data-y', y);
            pixel.setAttribute('data-x', x);
            if (pixelInfo) {
                pixel.style.backgroundColor = pixelInfo.color;
            }
            board.appendChild(pixel);
            i++;
        }
        // const pixels = pixelData.pixels;
    } 
    // const BOARD_SIZE = 32;
    // const board = document.getElementById('board');
    // // Create the board
    // let pixels = BOARD_SIZE * BOARD_SIZE;
    // let i = 0;
    // while (i < pixels) {
    //     const pixel = document.createElement('button');
    //     pixel.className = 'pixel pixel-off';
    //     pixel.id = `pixel-${i}`;
    //     pixel.setAttribute('data-y', `${Math.floor(i / BOARD_SIZE)}`);
    //     pixel.setAttribute('data-x', `${i % BOARD_SIZE}`);
    //     board.appendChild(pixel);
    //     i++;
    // }
}
let selectedColor = null;
const colorButtons = document.querySelectorAll('.color-button');
colorButtons.forEach((btn) => {
    btn.classList.remove('selected');
    btn.style.backgroundColor = btn.getAttribute('data-color');
});

function selectColor(button) {
    colorButtons.forEach((btn) => {
        btn.classList.remove('selected');
        btn.style.backgroundColor = btn.getAttribute('data-color');
    });
    button.classList.add('selected');
    let color = button.getAttribute('data-color');
    selectedColor = color;
    console.log(color);    
}

document.addEventListener('click', async function (event) {
    if (event.target.classList.contains('pixel')) {
        if(selectedColor) {
            event.target.style.backgroundColor = selectedColor;
            console.log(event.target.getAttribute('data-x'), event.target.getAttribute('data-y'), selectedColor);
            const pixelData = {
                x: parseInt(event.target.getAttribute('data-x')),
                y: parseInt(event.target.getAttribute('data-y')),
                color: selectedColor
            };
            const response = await fetch('http://localhost:3000/api/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pixelData)
            });
            if (!response.ok) {
                console.error('Failed to save pixel data:', response.statusText);
            }
        }
    }
});