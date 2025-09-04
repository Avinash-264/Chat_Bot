const express = require('express');
const dotenv = require('dotenv');
const {GoogleGenAI} = require('@google/genai');

const router = express.Router();
dotenv.config({path : '../../config.env'});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async(req, res) => {
   const {prompt} = req.body;
   
   if(typeof prompt !== 'string' || !prompt) {
      res.status(400).send('prompt is required in string');
   }

   try {
      const response = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: prompt,
      });
      
      const text = response.candidates[0].content.parts[0].text;
      console.log(text);
      res.status(200).send(text);
   } catch(error) {
      res.status(500).send(error);
   } 
});

module.exports = router;


