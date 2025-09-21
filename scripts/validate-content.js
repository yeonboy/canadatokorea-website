#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

/**
 * 콘텐츠 유효성 검증 스크립트
 * JSON 스키마를 사용하여 포스트, QnA, 비용 추산 데이터 검증
 */

class ContentValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    try {
      addFormats(this.ajv);
    } catch (e) {
      console.warn('⚠️ ajv-formats unavailable or incompatible, continuing without extra formats:', e.message);
    }
    
    this.schemasDir = path.join(__dirname, '../schemas');
    this.contentDir = path.join(__dirname, '../content');
    this.schemas = {};
  }

  async loadSchemas() {
    console.log('📋 Loading validation schemas...');
    
    const schemaFiles = [
      'post.schema.json',
      'qna.schema.json', 
      'cost_estimator.schema.json',
      'source.schema.json',
      'schedule.schema.json'
    ];

    for (const schemaFile of schemaFiles) {
      try {
        const schemaPath = path.join(this.schemasDir, schemaFile);
        const schemaContent = await fs.readFile(schemaPath, 'utf8');
        const schema = JSON.parse(schemaContent);
        
        const schemaName = schemaFile.replace('.schema.json', '');
        this.schemas[schemaName] = this.ajv.compile(schema);
        
        console.log(`  ✅ Loaded ${schemaName} schema`);
      } catch (error) {
        console.error(`  ❌ Failed to load ${schemaFile}:`, error.message);
        throw error;
      }
    }
  }

  async validateFile(filePath, schemaName) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      const validate = this.schemas[schemaName];
      if (!validate) {
        throw new Error(`Schema ${schemaName} not found`);
      }

      const isValid = validate(data);
      
      return {
        isValid,
        errors: validate.errors || [],
        filePath,
        data
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{ message: error.message }],
        filePath,
        data: null
      };
    }
  }

  async validateContentDirectory() {
    console.log('🔍 Validating content directory...');
    
    const results = {
      posts: [],
      qna: [],
      costEstimators: [],
      sources: [],
      schedules: [],
      summary: {
        totalFiles: 0,
        validFiles: 0,
        invalidFiles: 0,
        errors: []
      }
    };

    try {
      // content/posts/*.json 검증
      const postsDir = path.join(this.contentDir, 'posts');
      try {
        const postFiles = await fs.readdir(postsDir);
        for (const file of postFiles.filter(f => f.endsWith('.json'))) {
          const result = await this.validateFile(path.join(postsDir, file), 'post');
          results.posts.push(result);
          results.summary.totalFiles++;
          
          if (result.isValid) {
            results.summary.validFiles++;
            console.log(`  ✅ ${file} - Valid`);
          } else {
            results.summary.invalidFiles++;
            console.log(`  ❌ ${file} - Invalid`);
            result.errors.forEach(error => {
              console.log(`    - ${error.instancePath}: ${error.message}`);
              results.summary.errors.push(`${file}: ${error.instancePath} ${error.message}`);
            });
          }
        }
      } catch (error) {
        console.log('  📁 No posts directory found, skipping...');
      }

      // content/qna/*.json 검증
      const qnaDir = path.join(this.contentDir, 'qna');
      try {
        const qnaFiles = await fs.readdir(qnaDir);
        for (const file of qnaFiles.filter(f => f.endsWith('.json'))) {
          const result = await this.validateFile(path.join(qnaDir, file), 'qna');
          results.qna.push(result);
          results.summary.totalFiles++;
          
          if (result.isValid) {
            results.summary.validFiles++;
            console.log(`  ✅ ${file} - Valid`);
          } else {
            results.summary.invalidFiles++;
            console.log(`  ❌ ${file} - Invalid`);
            result.errors.forEach(error => {
              results.summary.errors.push(`${file}: ${error.instancePath} ${error.message}`);
            });
          }
        }
      } catch (error) {
        console.log('  📁 No QnA directory found, skipping...');
      }

      // 샘플 파일들 검증
      const samplesDir = path.join(__dirname, '../samples');
      try {
        const sampleFiles = await fs.readdir(samplesDir);
        
        for (const file of sampleFiles) {
          if (file.endsWith('.sample.json')) {
            const schemaName = file.replace('.sample.json', '');
            const result = await this.validateFile(path.join(samplesDir, file), schemaName);
            
            results.summary.totalFiles++;
            
            if (result.isValid) {
              results.summary.validFiles++;
              console.log(`  ✅ ${file} - Valid sample`);
            } else {
              results.summary.invalidFiles++;
              console.log(`  ❌ ${file} - Invalid sample`);
              result.errors.forEach(error => {
                results.summary.errors.push(`${file}: ${error.instancePath} ${error.message}`);
              });
            }
          }
        }
      } catch (error) {
        console.log('  📁 No samples directory found, skipping...');
      }

    } catch (error) {
      console.error('Validation failed:', error);
      throw error;
    }

    return results;
  }

  async generateValidationReport(results) {
    const reportPath = path.join(__dirname, '../logs/validation-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
    
    console.log('\n📊 Validation Summary:');
    console.log(`Total files: ${results.summary.totalFiles}`);
    console.log(`Valid files: ${results.summary.validFiles}`);
    console.log(`Invalid files: ${results.summary.invalidFiles}`);
    
    if (results.summary.errors.length > 0) {
      console.log('\n❌ Validation Errors:');
      results.summary.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    return results.summary.invalidFiles === 0;
  }

  async run() {
    try {
      console.log('🔍 Starting content validation...');
      
      await this.loadSchemas();
      const results = await this.validateContentDirectory();
      const isValid = await this.generateValidationReport(results);
      
      if (isValid) {
        console.log('\n✅ All content validation passed!');
        process.exit(0);
      } else {
        console.log('\n❌ Content validation failed!');
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Validation script failed:', error);
      process.exit(1);
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const validator = new ContentValidator();
  validator.run();
}

module.exports = { ContentValidator };
