# 🐛 Upload Debugging Guide

## What Was Fixed

1. **Middleware Order** - Simplified upload handling with proper error middleware
2. **Better Error Messages** - Console logging to track upload status
3. **File Validation** - Improved MIME type checking
4. **Error Recovery** - Automatic cleanup of failed uploads

## How to Test Upload

### Step 1: Open Browser DevTools
- Press `F12` in your browser
- Go to **Network** tab

### Step 2: Go to Add Food Page
- URL: `http://localhost:3001/addfood`

### Step 3: Fill Form and Submit
1. Food Name: "Test Dish"
2. Category: "Breakfast"  
3. Description: "Test"
4. Price: "199"
5. **Upload an image file** (JPG, PNG, GIF)
6. Click "Add Food Item"

### Step 4: Check Results

**In Browser DevTools (Network Tab):**
- Look for POST request to `/api/addfood`
- Should show **200 or 201** status
- Response should show: `"success": true`

**In Backend Console:**
- Should see: `Received form data: { name, category, description, price }`
- Should see: `File received: food-XXXX.jpg`
- Should see: `Food added successfully:`

**In File System:**
- Check: `back-end/uploads/` folder
- Should have a file like `food-1702053000000.jpg`

## Common Issues & Solutions

### Issue: Network shows 400 error
**Solution:** 
- Ensure all required fields are filled
- Check file is an image
- Check file size < 5MB

### Issue: No file in uploads folder
**Check:**
- File validation passed in browser?
- Backend console shows "File received"?
- Do you have write permissions to uploads folder?

### Issue: Network shows 500 error
**Check Backend Console:**
- It will show the exact error message
- Common: File system permissions or path issues

## Quick Test Without Browser

Open terminal and run:
```bash
curl -X POST http://localhost:5000/api/addfood \
  -F "name=Test" \
  -F "category=Breakfast" \
  -F "description=Test" \
  -F "price=100" \
  -F "image=@C:\path\to\image.jpg"
```

Should return:
```json
{
  "success": true,
  "message": "Food item added successfully",
  "food": { ... }
}
```

## Backend is Running?

Terminal should show:
```
Server listening on port 5000
MongoDB connected
```

If you see these messages, upload should work! 🚀
