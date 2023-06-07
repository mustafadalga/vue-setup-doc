#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const execSync = require('child_process').execSync;
const rimraf = require('rimraf');

// Get command-line arguments
const args = process.argv.slice(2);
const inputFileArgIndex = args.indexOf('-i');
const outputFileArgIndex = args.indexOf('-o');
const helpArgIndex = args.indexOf('-h') !== -1 ? args.indexOf('-h') : args.indexOf('--help');


checkForHelpArgument();
validateArguments();
const inputFile = args[inputFileArgIndex + 1];
const outputFile = args[outputFileArgIndex + 1];


async function validateInputOutputFiles (inputFile, outputFile) {
    try {
        await fs.access(inputFile);
        const outputDirectory = path.dirname(outputFile);
        await fs.access(outputDirectory);
    } catch (error) {
        console.error(`File or directory does not exist: ${error.message}`);
        process.exit(1);
    }
}

async function ensureTempDirExists (tempDir) {
    try {
        await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
        console.error(`Failed to create temporary directory: ${error.message}`, error);
        process.exit(1);
    }
}

async function generateVueComponentDocumentation (inputFile) {
    // Define your temporary directory
    const tempDir = 'temp-docs';
    try {
        await ensureTempDirExists(tempDir);
        // Write the file to the temporary directory
        const tempFile = path.join(tempDir, path.basename(inputFile));
        const data = await fs.readFile(inputFile, 'utf8');
        const result = modifyFileContent(data)
        await fs.writeFile(tempFile, result, 'utf8');
        await generateDocumentation(tempFile, outputFile);
    } catch (error) {
        console.error(`Failed to process file: ${error.message}`);
        process.exit(1);
    } finally {
         rimraf.sync(tempDir);
    }
}

function modifyFileContent (content) {
    return content
        .replace(/<script lang="ts" setup>/g, '<script lang="ts">')
        .replace(/<script setup lang="ts">/g, '<script lang="ts">')
        .replace(/<script setup>/g, '<script>');
}

function generateDocumentation (inputFile, outputFile) {
    try {
        const cmd = `documentation build ${inputFile} -f md -o ${outputFile}`;
        execSync(cmd, { stdio: 'pipe' });
        console.log(`Generated documentation for ${inputFile}`);
    } catch (error) {
        console.error(`Failed to generate documentation: ${error.message}`);
        process.exit(1);
    }
}

async function run () {
    await validateInputOutputFiles(inputFile, outputFile);
    if (isVueComponent()) {
        generateVueComponentDocumentation(inputFile);
    } else {
        generateDocumentation(inputFile, outputFile);
    }
}

function checkForHelpArgument () {
    if (helpArgIndex !== -1) {
        console.log(`
        Usage: node script.js -i [input file] -o [output file]
        
        Options:
          -i    Input file
          -o    Output file
          -h    Show help information
        `);
        process.exit(0);
    }
}

function validateArguments () {
    if (inputFileArgIndex < 0 || outputFileArgIndex < 0 || inputFileArgIndex + 1 >= args.length || outputFileArgIndex + 1 >= args.length) {
        console.error('You must provide an input file and an output file with the -i and -o arguments, respectively.');
        process.exit(1);
    }
}

function isVueComponent () {
    const extension = path.extname(inputFile);
    return extension == ".vue";
}

run();
