import fs from "fs";
import path from "path";

const moduleName = process.argv[2];

if (!moduleName) {
    console.log("❌ Please provide a module name");
    process.exit(1);
}

const basePath = path.join(
    process.cwd(),
    "src",
    "app",
    "modules",
    moduleName
);

// Create folder
fs.mkdirSync(basePath, { recursive: true });

// File templates
const files = [
    {
        name: `${moduleName}.controller.ts`,
        content: `import { Request, Response } from "express";

export const ${moduleName}Controller = {
  // example
  getAll: (req: Request, res: Response) => {
    res.send("${moduleName} controller working");
  },
};
`,
    },
    {
        name: `${moduleName}.service.ts`,
        content: `export const ${moduleName}Service = {
  // business logic here
};
`,
    },
    {
        name: `${moduleName}.routes.ts`,
        content: `import express from "express";
import { ${moduleName}Controller } from "./${moduleName}.controller";

const router = express.Router();

router.get("/", ${moduleName}Controller.getAll);

export const ${moduleName}Routes = router;
`,
    },
    {
        name: `${moduleName}.validation.ts`,
        content: `// validation schema here (zod/joi)

export const ${moduleName}Validation = {};
`,
    },
];

// Create files
files.forEach((file) => {
    const filePath = path.join(basePath, file.name);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content);
    }
});

console.log(`✅ Module '${moduleName}' created successfully!`);