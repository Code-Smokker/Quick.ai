import { pool, query } from "../configs/db.js";
import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Make sure Cloudinary is properly configured
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary environment variables. Please check your .env file');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const generateArticale = async (req, res) => {
    try {
        // userId was already set by auth middleware
        const userId = req.userId;
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success: false, message: 'Limit reached. Upgrade to continue.'})

        }

        // Call OpenAI / Gemini
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                    role: "user",
                    content: prompt,
                },
             ],
             temperature: 0.7,
             max_tokens: length,
        });

        const content = response.choices[0].message.content;
        

        await query(
          `INSERT INTO creations (user_id, prompt, content, type)
          VALUES ($1, $2, $3, 'article')`,
          [userId, prompt, content]
        );

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata:{
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content });
        


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }
}




export const generateBlogTitle = async (req, res) => {
    try {
        // userId was already set by auth middleware
        const userId = req.userId;
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success: false, message: 'Limit reached. Upgrade to continue.'})

        }

        // Call OpenAI / Gemini
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                    role: "user",
                    content: prompt,
                },
             ],
             temperature: 0.7,
             max_tokens: 100,
        });

        const content = response.choices[0].message.content;
       


        await query(
          `INSERT INTO creations (user_id, prompt, content, type)
          VALUES ($1, $2, $3, 'blog_title')`,
          [userId, prompt, content]
        );

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata:{
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content });
        


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }
}





