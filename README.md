# ISS Tracker & Space Dashboard

A real-time International Space Station (ISS) tracking application built with React and Plotly.js. This interactive dashboard allows users to visualize the current position of the ISS on both a 3D globe and flat map projection.

## Features

- Real-time ISS position tracking using the Open Notify API
- Interactive 3D globe visualization with Plotly.js
- Toggle between 3D globe and flat map views
- Current ISS coordinates display
- Smooth animations and transitions
- Responsive design for all screen sizes

## Technologies Used

- React
- Plotly.js
- Open Notify API
- Tailwind CSS
- Vite

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Captcurt09/space-tracker.git
cd space-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
space-tracker/
├── src/
│   ├── components/
│   │   └── SpaceTracker.jsx    # Main ISS tracking component
│   ├── App.jsx                 # Application entry point
│   └── index.css              # Global styles
├── public/
│   └── images/                # Project images
├── package.json
└── README.md
```

## API Reference

This project uses the [Open Notify API](http://api.open-notify.org/) to fetch real-time ISS position data:
- Endpoint: `http://api.open-notify.org/iss-now.json`
- Update frequency: Every 5 seconds
- Data format: JSON with latitude and longitude coordinates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Open Notify API](http://api.open-notify.org/) for providing ISS position data
- [Plotly.js](https://plotly.com/javascript/) for the interactive visualization
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling 