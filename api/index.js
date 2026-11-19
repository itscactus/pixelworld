const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const pixelData = {
    size: 32,
    pixels: []
}
app.get('/api/board', (req, res) => {
    res.json(pixelData);
});

app.post('/api/board', (req, res) => {
    updatePixelData(req.body);
    res.status(201).json({ message: 'Pixel data saved successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

function updatePixelData(data) {
    const { x, y, color } = data;
    const existingPixelIndex = pixelData.pixels.findIndex(p => p.x === x && p.y === y);
    if (existingPixelIndex !== -1) {
        pixelData.pixels[existingPixelIndex].color = color;
    } else {
        pixelData.pixels.push({ x, y, color });
    }
}