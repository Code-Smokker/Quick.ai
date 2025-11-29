import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticale,
  generateBlogTitle,
  generateImage,
  removeImageObject,
  resumeReview,
  generateAGCR,
  getAGCRHistory,
  generateBanner,
  chatWithGemini
} from "../controllers/aiControllers.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticale);
aiRouter.post('/generate-blog-titles', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject);
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview);
aiRouter.post('/generate-agcr', upload.fields([
  { name: 'voice', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), auth, generateAGCR);
aiRouter.get('/history/agcr', auth, getAGCRHistory);
aiRouter.post('/generate-banner', auth, generateBanner);
aiRouter.post('/chat', auth, chatWithGemini);

export default aiRouter;