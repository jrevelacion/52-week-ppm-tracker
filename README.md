# 52-Week PM Tracker - Web Application

A responsive web application for managing preventive maintenance activities across a 52-week period.

## Features

- **Home Dashboard**: Overview of current week statistics and completion rates
- **Schedule Management**: Calendar-based PM scheduling
- **Activity Tracking**: Monitor completed and pending maintenance activities
- **Analytics & Reports**: Comprehensive reporting and performance metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile browsers
- **Real-time Updates**: Live synchronization with backend API

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx    # Main navigation bar
├── context/             # React Context for state management
│   └── AppContext.tsx    # Global app state
├── lib/                 # Utility functions
│   └── api.ts          # API client configuration
├── pages/              # Page components
│   ├── Home.tsx        # Dashboard
│   ├── Schedule.tsx    # Scheduling view
│   ├── Completed.tsx   # Completed activities
│   ├── Pending.tsx     # Pending activities
│   ├── Reports.tsx     # Analytics
│   └── Info.tsx        # About & Contact
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

## API Integration

The app connects to the backend API at `http://localhost:3000/api`. Ensure the backend server is running before starting the web app.

### Available Endpoints

- `GET /stats/weekly` - Get weekly statistics
- `GET /activities` - List all activities
- `POST /activities` - Create new activity
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity

## Features Implementation Status

- [x] Navigation and routing
- [x] Home dashboard layout
- [x] Context-based state management
- [ ] Activity list with filtering
- [ ] Calendar view
- [ ] Real-time statistics
- [ ] Reporting dashboard
- [ ] User authentication
- [ ] Data export functionality

## Styling

The app uses Tailwind CSS with a custom color scheme:

- **Primary**: `#0a7ea4` (Blue)
- **Success**: `#22c55e` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## License

Proprietary - 52-Week PM Tracker

## Support

For issues or questions, contact: support@52weekpmtracker.com
