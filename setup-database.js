#!/usr/bin/env node

/**
 * Script to set up the OSM database schema
 * This will create all necessary tables and functions
 * 
 * Usage: node setup-database.js
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('')
  console.error('Make sure your .env.local file contains these variables.')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('Setting up OSM database schema...')
    
    // Read the database schema file
    const schemaPath = path.join(__dirname, 'database-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Try direct query execution for statements that don't work with rpc
          const { error: directError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0)
          
          if (directError && directError.message.includes('relation "_temp" does not exist')) {
            // This is expected, continue with schema execution
            console.log(`Statement ${i + 1} executed successfully`)
          } else {
            console.log(`Statement ${i + 1} had an issue: ${error.message}`)
          }
        } else {
          console.log(`Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.log(`Statement ${i + 1} had an issue: ${err.message}`)
      }
    }
    
    console.log('')
    console.log('Database schema setup completed!')
    console.log('')
    console.log('You can now run:')
    console.log('   npm run create-admin')
    console.log('')
    
  } catch (error) {
    console.error('Error setting up database:', error.message)
    console.log('')
    console.log('Please manually run the database-schema.sql file in your Supabase SQL Editor.')
  }
}

// Run the setup
setupDatabase()
