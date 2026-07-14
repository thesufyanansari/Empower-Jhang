import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = process.env.UPLOAD_PATH || 
  (fs.existsSync(path.join(process.cwd(), 'uploads')) 
    ? path.join(process.cwd(), 'uploads') 
    : path.join(process.cwd(), '../uploads'));

// Ensure directories exist
const profileDir = path.join(uploadPath, 'profile');
const cardsDir = path.join(uploadPath, 'member-cards');
const mentorCardsDir = path.join(uploadPath, 'mentor-cards');
const volunteerCardsDir = path.join(uploadPath, 'volunteer-cards');
const qrDir = path.join(uploadPath, 'qr');
const resourcesDir = path.join(uploadPath, 'resources');
const announcementsDir = path.join(uploadPath, 'announcements');
const tempDir = path.join(uploadPath, 'temp');

[
  profileDir, cardsDir, mentorCardsDir, volunteerCardsDir,
  qrDir, resourcesDir, announcementsDir, tempDir
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const uniqueName = `avatar_${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExt}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, webp) are allowed.'));
};

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});
export { profileDir, cardsDir, tempDir };
