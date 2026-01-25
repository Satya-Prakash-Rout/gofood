# GoFood - Food Delivery Application

> A full-stack food delivery platform with admin dashboard, real-time updates, and location tracking.

**Status**: ✅ Production Ready

---

## 🚀 Quick Start (5 Minutes)

### Install & Run
```bash
# Backend
cd back-end
npm install
cp .env.example .env
npm run dev

# Frontend (in another terminal)
cd my-app
npm install
cp .env.example .env.local
npm start
```

Visit: `http://localhost:3000`

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router, Bootstrap, Material-UI, Leaflet Maps |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB |
| **Authentication** | JWT |
| **Security** | bcrypt, Rate Limiting, Input Validation, CORS |

---

## 🌐 Deployment URLs

> Update these after deployment:

- **Frontend**: [Add your frontend URL here]
- **Backend API**: [Add your backend URL here]
- **Admin Dashboard**: [Add your admin URL here]

---

## 📁 Project Structure

```
GoFood/
├── back-end/
│   ├── middleware/
│   │   ├── validation.js       # Input validation
│   │   ├── errorHandler.js     # Error handling & logging
│   │   └── security.js         # Security & rate limiting
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── Orders.js
│   │   └── Admin.js
│   ├── Routes/
│   │   ├── CreateUser.js
│   │   ├── LoginUser.js
│   │   ├── DisplayData.js
│   │   ├── OrderData.js
│   │   ├── AddFood.js
│   │   ├── AdminAuth.js
│   │   └── AdminOrders.js
│   ├── logs/
│   ├── uploads/
│   ├── .env                    # Development config
│   ├── .env.example
│   ├── .env.production         # Production config
│   ├── package.json
│   ├── index.js
│   └── db.js
└── my-app/
    ├── src/
    │   ├── screens/
    │   ├── components/
    │   └── CSS/
    ├── public/
    ├── .env.example
    ├── .env.local
    └── package.json
```

---

## ⚙️ Environment Variables

### Backend (.env)

**Development:**
```env
MONGODB_URI=mongodb://localhost:27017/gofood
NODE_ENV=development
PORT=5000
HOST=localhost
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
ADMIN_SECRET=your_admin_secret_here
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

**Production:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gofood
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
JWT_SECRET=your_strong_secret_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=https://yourdomain.com
ADMIN_SECRET=your_strong_admin_secret_min_32_chars
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 📚 API Endpoints

### User Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/createuser` | ❌ | Register user |
| POST | `/api/loginuser` | ❌ | Login user |
| GET | `/api/getuser` | ✅ | Get user data |

### Food Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/foodData` | ❌ | Get all food items |
| POST | `/api/addfood` | ✅ Admin | Add food item |
| DELETE | `/api/deletefood/:id` | ✅ Admin | Delete food item |

### Order Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orderData` | ✅ User | Place order |
| POST | `/api/myOrderData` | ✅ User | Get user orders |

### Admin Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/register` | ❌ | Register admin |
| POST | `/api/admin/login` | ❌ | Admin login |
| POST | `/api/admin/allOrders` | ✅ Admin | Get all orders |
| POST | `/api/admin/update-order-status` | ✅ Admin | Update order status |

### Order Statuses
- `pending` - New order
- `preparing` - Being prepared
- `delivery_ready` - Ready for delivery
- `delivered` - Delivered
- `cancelled` - Cancelled

---

## 🔑 Features

### User Features
✅ User registration & authentication
✅ Browse food menu by category
✅ Add items to cart
✅ Place orders with location tracking
✅ View order history
✅ Real-time order status updates
✅ GPS location capture

### Admin Features
✅ Admin authentication
✅ Add/delete food items
✅ View all orders with customer details
✅ Filter orders by location
✅ Update order status
✅ Real-time order notifications
✅ Dashboard with order analytics

---

## 🔒 Security Features

| Feature | Details |
|---------|---------|
| **JWT Auth** | Token-based authentication |
| **Password Hashing** | bcrypt with salt rounds |
| **Input Validation** | express-validator on all routes |
| **Rate Limiting** | 100 req/15min, 5 req/15min login |
| **CORS** | Configurable origin validation |
| **Data Sanitization** | MongoDB injection prevention |
| **Security Headers** | X-Frame-Options, X-Content-Type-Options, XSS |
| **Error Handling** | Generic messages in production |
| **Logging** | File-based error & request logging |

---

## 🚀 Deployment

### Option 1: Heroku

**Backend:**
```bash
npm install -g heroku
heroku login
cd back-end
heroku create your-app-name
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set CORS_ORIGIN=https://your-domain.com
git push heroku main
```

**Frontend:**
```bash
cd my-app
npm run build
vercel  # or deploy to Vercel/Netlify
```

### Option 2: Vercel (Frontend)
```bash
npm install -g vercel
cd my-app
vercel
# Set env vars in Vercel dashboard
```

### Option 3: AWS
- Backend: Elastic Beanstalk
- Frontend: S3 + CloudFront
- Database: MongoDB Atlas

### Option 4: DigitalOcean
- Create Ubuntu Droplet
- Install Node.js, MongoDB
- Configure Nginx reverse proxy
- Enable SSL with Let's Encrypt

---

## 📊 Database Setup

### MongoDB Atlas (Recommended)
1. Create account at mongodb.com
2. Create cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/gofood`
5. Add IP whitelist
6. Update `.env.production`

### Local MongoDB
```bash
# Mac
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo service mongod start

