# Dhaka Bus Navigator 🚌

A modern web application for navigating bus routes in Dhaka, Bangladesh. Built with React, Vite, and Supabase.

## 🚀 Features

- **Smart Route Planning** - Find the best bus routes with minimal transfers
- **Real-time Information** - Get accurate fare estimates and journey times  
- **Interactive Maps** - Visual route planning with Leaflet maps
- **Multi-language Support** - English and Bangla interface
- **Community Feedback** - Submit route updates and feedback
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Maps**: Leaflet.js with OpenStreetMap
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel/Netlify ready

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dhaka-bus-navigator.git
   cd dhaka-bus-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Create these tables in your Supabase database:
   
   ```sql
   -- Stops table
   CREATE TABLE public.stops (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     lat double precision,
     lng double precision,
     nearby_landmarks text[] DEFAULT '{}',
     created_at timestamptz DEFAULT now()
   );
   
   -- Routes table  
   CREATE TABLE public.routes (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     stops text[] NOT NULL,
     color text,
     route_polyline jsonb,
     frequency text
   );
   
   -- Fares table
   CREATE TABLE public.fares (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     route_id uuid REFERENCES public.routes(id) ON DELETE CASCADE,
     start_stop_id text NOT NULL,
     end_stop_id text NOT NULL,
     fare_value numeric NOT NULL,
     estimated_flag boolean DEFAULT false
   );
   
   -- User feedback table
   CREATE TABLE public.user_feedback (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     feedback_type text,
     stop_id text,
     route_id uuid,
     description text NOT NULL,
     contact_email text,
     status text DEFAULT 'pending',
     created_at timestamptz DEFAULT now()
   );
   
   -- Favorites table
   CREATE TABLE public.favorites (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid,
     from_stop_id text NOT NULL,
     to_stop_id text NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all Supabase tables
- **Input validation** and sanitization on all user inputs
- **Content Security Policy** headers for XSS protection
- **Environment variables** for sensitive data
- **No hardcoded secrets** in the codebase

## 📱 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify  
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenStreetMap contributors for map data
- Supabase for backend services
- React and Vite teams for the amazing tools

---

**⚠️ Security Notice**: Never commit `.env.local` files or expose API keys. Always use environment variables for sensitive data.