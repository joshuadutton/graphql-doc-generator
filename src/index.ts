import fs = require('fs');

import {
  printSchema
} from './markdownPrinter';

if (process.argv.length != 4) {
  logFileError();
}

generate(process.argv[2], process.argv[3]);

function generate(inputSchemaPath: string, outputSchemaPath: string) {
  let schemaIdl = "";
  try {
    schemaIdl = fs.readFileSync(inputSchemaPath, 'utf-8');
  } catch(error) {
    logFileError(error);
  }

  const printedSchema = printSchema(schemaIdl);

  try {
    fs.writeFileSync(outputSchemaPath, printedSchema, 'utf-8');
  } catch(error) {
    logFileError(error);
  } 
}

function logFileError(error?: Error) {
  const errorMessage = "\nThis script requires 2 arguments: a file path for the input schema and a file path to write the generated schema to.\n";
  console.error(errorMessage);
  if (error) {
    console.error(error);
  }
  process.exit(1);
}