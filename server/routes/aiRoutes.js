import express from "express";
import { auth } from "../middlewares/auth.js";
import { 
  generateArticale, 
  generateBlogTitle, 
  generateImage, 
  removeImageObject, 
  resumeReview,
  removeImageBackground
} from "../controllers/aiControllers.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticale);
aiRouter.post('/generate-blog-titles', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-background', upload.single('image'), auth, removeImageBackground);
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject);
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview);

export default aiRouter;