export const generateImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, publish = false } = req.body;
    const plan = req.plan;

    console.log('Image generation request received:', { userId, prompt, publish });

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available in premium subscription",
      });
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid prompt for image generation"
      });
    }

    if (!process.env.CLIPDROP_API_KEY) {
      console.error('CLIPDROP_API_KEY is not set');
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact support."
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt.trim());

    console.log('Sending request to Clipdrop API...');
    
    const response = await axios({
      method: 'post',
      url: 'https://clipdrop-api.co/text-to-image/v1',
      data: formData,
      headers: {
        ...formData.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API_KEY,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer',
      maxContentLength: 15 * 1024 * 1024, 
      timeout: 120000, 
      maxBodyLength: 15 * 1024 * 1024, 
      validateStatus: function (status) {
        return status >= 200 && status < 500; 
      }
    });

    if (response.status !== 200) {
      const errorData = response.data ? Buffer.from(response.data).toString('utf8') : 'No error details';
      console.error('Clipdrop API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Image generation failed with status ${response.status}: ${response.statusText}`);
    }

    if (!response.data || response.data.length === 0) {
      throw new Error("Empty response received from image generation service");
    }

    console.log('Image generated successfully, uploading to Cloudinary...');
    
    // Convert to base64 for Cloudinary
    const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString("base64")}`;
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Image,
        {
          folder: 'ai-generated-images',
          resource_type: 'image',
          quality: 'auto:good',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    console.log('Image uploaded to Cloudinary, saving to database...');
    
    try {
      // Save to database using the query function
      console.log('Executing database query...');
      const result = await query(
        `INSERT INTO creations (user_id, prompt, content, type)
         VALUES ($1, $2, $3, 'image')
         RETURNING id, created_at`,
        [userId, prompt, uploadResult.secure_url]
      );
      
      if (!result || result.rows.length === 0) {
        throw new Error('No result returned from database query');
      }
      
      console.log('Database query successful, result:', JSON.stringify(result.rows[0]));
      
      return res.json({ 
        success: true, 
        content: uploadResult.secure_url,
        id: result.rows[0]?.id,
        createdAt: result.rows[0]?.created_at
      });
      
    } catch (dbError) {
      console.error('Database error in generateImage:', {
        error: dbError,
        message: dbError.message,
        stack: dbError.stack,
        userId,
        promptLength: prompt?.length,
        urlLength: uploadResult?.secure_url?.length
      });
      
      // Still return a success response with the image URL even if database save fails
      return res.json({
        success: true,
        content: uploadResult.secure_url,
        message: 'Image generated but could not save to database',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
    
  } catch (error) {
    console.error("Error in generateImage:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data ? String(error.response.data).substring(0, 200) : undefined,
      status: error.response?.status
    });
    
    let errorMessage = "Failed to generate image. Please try again later.";
    let statusCode = 500;
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        errorMessage = "Image generation service quota exceeded. Please try again later.";
        statusCode = 402;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Image generation request timed out. Please try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid API key for image generation service.";
        statusCode = 401;
      }
    } else if (error.message.includes('Cloudinary')) {
      errorMessage = "Error processing the generated image. Please try again.";
    }
    
    return res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


  export const removeImageObject = async (req, res) => {
    try {
      const userId = req.userId;
      const { object } = req.body;
      const image = req.file;  // Fixed: was destructuring from req.file
      const plan = req.plan;
  
      if (plan !== "premium") {
        return res.json({
          success: false,
          message: "This feature is only available in premium subscription"
        });
      }
  
      // Upload the image to Cloudinary with the object removal effect
      const result = await cloudinary.uploader.upload(image.path, {
        transformation: [{
          effect: `gen_remove:${object}`
        }],
        resource_type: 'image'
      });
  
      // Record in DB
      await query(
        `INSERT INTO creations (user_id, prompt, content, type)
        VALUES ($1, $2, $3, 'image')`,
        [userId, `Remove ${object} from image`, result.secure_url]
      );
  
      // Return the processed image URL
      res.json({ 
        success: true, 
        content: result.secure_url 
      });
  
    } catch (error) {
      console.error("Error removing object from image:", error.message);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process image. Please try again later." 
      });
    }
  };



  export const resumeReview = async (req, res) => {
    let tempFilePath = null;
  
    try {
      console.log('Starting resume review process...');
      const userId = req.userId;
      const resume = req.file;  
      const plan = req.plan;
      
      console.log('Request received with file:', {
        originalname: resume?.originalname,
        mimetype: resume?.mimetype,
        size: resume?.size
      });
      
      if (!resume) {
        console.error('No resume file provided in request');
        return res.status(400).json({
          success: false,
          message: "No resume file provided"
        });
      }
      
      tempFilePath = resume.path;
      console.log('File saved to:', tempFilePath);

      if (plan !== "premium") {
        console.log('User does not have premium access');
        return res.status(403).json({
          success: false,
          message: "This feature is only available in premium subscription"
        });
      }

      if (resume.size > 5 * 1024 * 1024) {
        console.error('File size exceeds limit:', resume.size);
        return res.status(400).json({
          success: false, 
          message: "Resume file size exceeds allowed size (5MB)."
        });
      }

      console.log('Reading PDF file...');
      let pdfData;
      try {
        const dataBuffer = fs.readFileSync(tempFilePath);
        console.log('File read successfully, size:', dataBuffer.length);
        
        // Check if file is a valid PDF
        if (!dataBuffer || dataBuffer.length === 0) {
          throw new Error('File is empty');
        }
        
        // Check for PDF magic number
        const magicNumber = dataBuffer.toString('utf8', 0, 4);
        console.log('File magic number:', magicNumber);
        
        if (magicNumber !== '%PDF') {
          console.error('Invalid PDF file format. Magic number:', magicNumber);
          return res.status(400).json({
            success: false,
            message: 'The uploaded file is not a valid PDF. Please upload a valid PDF file.'
          });
        }
        
        try {
          console.log('Attempting to parse PDF...');
          pdfData = await pdf(dataBuffer);
          console.log('PDF parsed successfully, text length:', pdfData.text?.length || 0);
          
          if (!pdfData.text || pdfData.text.trim().length < 10) {
            console.error('PDF appears to be empty or contains no extractable text');
            return res.status(400).json({
              success: false,
              message: 'The PDF appears to be empty or contains no extractable text. Please try with a different PDF.'
            });
          }
          
        } catch (parseError) {
          console.error('PDF parsing error:', parseError);
          return res.status(400).json({
            success: false,
            message: `Failed to parse PDF: ${parseError.message}. Please ensure the file is not password protected and is a valid PDF.`
          });
        }
        
        try {
          const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;
          console.log('Sending request to AI...');

          const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
              role: "user",
              content: prompt,
            }],
            temperature: 0.7,
            max_tokens: 1000,
          });

          console.log('AI Response:', JSON.stringify(response, null, 2));
          
          if (!response.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from AI service');
          }

          const content = response.choices[0].message.content;
          
          // Record in DB
          try {
            await query(
              `INSERT INTO creations (user_id, prompt, content, type)
              VALUES ($1, $2, $3, 'resume-review')`,
              [userId, 'Review the uploaded resume', content]
            );
            console.log('Record saved to database');
          } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue even if DB insertion fails
          }

          return res.json({ 
            success: true, 
            content
          });

        } catch (aiError) {
          console.error('AI Service Error:', {
            message: aiError.message,
            response: aiError.response?.data,
            stack: aiError.stack
          });
          
          throw new Error(`AI service error: ${aiError.message}`);
        }

      } catch (pdfError) {
        console.error('Error processing PDF:', pdfError);
        return res.status(400).json({
          success: false,
          message: `Invalid PDF file: ${pdfError.message}`
        });
      }

    } catch (error) {
      console.error("Error in resume review:", {
        message: error.message,
        stack: error.stack,
        ...(error.response?.data && { apiError: error.response.data })
      });
      
      res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to process resume. Please try again later.",
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.stack,
          details: error.response?.data
        })
      });
    } finally {
      // Clean up the temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          console.log('Cleaning up temporary file:', tempFilePath);
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          console.error("Error cleaning up temp file:", cleanupError);
        }
      }
    }
  };
  