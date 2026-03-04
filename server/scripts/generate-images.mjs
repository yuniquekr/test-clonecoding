#!/usr/bin/env node
/**
 * 나노바나나 Pro API 이미지 생성 스크립트
 * 사용법: node server/scripts/generate-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// 루트 .env 로드
function loadEnv() {
  const envPaths = [
    path.join(ROOT, '.env'),
    path.resolve(ROOT, '../../../../.env'), // 워크스페이스 상위 루트
    path.resolve(ROOT, '../../../../../.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
      }
      console.log(`[env] loaded from ${envPath}`);
      break;
    }
  }
}

loadEnv();

const API_KEY = process.env.NANOBANANA_API_KEY;
if (!API_KEY) {
  console.error('[error] NANOBANANA_API_KEY not found in environment');
  process.exit(1);
}

const API_URL = 'https://api.nanobanana.com/v1/generate';
const OUTPUT_DIR = path.join(ROOT, 'public', 'images');

// 생성할 이미지 목록
const IMAGE_TASKS = [
  {
    filename: 'hero-banner.webp',
    prompt: 'Clean modern aesthetic clinic interior with soft white lighting, luxury beauty clinic reception, elegant minimalist design, photorealistic',
    width: 1920,
    height: 1080,
  },
  {
    filename: 'eye-surgery.webp',
    prompt: 'Beautiful Korean woman close-up portrait, natural makeup, bright clear eyes, soft studio lighting, beauty clinic concept, photorealistic',
    width: 800,
    height: 600,
  },
  {
    filename: 'nose-surgery.webp',
    prompt: 'Elegant Asian woman side profile portrait, natural beauty, soft lighting, nose profile concept, clean background, photorealistic',
    width: 800,
    height: 600,
  },
  {
    filename: 'contouring.webp',
    prompt: 'Beautiful Korean woman face portrait, defined facial contours, soft studio lighting, beauty clinic facial contouring concept, photorealistic',
    width: 800,
    height: 600,
  },
  {
    filename: 'skincare.webp',
    prompt: 'Korean woman with glowing healthy skin, natural beauty, soft lighting, skincare treatment concept, clean minimal background, photorealistic',
    width: 800,
    height: 600,
  },
  {
    filename: 'before-after-1.webp',
    prompt: 'Asian woman portrait, natural beauty, soft neutral background, before and after beauty transformation concept, photorealistic',
    width: 600,
    height: 400,
  },
  {
    filename: 'before-after-2.webp',
    prompt: 'Korean woman portrait, fresh natural look, soft lighting, clean neutral background, beauty clinic transformation, photorealistic',
    width: 600,
    height: 400,
  },
  {
    filename: 'before-after-3.webp',
    prompt: 'Young Asian woman smiling naturally, bright clear skin, soft studio background, beauty clinic result concept, photorealistic',
    width: 600,
    height: 400,
  },
  {
    filename: 'doctor-profile.webp',
    prompt: 'Korean male doctor in white coat, professional headshot, clinic background, confident warm smile, photorealistic portrait',
    width: 400,
    height: 400,
  },
  {
    filename: 'clinic-interior.webp',
    prompt: 'Modern luxury aesthetic clinic interior, clean white and beige tones, professional medical equipment, elegant waiting area, photorealistic',
    width: 1200,
    height: 600,
  },
  {
    filename: 'testimonial-1.webp',
    prompt: 'Happy smiling Korean woman profile photo, natural beauty, soft background, customer testimonial portrait, photorealistic',
    width: 200,
    height: 200,
  },
  {
    filename: 'testimonial-2.webp',
    prompt: 'Smiling Asian woman headshot, warm natural lighting, clean background, satisfied customer portrait, photorealistic',
    width: 200,
    height: 200,
  },
  {
    filename: 'testimonial-3.webp',
    prompt: 'Young Korean woman smiling, natural look, soft studio background, beauty clinic testimonial portrait, photorealistic',
    width: 200,
    height: 200,
  },
];

async function generateImage(task) {
  const { filename, prompt, width, height } = task;
  console.log(`[generate] ${filename} (${width}x${height})`);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      width,
      height,
      style: 'photographic',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // API 응답에서 이미지 URL 또는 base64 추출
  let imageBuffer;
  if (data.image_url) {
    // URL 형태로 반환된 경우
    const imgResp = await fetch(data.image_url);
    if (!imgResp.ok) throw new Error(`Image download failed: ${imgResp.status}`);
    const arrayBuffer = await imgResp.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  } else if (data.image_base64 || data.base64 || data.data) {
    // Base64 형태로 반환된 경우
    const b64 = data.image_base64 || data.base64 || data.data;
    imageBuffer = Buffer.from(b64, 'base64');
  } else if (data.url) {
    const imgResp = await fetch(data.url);
    if (!imgResp.ok) throw new Error(`Image download failed: ${imgResp.status}`);
    const arrayBuffer = await imgResp.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  } else {
    throw new Error(`Unexpected API response format: ${JSON.stringify(data).slice(0, 200)}`);
  }

  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`[saved] ${outputPath} (${imageBuffer.length} bytes)`);

  return {
    filename,
    width,
    height,
    path: `public/images/${filename}`,
    generatedAt: new Date().toISOString(),
  };
}

async function main() {
  console.log('=== 나노바나나 이미지 생성 시작 ===');
  console.log(`출력 폴더: ${OUTPUT_DIR}`);
  console.log(`총 ${IMAGE_TASKS.length}장 생성 예정\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: IMAGE_TASKS.length,
    images: [],
    errors: [],
  };

  for (const task of IMAGE_TASKS) {
    try {
      const result = await generateImage(task);
      manifest.images.push(result);
    } catch (err) {
      console.error(`[error] ${task.filename}: ${err.message}`);
      manifest.errors.push({ filename: task.filename, error: err.message });
    }

    // API 레이트 리밋 방지를 위한 대기
    await new Promise(r => setTimeout(r, 500));
  }

  // images.json 매니페스트 저장
  const manifestPath = path.join(OUTPUT_DIR, 'images.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n[manifest] ${manifestPath}`);

  console.log('\n=== 완료 ===');
  console.log(`성공: ${manifest.images.length}장`);
  console.log(`실패: ${manifest.errors.length}장`);

  if (manifest.errors.length > 0) {
    console.log('\n실패 목록:');
    manifest.errors.forEach(e => console.log(`  - ${e.filename}: ${e.error}`));
  }

  return manifest;
}

main().catch(err => {
  console.error('[fatal]', err);
  process.exit(1);
});
