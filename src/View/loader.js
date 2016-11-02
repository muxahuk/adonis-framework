'use strict'

/**
 * adonis-framework
 * Copyright(c) 2015-2016 Harminder Virk
 * MIT Licensed
*/

const nunjucks = require('nunjucks')
const path = require('path')
const fs = require('fs')

/**
 * Views loader
 * @module
 * @alias Views.Loader
 */
exports = module.exports = nunjucks.Loader.extend({
  /**
   * Initiates views loader
   *
   * @param  {String} viewsPath
   * @param  {Boolean} noWatch Not considered
   * @param  {Boolean} noCache
   *
   * @public
   */
  init: function (viewsPath, noWatch, noCache) {
    this.viewsPath = path.normalize(viewsPath)
    this.async = true
    this.noCache = !!noCache
  },

  /**
   * get content of a file required while rendering
   * template
   *
   * @param  {String}   name
   * @param  {Function} callback
   *
   * @public
   */
  getSource: function (name, callback) {
    name = name.indexOf('::') === -1 ? '::' + name : name
    const parts = name.split('::')
    name = parts[1]
    name = name.replace(/((?!\.+\/)\.(?!njk))/g, '/')
    name = path.extname(name) === '.njk' ? name : `${name}.njk`

    const viewsPath = this.resolveNamespace(parts[0])
    const viewPath = path.resolve(viewsPath, name)
    const self = this

    fs.readFile(viewPath, function (err, content) {
      if (err) {
        callback(null, null)
        return
      }
      callback(null, {
        src: content.toString(),
        path: viewPath,
        noCache: self.noCache
      })
    })
  },

  /**
   * resolve path for passed namespace
   *
   * ::home
   * App::home
   * @App::home
   * Adonis/Addon/Test::home
   * @Adonis/Addon/Test::home
   */
  resolveNamespace: function (namespace) {
    namespace = namespace.trimLeft('@')
    if (namespace === '' || namespace === 'App') { // TODO: may be remove 'App' check ?
      return this.viewsPath
    }
    // TODO: make some loading of view path of Addon with namespace or alias ... ?
    return this.viewsPath
  }
})
