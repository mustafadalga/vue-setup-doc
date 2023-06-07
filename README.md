# vue setup doc

`vue-setup-doc` is a command-line tool that generates documentation for Vue.js and TypeScript projects. It handles Vue.js's `<script setup>` syntax, which is not supported by documentation.js.

<p align="center">

[![version](https://img.shields.io/npm/v/vue-setup-doc.svg)](https://www.npmjs.com/package/vue-setup-doc)

</p>

## Installation

### Global Installation

To install vue-setup-doc globally, run the following command:

```sh
npm install -g vue-setup-doc
```
This will install the package globally, allowing you to use the vue-setup-doc command in your terminal.


### Local Installation
To install vue-setup-doc as a development dependency in your project, navigate to your project directory in your terminal and run the following command:

```sh 
npm install -D vue-setup-doc
```
This will add vue-setup-doc to the devDependencies in your project's package.json.

## Usage
To use vue-setup-doc, you need to specify an input file and an output file. The command format is as follows:

```sh
vue-setup-doc -i [input file] -o [output file]
```

Replace [input file] with the path to the file you want to generate documentation for, and [output file] with the path where you want to save the generated documentation.

If the input file is a Vue component, vue-setup-doc will remove the setup attribute before generating the documentation. If the input file is not a Vue component, vue-setup-doc will run the documentation command directly.

### Help
You can view the help information by running the following command:

```sh
vue-setup-doc -h
```
or
```sh
vue-setup-doc -help
```