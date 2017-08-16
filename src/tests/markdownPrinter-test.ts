import { expect } from 'chai';

import {
  printSchema
} from './../markdownPrinter';

describe("Printer", () => {
  it('should print a type', () => {
    const schema = `
    schema {
      query: Query
    }

    type Query {
      user: User
    }

    # Description here
    type User {
      id: ID!
    }`

    const printed = printSchema(schema);
    console.log(printed);
    
    expect(printed).to.exist;
  });
})