import { readFile, readdir, writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { query } from "express";

export class FusionQLGenerator {

      typeDefinitionFile = "./src/generated/typeDefinitions.ts";
      resolversFiles = "./src/generated/resolvers.ts";

      private async buildTypeDefinitions(queryFilesLocation: string, mutationFilesLocation: string) {
            const queryFiles = await readdir(queryFilesLocation);
            const mutationFiles = await readdir(mutationFilesLocation);
            let typeDefs = "export const typeDefs = `\nscalar File\n\n";
            for(const file of queryFiles) {
                  if (file.split(".")[1] == "graphql") {
                        const graphqlFile = await readFile(queryFilesLocation + "/" + file, "utf-8");
                        typeDefs += graphqlFile + "\n";
                  } else {
                        // Match the file code to the query name
                  }
            }
            for(const file of mutationFiles) {
                  if (file.split(".")[1] == "graphql") {
                        const graphqlFile = await readFile(mutationFilesLocation + "/" + file, "utf-8");
                        typeDefs += graphqlFile + "\n";
                  } else {
                        // Match the file code to the query name
                  }
            }
            typeDefs += "`";
            await writeFile(this.typeDefinitionFile, typeDefs);
      }

      private async buildResolvers(queryFilesLocation: string, mutationFilesLocation: string){
            const queryFiles = await readdir(queryFilesLocation);
            const mutationFiles = await readdir(mutationFilesLocation);
            let imports = "";
            let resolver = "export const resolvers = {\n";
            let finalWrite = "";
            resolver += "Query: {\n";
            for (const file of queryFiles) {
                  if (file.split(".")[1] == "ts") {
                        const queryName = file.split(".")[0];
                        const queryFile = await readFile(queryFilesLocation + "/" + file, "utf-8");
                        const queryFunction = queryFile.split("async function execute() {")[1].split("}")[0];
                        const queryImports = "import" + queryFile.split("import")[1].split("from")[0] + "from" + queryFile.split("from")[1].split(";")[0] + ";\n";
                        resolver += `${queryName}: async () => {${queryFunction}\n}` 
                        imports += queryImports;
                  }
            }
            resolver += "},\n";
            finalWrite = imports + "\n" + resolver + "\n}";
            await writeFile(this.resolversFiles, finalWrite);
      }


      public async build() {
            console.log("FusionQL Generator: Building...")

            const queryFilesLocation = "./src/graphql/query";
            const mutationFilesLocation = "./src/graphql/mutation";

            console.log("FusionQL Generator: Building Queries...")
            await this.buildTypeDefinitions(queryFilesLocation, mutationFilesLocation);
            console.log("FusionQL Generator: Queries Built")

            console.log("FusionQL Generator: Making resolver links...")
            await this.buildResolvers(queryFilesLocation, mutationFilesLocation);
            console.log("FusionQL Generator: Resolver links made")



      }

      public typeDefs(): string {
            const typeDefs = readFileSync(this.typeDefinitionFile, "utf-8");
            return typeDefs;
      }

      public resolvers() {
            const resolvers = require("@generated/resolvers");
            console.log(resolvers);
            return resolvers;      
      }
}