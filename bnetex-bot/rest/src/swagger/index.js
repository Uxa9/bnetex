
import { PatternResponse } from '../components/PatternsComponent/patterns.schema.js';
 
 import swaggerAutogen from 'swagger-autogen';
const outputFile = './swagger-output.json';
const apiFiles = ["./src/components/PatternsComponent/patterns.routes.ts"];
const doc = {
  info: {
    title: 'BNETEX ALGO API',    
  },
  servers: [
    {
      "url": "http://localhost:3800/"
    }
  ],
  'definitions': {
    PatternResponse: PatternResponse.swagger.properties
  },  
};
swaggerAutogen({ openapi: '3.0.0' })(outputFile, apiFiles, doc);
