# 🚀 Quick Start Guide

## What You Can Do Now

### Add Food Items with Images
Visit: `http://localhost:3001/addfood`

**Form Fields:**
- 🍽️ Food Name - Name of the dish
- 🏷️ Category - Type of food (Breakfast, Lunch, etc.)
- 📝 Description - Details about the dish
- 💰 Price - Cost in rupees (₹)
- 🖼️ Image - Upload food photo (JPG, PNG, GIF - Max 5MB)

### What Happens After You Add
1. Image uploads to: `back-end/uploads/`
2. Data saves to: MongoDB database
3. You see a success message
4. Automatic redirect to home page

## Backend Endpoints

### Add Food Item
```
POST http://localhost:5000/api/addfood
Content-Type: multipart/form-data

Form Data:
- name: string (required)
- category: string (required)
- description: string (optional)
- price: number (required)
- image: file (optional)

Response:
{
  success: true,
  message: "Food item added successfully",
  food: { ... food object ... }
}
```

### Get All Food Items
```
GET http://localhost:5000/api/getfoods

Response:
{
  success: true,
  foods: [ ... array of food items ... ]
}
```

### Delete Food Item
```
DELETE http://localhost:5000/api/deletefood/:id

Response:
{
  success: true,
  message: "Food item deleted successfully"
}
```

## Directory Structure

**Uploads Location**: `my-app/back-end/uploads/`
- Example: `food-1702053000000.jpg`
- Access via: `http://localhost:5000/uploads/food-1702053000000.jpg`

## Database Schema

**Food Collection Fields:**
```javascript
{
  _id: ObjectId,
  name: String,           // "Butter Chicken"
  category: String,       // "Main Course"
  description: String,    // "Creamy tomato-based curry"
  price: Number,          // 350
  imageUrl: String,       // "/uploads/food-xxx.jpg"
  createdAt: Date         // 2024-12-07T...
}
```

## Common Issues & Solutions

### Issue: Image doesn't upload
**Check:**
- File size is less than 5MB
- File is an image (JPG, PNG, GIF)
- Backend is running on port 5000

### Issue: Page shows 404
**Check:**
- Frontend is running on port 3001
- Backend is running on port 5000
- MongoDB is connected

### Issue: Images not showing
**Check:**
- `back-end/uploads/` directory exists
- Backend is serving static files
- Image filename in database is correct

## Example Food Items Added

When you add an item like:
```
Name: Paneer Butter Masala
Category: Main Course
Description: Soft paneer in creamy tomato curry
Price: 280
Image: (upload file)
```

It gets saved as:
```
MongoDB:
{
  name: "Paneer Butter Masala",
  category: "Main Course",
  description: "Soft paneer in creamy tomato curry",
  price: 280,
  imageUrl: "/uploads/food-1702053000000.jpg",
  createdAt: 2024-12-07T...
}

File System:
back-end/uploads/food-1702053000000.jpg
```

## Need Help?

1. **Check Backend Terminal** - Look for error messages
2. **Check Browser Console** - Press F12, look at Console & Network tabs
3. **Check File Upload** - Verify image uploads to `back-end/uploads/`
4. **Check Database** - Login to MongoDB Atlas to see data

All systems ready! 🎉
