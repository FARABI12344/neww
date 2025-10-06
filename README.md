# Click Simulator

A fun and addictive clicking game built with React and Supabase. Click your way to glory and unlock powerful upgrades!

## Features

- **Click Counter**: Track your clicks with a satisfying button
- **Upgrades**: Increase your click power with upgrades
- **Auto-Clickers**: Purchase auto-clickers for passive income
- **Persistent State**: Your progress is automatically saved to Supabase
- **Responsive Design**: Works great on desktop and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations

## How to Play

1. Click the big button to earn clicks
2. Buy upgrades to increase your clicking power
3. Purchase auto-clickers to generate clicks automatically
4. Watch your clicks grow exponentially!

## Technologies Used

- **React** - Frontend framework
- **Supabase** - Database and backend
- **Tailwind CSS** - Styling
- **React Scripts** - Build tooling

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd click-simulator
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Create a `.env` file in the `frontend` directory:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Database Setup

The game uses Supabase for data persistence. The database schema includes:

- **clicker_game_state** table:
  - `id` - Unique identifier
  - `session_id` - Session identifier for each player
  - `clicks` - Current click count
  - `click_power` - Power of each click
  - `auto_clickers` - Number of auto-clickers
  - `auto_clicker_cost` - Cost of next auto-clicker
  - `power_up_cost` - Cost of next power upgrade
  - `total_clicks` - Total lifetime clicks

## License

MIT

## Contributing

Pull requests are welcome! Feel free to contribute to make this game even better.