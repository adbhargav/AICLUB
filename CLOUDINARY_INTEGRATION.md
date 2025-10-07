# Cloudinary Integration Documentation

## Overview
All image uploads in the RGM AI Club application are now integrated with Cloudinary for efficient cloud storage and delivery.

## Configuration

### Environment Variables
The following environment variables are configured in `server/.env`:
```
CLOUDINARY_CLOUD_NAME=dzkr16ftq
CLOUDINARY_API_KEY=766369585551729
CLOUDINARY_API_SECRET=VKl7SU4WE55lpak616x1xjj3uEU
```

### Cloudinary Config
Located at: `server/config/cloudinary.js`
- Initializes Cloudinary SDK with environment variables
- Exports configured cloudinary instance for use across routes

## Updated Models

### 1. Gallery Model (`server/models/Gallery.js`)
- **imageURL**: Stores Cloudinary secure URL
- **cloudinaryId**: Stores Cloudinary public_id for deletion
- **type**: Image type (default: "image")

### 2. Event Model (`server/models/Event.js`)
- **imageURL**: Stores Cloudinary secure URL
- **cloudinaryId**: Stores Cloudinary public_id for deletion

### 3. TeamMember Model (`server/models/TeamMember.js`)
- **profileImageURL**: Stores Cloudinary secure URL
- **cloudinaryId**: Stores Cloudinary public_id for deletion

## Updated Routes

### Gallery Routes (`server/routes/galleryRoutes.js`)
**Features:**
- Upload images to `rgm-ai-club/gallery` folder in Cloudinary
- Stream-based upload using `streamifier`
- Automatic cleanup on database save failure
- Delete from Cloudinary when gallery item is deleted
- 10MB file size limit

**Endpoints:**
- `POST /api/gallery` - Upload new gallery image
- `GET /api/gallery` - Get all gallery images
- `PUT /api/gallery/:id` - Update gallery metadata (title, description)
- `DELETE /api/gallery/:id` - Delete gallery image (removes from Cloudinary + DB)

### Event Routes (`server/routes/eventRoutes.js`)
**Features:**
- Upload images to `rgm-ai-club/events` folder in Cloudinary
- Stream-based upload using `streamifier`
- Replace old image when updating event
- Delete from Cloudinary when event is deleted
- 10MB file size limit

**Endpoints:**
- `POST /api/events` - Create event with image (requires auth + admin)
- `GET /api/events` - Get all events
- `PUT /api/events/:id` - Update event (replaces image if new one provided)
- `DELETE /api/events/:id` - Delete event (removes from Cloudinary + DB)

### Team Routes (`server/routes/teamRoutes.js`)
**Features:**
- Upload images to `rgm-ai-club/team` folder in Cloudinary
- Stream-based upload using `streamifier`
- Replace old image when updating team member
- Delete from Cloudinary when team member is deleted
- 10MB file size limit

**Endpoints:**
- `POST /api/team` - Add team member with profile image (requires auth + admin)
- `GET /api/team` - Get all team members
- `PUT /api/team/:id` - Update team member (replaces image if new one provided)
- `DELETE /api/team/:id` - Delete team member (removes from Cloudinary + DB)

## Technical Implementation

### Upload Process
1. **Multer** captures file upload with memory storage
2. **Streamifier** converts buffer to readable stream
3. **Cloudinary** receives stream and uploads to specified folder
4. On success: Save secure URL and public_id to MongoDB
5. On failure: Cleanup uploaded image from Cloudinary

### Delete Process
1. Find document in MongoDB
2. If `cloudinaryId` exists, delete from Cloudinary
3. Delete document from MongoDB
4. Return success response

### Update Process (Events & Team Members)
1. Find existing document
2. If new image provided:
   - Delete old image from Cloudinary (if exists)
   - Upload new image to Cloudinary
   - Update URLs in document
3. Save updated document

## Benefits

✅ **Scalability**: Images stored in cloud, not in MongoDB or local filesystem
✅ **Performance**: Fast CDN delivery of images
✅ **Optimization**: Cloudinary auto-optimizes images
✅ **Storage**: No database bloat from base64 images
✅ **Management**: Centralized image management in Cloudinary dashboard
✅ **Cleanup**: Automatic deletion from Cloudinary when items are removed

## Folder Structure in Cloudinary
```
rgm-ai-club/
├── gallery/     # Gallery images
├── events/      # Event images
└── team/        # Team member profile images
```

## Dependencies
- `cloudinary`: ^1.37.2
- `multer`: ^2.0.2
- `streamifier`: ^0.1.1

## Testing

### Test Gallery Upload
```bash
curl -X POST http://localhost:5000/api/gallery \
  -F "image=@/path/to/image.jpg" \
  -F "title=Test Image" \
  -F "description=Test Description"
```

### Test Event Upload (requires auth token)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "title=Test Event" \
  -F "description=Event Description" \
  -F "date=2025-10-15" \
  -F "location=RGMCET"
```

### Test Team Member Upload (requires auth token)
```bash
curl -X POST http://localhost:5000/api/team \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@/path/to/image.jpg" \
  -F "name=John Doe" \
  -F "role=President" \
  -F "branch=CSE" \
  -F "year=3rd Year"
```

## Notes
- All image uploads have a 10MB file size limit
- Images are automatically optimized by Cloudinary
- Failed uploads are automatically cleaned up
- Old images are deleted when updating or removing items
