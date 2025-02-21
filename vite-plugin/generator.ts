import { Plugin } from 'vite'
import mdit from './markdown'

const preReplaceRe = /(<pre(?:(?!v-pre)[\s\S])*?)>/gm

function ContentGeneratorPlugin(): Plugin {
  return {
    name: 'content-generator',
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const rendered = mdit.render(code)
        return `<template>${rendered.replace(preReplaceRe, '$1 v-pre>')}</template>`
      }
    },
  }
}

export default ContentGeneratorPlugin
