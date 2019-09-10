import fs from "fs";

function findTsFilePaths(dirPath: string, files: string[]) {
    const dirFiles = fs.readdirSync(dirPath);

    dirFiles.forEach(path => {
        if (fs.statSync(path).isDirectory()) {
            findTsFilePaths(path, files);
        } else if (path.endsWith(".ts")) {
            files.push(path);
        }
    });
}

export function getTsFilePaths(rootDirPath: string) {
    const files = [];

    findTsFilePaths(rootDirPath, files);

    return files;
}