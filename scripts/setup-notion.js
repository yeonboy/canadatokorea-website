#!/usr/bin/env node

// Notion 데이터베이스 생성 및 설정 도우미 스크립트

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID; // 데이터베이스를 생성할 페이지 ID

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN environment variable is required');
  console.log('💡 Get your token from: https://www.notion.so/my-integrations');
  process.exit(1);
}

if (!NOTION_PARENT_PAGE_ID) {
  console.error('❌ NOTION_PARENT_PAGE_ID environment variable is required');
  console.log('💡 Create a page in Notion and copy its ID from the URL');
  process.exit(1);
}

// 데이터베이스 스키마 정의
const databaseSchema = {
  title: [
    {
      text: {
        content: "Real Korea Cards"
      }
    }
  ],
  parent: {
    page_id: NOTION_PARENT_PAGE_ID
  },
  properties: {
    "Title": {
      title: {}
    },
    "Summary": {
      rich_text: {}
    },
    "Type": {
      select: {
        options: [
          { name: "Issue", color: "red" },
          { name: "Popup", color: "purple" },
          { name: "Congestion", color: "orange" },
          { name: "Tip", color: "blue" },
          { name: "Weather", color: "yellow" },
          { name: "Hotspot", color: "pink" },
          { name: "Population", color: "green" }
        ]
      }
    },
    "Status": {
      select: {
        options: [
          { name: "Draft", color: "gray" },
          { name: "Review", color: "yellow" },
          { name: "Approved", color: "green" },
          { name: "Published", color: "blue" },
          { name: "Archived", color: "red" }
        ]
      }
    },
    "Area": {
      rich_text: {}
    },
    "Coordinates": {
      rich_text: {}
    },
    "Period": {
      date: {}
    },
    "Tags": {
      multi_select: {
        options: [
          { name: "seoul", color: "blue" },
          { name: "busan", color: "green" },
          { name: "jeju", color: "yellow" },
          { name: "transport", color: "orange" },
          { name: "food", color: "red" },
          { name: "culture", color: "purple" },
          { name: "visa", color: "pink" },
          { name: "housing", color: "brown" },
          { name: "student", color: "gray" }
        ]
      }
    },
    "Source1": {
      url: {}
    },
    "Source1 Title": {
      rich_text: {}
    },
    "Source1 Publisher": {
      rich_text: {}
    },
    "Source2": {
      url: {}
    },
    "Source2 Title": {
      rich_text: {}
    },
    "Source2 Publisher": {
      rich_text: {}
    },
    "FR Title": {
      rich_text: {}
    },
    "FR Summary": {
      rich_text: {}
    },
    "FR Tags": {
      rich_text: {}
    },
    "Last Updated": {
      last_edited_time: {}
    },
    "Approver": {
      people: {}
    },
    "Priority": {
      select: {
        options: [
          { name: "High", color: "red" },
          { name: "Medium", color: "yellow" },
          { name: "Low", color: "gray" }
        ]
      }
    }
  }
};

// 데이터베이스 생성 함수
async function createNotionDatabase() {
  try {
    console.log('📝 Creating Notion database...');
    
    const response = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(databaseSchema)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create database: ${response.status} ${error}`);
    }

    const database = await response.json();
    console.log('✅ Database created successfully!');
    console.log(`📋 Database ID: ${database.id}`);
    console.log(`🔗 Database URL: ${database.url}`);
    
    return database;
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    throw error;
  }
}

// 샘플 데이터 추가 함수
async function addSampleData(databaseId) {
  const samplePages = [
    {
      properties: {
        "Title": { title: [{ text: { content: "Seoul Metro Line 2 Delays" } }] },
        "Summary": { rich_text: [{ text: { content: "Signal issues causing 10-15 minute delays on Line 2 between Hongik Univ and Sinchon stations during rush hour." } }] },
        "Type": { select: { name: "Congestion" } },
        "Status": { select: { name: "Published" } },
        "Area": { rich_text: [{ text: { content: "Hongdae" } }] },
        "Coordinates": { rich_text: [{ text: { content: "37.5563, 126.9250" } }] },
        "Tags": { multi_select: [{ name: "transport" }, { name: "seoul" }] },
        "Source1": { url: "https://www.seoulmetro.co.kr" },
        "Source1 Publisher": { rich_text: [{ text: { content: "Seoul Metro" } }] },
        "FR Title": { rich_text: [{ text: { content: "Retards ligne 2 du métro de Séoul" } }] },
        "FR Summary": { rich_text: [{ text: { content: "Problèmes de signalisation causant des retards de 10-15 minutes sur la ligne 2 entre les stations Hongik Univ et Sinchon aux heures de pointe." } }] },
        "Priority": { select: { name: "High" } }
      }
    },
    {
      properties: {
        "Title": { title: [{ text: { content: "Seongsu Pop-up Store Opening" } }] },
        "Summary": { rich_text: [{ text: { content: "New artisan coffee pop-up store opening in Seongsu district this weekend. Features local roasters and limited edition merchandise." } }] },
        "Type": { select: { name: "Popup" } },
        "Status": { select: { name: "Published" } },
        "Area": { rich_text: [{ text: { content: "Seongsu" } }] },
        "Coordinates": { rich_text: [{ text: { content: "37.5446, 127.0559" } }] },
        "Period": { 
          date: { 
            start: "2025-09-14",
            end: "2025-09-16"
          }
        },
        "Tags": { multi_select: [{ name: "seoul" }, { name: "culture" }] },
        "Source1": { url: "https://example.com/seongsu-popup" },
        "Source1 Publisher": { rich_text: [{ text: { content: "Seongsu Today" } }] },
        "FR Title": { rich_text: [{ text: { content: "Ouverture pop-up store Seongsu" } }] },
        "Priority": { select: { name: "Medium" } }
      }
    }
  ];

  console.log('📝 Adding sample data...');
  
  for (const pageData of samplePages) {
    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          ...pageData
        })
      });

      if (response.ok) {
        const page = await response.json();
        console.log(`✅ Added: ${pageData.properties.Title.title[0].text.content}`);
      } else {
        console.log(`❌ Failed to add: ${pageData.properties.Title.title[0].text.content}`);
      }
    } catch (error) {
      console.error('Error adding sample page:', error.message);
    }
  }
}

// 메인 실행
async function main() {
  try {
    console.log('🏗️  Setting up Notion integration for ca.korea.com');
    console.log('📋 This will create a database and add sample data\n');
    
    const database = await createNotionDatabase();
    await addSampleData(database.id);
    
    console.log('\n🎉 Setup completed!');
    console.log('\n📋 Next steps:');
    console.log(`1. Add this to your .env.local:`);
    console.log(`   NOTION_DB_ID=${database.id}`);
    console.log(`   NOTION_TOKEN=${NOTION_TOKEN.substring(0, 10)}...`);
    console.log(`2. Add secrets to GitHub repository:`);
    console.log(`   - NOTION_TOKEN`);
    console.log(`   - NOTION_DB_ID`);
    console.log(`3. Test sync: npm run sync-notion`);
    console.log(`4. Visit database: ${database.url}`);
    
  } catch (error) {
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
