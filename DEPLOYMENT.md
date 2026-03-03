# 52-Week PM Tracker - Web Application Deployment Guide

## Overview

This is a complete web version of the 52-Week PM Tracker mobile application. It provides the same functionality with a responsive, desktop-friendly interface.

## Features Implemented

### ✓ Core Features
- **Home Dashboard** - Real-time statistics and weekly overview
- **Schedule Management** - Week-based activity scheduling and management
- **Activity Tracking** - Complete activity list with status management
- **Completed Activities** - View and export completed maintenance records
- **Pending Activities** - Monitor pending and overdue tasks
- **Reports & Analytics** - Comprehensive performance metrics and trends
- **About & Contact** - App information and support details

### ✓ Technical Features
- Responsive design (desktop, tablet, mobile)
- Real-time API integration
- State management with React Context
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React icons
- Activity filtering and sorting
- Data export functionality (CSV)

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx       # Main navigation bar
│   └── ActivityList.tsx     # Reusable activity list component
├── context/
│   └── AppContext.tsx       # Global app state management
├── lib/
│   ├── api.ts              # API client configuration
│   ├── activity-service.ts # Activity API service
│   └── date-utils.ts       # Date utility functions
├── pages/
│   ├── Home.tsx            # Dashboard
│   ├── Schedule.tsx        # Schedule management
│   ├── Completed.tsx       # Completed activities
│   ├── Pending.tsx         # Pending activities
│   ├── Reports.tsx         # Analytics dashboard
│   └── Info.tsx            # About & contact
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm/pnpm
- Backend API server running on `http://localhost:3000`

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Update API URL if needed
# Edit .env.local and set VITE_API_URL to your backend API

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## API Integration

The web app connects to the backend API. Ensure these endpoints are available:

### Activity Endpoints
- `GET /api/activities` - List all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `POST /api/activities/:id/complete` - Mark as completed
- `GET /api/activities/week` - Get activities for specific week
- `GET /api/activities/completed` - Get completed activities
- `GET /api/activities/pending` - Get pending activities
- `GET /api/activities/overdue` - Get overdue activities
- `GET /api/activities/export` - Export activities (CSV/PDF)

### Statistics Endpoints
- `GET /api/stats/weekly` - Get weekly statistics
- `GET /api/stats/monthly` - Get monthly statistics

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Server

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to your web server**

3. **Configure web server for SPA routing:**
   - All routes should serve `index.html`
   - This allows React Router to handle navigation

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/52-week-pm-tracker-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Environment Variables for Production

Create `.env.production` or set environment variables:

```env
VITE_API_URL=https://api.your-domain.com
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance Optimization

- **Code Splitting**: Routes are lazy-loaded
- **CSS Optimization**: Tailwind CSS purges unused styles
- **Image Optimization**: Icons are SVG-based
- **Caching**: Static assets have long cache headers

## Troubleshooting

### API Connection Issues
- Ensure backend server is running on the correct port
- Check CORS settings on backend
- Verify API_URL environment variable

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check Node.js version: `node --version` (should be 16+)

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` for correct content paths
- Run `npm run build` to rebuild CSS

## Features Roadmap

- [ ] User authentication
- [ ] Role-based access control
- [ ] Advanced filtering and search
- [ ] Calendar view with drag-and-drop
- [ ] Notifications and alerts
- [ ] Mobile app sync
- [ ] Offline mode
- [ ] Multi-language support

## Support

For issues or questions:
- Email: support@52weekpmtracker.com
- Phone: +1 (555) 123-4567
- Website: www.52weekpmtracker.com

## License

Proprietary - 52-Week PM Tracker
