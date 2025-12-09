# Food Data Entry System - Setup Guide

## Features
✅ Add food items with image uploads
✅ Images stored locally on server
✅ Food data stored in MongoDB
✅ Images displayed on the website
✅ Delete food items
✅ Category management

## Backend Setup

### 1. Install Required Packages
The following packages have been installed:
- `multer` - For handling file uploads
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `cors` - Cross-origin requests

### 2. Database Model
A new `Food` model has been created at `back-end/models/Food.js` with the following fields:
- `name` - Food item name (required)
- `category` - Food category (required)
- `description` - Food description (optional)
- `price` - Food price in ₹ (required)
- `imageUrl` - Path to uploaded image
- `imageId` - For future Google Drive integration
- `createdAt` - Timestamp

### 3. API Endpoints

#### Add Food Item
**POST** `/api/addfood`
- Form data with file upload
- Fields: name, category, description, price, image (file)
- Returns: Food object with saved details

#### Get All Food Items
**GET** `/api/getfoods`
- Returns: Array of all food items sorted by creation date

#### Delete Food Item
**DELETE** `/api/deletefood/:id`
- Parameters: id (MongoDB ID)
- Returns: Success message

### 4. Image Storage
- Images are stored in `back-end/uploads/` directory
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF
- Images are accessible via: `http://localhost:5000/uploads/filename`

## Frontend Setup

### Add Food Page
Located at `src/screens/AddFood.jsx`

Features:
- Form with all required fields
- Image file upload with preview
- Form validation
- Loading states
- Success/error notifications

### How to Use
1. Navigate to `http://localhost:3001/addfood`
2. Fill in the food details:
   - Food Name (required)
   - Category (required)
   - Description (optional)
   - Price (required)
   - Image upload (optional)
3. Click "Add Food Item"
4. Image preview displays before submission
5. On success, redirects to home page

## Running the Application

### Start Backend
```bash
cd back-end
node index.js
```
Server runs on: `http://localhost:5000`

### Start Frontend
```bash
npm start
```
App runs on: `http://localhost:3001` (or 3000 if available)

## Future Enhancements - Google Drive Integration

To implement Google Drive image uploads instead of local storage:

1. Create a Google Cloud project
2. Enable Google Drive API
3. Create a service account with credentials
4. Add `googleapis` package: `npm install googleapis`
5. Create a separate Google Drive upload utility
6. Update the AddFood route to use Google Drive API

The code structure is already prepared for this enhancement.

## File Structure
```
back-end/
├── Routes/
│   └── AddFood.js (Updated with multer)
├── models/
│   ├── Food.js (New)
│   └── ...
├── uploads/ (New - stores images)
├── index.js (Updated for static file serving)
└── ...

src/
├── screens/
│   └── AddFood.jsx (Updated with file upload)
├── CSS/
│   └── AddFood.css (Updated with image preview styles)
└── ...
```

## Troubleshooting

### Images not showing
- Check if `back-end/uploads/` directory exists
- Verify backend is running on port 5000
- Check browser console for network errors

### MongoDB connection issues
- Verify connection string in `db.js`
- Check internet connection
- Whitelist your IP in MongoDB Atlas

### File upload failing
- Check file size (max 5MB)
- Verify file is an image
- Check backend console for errors
