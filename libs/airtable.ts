import Airtable from "airtable"

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

export type Automation = {
  id: string
  name: string
  shortDescription: string
  content: string
  videoUrl: string
  attachments?: string[]
  timeToImplement: string
  lastModified: string
  image?: string
  category: string
  platform: string
  production: boolean
}

export const getAutomations = async () => {
  try {
    const records = await airtable('Automations').select({
      view: 'Grid view'
    }).all()

    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      shortDescription: record.get('Short Description') as string,
      content: record.get('Content') as string,
      videoUrl: record.get('Video URL') as string,
      attachments: record.get('Attachments') as string[],
      timeToImplement: record.get('Time to Implement') as string,
      lastModified: record.get('Last Modified') as string,
      image: record.get('Image') as string,
      category: record.get('Category') as string,
      platform: record.get('Platform') as string,
      production: record.get('Production') as boolean,
    }))
  } catch (error) {
    console.error('Error fetching automations:', error)
    return []
  }
}

export const getAutomationById = async (id: string) => {
  try {
    const record = await airtable('Automations').find(id)
    
    return {
      id: record.id,
      name: record.get('Name') as string,
      shortDescription: record.get('Short Description') as string,
      content: record.get('Content') as string,
      videoUrl: record.get('Video URL') as string,
      attachments: record.get('Attachments') as string[],
      timeToImplement: record.get('Time to Implement') as string,
      lastModified: record.get('Last Modified') as string,
      image: record.get('Image') as string,
      category: record.get('Category') as string,
      platform: record.get('Platform') as string,
      production: record.get('Production') as boolean,
    }
  } catch (error) {
    console.error('Error fetching automation:', error)
    return null
  }
}

export type Snippet = {
  id: string
  name: string
  shortDescription: string
  content: string
  videoUrl: string
  attachments?: string[]
  timeToImplement: string
  lastModified: string
  image?: string
  language: string
  category: string
  production: boolean
}

export const getSnippets = async () => {
  try {
    const records = await airtable('Snippets').select({
      view: 'Grid view'
    }).all()

    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      shortDescription: record.get('Short Description') as string,
      content: record.get('Content') as string,
      videoUrl: record.get('Video URL') as string,
      attachments: record.get('Attachments') as string[],
      timeToImplement: record.get('Time to Implement') as string,
      lastModified: record.get('Last Modified') as string,
      image: record.get('Image') as string,
      language: record.get('Language') as string,
      category: record.get('Category') as string,
      production: record.get('Production') as boolean,
    }))
  } catch (error) {
    console.error('Error fetching snippets:', error)
    return []
  }
}

export type Document = {
  id: string
  name: string
  shortDescription: string
  content: string
  type: string
  attachments?: string[]
  lastModified: string
  category: string
  production: boolean
}

export const getDocuments = async () => {
  try {
    const records = await airtable('Documents').select({
      view: 'Grid view'
    }).all()

    return records.map(record => ({
      id: record.id,
      name: record.get('Name') as string,
      shortDescription: record.get('Short Description') as string,
      content: record.get('Content') as string,
      type: record.get('Type') as string,
      attachments: record.get('Attachments') as string[],
      lastModified: record.get('Last Modified') as string,
      category: record.get('Category') as string,
      production: record.get('Production') as boolean,
    }))
  } catch (error) {
    console.error('Error fetching documents:', error)
    return []
  }
} 