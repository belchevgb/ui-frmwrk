import { getTsFilePaths } from "./aot-utils";
import * as ts from "typescript";

interface IComponentClassMetadata {
    classDecl: ts.ClassDeclaration;
    decorator: ts.Decorator;
}

function getComponentClasses(node: ts.Node, components: IComponentClassMetadata[]) {
    if (ts.isClassDeclaration(node)) {
        node.decorators.forEach(d => {
            if (d.expression.getText(d.getSourceFile()) === "ComponentDef") {
                components.push({ classDecl: node as ts.ClassDeclaration, decorator: d });
            }
        });
    }

    for (const ch of node.getChildren(node.getSourceFile())) {
        getComponentClasses(ch, components);
    }
}

class AotOutputGenereator {
    generateViewFiles(startupFile: string) {
        // 1. read all files
        // 2. convert to SourceFile
        // 3. analyze source files and register component files
        // 4. read and parse template
        // 5. generate viles

        const program = ts.createProgram([startupFile], {  });
        const sourceFiles = program.getSourceFiles();
        const compsMetadata: IComponentClassMetadata[] = [];

        sourceFiles.forEach(sf => getComponentClasses(sf, compsMetadata));

        compsMetadata.forEach(x => {
        });
    }
}