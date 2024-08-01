import * as dotenv from 'dotenv';
import express, { response } from "express";
import cors from "cors"


dotenv.config()
const app = express()
app.use(express.json())
const PORT = 9004
app.use(cors())


import { OpenAIApi, Configuration } from 'openai'
import * as path from "path";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const generatePrompt = (clasificador: Text) => {
    return `
      Primero verificar si el texto: ${clasificador} 
      tiene la estructura (numero + texto), si esto no es asi imprime: no cumple con la estructura
      Segundo, clasifica el texto segun su tema: Cine, Politica, Religion u Otro  
      Tercero, dame: numero + clasificacion (Cine, Politica, Religion, Otro)
      Cuarto, guardalos y dame el historial de respuesta
    `;
  }


app.post('/openapi2', async (req, res) => {
    const { prompt } = req.body
    const completion = await openai.createCompletion({

        // Con el gpt 3.5 no da respuestas se recomienda probar con gpt4 
        model: 'gpt-3.5-turbo-instruct',
        
         prompt: generatePrompt(prompt),
        temperature: 0.5
    })

    // @ts-ignore
    res.send({ result: completion.data.choices[0].text.trim()})
})






app.listen(PORT, '0.0.0.0', () => {
    console.log(`Running application at http://localhost:${PORT}`);
  });