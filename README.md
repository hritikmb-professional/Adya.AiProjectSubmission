# SmartRecruit - AI-Powered Recruitment Platform

An intelligent recruitment platform that uses AI to automatically parse resumes, match candidates with job requirements, and provide detailed analysis.

##  Features

- **AI Resume Parsing**: Automatically extracts information from PDF/DOCX resumes
- **Smart Matching**: Uses Google Gemini AI to match candidates with job requirements
- **Candidate Comparison**: Side-by-side comparison of multiple candidates
- **Status Management**: Track candidate progress (shortlisted, hired, rejected)
- **Secure Authentication**: JWT-based user authentication
- **Real-time Analysis**: Instant AI-powered candidate evaluation

##  Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Google Gemini AI for resume analysis

### AI Tools Used
- **Google Gemini AI**: Resume parsing and candidate-job matching
- **Natural Language Processing**: Text analysis and scoring algorithms
- **PDF Parser**: Extract text from PDF resumes
- **Mammoth.js**: Parse DOCX documents

##  Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key
- Git

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hritikmb-professional/Adya.AiProjectSubmission.git
cd Adya.AiProjectSubmission
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: Any secure random string
# - GEMINI_API_KEY: Your Google Gemini API key

# Build TypeScript
npm run build

# Start server
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update API URL in src/api/axios.ts
# Change baseURL to your backend URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Get Required API Keys

#### MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free tier (M0)
3. Create a cluster
4. Add database user (username/password)
5. Whitelist IP: 0.0.0.0/0 (for development)
6. Get connection string from "Connect" → "Connect your application"

#### Google Gemini AI
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

##  Deployment Steps

### Backend Deployment (Render)

1. **Create Account**: Sign up at https://render.com

2. **New Web Service**:
   - Connect GitHub repository
   - Name: `smartrecruit-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance: Free

3. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartrecruit
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Deploy**: Click "Create Web Service"

### Frontend Deployment (Vercel)

1. **Create Account**: Sign up at https://vercel.com

2. **Import Project**:
   - Connect GitHub repository
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Update API URL**:
   - In `frontend/src/api/axios.ts`
   - Change `baseURL` to your Render backend URL
   - Commit and push changes

4. **Deploy**: Vercel auto-deploys on push

##  Usage

### Sign Up / Login
1. Navigate to the app
2. Create a new account or login
3. Access the dashboard

### Create Job Posting
1. Click "Create Job"
2. Enter job title and description
3. Submit to create posting

### Upload Resumes
1. Click on a job card
2. Upload PDF or DOCX resume
3. AI automatically parses and scores candidate
4. View detailed analysis

### Manage Candidates
1. View all candidates for a job
2. Click candidate to see full details
3. Update status (shortlisted/hired/rejected)
4. Compare multiple candidates side-by-side

##  Testing

### Manual Testing Checklist
- ✅ User registration and login
- ✅ Job creation and listing
- ✅ Resume upload (PDF and DOCX)
- ✅ AI parsing accuracy
- ✅ Candidate scoring
- ✅ Status updates
- ✅ Candidate comparison
- ✅ Authentication persistence

### API Endpoints

**Authentication**
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - User login

**Jobs**
- GET `/api/jobs` - List all jobs
- POST `/api/jobs` - Create new job
- GET `/api/jobs/:id` - Get job details

**Candidates**
- GET `/api/candidates/job/:jobId` - List candidates for job
- GET `/api/candidates/:id` - Get candidate details
- PATCH `/api/candidates/:id/status` - Update status

**Resumes**
- POST `/api/resumes/upload` - Upload and parse resume

##  Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- Input validation
- Secure file upload handling

##  AI Implementation Details

### Resume Parsing
1. Extract text from PDF/DOCX using specialized parsers
2. Send to Gemini AI with structured prompt
3. AI extracts: name, email, phone, skills, experience, education
4. Return structured JSON data

### Candidate Scoring
1. Compare candidate skills with job requirements
2. Analyze experience relevance
3. Education alignment check
4. Generate overall match score (0-100)
5. Provide detailed reasoning

### Skills Matching
- Keyword extraction from resume
- Semantic matching with job description
- Skill categorization (technical, soft skills)
- Experience level assessment

##  Troubleshooting

**Backend won't start**
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 5000 is available

**Frontend can't connect**
- Verify backend URL in `axios.ts`
- Check CORS settings in backend
- Ensure backend is running

**Resume upload fails**
- Check file size (max 5MB)
- Verify file format (PDF or DOCX only)
- Check Gemini API key is valid

**MongoDB connection issues**
- Verify IP whitelist in MongoDB Atlas
- Check username/password in connection string
- Ensure cluster is active

##  Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (AI)
│   │   ├── middleware/       # Auth middleware
│   │   └── server.ts         # Entry point
│   ├── uploads/              # Temporary resume storage
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route protection
│   │   └── App.tsx           # Main app
│   └── package.json
│
└── README.md
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is licensed under the MIT License.

##  Author

**Hritik MB**
- GitHub: [@hritikmb-professional](https://github.com/hritikmb-professional)

##  Acknowledgments

- Google Gemini AI for intelligent resume parsing
- MongoDB Atlas for database hosting
- Render for backend hosting
- Vercel for frontend hosting
