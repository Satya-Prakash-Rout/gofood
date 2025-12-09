# Testing the Food Entry System

## Backend Test

1. **Server is running?**
   ```
   Terminal shows: Server listening on port 5000
   MongoDB connected
   ```

2. **Test the API endpoints:**

   **Add Food (with curl or Postman):**
   ```bash
   curl -X POST http://localhost:5000/api/addfood \
     -F "name=Test Dish" \
     -F "category=Breakfast" \
     -F "description=Test Description" \
     -F "price=199" \
     -F "image=@path/to/image.jpg"
   ```

   **Get All Foods:**
   ```bash
   curl http://localhost:5000/api/getfoods
   ```

## Frontend Test

1. Navigate to `http://localhost:3001/addfood`
2. Fill in the form:
   - Food Name: "Paneer Butter Masala"
   - Category: "Lunch"
   - Description: "Creamy paneer in tomato curry"
   - Price: 280
   - Image: Upload a JPG/PNG file
3. Click "Add Food Item"
4. Should see success message and redirect to home

## Expected Results

✅ Form submits without errors
✅ Image uploads to `back-end/uploads/`
✅ Food data saves to global.food_items
✅ No "500" server errors
✅ Success notification appears
✅ Redirects to home page after 1.5 seconds

## If Still Getting Errors

1. Check backend console for specific error messages
2. Open browser DevTools (F12) → Network tab
3. Look at the actual error response from `/api/addfood`
4. Check file upload permissions in `back-end/uploads/` directory