# Windows
# Download installer from mongodb.com
```

---

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/createuser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "location": "123 Main St"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/loginuser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Place Order
```bash
curl -X POST http://localhost:5000/api/orderData \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "order_data": [
      {
        "_id": "food_id",
        "name": "Butter Paneer",
        "qty": 2,
        "price": 250,
        "size": "full"
      }
    ],
    "location": {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "address": "123 Main St, Delhi",
      "city": "Delhi",
      "state": "Delhi"
    }
  }'
```

### Get All Orders (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/allOrders \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

### Update Order Status (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/update-order-status \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_id",
    "status": "delivery_ready"
  }'
```

---

## 🧪 Testing

### Test User Login
- Email: `user@example.com`
- Password: `password123`

### Test Admin Login
- Email: `admin@example.com`
- Password: `adminpass123`

### Health Check
```bash
curl http://localhost:5000/health
```

---

## 📊 Monitoring

### Logs Location
```
back-end/logs/app.log
```

### What Gets Logged
- API requests/responses
- Errors with stack traces
- Authentication events
- Rate limit hits

### Recommended Monitoring Tools
- **Error Tracking**: Sentry, Rollbar
- **APM**: New Relic, DataDog
- **Logging**: ELK Stack, Papertrail
- **Uptime**: UptimeRobot, Pingdom

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Edit `.env`: `PORT=5001` |
| MongoDB connection failed | Check `MONGODB_URI`, verify MongoDB running |
| CORS errors | Update `CORS_ORIGIN` to match frontend URL |
| Rate limited | Wait 15 minutes or adjust `RATE_LIMIT_MAX_REQUESTS` |
| Build errors | Run `npm install && npm audit fix` |
| Environment variables not loading | Restart server, verify `.env` file exists |

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.16.0",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^3.0.2",
  "express-validator": "^7.2.1",
  "express-rate-limit": "^7.1.5",
  "mongo-sanitize": "^2.1.0",
  "socket.io": "^4.8.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend
```json
{
  "react": "^19.1.0",
  "react-router-dom": "^7.6.2",
  "react-toastify": "^11.0.5",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "socket.io-client": "^4.8.1",
  "bootstrap": "^5.3.7",
  "@mui/icons-material": "^7.2.0"
}
```

---

## 📋 Pre-Deployment Checklist

### Security
- [ ] No hardcoded credentials
- [ ] All `.env` files in `.gitignore`
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] CORS_ORIGIN set to production domain
- [ ] Error messages hide sensitive info

### Testing
- [ ] Run `npm audit`
- [ ] Test all user flows
- [ ] Test admin functions
- [ ] Test on multiple browsers
- [ ] No console errors/warnings

### Database
- [ ] MongoDB cluster created
- [ ] Database backups enabled
- [ ] Connection string verified
- [ ] IP whitelist configured

### Infrastructure
- [ ] Hosting account ready
- [ ] Domain purchased
- [ ] SSL certificate ready
- [ ] Monitoring configured

---

## 🔄 Deployment Checklist

### Day Of Deployment
- [ ] Backup database
- [ ] `npm audit fix`
- [ ] Build frontend: `npm run build`
- [ ] Test in staging
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Smoke test all features
- [ ] Monitor logs

### Post-Deployment
- [ ] Monitor uptime
- [ ] Check error logs
- [ ] Verify all features working
- [ ] Gather user feedback
- [ ] Document any issues

---

## 🆘 Emergency Procedures

### Site Down
1. Check server status
2. Review error logs
3. Verify database connection
4. Restart application
5. Check recent changes
6. Restore backup if needed

### Database Issues
1. Check connection string
2. Verify MongoDB running
3. Check IP whitelist
4. Review disk space
5. Restore from backup

### Security Breach
1. Isolate affected systems
2. Review access logs
3. Rotate secrets
4. Scan for malware
5. Notify users if needed

---

## 🔄 Rollback

### Heroku
```bash
heroku releases
heroku rollback v42
```

### Git
```bash
git revert HEAD
git push production
```

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 📞 Support

### Debug Mode
```bash
# Backend
NODE_ENV=development npm run dev

# Check logs
tail -f back-end/logs/app.log
```

### Common Commands
```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Start development
npm run dev

# Build for production
npm run build
```

---

## 🎯 Project Features Summary

✅ Full-stack food delivery app
✅ User authentication & registration
✅ Admin dashboard with real-time updates
✅ Order management with status tracking
✅ GPS location tracking for deliveries
✅ Real-time notifications (Socket.IO)
✅ Food menu management
✅ Cart functionality
✅ Order history
✅ Admin analytics
✅ Responsive design
✅ Security best practices
✅ Production-ready code
✅ Comprehensive logging
✅ Rate limiting & CORS protection

---

## 📄 Version Info

- **Node.js**: v14+ required
- **MongoDB**: 4.0+
- **React**: 19.1.0
- **Express**: 5.1.0
- **Status**: ✅ Production Ready
- **Last Updated**: January 25, 2026

---

## 📝 License

ISC

---

## 🎉 You're Ready to Deploy!

1. **Setup**: Follow Quick Start above
2. **Configure**: Update `.env` files
3. **Test**: Run locally to verify
4. **Deploy**: Choose deployment option
5. **Monitor**: Watch logs and metrics
6. **Scale**: Add resources as needed

**Good luck! 🚀**

---

## 📌 Important Notes

- Always use `.env.production` for production deployments
- Keep JWT_SECRET and ADMIN_SECRET strong and unique
- Enable database backups before going live
- Monitor error logs regularly
- Update dependencies monthly
- Test database restoration quarterly
- Keep documentation updated

---

**For detailed API information, see the API Endpoints section above.**
