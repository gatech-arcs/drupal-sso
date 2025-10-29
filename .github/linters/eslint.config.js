
// eslint.config.js — ESLint v9 Flat Configuration for Drupal 11.3 standards

import { defineConfig } from "eslint/config";
// Import required plugins/configs for use in extends or custom rules
import drupalPlugin from "eslint-plugin-drupal";
import jsdocPlugin from "eslint-plugin-jsdoc";
import jsonPlugin from "eslint-plugin-json";
import ymlPlugin from "eslint-plugin-yml";

// Ensure the base config is installed: eslint-config-airbnb-base (for Airbnb rules)

export default defineConfig([
  {
    // ** JavaScript files config **
    files: ["**/*.js", "**/*.jsx"],  // include JS (and JSX if any in project)
    ignores: ["node_modules/"],      // ignore node_modules by default
    languageOptions: {
      ecmaVersion: 2021,         // Use latest ECMAScript (ES12/2021) for parsing[4](https://deepwiki.com/airbnb/javascript/5.1-eslint-config-airbnb-base)
      sourceType: "module",      // Drupal's JS is in ES module format[4](https://deepwiki.com/airbnb/javascript/5.1-eslint-config-airbnb-base)
      globals: {
        // Browser globals (since Drupal JS runs in browser environment):
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        // You can include others like location, setTimeout, etc. as needed
        // Drupal-specific global variables:
        Drupal: "readonly",           // Drupal core JS global[6](https://www.drupal.org/project/tagify/issues/3416033)
        drupalSettings: "readonly",   // Drupal settings object (global)
        drupalTranslations: "readonly", // Drupal translations object
        once: "readonly",             // one-time event handler provided by Drupal[6](https://www.drupal.org/project/tagify/issues/3416033)
        $: "readonly",                // jQuery global (Drupal still includes jQuery)[6](https://www.drupal.org/project/tagify/issues/3416033)
        jQuery: "readonly"
      }
    },
    plugins: {
      // Register plugins so we can reference their rules/configs
      drupal: drupalPlugin,
      jsdoc: jsdocPlugin
      // Note: json and yml plugins will be used in their own configs below
    },
    // Extend Airbnb base and Drupal recommended configs (and JSDoc rules):
    extends: [
      // Airbnb base JS style guide rules:
      "airbnb-base",                  // brings in ESLint recommended + stylistic rules[1](https://www.drupal.org/node/2873849)
      // Drupal-specific lint rules:
      "plugin:drupal/recommended",    // enables Drupal’s custom rules (jQuery naming, etc.)[5](https://github.com/theodoreb/eslint-plugin-drupal)
      // JSDoc rules to replace valid-jsdoc:
      // We use the recommended config from eslint-plugin-jsdoc (all rules as errors)
      jsdocPlugin.configs["flat/recommended-error"]
      // (Above, we directly use the plugin's flat config object for comprehensive JSDoc checks)
      // If using a version of eslint-plugin-jsdoc that still supports legacy extends,
      // you could do: "plugin:jsdoc/recommended" instead of the above line.
    ],
    rules: {
      // ** Custom rule adjustments (if any) **
      // (No major overrides needed because Drupal adheres to Airbnb defaults)

      // Example: Ensure 'valid-jsdoc' is fully handled by plugin:
      // (valid-jsdoc is removed in ESLint 9, so we rely on jsdocPlugin rules now)
      // We prefer @return over @returns in JSDoc:
      "jsdoc/check-tag-names": ["error", { "preferredTags": { "returns": "return" } }],
      // ^ This jsdoc rule configuration enforces using @return (Drupal standard)[6](https://www.drupal.org/project/tagify/issues/3416033).

      // (Other rules from Airbnb or Drupal are already set via extends.
      // For instance, no-console is already a warning via Airbnb config[6](https://www.drupal.org/project/tagify/issues/3416033),
      // strict mode is handled via Airbnb (no 'use strict' needed in modules)[6](https://www.drupal.org/project/tagify/issues/3416033), etc.)
    }
  },

  {
    // ** JSON files config **
    files: ["**/*.json"],
    plugins: {
      json: jsonPlugin
    },
    extends: ["plugin:json/recommended-with-comments"]  // allow comments in JSON[2](https://project.pages.drupalcode.org/coding_standards/javascript/eslint/)
    // (The plugin:json config handles JSON parsing and basic linting of JSON structure)
  },

  {
    // ** YAML files config **
    files: ["**/*.yml", "**/*.yaml"],
    plugins: {
      yml: ymlPlugin
    },
    extends: ["plugin:yml/standard"]
    // (Uses eslint-plugin-yml to enforce YAML formatting rules)[2](https://project.pages.drupalcode.org/coding_standards/javascript/eslint/)
  }
]);
